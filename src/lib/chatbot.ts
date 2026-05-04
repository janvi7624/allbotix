/**
 * Allbotix chatbot — Groq-powered architecture.
 *
 * Routing strategy:
 *   Rule-based  → greetings, company info, contact intents, menu nav button clicks
 *   Groq AI     → all natural language questions, comparisons, capability queries,
 *                 use-case questions, follow-ups, and anything else
 *
 * Data sources:
 *   data/chatbot/content.json          (menu nodes)
 *   data/chatbot/robots_products.json  (product summaries)
 *   data/chatbot/<Product>.json        (detailed per-product specs)
 */

import fs from 'node:fs';
import path from 'node:path';
import Groq from 'groq-sdk';

export type ChatResponse = {
  text: string;
  image?: string;
  images?: string[];
  video_link?: string;
  buttons?: string[];
  type?: 'normal' | 'recommendation';
};

export type HistoryMessage = { role: 'user' | 'bot'; text: string };

type ContentNode = {
  text: string;
  buttons?: string[];
  image?: string;
  images?: string[];
  video_link?: string;
};

type Product = {
  category: string;
  name: string;
  description: string;
  key_features?: string[];
  tech_highlights?: string[];
  demo_link?: string;
};

type Catalog = { [key: string]: ContentNode };

const CHATBOT_DATA_DIR = path.join(process.cwd(), 'data', 'chatbot');

/* ─── Data loading (lazy, cached) ──────────────────────────────── */

let cachedContent: Catalog | null = null;
let cachedProducts: Product[] | null = null;
const cachedDetailFiles: Record<string, Record<string, unknown>> = {};

const PRODUCT_DETAIL_FILES: Record<string, string> = {
  'alpha b2':  'Alpha B2.json',
  'alpha go2': 'Alpha GO2.json',
  'at20 pro':  'AT20 Pro.json',
  'at60':      'AT20 Pro.json',
  'ax10':      'AX10.json',
  'amt 1':     'AMT1.json',
  'amt1':      'AMT1.json',
  'ac40':      'AC40.json',
  'as100n':    'AS100N.json',
  'aw3':       'AW3.json',
  'at9':       'ASMR T10.json',
  'asmr t10':  'ASMR T10.json',
  'at300':     'AT300.json',
  'at600':     'AT600.json',
  'atr v3':    'ATR V3.json',
};

function loadContent(): Catalog {
  if (cachedContent) return cachedContent;
  const raw = fs.readFileSync(path.join(CHATBOT_DATA_DIR, 'content.json'), 'utf8');
  cachedContent = JSON.parse(raw);
  return cachedContent!;
}

function loadProducts(): Product[] {
  if (cachedProducts) return cachedProducts;
  const raw = fs.readFileSync(path.join(CHATBOT_DATA_DIR, 'robots_products.json'), 'utf8');
  const parsed = JSON.parse(raw) as { products: Product[] };
  cachedProducts = parsed.products || [];
  return cachedProducts;
}

function loadProductDetail(productName: string): Record<string, unknown> | null {
  const key = norm(productName);
  if (cachedDetailFiles[key]) return cachedDetailFiles[key];
  const fileName = PRODUCT_DETAIL_FILES[key];
  if (!fileName) return null;
  try {
    const raw = fs.readFileSync(path.join(CHATBOT_DATA_DIR, fileName), 'utf8');
    const parsed = JSON.parse(raw);
    cachedDetailFiles[key] = parsed;
    return parsed;
  } catch {
    return null;
  }
}

function getDetailText(detail: Record<string, unknown>): string {
  const lines: string[] = [];
  for (const [, page] of Object.entries(detail)) {
    const p = page as { title?: string; content?: unknown };
    if (!p) continue;
    if (p.title) lines.push(`\n**${p.title}**`);
    if (Array.isArray(p.content)) {
      for (const item of p.content) lines.push(`• ${item}`);
    } else if (typeof p.content === 'object' && p.content !== null) {
      for (const [k, v] of Object.entries(p.content as Record<string, string>)) {
        lines.push(`• **${k}:** ${v}`);
      }
    } else if (typeof p.content === 'string') {
      lines.push(p.content);
    }
  }
  return lines.join('\n');
}

/* ─── Image path remap ─────────────────────────────────────────── */

function remap(src?: string): string | undefined {
  if (!src) return src;
  return src.replace(/^\/static\/images\//, '/chatbot/images/');
}

function fromNode(node: ContentNode, extraButtons?: string[]): ChatResponse {
  const resp: ChatResponse = {
    text: node.text,
    buttons: node.buttons ? [...node.buttons] : undefined,
  };
  if (node.image) resp.image = remap(node.image);
  if (node.images) resp.images = node.images.map((s) => remap(s) as string);
  if (node.video_link) resp.video_link = node.video_link;
  if (extraButtons && resp.buttons) {
    for (const b of extraButtons) if (!resp.buttons.includes(b)) resp.buttons.push(b);
  }
  return resp;
}

/* ─── Menu routing tables ───────────────────────────────────────── */

const LABEL_TO_NODE: Array<{ match: RegExp; key: string }> = [
  { match: /^robotics$/i, key: 'robotics' },
  { match: /^cleaning\s*robots?$/i, key: 'cleaning_robot' },
  { match: /^reception\s*robots?$/i, key: 'reception_robot' },
  { match: /^(delivery|serving)\s*robots?$/i, key: 'delivery_robot' },
  { match: /^amr$/i, key: 'amr' },
  { match: /^autonomous\s+mobile\s+robots?$/i, key: 'amr' },
  { match: /^surveillance\s*robots?$/i, key: 'surveillance_robot' },
  { match: /^(autonomous\s*robots?|patrol|inspection\s+robots?)$/i, key: 'surveillance_robot' },
  { match: /^robot\s*arms?$/i, key: 'robot_arm' },
  { match: /^(cobots?|collaborative\s*robots?)$/i, key: 'robot_arm' },
  { match: /^(entertainment\s*robots?|humanoid\s*robots?)$/i, key: 'entertainment_robot' },
  { match: /^back\s+to\s+menu$/i, key: 'robotics' },
  { match: /^back\s+to\s+robotics$/i, key: 'robotics' },
  { match: /^back\s+to\s+cleaning(\s+robots?)?$/i, key: 'cleaning_robot' },
  { match: /^back\s+to\s+reception(\s+robots?)?$/i, key: 'reception_robot' },
  { match: /^back\s+to\s+(delivery|serving)(\s+robots?)?$/i, key: 'delivery_robot' },
  { match: /^back\s+to\s+amr$/i, key: 'amr' },
  { match: /^back\s+to\s+surveillance(\s+robots?)?$/i, key: 'surveillance_robot' },
  { match: /^back\s+to\s+robot\s*arms?$/i, key: 'robot_arm' },
  { match: /^back\s+to\s+entertainment(\s+robots?)?$/i, key: 'entertainment_robot' },
  { match: /^explore\s+robots?$/i, key: 'robotics' },
];

const CATEGORY_BACK_BUTTON: Record<string, string> = {
  'Cleaning Robot': 'Back to Cleaning Robots',
  'Reception Robot': 'Back to Reception Robots',
  'Serving Robot': 'Back to Delivery Robots',
  'Delivery Robot': 'Back to Delivery Robots',
  'Delivery & Marketing Robot': 'Back to Delivery Robots',
  'Logistics Robot': 'Back to AMR',
  'Humanoid Robot': 'Back to Entertainment Robots',
  'Autonomous Robot': 'Back to Surveillance Robots',
  'Robot Arm': 'Back to Robot Arm',
};

/* ─── Utilities ─────────────────────────────────────────────────── */

function norm(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

function stripMarkdown(s: string): string {
  return s.replace(/\*\*/g, '').replace(/\*/g, '').replace(/__/g, '').replace(/_/g, '');
}

function fixTypos(s: string): string {
  return s
    .replace(/\bcontct\b/g, 'contact')
    .replace(/\bcontat\b/g, 'contact')
    .replace(/\bconact\b/g, 'contact')
    .replace(/\bcontac\b/g, 'contact')
    .replace(/\bconect\b/g, 'contact')
    .replace(/\bdeliverr\b/g, 'delivery')
    .replace(/\bdelviery\b/g, 'delivery')
    .replace(/\bdelievery\b/g, 'delivery')
    .replace(/\bsurv[a-z]*nce\b/gi, 'surveillance')
    .replace(/\bsurv[a-z]*ance\b/gi, 'surveillance')
    .replace(/\bsurv[a-z]*ence\b/gi, 'surveillance')
    .replace(/\broboit\b/gi, 'robot')
    .replace(/\bwarhouse\b/gi, 'warehouse')
    .replace(/\bwarehose\b/gi, 'warehouse')
    .replace(/\bwharehouse\b/gi, 'warehouse')
    .replace(/\bclening\b/gi, 'cleaning')
    .replace(/\bcleening\b/gi, 'cleaning')
    .replace(/\brecption\b/gi, 'reception')
    .replace(/\brecpetion\b/gi, 'reception')
    .replace(/\bspecifcation\b/gi, 'specification')
    .replace(/\bfeetures\b/gi, 'features')
    .replace(/\bfeatres\b/gi, 'features')
    .replace(/\btehnical\b/gi, 'technical')
    .replace(/\btechinical\b/gi, 'technical')
    .replace(/\bpriece\b/gi, 'price')
    .replace(/\blogitic\b/gi, 'logistic')
    .replace(/\blogistc\b/gi, 'logistic')
    .replace(/\blogisitc\b/gi, 'logistic');
}

function matchNode(raw: string): string | null {
  const msg = norm(raw);
  for (const row of LABEL_TO_NODE) {
    if (row.match.test(msg)) return row.key;
  }
  return null;
}

/* ─── Product card builders ─────────────────────────────────────── */

function buildSummary(p: Product): string {
  const lines: string[] = [`**${p.name}**`, '', p.description];
  if (p.key_features && p.key_features.length > 0) {
    lines.push('', '**Key Features:**');
    for (const f of p.key_features) lines.push(`• ${f}`);
  }
  if (p.tech_highlights && p.tech_highlights.length > 0) {
    lines.push('', '**Tech Highlights:**');
    for (const t of p.tech_highlights) lines.push(`• ${t}`);
  }
  return lines.join('\n');
}

function productResponse(p: Product, detailed = false): ChatResponse {
  let text: string;
  if (detailed) {
    const detail = loadProductDetail(p.name);
    text = detail ? `**${p.name}**\n` + getDetailText(detail) : buildSummary(p);
  } else {
    text = buildSummary(p);
  }
  const buttons: string[] = [];
  const back = CATEGORY_BACK_BUTTON[p.category];
  if (back) buttons.push(back);
  buttons.push('Contact Allbotix', 'Back to Menu');
  const resp: ChatResponse = { text, buttons };
  if (p.demo_link) resp.video_link = p.demo_link;
  return resp;
}

/* ─── Careers response builder ──────────────────────────────────── */

function careersResponse(): ChatResponse {
  return {
    text: '🚀 **Join the Allbotix Team!**\n\nWe\'re always looking for passionate people to help shape the future of robotics.\n\n👉 [View open roles & apply here](http://localhost:3000/careers)\n\nYou\'ll find:\n• Current job openings\n• Company culture & values\n• Work benefits & perks\n• How to apply',
    buttons: ['Back to Menu', 'Contact Allbotix'],
  };
}

/* ─── Contact response builders ─────────────────────────────────── */

function contactResponse(customText?: string): ChatResponse {
  return {
    text: customText ?? '📞 *Contact Allbotix*\n\n👉 [Visit our contact page](https://www.allbotix.ai/contacts) to get in touch with our team.',
    buttons: ['Back to Menu'],
  };
}

function humanContactResponse(msg: string): ChatResponse | null {
  if (/(contact\s*(detail|info|number|us|allbotix)|get\s*in\s*touch|reach\s*(us|out|allbotix)|contct|contat|contac\b|how.*contact|email.*allbotix|phone.*allbotix|allbotix.*contact)/.test(msg)) {
    return contactResponse('📞 **Contact Allbotix**\n\nWe\'re here to help!\n\n👉 [Visit our contact page](https://www.allbotix.ai/contacts) to reach our team.\n\nOur experts can help you with:\n• Product enquiries & demos\n• Pricing & quotations\n• Technical support\n• Site visits & installation\n• Custom & enterprise solutions');
  }
  if (/(demo|trial|see\s+it\s+in\s+action|live\s+demo|schedule\s+demo|request\s+demo|want.*demo|book.*demo|arrange.*demo|request\s+a\s+demo)/.test(msg)) {
    return contactResponse('🎯 **Request a Demo**\n\nGreat choice! We\'d love to show you Allbotix robots in action.\n\n👉 [Book a demo here](https://www.allbotix.ai/contacts) and our team will arrange a live demonstration tailored to your needs.');
  }
  if (/(meet|speak|talk|connect|call|reach|contact)\s+(the|a|our|with|to)?\s*(technical|tech|engineer|expert|specialist|sales|team|person|staff|representative|rep|human|agent|advisor|consultant|you|someone|allbotix)/.test(msg) ||
      /(technical\s+person|sales\s+person|meet.*person|speak.*person|human\s+agent|connect\s+with\s+you|talk\s+to\s+you|speak\s+to\s+you|reach\s+you|want\s+to\s+connect|like\s+to\s+connect|get\s+connected|talk.*team|speak.*team|connect.*team)/.test(msg)) {
    return contactResponse('👨‍💼 **Connect with Our Team**\n\nWe\'d be happy to connect you with the right person!\n\n👉 [Contact us here](https://www.allbotix.ai/contacts) and let us know:\n• Your use case or industry\n• Which robot(s) you\'re interested in\n• Your preferred contact method');
  }
  if (/(price|pricing|cost|quote|quotation|how much|purchase|order|invoice)/.test(msg) ||
      (/\bbuy\b/.test(msg) && !/(why|should|reason|worth|benefit|advantage|speciality|special|unique|better than|different)/.test(msg))) {
    return contactResponse('💰 **Get a Quote**\n\nPricing depends on your specific requirements and deployment scale.\n\n👉 [Request a quote here](https://www.allbotix.ai/contacts) and our sales team will provide a customised proposal.\n\nPlease mention the robot model(s) and quantity you\'re interested in for a faster response.');
  }
  if (/(site\s*visit|installation|deploy|setup|on.?site|visit\s+us|come\s+to|arrange\s+visit)/.test(msg)) {
    return contactResponse('🏢 **Site Visit & Installation**\n\nWe offer on-site assessments and professional installation.\n\n👉 [Schedule a site visit](https://www.allbotix.ai/contacts) and our team will assess your space and recommend the best solution.');
  }
  if (/(partner|partnership|\bintegrat\b|\bcustom\b|bespoke|white.?label|oem|resell)/.test(msg)) {
    return contactResponse('🤝 **Partnership & Custom Solutions**\n\nWe welcome partnership and integration enquiries.\n\n👉 [Reach out here](https://www.allbotix.ai/contacts) with details about your proposal and our business development team will follow up.');
  }
  return null;
}

/* ─── Nav-only phrase set (these NEVER go to Groq) ─────────────── */

const NAV_PHRASES = new Set([
  'cleaning robots', 'reception robots', 'delivery robots', 'amr',
  'surveillance robots', 'robot arm', 'entertainment robots',
  'contact allbotix', 'back to menu', 'back to cleaning robots',
  'back to reception robots', 'back to delivery robots', 'back to amr',
  'back to surveillance robots', 'back to entertainment robots',
  'back to robot arms', 'robotics', 'explore robots',
  'at20 pro', 'at60', 'ax10', 'amt 1', 'ac40', 'as100n',
  'atr v3', 'aw3', 'at9', 'asmr t10', 'at300', 'at600',
  'alpha b2', 'alpha go2', 'g1', 'al series robot arm',
  'hi', 'hello', 'hey', 'start', 'menu',
]);

/* ─── Natural question detector ─────────────────────────────────── */

const QUESTION_RE = /\b(are|is|was|were|do|does|did|have|has|can|could|will|would|should|what|which|where|when|why|how|tell|explain|describe|compare|difference|recommend|suggest|help|give|show|want|need|suitable|best|better|ideal|fit|choose|select|pick|works?|capable|able|features?|specs?|technical|use\s*case|application)\b/i;
const COMPLEX_RE = /\b(solution|recommend|suggest|suitable|i need|i want|we need|help me|looking for|deploy|install|configure)\b/i;
const COMPARISON_SIGNALS = ['between', 'versus', ' vs ', 'differ', 'compar', 'spec', 'better', 'which', 'detail', 'feature', 'payload', 'battery', 'sensor', 'camera', 'navig', 'safety', 'dimension', 'weight', 'speed', 'range'];

function isNaturalQuestion(msg: string, history: HistoryMessage[]): boolean {
  const t = msg.trim().toLowerCase();
  if (NAV_PHRASES.has(t)) return false;
  if (t.startsWith('back to')) return false;

  const words = t.split(/\s+/);
  if (words.length >= 2 && QUESTION_RE.test(t)) return true;
  if (words.length >= 2 && COMPLEX_RE.test(t)) return true;

  const products = loadProducts();
  const productHits = products.filter(p => t.includes(norm(p.name))).length;
  if (productHits >= 2) return true;
  if (productHits >= 1 && COMPARISON_SIGNALS.some(s => t.includes(s))) return true;
  if (words.length >= 2 && history.length > 0) return true;
  if (words.length >= 1 && t.endsWith('?')) return true;

  return false;
}

/* ─── Groq AI — rich system prompt + response ───────────────────── */

let groqClient: Groq | null = null;
function getGroqClient(): Groq {
  if (!groqClient) groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  return groqClient;
}

let cachedSystemPrompt: string | null = null;

function buildSystemPrompt(): string {
  if (cachedSystemPrompt) return cachedSystemPrompt;

  const products = loadProducts();

  const byCategory = new Map<string, Product[]>();
  for (const p of products) {
    if (!byCategory.has(p.category)) byCategory.set(p.category, []);
    byCategory.get(p.category)!.push(p);
  }

  let catalogSection = '\n=== ALLBOTIX ROBOT CATALOGUE ===\n';
  for (const [cat, prods] of byCategory) {
    catalogSection += `\n-- ${cat.toUpperCase()} --\n`;
    for (const p of prods) {
      catalogSection += `• ${p.name}: ${p.description}\n`;
      if (p.key_features?.length) catalogSection += `  Features: ${p.key_features.slice(0, 5).join(' · ')}\n`;
      if (p.tech_highlights?.length) catalogSection += `  Tech: ${p.tech_highlights.slice(0, 4).join(' · ')}\n`;
    }
  }

  const seenFiles = new Set<string>();
  let specsSection = '\n=== DETAILED PRODUCT SPECIFICATIONS ===\nUse these specs to answer precise questions about payload, battery, cameras, sensors, navigation, dimensions, and accessories.\n';

  for (const [productKey, fileName] of Object.entries(PRODUCT_DETAIL_FILES)) {
    if (seenFiles.has(fileName)) continue;
    seenFiles.add(fileName);
    try {
      const raw = fs.readFileSync(path.join(CHATBOT_DATA_DIR, fileName), 'utf8');
      const detail = JSON.parse(raw) as Record<string, { title?: string; content?: unknown }>;
      specsSection += `\n--- ${productKey.toUpperCase()} ---\n`;
      for (const [, page] of Object.entries(detail)) {
        if (!page.title || !page.content) continue;
        specsSection += `${page.title}:\n`;
        if (Array.isArray(page.content)) {
          for (const item of page.content as string[]) specsSection += `• ${item}\n`;
        } else if (typeof page.content === 'object' && page.content !== null) {
          for (const [k, v] of Object.entries(page.content as Record<string, string>)) {
            specsSection += `  ${k}: ${v}\n`;
          }
        } else if (typeof page.content === 'string') {
          specsSection += page.content + '\n';
        }
      }
    } catch { /* skip missing/malformed files */ }
  }

  cachedSystemPrompt = `You are Allbotix Assistant — a smart, friendly, and knowledgeable robotics expert for Allbotix, the robotics brand of Nanta Tech Limited.

YOUR ROLE
You are a robotics sales consultant. Help customers find the right robot, answer specific product questions with real specs, compare robots intelligently, and explain how robots solve real-world problems.

ALWAYS answer the actual question asked. NEVER redirect to a generic menu when a specific question was asked.

COMPANY BACKGROUND
Allbotix is the robotics division of Nanta Tech Limited — publicly listed on BSE (SME Platform, 2025). Founded 2018 as MNT Technologies, rebranded to Nanta Tech in 2023. Showcased at INFOCOMM, FITAG, AVICN, and Palm 2024.
Mission: Intelligent machines in service of people — robotics, AI, and AV solutions making industries safer and operations smarter.

ROBOT CATEGORIES:
• Cleaning Robots (AC40, AX10, AMT 1, AT60, AT20 PRO, AS100N) — cleaning, mopping, vacuuming, sweeping, floor scrubbing, outdoor cleaning
• Reception Robots (ATR V3) — reception, visitor management, front desk, check-in, lobby, hotel receptionist
• Delivery & Serving Robots (AW3, AT9, ASMR T10) — food delivery, serving, restaurant, hotel service, contactless delivery, waiter robot
• AMR / Logistics Robots (AT300, AT600) — warehouse, logistics, material handling, factory transport, production line
• Surveillance & Quadruped Robots (ALPHA B2, ALPHA GO2) — inspection, patrol, surveillance, security, robot dog, all-terrain
• Robot Arms / Cobots (AL Series Robot Arm) — cobot, collaborative robot, assembly, manufacturing, pick and place, precision automation
• Humanoid & Entertainment Robots (G1) — humanoid, entertainment, greeter, guide robot, hospitality, social robot
${catalogSection}${specsSection}

HOW TO RESPOND:

1. **Spec question** ("What camera does X use?", "What is payload of AT300?")
   → Answer directly using the specs above. Be precise with numbers and names.

2. **Capability question** ("Can ALPHA GO2 do surveillance?", "Does AT300 work outdoors?")
   → Answer yes/no clearly, then explain why with the relevant specs or features.

3. **Comparison** ("Difference between AMR and Delivery robots", "Compare AT300 vs AT600")
   → Give a structured comparison with Purpose, Key specs, Best for each option, then a recommendation.

4. **Recommendation** ("Which robot for warehouse?", "Suggest a cleaning robot for 1500 sqft")
   → Short intro (1–2 sentences) + bullet list of recommended products with one-sentence reasons. Max 4 products.
   End with: "Tap a product below to see full details."

5. **How it works / use cases** → Explain clearly using product data with specific specs and features.

6. **General robotics** → Explain clearly, relate to our products where relevant.

CRITICAL RULES:
- Never start with filler phrases like "Great question" — go straight to the answer.
- NEVER redirect to a product selection menu when a comparison or spec question was asked.
- Use **bold** for product names, specs, and section titles. Do NOT use ### headings.
- Never invent specs — only use what's in the catalogue and specs above.
- Keep answers under 300 words. Use bullet points for specs and lists.
- For pricing, demos, or site visits: say "Contact our team for details."
- If genuinely unknown: "I don't have that detail — please contact our team."
- For tasks needing hands/gripping/manipulation → recommend Robot Arms (AL Series).
- NEVER append URLs, website links, or "visit our website" lines at the end of your response. Do not add any closing link or footer text.`;

  return cachedSystemPrompt;
}

function extractProductButtons(responseText: string, userMessage: string): string[] {
  const products = loadProducts();
  const responseLower = norm(stripMarkdown(responseText));
  const userLower = norm(userMessage);

  const mentioned: Product[] = [];
  for (const p of products) {
    const pn = norm(p.name);
    if ((responseLower.includes(pn) || userLower.includes(pn)) && !mentioned.find(m => m.name === p.name)) {
      mentioned.push(p);
    }
  }

  const buttons: string[] = mentioned.slice(0, 4).map(p => p.name);
  buttons.push('Contact Allbotix', 'Back to Menu');
  return buttons;
}

async function callGroq(message: string, history: HistoryMessage[]): Promise<ChatResponse | null> {
  try {
    const client = getGroqClient();
    const systemPrompt = buildSystemPrompt();

    const messages: Groq.Chat.ChatCompletionMessageParam[] = history.slice(-10).map(h => ({
      role: h.role === 'user' ? 'user' as const : 'assistant' as const,
      content: h.text,
    }));
    messages.push({ role: 'user', content: message });

    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      temperature: 0.7,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
    });

    const text = response.choices[0]?.message?.content || '';
    if (!text) return null;

    return { text, buttons: extractProductButtons(text, message) };
  } catch (err) {
    console.error('[callGroq] API error:', err);
    return null;
  }
}

/* ─── Short-phrase category routing ─────────────────────────────── */

function recommendCategory(raw: string): ChatResponse | null {
  const msg = norm(fixTypos(raw));
  const content = loadContent();

  if (/(robot\s*arm|cobot|assembly|\bhand(s)?\b|grip|manipulat|arm\s*robot)/.test(msg)) return fromNode(content['robot_arm']);
  if (/(patrol|surveill|security|inspect|guard|quadruped|four.?leg)/.test(msg)) return fromNode(content['surveillance_robot']);
  if (/(warehouse|logistic|material\s+transport|forklift|payload|goods\s+transport|supply\s*chain|inventory|distribution|shifting|pallet|cargo)/.test(msg)) return fromNode(content['amr']);
  if (/(restaurant|cafe|coffee|hotel|serving|serve|food\s+delivery|tray|dining)/.test(msg)) return fromNode(content['delivery_robot']);
  if (/(clean|mop|scrub|vacuum|sweep|sqft|sq\s*ft|office\s+floor)/.test(msg)) return fromNode(content['cleaning_robot']);
  if (/(reception|visitor|lobby|front\s*desk|check\s*-?in)/.test(msg)) return fromNode(content['reception_robot']);
  if (/(humanoid|bolt|entertainment|greet|stage|performance)/.test(msg)) return fromNode(content['entertainment_robot']);

  return null;
}

/* ─── Public API ───────────────────────────────────────────────── */

export function welcome(): ChatResponse {
  const content = loadContent();
  return fromNode(content['robotics']);
}

export async function reply(raw: string, history: HistoryMessage[] = []): Promise<ChatResponse> {
  const text = (raw || '').trim();
  if (!text) return welcome();

  const msg = norm(fixTypos(text));
  const content = loadContent();

  // ── Greetings ────────────────────────────────────────────────────────
  if (/^(hi|hello|hey|yo|namaste|howdy|start|menu)(\b.*)?$/i.test(msg)) {
    const r = fromNode(content['robotics']);
    return { ...r, text: `👋 Hello! Welcome to Allbotix.\n\n${r.text}` };
  }

  // ── Company background ──────────────────────────────────────────────
  if (/(about\s*(allbotix|company|nanta|us)|who\s*(are|is)\s*(allbotix|nanta|you|we)|tell.*about.*company|tell.*about.*allbotix|company.*history|history.*company|nanta\s*tech|founded|mission|vision|background|bse|stock\s*exchange|listed|public\s*listed|mnt\s*tech|infocomm|fitag|avicn|palm\s*2024)/.test(msg)) {
    return {
      text: `🏢 **About Allbotix & Nanta Tech Limited**\n\n**Allbotix** is the robotics division of **Nanta Tech Limited** — a publicly listed technology company specialising in advanced Robotics, AI-driven innovation, and AV solutions.\n\n**Company History**\n• Founded in **2018** as MNT Technologies\n• Acquired and rebranded as **Nanta Tech Private Limited** in 2023\n• Achieved **public listing on the Bombay Stock Exchange (BSE – SME Platform)** in 2025\n• Today, Nanta Tech Limited is a **Public Limited Company**\n\n**Industry Presence**\n• INFOCOMM • FITAG • AVICN • Palm 2024\n\n**Our Mission**\nTo put the power of intelligent machines in service of people — building robotics, autonomous vehicle-grade AI, and AV solutions that make industries safer, operations smarter, and human potential limitless.\n\n**Our Vision**\nA world where intelligent machines work alongside humanity as trusted partners — eliminating preventable harm, unlocking human creativity, and making India a global force in robotics and AI.`,
      buttons: ['Explore Robots', 'Contact Allbotix', 'Back to Menu'],
    };
  }

  // ── Careers / hiring intents ─────────────────────────────────────────
  if (/(career|careers|job|jobs|hiring|apply|application|vacancy|vacancies|role|opening|work\s+with\s+us|join\s+(us|allbotix|the\s+team)|work\s+(at|for)\s+allbotix|culture|work\s+benefit|perk|salary|internship|employment)/.test(msg)) {
    return careersResponse();
  }

  // ── Contact intents ─────────────────────────────────────────────────
  const humanContact = humanContactResponse(msg);
  if (humanContact) return humanContact;

  // ── Generic contact button click ─────────────────────────────────────
  if (
    /^contact(\s+allbotix)?$/i.test(msg) ||
    /^(talk\s+to\s+(human|agent|sales|team)|book\s+a?\s*demo|get\s+quote|pricing|price|buy)/i.test(msg) ||
    /connect\s+(me\s+)?(with\s+)?(senior|sales|technical)/i.test(msg)
  ) {
    return contactResponse();
  }

  // ── Menu navigation ─────────────────────────────────────────────────
  const nodeKey = matchNode(text);
  if (nodeKey && content[nodeKey]) return fromNode(content[nodeKey]);

  // ── Exact product name click ─────────────────────────────────────────
  const products = loadProducts();
  const exactProduct = products.find(p => norm(p.name) === msg);
  if (exactProduct) return productResponse(exactProduct, true);

  // ── Natural language questions → Groq ────────────────────────────────
  const hasProductName = products.some(p => msg.includes(norm(p.name)));
  if (isNaturalQuestion(msg, history) || hasProductName) {
    const groqResp = await callGroq(text, history);
    if (groqResp) return groqResp;
  }

  // ── Short keyword phrases → category routing ─────────────────────────
  const rec = recommendCategory(msg);
  if (rec) return rec;

  // ── Final fallback → Groq ─────────────────────────────────────────────
  const fallbackResp = await callGroq(text, history);
  if (fallbackResp) return fallbackResp;

  return {
    text: 'I can help you explore **Allbotix Robotics**. Please choose a category below or describe your use case (e.g. "robot for cleaning office", "robot for warehouse", "robot for serving food") and I\'ll suggest the right solution 👇',
    buttons: ['Cleaning Robots', 'Reception Robots', 'Delivery Robots', 'AMR', 'Surveillance Robots', 'Robot Arm', 'Entertainment Robots', 'Contact Allbotix'],
  };
}
