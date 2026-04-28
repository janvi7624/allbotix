/**
 * Allbotix chatbot — data-driven with conversation context.
 *
 * Data sources:
 *   - data/chatbot/content.json           (menu nodes)
 *   - data/chatbot/robots_products.json   (product summaries)
 *   - data/chatbot/<ProductName>.json     (detailed per-product specs)
 */

import fs from 'node:fs';
import path from 'node:path';
import Anthropic from '@anthropic-ai/sdk';

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

// File name mapping: product name → JSON filename
const PRODUCT_DETAIL_FILES: Record<string, string> = {
  'alpha b2':       'Alpha B2.json',
  'alpha go2':      'Alpha GO2.json',
  'at20 pro':       'AT20 Pro.json',
  'at60':           'AT20 Pro.json',
  'ax10':           'AX10.json',
  'amt 1':          'AMT1.json',
  'amt1':           'AMT1.json',
  'ac40':           'AC40.json',
  'as100n':         'AS100N.json',
  'aw3':            'AW3.json',
  'at9':            'ASMR T10.json',
  'asmr t10':       'ASMR T10.json',
  'at300':          'AT300.json',
  'at600':          'AT600.json',
  'atr v3':         'ATR V3.json',
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

/* ─── Intent routing tables ─────────────────────────────────────── */

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

/* ─── Helpers ──────────────────────────────────────────────────── */

function norm(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

// Common typo/spelling corrections — run on user input before intent matching
function fixTypos(s: string): string {
  return s
    .replace(/\bcontct\b/g, 'contact')
    .replace(/\bcontat\b/g, 'contact')
    .replace(/\bconact\b/g, 'contact')
    .replace(/\bcontac\b/g, 'contact')
    .replace(/\bconect\b/g, 'contact')
    .replace(/\bdemo\b/g, 'demo')
    .replace(/\bdeliverr\b/g, 'delivery')
    .replace(/\bdelviery\b/g, 'delivery')
    .replace(/\bdelievery\b/g, 'delivery')
    .replace(/\bsurv[a-z]*nce\b/gi, 'surveillance')
    .replace(/\bsurv[a-z]*ance\b/gi, 'surveillance')
    .replace(/\bsurv[a-z]*ence\b/gi, 'surveillance')
    .replace(/\bsurvelance\b/gi, 'surveillance')
    .replace(/\bsurvailance\b/gi, 'surveillance')
    .replace(/\broboit\b/gi, 'robot')
    .replace(/\brobot\b/gi, 'robot')
    .replace(/\brobots\b/gi, 'robots')
    .replace(/\bwarhouse\b/gi, 'warehouse')
    .replace(/\bwarehose\b/gi, 'warehouse')
    .replace(/\bwharehouse\b/gi, 'warehouse')
    .replace(/\bclening\b/gi, 'cleaning')
    .replace(/\bcleening\b/gi, 'cleaning')
    .replace(/\bclenning\b/gi, 'cleaning')
    .replace(/\brecption\b/gi, 'reception')
    .replace(/\brecpetion\b/gi, 'reception')
    .replace(/\breception\b/gi, 'reception')
    .replace(/\bspecifcation\b/gi, 'specification')
    .replace(/\bspecifiction\b/gi, 'specification')
    .replace(/\bspecification\b/gi, 'specification')
    .replace(/\bspecs\b/gi, 'specs')
    .replace(/\bfeetures\b/gi, 'features')
    .replace(/\bfeatres\b/gi, 'features')
    .replace(/\btehnical\b/gi, 'technical')
    .replace(/\btechinical\b/gi, 'technical')
    .replace(/\bprice\b/gi, 'price')
    .replace(/\bpriece\b/gi, 'price')
    .replace(/\bpric\b/gi, 'price')
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

function matchProduct(raw: string): Product | null {
  const msg = norm(stripMarkdown(raw));
  const products = loadProducts();
  for (const p of products) {
    if (norm(p.name) === msg) return p;
  }
  for (const p of products) {
    if (msg.includes(norm(p.name))) return p;
  }
  return null;
}

// Strip markdown formatting before matching
function stripMarkdown(s: string): string {
  return s.replace(/\*\*/g, '').replace(/\*/g, '').replace(/__/g, '').replace(/_/g, '');
}

// Extract the last mentioned product name from conversation history
function getLastMentionedProduct(history: HistoryMessage[]): Product | null {
  const products = loadProducts();
  // Search from most recent backwards
  for (let i = history.length - 1; i >= 0; i--) {
    const raw = stripMarkdown(history[i].text);
    const msg = norm(raw);
    for (const p of products) {
      if (msg.includes(norm(p.name))) return p;
    }
  }
  return null;
}

// Get products mentioned in the most recent exchange (last user message + bot reply)
function getLastExchangeProducts(history: HistoryMessage[]): Product[] {
  const products = loadProducts();
  const found: Product[] = [];
  // Walk backwards and collect products until we've seen a user message
  let seenUser = false;
  for (let i = history.length - 1; i >= 0; i--) {
    const msg = norm(stripMarkdown(history[i].text));
    if (history[i].role === 'user') {
      if (seenUser) break; // stop after one full exchange
      seenUser = true;
    }
    for (const p of products) {
      if (msg.includes(norm(p.name)) && !found.find(f => f.name === p.name)) {
        found.push(p);
      }
    }
  }
  return found;
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

function contactResponse(customText?: string): ChatResponse {
  return {
    text: customText ?? "📞 *Contact Allbotix*\n\n👉 [Visit our contact page](https://www.allbotix.ai/contacts) to get in touch with our team.",
    buttons: ['Back to Menu'],
  };
}

function humanContactResponse(msg: string): ChatResponse | null {
  // Contact details / reach us / get in touch
  if (/(contact\s*(detail|info|number|us|allbotix)|get\s*in\s*touch|reach\s*(us|out|allbotix)|contct|contat|contac\b|how.*contact|email.*allbotix|phone.*allbotix|allbotix.*contact)/.test(msg)) {
    return contactResponse("📞 **Contact Allbotix**\n\nWe're here to help!\n\n👉 [Visit our contact page](https://www.allbotix.ai/contacts) to reach our team.\n\nOur experts can help you with:\n• Product enquiries & demos\n• Pricing & quotations\n• Technical support\n• Site visits & installation\n• Custom & enterprise solutions");
  }

  // Demo / trial request
  if (/(demo|trial|see\s+it\s+in\s+action|live\s+demo|schedule\s+demo|request\s+demo|want.*demo|book.*demo|arrange.*demo|request\s+a\s+demo)/.test(msg)) {
    return contactResponse("🎯 **Request a Demo**\n\nGreat choice! We'd love to show you Allbotix robots in action.\n\n👉 [Book a demo here](https://www.allbotix.ai/contacts) and our team will arrange a live demonstration tailored to your needs.\n\nOr reach out directly and mention the robot you're interested in — our experts will get back to you shortly.");
  }

  // Meet / speak with technical / sales person
  if (/(meet|speak|talk|connect|call|reach|contact)\s+(the|a|our|with|to)?\s*(technical|tech|engineer|expert|specialist|sales|team|person|staff|representative|rep|human|agent|advisor|consultant|you|someone|allbotix)/.test(msg) ||
      /(technical\s+person|sales\s+person|meet.*person|speak.*person|human\s+agent|connect\s+with\s+you|talk\s+to\s+you|speak\s+to\s+you|reach\s+you|want\s+to\s+connect|like\s+to\s+connect|get\s+connected|talk.*team|speak.*team|connect.*team)/.test(msg)) {
    return contactResponse("👨‍💼 **Connect with Our Team**\n\nWe'd be happy to connect you with the right person!\n\n👉 [Contact us here](https://www.allbotix.ai/contacts) and let us know:\n• Your use case or industry\n• Which robot(s) you're interested in\n• Your preferred contact method\n\nOur technical and sales experts will get in touch with you promptly.");
  }

  // Pricing / quote / buy — but NOT "why buy" or "should I buy" questions (those are value questions)
  if (/(price|pricing|cost|quote|quotation|how much|purchase|order|invoice)/.test(msg) ||
      (/\bbuy\b/.test(msg) && !/(why|should|reason|worth|benefit|advantage|speciality|special|unique|better than|different)/.test(msg))) {
    return contactResponse("💰 **Get a Quote**\n\nPricing depends on your specific requirements and deployment scale.\n\n👉 [Request a quote here](https://www.allbotix.ai/contacts) and our sales team will provide a customised proposal for you.\n\nPlease mention the robot model(s) and quantity you're interested in for a faster response.");
  }

  // Site visit / installation
  if (/(site\s*visit|installation|deploy|setup|on.?site|visit\s+us|come\s+to|arrange\s+visit)/.test(msg)) {
    return contactResponse("🏢 **Site Visit & Installation**\n\nWe offer on-site assessments and professional installation.\n\n👉 [Schedule a site visit](https://www.allbotix.ai/contacts) and our team will assess your space and recommend the best robotics solution.\n\nPlease include your location and preferred timing in your message.");
  }

  // Partnership / integration / custom — use word boundaries to avoid matching "customers", "customise" etc.
  if (/(partner|partnership|\bintegrat\b|\bcustom\b|bespoke|white.?label|oem|resell)/.test(msg)) {
    return contactResponse("🤝 **Partnership & Custom Solutions**\n\nWe welcome partnership and integration enquiries.\n\n👉 [Reach out here](https://www.allbotix.ai/contacts) with details about your proposal and our business development team will follow up with you.");
  }

  return null;
}

/* ─── Context-aware follow-up handler ─────────────────────────── */

// Check if message uses a pronoun/reference to a previous subject
function isContextualReference(msg: string): boolean {
  return /(^|\s)(it|its|this|that|the robot|the product|this robot|that robot|same one|this one|that one)\b/.test(msg) ||
    /^(what|how|can|does|is|has|will|do|tell|give|show|any|are)\s/.test(msg);
}

function contextFollowUp(msg: string, history: HistoryMessage[]): ChatResponse | null {
  const lastProduct = getLastMentionedProduct(history);

  // If user uses a pronoun or contextual reference, resolve to last product immediately
  const isContextRef = isContextualReference(msg);

  // Questions about specs/sensors/camera — load detailed file
  if (/(camera|sensor|lidar|how.*work|how.*do|what.*sensor|spec|specification|detail|feature|technical|dimension|weight|battery|payload|speed|range|navigation)/.test(msg)) {
    if (lastProduct) return productResponse(lastProduct, true);
  }

  // "Tell me more", "more details", "explain" about previous topic
  if (/(more|detail|explain|tell me|elaborate|describe|what about|how about)/.test(msg)) {
    if (lastProduct) return productResponse(lastProduct, true);
  }

  // Pronoun/contextual reference with a question — use last product
  if (isContextRef && lastProduct) {
    const questionResp = answerProductQuestion(msg, lastProduct);
    if (questionResp) return questionResp;
    return productResponse(lastProduct, /(spec|feature|detail|technical|dimension|weight|battery|sensor)/.test(msg));
  }

  // Comparison between multiple products
  if (/(compare|vs|versus|difference|better|which one|which is|prefer)/.test(msg)) {
    const products = loadProducts();
    // Find all products mentioned in current message
    const inMsg: Product[] = [];
    for (const p of products) {
      if (msg.includes(norm(p.name))) inMsg.push(p);
    }
    // Fall back to history if not enough in current message
    const mentioned: Product[] = inMsg.length >= 2 ? [...inMsg] : [...inMsg];
    if (mentioned.length < 2) {
      for (let i = history.length - 1; i >= 0 && mentioned.length < 3; i--) {
        const hmsg = norm(stripMarkdown(history[i].text));
        for (const p of products) {
          if (hmsg.includes(norm(p.name)) && !mentioned.find(m => m.name === p.name)) {
            mentioned.push(p);
          }
        }
      }
    }

    if (mentioned.length >= 2) {
      const isDetailedCompare = /(spec|specification|detail|dimension|weight|battery|payload|sensor|camera|technical)/.test(msg);

      const getSpecs = (detail: Record<string, unknown>): Record<string, string> | null => {
        for (const [, page] of Object.entries(detail)) {
          const p = page as { title?: string; content?: unknown };
          if (/spec/i.test(p.title || '') && typeof p.content === 'object' && !Array.isArray(p.content)) {
            return p.content as Record<string, string>;
          }
        }
        return null;
      };

      const getFeatures = (detail: Record<string, unknown>): string[] => {
        const feats: string[] = [];
        for (const [, page] of Object.entries(detail)) {
          const p = page as { title?: string; content?: unknown };
          if (/feature|highlight|hardware|accessory/i.test(p.title || '') && Array.isArray(p.content)) {
            for (const item of p.content as string[]) feats.push(item);
          }
        }
        return feats;
      };

      const title = mentioned.map(p => p.name).join(' vs ');
      const lines: string[] = [`**${title}**\n`];

      // Description for each product
      for (const p of mentioned) {
        lines.push(`**${p.name}**`);
        lines.push(p.description);
        lines.push('');
      }

      if (isDetailedCompare) {
        const details = mentioned.map(p => loadProductDetail(p.name));
        const specsArr = details.map(d => d ? getSpecs(d) : null);

        // Shared spec keys across all products that have specs
        const validSpecs = specsArr.filter((s): s is Record<string, string> => s !== null);
        if (validSpecs.length >= 2) {
          const allKeys = Object.keys(validSpecs[0]);
          const sharedKeys = allKeys.filter(k => validSpecs.every(s => s[k]));

          if (sharedKeys.length > 0) {
            lines.push('**📊 Specification Comparison:**');
            for (const key of sharedKeys) {
              const row = mentioned
                .map((p, i) => specsArr[i] ? `  — ${p.name}: ${specsArr[i]![key]}` : null)
                .filter(Boolean)
                .join('\n');
              lines.push(`• **${key}**\n${row}`);
            }
            lines.push('');
          }

          // Unique specs for each product
          for (let i = 0; i < mentioned.length; i++) {
            const specs = specsArr[i];
            if (!specs) continue;
            const otherKeys = new Set(
              specsArr.filter((_, j) => j !== i && specsArr[j]).flatMap(s => Object.keys(s!))
            );
            const unique = Object.keys(specs).filter(k => !otherKeys.has(k));
            if (unique.length > 0) {
              lines.push(`**${mentioned[i].name} — Unique Specs:**`);
              for (const k of unique) lines.push(`• **${k}:** ${specs[k]}`);
              lines.push('');
            }
          }
        }

        // Features for each product
        lines.push('**⚙️ Key Capabilities:**');
        for (let i = 0; i < mentioned.length; i++) {
          const d = details[i];
          const feats = d ? getFeatures(d) : [];
          lines.push(`**${mentioned[i].name}:** ${feats.length > 0 ? feats.slice(0, 5).join(' • ') : '—'}`);
        }
        lines.push('');
      } else {
        // Summary-level: key features for each
        for (const p of mentioned) {
          lines.push(`**⚙️ ${p.name} — Key Features:**`);
          if (p.key_features) for (const f of p.key_features) lines.push(`• ${f}`);
          if (p.tech_highlights) for (const t of p.tech_highlights) lines.push(`• ${t}`);
          lines.push('');
        }
      }

      lines.push('For a tailored recommendation, contact our team.');
      const buttons = [...mentioned.map(p => p.name), 'Contact Allbotix', 'Back to Menu'];
      return { text: lines.join('\n'), buttons };
    }

    if (mentioned.length === 1) return productResponse(mentioned[0], /(spec|specification|detail|dimension|weight|battery|payload|sensor|camera|technical)/.test(msg));
  }

  return null;
}

/* ─── Smart reasoning over product data ────────────────────────── */

function smartReasoningResponse(raw: string): ChatResponse | null {
  const msg = norm(fixTypos(raw));
  const products = loadProducts();

  // Robot with hands / arm / grip / manipulator — takes priority over delivery/serving patterns
  if (/(\bhand(s)?\b|grip|manipulat|arm\s*(robot|that|to|which|for)|robot.*with.*arm|robot.*hand|with\s*hand)/.test(msg)) {
    const armProduct = products.find(p => p.category === 'Robot Arm');
    const detail = armProduct ? loadProductDetail(armProduct.name) : null;
    const specLines: string[] = [];
    if (detail) {
      for (const [, page] of Object.entries(detail)) {
        const p = page as { title?: string; content?: unknown };
        if (!p.title) continue;
        if (/(spec|payload|reach|feature|highlight)/i.test(p.title)) {
          if (Array.isArray(p.content)) {
            for (const item of (p.content as string[]).slice(0, 4)) specLines.push(`• ${item}`);
          } else if (typeof p.content === 'object' && p.content !== null) {
            for (const [k, v] of Object.entries(p.content as Record<string, string>).slice(0, 4)) {
              specLines.push(`• **${k}:** ${v}`);
            }
          }
        }
      }
    } else if (armProduct?.key_features) {
      for (const f of armProduct.key_features.slice(0, 4)) specLines.push(`• ${f}`);
    }

    const servingNote = /(serve|food|deliver|tray|pick|place|lift|carry|assemble)/.test(msg)
      ? '\n\n**For serving & food handling:** The AL Series cobot can be configured to pick up trays, place items, and assist in food preparation or service workflows with custom end-effectors.'
      : '';

    return {
      text: `🦾 **AL Series Robot Arm — Built for Tasks Requiring Hands**\n\nFor any task that needs gripping, picking, placing, or manipulation, the **AL Series collaborative robot arm (cobot)** is the right solution.\n\n${armProduct?.description || 'Precision collaborative robot arm for industrial and commercial automation.'}\n\n**Capabilities:**\n${specLines.length > 0 ? specLines.join('\n') : '• Precision pick & place\n• Payload up to 20kg\n• 360° articulated reach\n• Safe human-robot collaboration'}${servingNote}\n\n🔧 **We also offer full customisation** — end-effectors, grippers, conveyors, and integration with your existing workflow. Contact us to discuss your specific requirement.`,
      buttons: ['AL Series Robot Arm', 'Contact Allbotix', 'Back to Menu'],
    };
  }

  // Heat monitoring / thermal inspection
  if (/(heat\s*monitor|thermal|temperature\s*(check|monitor|detect)|infrared)/.test(msg)) {
    const alphaB2 = products.find(p => norm(p.name) === 'alpha b2');
    const detailB2 = alphaB2 ? loadProductDetail(alphaB2.name) : null;
    const sensors = detailB2
      ? '\n\n**ALPHA B2 Sensors:** 32-wire Automotive-grade LiDAR, Depth Camera, High Resolution Optical Camera — all modular and upgradeable with thermal imaging.'
      : '';
    return {
      text:
        `🌡️ **Heat Monitoring & Thermal Inspection**\n\nFor heat monitoring and workstation inspection, the **ALPHA B2** and **ALPHA GO2** quadruped robots are the best fit.${sensors}\n\n**Why robots instead of humans?**\n• Robots continuously monitor hazardous/high-temperature zones without health risks\n• 24/7 operation with consistent accuracy — no fatigue\n• IP67 weatherproof protection for harsh environments\n• All-terrain mobility to reach areas difficult or dangerous for humans\n• Modular design: attach thermal cameras, LiDAR, or custom sensors\n• Real-time alerts and data logging`,
      buttons: ['ALPHA B2', 'ALPHA GO2', 'Contact Allbotix', 'Back to Menu'],
    };
  }

  // Workstation inspection
  if (/(workstation|work\s*station|station\s*inspect|equipment\s*inspect|machine\s*inspect)/.test(msg)) {
    const alphaB2 = products.find(p => norm(p.name) === 'alpha b2');
    const detail = alphaB2 ? loadProductDetail(alphaB2.name) : null;
    const specInfo = detail
      ? '\n\n**ALPHA B2 Specs for Inspection:**\n• 32-wire LiDAR + Depth Camera + Optical Camera\n• Payload up to 40 kg (walking)\n• IP67 dust & waterproof\n• 4-6h battery life, 20 km range\n• Climb angle >45°'
      : '';
    return {
      text:
        `🔍 **Workstation Inspection**\n\nThe **ALPHA B2** and **ALPHA GO2** are purpose-built for workstation and equipment inspection.${specInfo}\n\n**Why use robots?**\n• Consistent, repeatable inspections — no human error\n• Operates in confined, hazardous, or hard-to-reach areas\n• All-terrain mobility across stairs, uneven surfaces, outdoors\n• Modular payload: cameras, sensors, thermal imaging\n• 24/7 autonomous patrol with scheduled routes`,
      buttons: ['ALPHA B2', 'ALPHA GO2', 'Contact Allbotix', 'Back to Menu'],
    };
  }

  // Company background — Allbotix / Nanta Tech
  if (/(about\s*(allbotix|company|nanta|us)|who\s*(are|is)\s*(allbotix|nanta|you|we)|tell.*about.*company|tell.*about.*allbotix|company.*history|history.*company|nanta\s*tech|founded|mission|vision|background|bse|stock\s*exchange|listed|public\s*listed|mnt\s*tech|infocomm|fitag|avicn|palm\s*2024)/.test(msg)) {
    return {
      text: `🏢 **About Allbotix & Nanta Tech Limited**\n\n**Allbotix** is the robotics division of **Nanta Tech Limited** — a publicly listed technology company specialising in advanced Robotics, AI-driven innovation, and AV solutions.\n\n**Company History**\n• Founded in **2018** as MNT Technologies\n• Acquired and rebranded as **Nanta Tech Private Limited** in 2023\n• Achieved **public listing on the Bombay Stock Exchange (BSE – SME Platform)** in 2025 — growing from a startup to a global leader in equitable technology\n• Today, Nanta Tech Limited is a **Public Limited Company**\n\n**Industry Presence**\nDemonstrated innovation at major global expos:\n• INFOCOMM • FITAG • AVICN • Palm 2024\n\n**Our Mission**\nTo put the power of intelligent machines in service of people — building robotics, autonomous vehicle-grade AI, and AV solutions that make industries safer, operations smarter, and human potential limitless.\n\n**Our Vision**\nA world where intelligent machines work alongside humanity as trusted partners — eliminating preventable harm, unlocking human creativity, and making India a global force in robotics and AI.`,
      buttons: ['Explore Robots', 'Contact Allbotix', 'Back to Menu'],
    };
  }

  // Use cases — generic (all robots) or category-specific
  if (/(use\s*case|use\s*cases|application|applications|where.*used|used\s*(for|in|at)|what.*used\s*for|suitable\s*for|good\s*for|purpose|industries|industry|environment|scenario|when\s*to\s*use|explain.*robot|robot.*explain)/.test(msg)) {

    // Category-specific use cases
    if (/(clean|mop|vacuum|sweep|scrub)/.test(msg)) {
      return { text: `🧹 **Cleaning Robot Use Cases**\n\n• **Offices & Corporate Buildings** — automated daily floor cleaning without disrupting staff\n• **Hotels & Hospitality** — maintain spotless lobbies, corridors, and conference rooms 24/7\n• **Retail & Malls** — keep large floor areas clean during and after business hours\n• **Hospitals & Healthcare** — hygienic floor cleaning with consistent coverage\n• **Airports & Transit Hubs** — high-traffic area cleaning with minimal human intervention\n• **Warehouses & Industrial Floors** — large-scale scrubbing and sweeping of factory/warehouse floors\n• **Apartments & Residences** — hands-free home cleaning`, buttons: ['AT20 PRO', 'AT60', 'AX10', 'AMT 1', 'AC40', 'AS100N', 'Contact Allbotix', 'Back to Menu'] };
    }
    if (/(deliver|serving|waiter|restaurant|food|tray|dining)/.test(msg)) {
      return { text: `📦 **Delivery & Serving Robot Use Cases**\n\n• **Restaurants & Cafes** — serve food and beverages to tables autonomously\n• **Hotels** — deliver room service, towels, or amenities contactlessly\n• **Hospitals** — transport medicines, meals, and supplies between wards\n• **Corporate Offices** — deliver documents, parcels, or refreshments across floors\n• **Retail & Malls** — guide customers and carry purchases\n• **Event Venues** — serve guests at large gatherings and conferences`, buttons: ['AW3', 'AT9', 'ASMR T10', 'Contact Allbotix', 'Back to Menu'] };
    }
    if (/(surveill|patrol|security|inspect|guard|quadruped|four.?leg)/.test(msg)) {
      return { text: `🔍 **Surveillance & Inspection Robot Use Cases**\n\n• **Security Patrol** — autonomous 24/7 perimeter and indoor security rounds\n• **Factory & Plant Inspection** — detect equipment faults, leaks, or anomalies\n• **Power Infrastructure** — inspect transmission lines, substations, and energy facilities\n• **Construction Sites** — monitor safety compliance and site progress\n• **Disaster & Rescue** — navigate rubble and hazardous zones to locate survivors\n• **Outdoor & Harsh Environments** — all-terrain patrol in rain, dust, or uneven terrain\n• **Data Centres** — automated server room inspection and monitoring`, buttons: ['ALPHA B2', 'ALPHA GO2', 'Contact Allbotix', 'Back to Menu'] };
    }
    if (/(reception|receptionist|front\s*desk|lobby|visitor|check.?in)/.test(msg)) {
      return { text: `🤝 **Reception Robot Use Cases**\n\n• **Corporate Offices** — greet visitors, manage check-ins, and notify hosts automatically\n• **Hotels** — welcome guests, provide information, and assist with check-in\n• **Hospitals & Clinics** — guide patients to departments and reduce front-desk load\n• **Shopping Malls** — assist customers with directions and store information\n• **Airports** — provide flight information and wayfinding assistance\n• **Exhibition Halls & Events** — engage visitors with interactive demonstrations`, buttons: ['ATR V3', 'Contact Allbotix', 'Back to Menu'] };
    }
    if (/(warehouse|amr|autonomous\s*mobile|logistic|transport|shifting)/.test(msg)) {
      return { text: `🚗 **AMR Use Cases**\n\n• **Warehouses & Fulfilment Centres** — autonomous picking, sorting, and goods transport\n• **Manufacturing Plants** — move raw materials and finished goods along production lines\n• **E-Commerce Logistics** — high-speed order fulfilment and inventory management\n• **Cold Storage Facilities** — operate in temperature-controlled environments\n• **Automotive Assembly** — transport heavy components between workstations\n• **Pharmaceutical Warehouses** — precise, contamination-free materials handling`, buttons: ['AT300', 'AT600', 'Contact Allbotix', 'Back to Menu'] };
    }
    if (/(humanoid|entertainment|performance|stage)/.test(msg)) {
      return { text: `🎭 **Humanoid & Entertainment Robot Use Cases**\n\n• **Hospitality & Hotels** — engage guests with interactive conversations and guided tours\n• **Education & Training** — interactive learning companion for students\n• **Events & Exhibitions** — attract and engage audiences at trade shows and expos\n• **Retail** — interactive product demonstration and customer engagement\n• **Theme Parks & Entertainment** — immersive character experiences\n• **Healthcare** — social companion for elderly or rehabilitation patients`, buttons: ['G1', 'Contact Allbotix', 'Back to Menu'] };
    }
    if (/(robot\s*arm|cobot|assembly|manufacturing|production)/.test(msg)) {
      return { text: `🦾 **Robot Arm Use Cases**\n\n• **Manufacturing & Assembly Lines** — precise component assembly and fastening\n• **Pick & Place Operations** — sorting, packaging, and palletising products\n• **Welding & Fabrication** — consistent weld quality in automotive and metal industries\n• **Quality Inspection** — camera-equipped arms for automated visual inspection\n• **Pharmaceutical Packaging** — sterile, precise handling of medical products\n• **Electronics Assembly** — micro-component placement with high accuracy`, buttons: ['AL Series Robot Arm', 'Contact Allbotix', 'Back to Menu'] };
    }

    // Generic — explain all robot categories
    return {
      text: `🤖 **Allbotix Robot Use Cases — Full Overview**\n\nHere's how each robot category is used across industries:\n\n🧹 **Cleaning Robots**\nOffices, hotels, hospitals, malls, warehouses, airports — automated floor cleaning with AI navigation and multi-surface support.\n\n📦 **Delivery & Serving Robots**\nRestaurants, hotels, hospitals, offices — contactless food, medicine, and parcel delivery across floors.\n\n🤝 **Reception Robots**\nCorporate offices, hotels, hospitals, malls — AI-powered visitor greeting, check-in, and wayfinding.\n\n🚗 **AMR (Autonomous Mobile Robots)**\nWarehouses, factories, e-commerce, automotive — autonomous material transport and goods handling.\n\n🔍 **Surveillance & Inspection Robots**\nSecurity patrol, factory inspection, disaster rescue, power infrastructure — all-terrain autonomous monitoring.\n\n🦾 **Robot Arms**\nManufacturing, pick & place, welding, pharmaceutical packaging — precision industrial automation.\n\n🎭 **Humanoid & Entertainment Robots**\nHospitality, education, events, retail — interactive AI-powered engagement and assistance.\n\nWant details on a specific category?`,
      buttons: ['Cleaning Robots', 'Delivery Robots', 'Reception Robots', 'AMR', 'Surveillance Robots', 'Robot Arm', 'Entertainment Robots', 'Contact Allbotix'],
    };
  }

  // Why buy / speciality / unique selling point / what makes Allbotix special
  if (/(why\s*(buy|choose|pick|select|get|purchase|invest|should.*buy)|what.*special|what.*unique|what.*different|what.*advantage|what.*benefit|speciality|usp|why\s*allbotix|allbotix.*better|better\s*than\s*others|stand.*out|what.*offer)/.test(msg)) {
    return {
      text: "🌟 **Why Choose Allbotix Robots?**\n\nAllbotix delivers next-generation robotics solutions purpose-built for real-world environments. Here's what sets us apart:\n\n**🤖 Full Range of Robots**\nFrom cleaning and delivery to surveillance, AMR, humanoid, and robot arms — we cover every operational need under one roof.\n\n**🧠 AI-Powered Intelligence**\nEvery robot uses advanced AI, LiDAR, and computer vision for autonomous navigation, obstacle avoidance, and smart decision-making.\n\n**⚙️ Modular & Customisable**\nOur robots are designed to adapt — attach custom sensors, cameras, or payloads to fit your exact use case.\n\n**🏭 Industrial-Grade Reliability**\nBuilt for 24/7 operation in demanding environments — weatherproof, high-payload, long battery life.\n\n**🌍 Proven Across Industries**\nDeployed in hotels, hospitals, restaurants, warehouses, factories, malls, and more worldwide.\n\n**🔧 End-to-End Support**\nWe provide consultation, installation, training, and ongoing technical support.\n\n**💡 Competitive Edge**\nReplacing repetitive and hazardous tasks with robots reduces operational costs, increases consistency, and frees your team for higher-value work.",
      buttons: ['Explore Robots', 'Request a Demo', 'Contact Allbotix', 'Back to Menu'],
    };
  }

  // Why robot vs human
  if (/(why\s*(use\s*)?robot|instead\s*of\s*human|replace\s*human|robot\s*vs\s*human|benefit.*robot|advantage.*robot)/.test(msg)) {
    return {
      text:
        "🤖 **Why Use Robots Instead of Humans?**\n\nAllbotix robots offer significant advantages:\n\n• **24/7 Operation** — robots never tire, take breaks, or call in sick\n• **Consistency** — every task performed to the same standard, every time\n• **Safety** — robots handle dangerous, hazardous, or repetitive tasks\n• **Cost Efficiency** — lower long-term operational costs vs. manpower\n• **Speed & Accuracy** — faster task completion with higher precision\n• **Data & Insights** — robots collect real-time operational data\n• **Scalability** — easily scale without hiring constraints\n\nRobots free your team to focus on higher-value work.",
      buttons: ['Cleaning Robots', 'Surveillance Robots', 'AMR', 'Contact Allbotix'],
    };
  }

  // Detect intent category from query to filter products correctly
  const INTENT_CATEGORIES: Array<{ pattern: RegExp; categories: string[] }> = [
    // Robot arm/hands must come first — "hands that serve food" is arm, not delivery
    { pattern: /(\bhand(s)?\b|grip|manipulat|arm\s*(robot|that|to|which|for)|robot.*with.*arm|robot.*hand|with\s*hand)/, categories: ['Robot Arm'] },
    // AMR/logistics must come before generic delivery to avoid mis-routing
    { pattern: /(warehouse|amr|autonomous\s*mobile|material\s*transport|goods\s*transport|forklift|logistic|supply\s*chain|inventory|distribution|shifting|pallet|tote|cargo\s*transport)/, categories: ['Logistics Robot'] },
    { pattern: /(serving|serve|waiter|restaurant|cafe|hotel.*deliver|food.*deliver|deliver.*food|tray|dining)/, categories: ['Serving Robot', 'Delivery Robot', 'Delivery & Marketing Robot'] },
    { pattern: /(deliver|dispatch)/, categories: ['Serving Robot', 'Delivery Robot', 'Delivery & Marketing Robot'] },
    { pattern: /(clean|mop|vacuum|sweep|scrub|floor.*clean|clean.*floor)/, categories: ['Cleaning Robot'] },
    { pattern: /(reception|receptionist|greet.*visitor|visitor.*greet|front\s*desk|lobby\s*robot|check.?in)/, categories: ['Reception Robot'] },
    { pattern: /(surveill|patrol|security\s*robot|inspect|guard|quadruped|four.?leg)/, categories: ['Autonomous Robot'] },
    { pattern: /(humanoid|entertainment|performance|stage\s*robot|interactive\s*robot)/, categories: ['Humanoid Robot'] },
    { pattern: /(robot\s*arm|cobot|assembly|pick\s*and\s*place|manufacturing|production\s*line|\bhand(s)?\b|grip|manipulat|arm\s*robot)/, categories: ['Robot Arm'] },
  ];

  let categoryFilter: string[] | null = null;
  for (const intent of INTENT_CATEGORIES) {
    if (intent.pattern.test(msg)) {
      categoryFilter = intent.categories;
      break;
    }
  }

  // Parse area requirement from query (sqft or sqm)
  function parseAreaSqft(q: string): number | null {
    const sqftMatch = q.match(/(\d[\d,]*)\s*(sq\.?\s*ft|sqft|square\s*f)/i);
    if (sqftMatch) return parseInt(sqftMatch[1].replace(/,/g, ''));
    const sqmMatch = q.match(/(\d[\d,]*)\s*(sq\.?\s*m|sqm|square\s*m|m²|m2)/i);
    if (sqmMatch) return Math.round(parseInt(sqmMatch[1].replace(/,/g, '')) * 10.76);
    return null;
  }

  // Extract max coverage sqft from product detail spec
  function getProductCoverageSqft(p: Product): number | null {
    const detail = loadProductDetail(p.name);
    if (!detail) return null;
    for (const [, page] of Object.entries(detail)) {
      const pg = page as { title?: string; content?: unknown };
      if (!/spec/i.test(pg.title || '')) continue;
      const c = pg.content as Record<string, string> | undefined;
      if (!c) continue;
      for (const [k, v] of Object.entries(c)) {
        const combined = (k + ' ' + v).toLowerCase();
        // sqft
        const sqftM = combined.match(/(\d[\d,+]*)\s*(sq\.?\s*ft|sqft)/i);
        if (sqftM) return parseInt(sqftM[1].replace(/[,+]/g, ''));
        // sqm → convert
        const sqmM = combined.match(/(\d[\d,+]*)\s*(m²|sqm|sq\.?\s*m)\s*[/h]?/i);
        if (sqmM) return Math.round(parseInt(sqmM[1].replace(/[,+]/g, '')) * 10.76);
      }
    }
    // Fallback: tech_highlights
    for (const t of p.tech_highlights || []) {
      const tl = t.toLowerCase();
      const sqftM = tl.match(/(\d[\d,+]*)\+?\s*(sq\.?\s*ft|sqft)/i);
      if (sqftM) return parseInt(sqftM[1].replace(/[,+]/g, ''));
    }
    return null;
  }

  const pool = categoryFilter
    ? products.filter(p => categoryFilter!.includes(p.category))
    : products;

  // Spec-based area matching — if user mentions sqft/sqm pick the right product
  const requiredSqft = parseAreaSqft(msg);
  if (requiredSqft !== null && categoryFilter) {
    const speced: Array<{ p: Product; coverage: number | null; fits: boolean }> = pool.map(p => {
      const cov = getProductCoverageSqft(p);
      return { p, coverage: cov, fits: cov !== null ? cov >= requiredSqft : false };
    });
    const fits = speced.filter(s => s.fits);
    const all = speced.sort((a, b) => (b.coverage ?? 0) - (a.coverage ?? 0));
    const toShow = fits.length > 0 ? fits : all;

    const lines: string[] = [`🧹 **Best Match for ${requiredSqft.toLocaleString()} sqft area:**\n`];
    for (const { p, coverage } of toShow) {
      const covText = coverage ? ` — Coverage: **${coverage.toLocaleString()} sqft**` : '';
      const fit = coverage && coverage >= requiredSqft ? '✅' : coverage ? '⚠️ Smaller coverage' : '❓ Check with our team';
      lines.push(`**${p.name}**${covText} ${fit}`);
      lines.push(p.description);
      if (p.key_features) lines.push('Key features: ' + p.key_features.slice(0, 3).join(', '));
      lines.push('');
    }
    if (fits.length === 0) {
      lines.push(`ℹ️ None of our cleaning robots have published coverage data for ${requiredSqft.toLocaleString()} sqft. Contact us for a tailored recommendation.`);
    } else {
      lines.push(`**Recommendation:** ${fits[0].p.name} is the best fit for a ${requiredSqft.toLocaleString()} sqft area.`);
    }
    const buttons = toShow.map(s => s.p.name);
    buttons.push('Contact Allbotix', 'Back to Menu');
    return { text: lines.join('\n'), buttons };
  }

  // Score-based product matching — restricted to detected category if any
  const useCaseMatches: Array<{ score: number; product: Product }> = [];
  for (const p of pool) {
    let score = 0;
    const searchText = [p.name, p.description, ...(p.key_features || []), ...(p.tech_highlights || [])].join(' ').toLowerCase();
    const queryWords = msg.split(/\s+/).filter(w => w.length > 3);
    for (const word of queryWords) {
      if (searchText.includes(word)) score++;
    }
    if (score > 0) useCaseMatches.push({ score, product: p });
  }

  // If category was detected but no products scored, still return all products in that category
  if (categoryFilter && useCaseMatches.length === 0 && pool.length > 0) {
    for (const p of pool) useCaseMatches.push({ score: 1, product: p });
  }

  if (useCaseMatches.length > 0) {
    useCaseMatches.sort((a, b) => b.score - a.score);
    const top = useCaseMatches.slice(0, categoryFilter ? pool.length : 2);
    if (top[0].score >= 1) {
      const lines: string[] = ['Based on your requirement, here are the best-fit Allbotix robots:\n'];
      for (const match of top) {
        const p = match.product;
        lines.push(`**${p.name}** (${p.category})`);
        lines.push(p.description);
        if (p.key_features) lines.push('Key features: ' + p.key_features.slice(0, 3).join(', '));
        lines.push('');
      }
      lines.push('Tap a product below for full details, or contact us for a tailored recommendation.');
      const buttons = top.map(m => m.product.name);
      buttons.push('Contact Allbotix', 'Back to Menu');
      return { text: lines.join('\n'), buttons };
    }
  }

  return null;
}

function answerProductQuestion(msg: string, p: Product): ChatResponse | null {
  const detail = loadProductDetail(p.name);
  const back = CATEGORY_BACK_BUTTON[p.category];
  const buttons = [...(back ? [back] : []), 'Contact Allbotix', 'Back to Menu'];

  // Can it do surveillance / inspection / patrol?
  if (/(surveill|surv[ie]|inspect|patrol|monitor|security|watch|guard)/.test(msg)) {
    const isAutonomous = p.category === 'Autonomous Robot';
    if (isAutonomous) {
      const sensors = detail
        ? '\n\n**Sensors & Cameras:**\n' + Object.entries((detail as Record<string, {title?:string; content?:unknown}>))
            .filter(([, v]) => /sensor|hardware|accessory/i.test((v as {title?:string}).title || ''))
            .flatMap(([, v]) => Array.isArray((v as {content?:unknown[]}).content) ? (v as {content:string[]}).content.map(c => `• ${c}`) : [])
            .join('\n')
        : '';
      // Suggest the companion model too
      const companion = p.name === 'ALPHA GO2' ? 'ALPHA B2' : 'ALPHA GO2';
      return {
        text: `✅ **Yes, the ${p.name} is built for surveillance & inspection.**\n\n${p.description}\n\n**Why it's ideal for surveillance:**\n• All-terrain mobility — patrols any environment including stairs, outdoor, and uneven terrain\n• Modular design — supports LiDAR, depth cameras, thermal sensors, and custom payloads\n• IP67 protection — operates in harsh, dusty, or wet conditions\n• Autonomous navigation with scheduled patrol routes\n• Real-time data collection and remote monitoring${sensors}\n\nYou may also want to explore the **${companion}** for heavier industrial use cases.`,
        buttons: [p.name, companion, 'Contact Allbotix', 'Back to Menu'],
      };
    } else {
      return {
        text: `ℹ️ The **${p.name}** is a ${p.category} — primarily designed for ${p.description.toLowerCase()}\n\nFor surveillance and inspection tasks, we recommend the **ALPHA B2** or **ALPHA GO2** quadruped robots which are purpose-built for patrol, inspection, and security monitoring.`,
        buttons: ['ALPHA B2', 'ALPHA GO2', 'Back to Menu'],
      };
    }
  }

  // Can it clean?
  if (/(can|able|capable|do|does|support|used for|suitable|good for)/.test(msg) &&
      /(clean|mop|vacuum|sweep|scrub)/.test(msg)) {
    const isCleaner = p.category === 'Cleaning Robot';
    if (isCleaner) {
      return {
        text: `✅ **Yes, the ${p.name} is designed for cleaning.**\n\n${p.description}\n\n**Cleaning Capabilities:**\n${(p.key_features || []).map(f => `• ${f}`).join('\n')}`,
        buttons,
      };
    } else {
      return {
        text: `ℹ️ The **${p.name}** is a ${p.category} and is not designed for cleaning tasks.\n\nFor cleaning, check out our dedicated **Cleaning Robots** range.`,
        buttons: ['Cleaning Robots', 'Back to Menu'],
      };
    }
  }

  // Can it deliver?
  if (/(can|able|capable|do|does|support|used for|suitable|good for)/.test(msg) &&
      /(deliver|serve|food|tray|carry|transport)/.test(msg)) {
    const isDelivery = ['Serving Robot', 'Delivery Robot', 'Delivery & Marketing Robot'].includes(p.category);
    if (isDelivery) {
      return {
        text: `✅ **Yes, the ${p.name} is built for delivery.**\n\n${p.description}\n\n**Delivery Specs:**\n${(p.tech_highlights || []).map(t => `• ${t}`).join('\n')}`,
        buttons,
      };
    }
  }

  // Generic "can it do X" — answer based on features
  if (/(can|able|capable|do|does|support|used for|suitable|good for|work for)/.test(msg)) {
    const queryWords = msg.split(/\s+/).filter(w => w.length > 3 && !['this','that','does','can','able','good','used','suitable','support'].includes(w));
    const allText = [p.description, ...(p.key_features || []), ...(p.tech_highlights || [])].join(' ').toLowerCase();
    const matched = queryWords.filter(w => allText.includes(w));
    if (matched.length > 0) {
      return {
        text: `✅ **Yes, the ${p.name} supports this.**\n\n${p.description}\n\n**Relevant capabilities:**\n${(p.key_features || []).map(f => `• ${f}`).join('\n')}\n\n**Tech Highlights:**\n${(p.tech_highlights || []).map(t => `• ${t}`).join('\n')}`,
        buttons,
      };
    } else {
      return {
        text: `ℹ️ The **${p.name}** is a ${p.category}. ${p.description}\n\nThis may not be the best fit for that specific use case. Would you like to explore other options or contact our team for a tailored recommendation?`,
        buttons: [...buttons.slice(0, 1), 'Contact Allbotix', 'Back to Menu'],
      };
    }
  }

  return null;
}

// Answer a specific question about a group of products using their data
function answerAboutProducts(question: string, products: Product[]): ChatResponse {
  const q = norm(question);
  const buttons = [...products.map(p => p.name), 'Contact Allbotix', 'Back to Menu'];

  // Score each product against the question intent
  function scoreProduct(p: Product, keywords: string[]): number {
    const text = [p.description, ...(p.key_features || []), ...(p.tech_highlights || [])].join(' ').toLowerCase();
    const detail = loadProductDetail(p.name);
    const detailText = detail ? getDetailText(detail).toLowerCase() : '';
    let score = 0;
    for (const kw of keywords) {
      if (text.includes(kw)) score += 2;
      if (detailText.includes(kw)) score += 1;
    }
    return score;
  }

  // Spec/dimension/technical detail request
  if (/(spec|specification|dimension|weight|battery|payload|speed|range|suction|runtime|capacity|technical)/.test(q)) {
    const lines: string[] = [`**${products.map(p => p.name).join(' vs ')} — Specifications**\n`];
    for (const p of products) {
      const detail = loadProductDetail(p.name);
      lines.push(`**${p.name}**`);
      if (detail) {
        for (const [, page] of Object.entries(detail)) {
          const pg = page as { title?: string; content?: unknown };
          if (/spec/i.test(pg.title || '') && typeof pg.content === 'object' && !Array.isArray(pg.content)) {
            for (const [k, v] of Object.entries(pg.content as Record<string, string>)) {
              lines.push(`• **${k}:** ${v}`);
            }
          }
        }
      } else {
        if (p.key_features) for (const f of p.key_features) lines.push(`• ${f}`);
      }
      lines.push('');
    }
    return { text: lines.join('\n'), buttons };
  }

  // "Which is better for X" / "best for X" / "good for X" / "suitable for X"
  const bestForMatch = q.match(/(better|best|good|suitable|recommend|use|work)\s+(for|in|at)\s+(.+)/);
  const forWhat = bestForMatch ? bestForMatch[3].trim() : null;
  if (forWhat || /(office|home|restaurant|hotel|hospital|warehouse|outdoor|indoor|industrial|commercial|large\s*space|small\s*space|apartment|enterprise|retail|mall|lobby)/.test(q)) {
    const useCase = forWhat || q;
    const useKeywords = useCase.split(/\s+/).filter(w => w.length > 3);

    const scored = products.map(p => ({ p, score: scoreProduct(p, useKeywords) }));
    scored.sort((a, b) => b.score - a.score);

    const lines: string[] = [];
    const topScore = scored[0].score;

    if (topScore > 0) {
      lines.push(`Based on your use case **"${useCase}"**, here's how each compares:\n`);
      for (const { p, score } of scored) {
        const rank = score === topScore ? '✅ **Best fit**' : score > 0 ? '⚠️ Partial fit' : '❌ Not ideal';
        lines.push(`**${p.name}** — ${rank}`);
        lines.push(p.description);
        // Pull relevant features that match
        const relevantFeats = [...(p.key_features || []), ...(p.tech_highlights || [])]
          .filter(f => useKeywords.some(kw => f.toLowerCase().includes(kw)));
        if (relevantFeats.length > 0) {
          lines.push('Relevant capabilities:');
          for (const f of relevantFeats.slice(0, 3)) lines.push(`  • ${f}`);
        }
        lines.push('');
      }
      lines.push(`**Recommendation:** ${scored[0].p.name} is the best fit for ${useCase}.`);
    } else {
      // No keyword match — just describe each and let user decide
      lines.push(`Here's how **${products.map(p => p.name).join(', ')}** compare for your use case:\n`);
      for (const p of products) {
        lines.push(`**${p.name}** — ${p.category}`);
        lines.push(p.description);
        if (p.key_features) lines.push('Key features: ' + p.key_features.slice(0, 3).join(', '));
        lines.push('');
      }
      lines.push('Contact us for a tailored recommendation.');
    }
    return { text: lines.join('\n'), buttons };
  }

  // Feature comparison
  if (/(feature|capabilit|function|can.*do|what.*do|how.*different|difference)/.test(q)) {
    const lines: string[] = [`**Feature Comparison: ${products.map(p => p.name).join(' vs ')}**\n`];
    for (const p of products) {
      lines.push(`**⚙️ ${p.name}**`);
      lines.push(p.description);
      if (p.key_features && p.key_features.length > 0) {
        for (const f of p.key_features) lines.push(`• ${f}`);
      }
      if (p.tech_highlights && p.tech_highlights.length > 0) {
        for (const t of p.tech_highlights) lines.push(`• ${t}`);
      }
      lines.push('');
    }
    return { text: lines.join('\n'), buttons };
  }

  // Default: describe all products with full detail
  const lines: string[] = [`**${products.map(p => p.name).join(' vs ')}**\n`];
  for (const p of products) {
    lines.push(`**${p.name}** — ${p.category}`);
    lines.push(p.description);
    if (p.key_features) for (const f of p.key_features) lines.push(`• ${f}`);
    lines.push('');
  }
  lines.push('For a tailored recommendation, contact our team.');
  return { text: lines.join('\n'), buttons };
}

function howItWorksResponse(msg: string): ChatResponse | null {
  // Surveillance / inspection
  if (/(surveill|patrol|inspect|security|guard|monitor)/.test(msg)) {
    const products = loadProducts().filter(p => p.category === 'Autonomous Robot');
    const buttons = [...products.map(p => p.name), 'Contact Allbotix', 'Back to Menu'];
    return {
      text: `🔍 **How Surveillance Robots Work**\n\nAllbotix surveillance robots (like the **ALPHA B2** and **ALPHA GO2**) are quadruped (four-legged) robots built for autonomous patrol and inspection.\n\n**How they perform surveillance:**\n• **Sensors & Cameras:** Equipped with 360° LiDAR, depth cameras, and high-resolution optical cameras for real-time environment scanning\n• **Autonomous Navigation:** Use SLAM (Simultaneous Localization and Mapping) to build and navigate maps of the patrol area\n• **Scheduled Patrols:** Can run preset patrol routes 24/7 without human intervention\n• **Anomaly Detection:** Detect intruders, obstacles, or unusual activity using AI vision\n• **All-Terrain Mobility:** Walk on stairs, uneven ground, and outdoor environments — areas cameras or wheeled robots can't cover\n• **Remote Monitoring:** Stream live video and sensor data to a control center\n• **Modular Payloads:** Attach thermal cameras, gas sensors, or custom tools for specific inspection needs\n\n**Use cases:** Security patrol, factory floor inspection, outdoor monitoring, hazardous zone inspection, disaster response.`,
      buttons,
    };
  }

  // Cleaning robots
  if (/(clean|mop|vacuum|sweep|scrub)/.test(msg)) {
    const products = loadProducts().filter(p => p.category === 'Cleaning Robot');
    const buttons = [...products.map(p => p.name), 'Contact Allbotix', 'Back to Menu'];
    return {
      text: `🧹 **How Cleaning Robots Work**\n\nAllbotix cleaning robots use AI and LiDAR technology to clean spaces autonomously.\n\n**How they clean:**\n• **LiDAR + AI Mapping:** The robot first scans and maps the space using laser sensors, creating a precise floor plan\n• **Systematic Path Planning:** Calculates the most efficient cleaning route to cover every area\n• **Multi-Mode Cleaning:** Combines vacuuming, mopping, scrubbing, and drying in one pass\n• **Obstacle Detection:** Uses ToF (Time-of-Flight) sensors and cameras to detect and avoid furniture, people, and objects\n• **No-Go Zones:** You can define restricted areas via the app\n• **Auto Recharge & Resume:** Returns to dock when battery is low, then continues where it left off\n• **Self-Cleaning Mop:** Some models auto-wash and dry the mop after use\n\n**Use cases:** Homes, offices, hotels, hospitals, retail stores, large commercial spaces.`,
      buttons,
    };
  }

  // Delivery / serving robots
  if (/(deliver|serving|waiter|food|tray|hotel.*robot|restaurant.*robot)/.test(msg)) {
    const products = loadProducts().filter(p => ['Serving Robot', 'Delivery Robot', 'Delivery & Marketing Robot'].includes(p.category));
    const buttons = [...products.map(p => p.name), 'Contact Allbotix', 'Back to Menu'];
    return {
      text: `📦 **How Delivery & Serving Robots Work**\n\nAllbotix delivery robots autonomously transport food, items, or documents in restaurants, hotels, and hospitals.\n\n**How they work:**\n• **Autonomous Navigation:** Use LiDAR and cameras to navigate corridors, avoid people, and reach destination tables or rooms\n• **Multi-Tray Design:** Carry multiple orders simultaneously on stacked trays\n• **Touchscreen Interaction:** Customers can confirm delivery via onboard touchscreen; robots greet with voice/display\n• **Contactless Delivery:** Opens tray compartments automatically when destination is reached\n• **Safe Obstacle Avoidance:** Slows down and reroutes when people or objects are in the way\n• **Auto Return & Recharge:** Returns to base when idle or battery is low\n• **Fleet Management:** Multiple robots can operate simultaneously across a floor\n\n**Use cases:** Restaurants, hotels, hospitals, offices, malls.`,
      buttons,
    };
  }

  // AMR / warehouse
  if (/(warehouse|amr|autonomous\s*mobile|logistics|transport|goods)/.test(msg)) {
    const products = loadProducts().filter(p => p.category === 'Logistics Robot');
    const buttons = [...products.map(p => p.name), 'Contact Allbotix', 'Back to Menu'];
    return {
      text: `🚗 **How AMR (Autonomous Mobile Robots) Work**\n\nAllbotix AMRs are designed for warehouse and industrial material transport.\n\n**How they work:**\n• **Autonomous Navigation:** Use LiDAR, cameras, and SLAM to navigate warehouse floors without fixed tracks\n• **Dynamic Path Planning:** Recalculate routes in real time to avoid obstacles and other robots\n• **Heavy Payload Transport:** Carry goods, pallets, or materials up to hundreds of kilograms\n• **Fleet Coordination:** Multiple AMRs work together managed by a central system\n• **Integration with WMS:** Connect to Warehouse Management Systems for automated task assignment\n• **Auto Docking & Charging:** Return to charging stations between tasks\n\n**Use cases:** Warehouses, manufacturing plants, logistics centers, e-commerce fulfillment.`,
      buttons,
    };
  }

  // Reception robots
  if (/(reception|receptionist|front\s*desk|check.?in|visitor|lobby)/.test(msg)) {
    const products = loadProducts().filter(p => p.category === 'Reception Robot');
    const buttons = [...products.map(p => p.name), 'Contact Allbotix', 'Back to Menu'];
    return {
      text: `🤝 **How Reception Robots Work**\n\nAllbotix reception robots act as AI-powered front-desk assistants.\n\n**How they work:**\n• **Facial Recognition:** Identify returning visitors and greet them by name\n• **Visitor Check-In:** Guide visitors through check-in, print badges, notify hosts\n• **Voice Interaction:** Understand and respond to natural language questions\n• **Touchscreen Interface:** Visitors can navigate services, maps, or information via the display\n• **Autonomous Navigation:** Escort visitors to meeting rooms or destinations\n• **Multilingual Support:** Communicate in multiple languages\n• **Integration:** Connect with building management, calendars, and access control systems\n\n**Use cases:** Hotels, corporate offices, hospitals, malls, airports.`,
      buttons,
    };
  }

  return null;
}

/* ─── Claude AI fallback ────────────────────────────────────────── */

let anthropicClient: Anthropic | null = null;
function getAnthropicClient(): Anthropic {
  if (!anthropicClient) anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return anthropicClient;
}

function buildSystemPrompt(): string {
  const products = loadProducts();
  const productSummaries = products.map(p => {
    const features = p.key_features?.slice(0, 3).join(', ') || '';
    const highlights = p.tech_highlights?.slice(0, 2).join(', ') || '';
    return `- ${p.name} (${p.category}): ${p.description}${features ? '. Features: ' + features : ''}${highlights ? '. Tech: ' + highlights : ''}`;
  }).join('\n');

  return `You are the Allbotix AI assistant — a friendly, knowledgeable chatbot for Allbotix Robotics, the robotics division of Nanta Tech Limited.

COMPANY BACKGROUND:
Allbotix is the robotics division of Nanta Tech Limited, a publicly listed company (BSE SME Platform, 2025). Founded in 2018 as MNT Technologies, rebranded as Nanta Tech in 2023. Specialises in Robotics, AI, and AV solutions. Presented at INFOCOMM, FITAG, AVICN, Palm 2024.

PRODUCT CATALOG:
${productSummaries}

ROBOT CATEGORIES:
- Cleaning Robots: AT20 PRO, AT60, AX10, AMT 1, AC40, AS100N
- Reception Robots: ATR V3
- Delivery & Serving Robots: AW3, AT9, ASMR T10
- AMR (Autonomous Mobile Robots): AT300, AT600
- Surveillance & Inspection Robots: ALPHA B2, ALPHA GO2
- Robot Arms: AL Series
- Humanoid & Entertainment: G1

CONTACT: For pricing, demos, site visits, or custom solutions → https://www.allbotix.ai/contacts

RULES:
1. Only answer questions related to Allbotix, its robots, robotics in general, or use cases for automation.
2. For pricing or purchase requests, always direct to the contact page.
3. Keep answers concise, helpful, and professional.
4. Use bullet points and clear structure where helpful.
5. If a question is completely unrelated to robotics or Allbotix, politely redirect the user to robotics topics.
6. Do not make up specifications — if you don't know a specific spec, say so and suggest contacting the team.`;
}

async function callClaude(message: string, history: HistoryMessage[], contextProducts?: Product[]): Promise<ChatResponse | null> {
  try {
    const client = getAnthropicClient();
    const allProducts = loadProducts();
    const msgNorm = norm(fixTypos(message));

    // Resolve relevant products: explicit context → from message → from history → by category keyword
    let relevant: Product[] = contextProducts ? [...contextProducts] : [];

    if (relevant.length === 0) {
      relevant = allProducts.filter(p => msgNorm.includes(norm(p.name)));
    }
    if (relevant.length === 0) {
      relevant = getLastExchangeProducts(history);
    }
    if (relevant.length === 0) {
      const categoryMap: Array<{ pattern: RegExp; categories: string[] }> = [
        { pattern: /(clean|mop|vacuum|sweep|scrub)/, categories: ['Cleaning Robot'] },
        { pattern: /(deliver|serving|waiter|food|tray)/, categories: ['Serving Robot', 'Delivery Robot', 'Delivery & Marketing Robot'] },
        { pattern: /(surveill|patrol|security|inspect|quadruped)/, categories: ['Autonomous Robot'] },
        { pattern: /(reception|receptionist|front\s*desk|lobby)/, categories: ['Reception Robot'] },
        { pattern: /(warehouse|amr|logistics|transport)/, categories: ['Logistics Robot'] },
        { pattern: /(humanoid|entertainment)/, categories: ['Humanoid Robot'] },
        { pattern: /(robot\s*arm|cobot|assembly)/, categories: ['Robot Arm'] },
      ];
      for (const cm of categoryMap) {
        if (cm.pattern.test(msgNorm)) {
          relevant = allProducts.filter(p => cm.categories.includes(p.category));
          break;
        }
      }
    }

    // Build full product detail context from JSON files
    let productContext = '';
    if (relevant.length > 0) {
      const sections: string[] = [];
      for (const p of relevant.slice(0, 5)) {
        const detail = loadProductDetail(p.name);
        let section = `\n### ${p.name} (${p.category})\n${p.description}`;
        if (p.key_features?.length) section += '\nKey Features:\n' + p.key_features.map(f => `- ${f}`).join('\n');
        if (p.tech_highlights?.length) section += '\nTech Highlights:\n' + p.tech_highlights.map(t => `- ${t}`).join('\n');
        if (detail) section += '\n\nDetailed Specifications:\n' + getDetailText(detail);
        sections.push(section);
      }
      productContext = '\n\nRELEVANT PRODUCT DATA FROM CATALOG:\n' + sections.join('\n\n---\n');
    }

    const systemPrompt = buildSystemPrompt() + productContext + `

ANSWERING GUIDELINES:
- Use the product data above to give specific, accurate answers
- When answering capability questions, cite specific features or specs from the data
- For comparisons, highlight differences based on actual specs
- Keep the tone friendly and concise
- End responses with a helpful suggestion or next step`;

    const messages: Anthropic.MessageParam[] = history.slice(-6).map(h => ({
      role: h.role === 'user' ? 'user' : 'assistant',
      content: h.text,
    }));
    messages.push({ role: 'user', content: message });

    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    const responseText = response.content
      .filter(b => b.type === 'text')
      .map(b => (b as { type: 'text'; text: string }).text)
      .join('');

    if (!responseText) return null;

    // Smart buttons: named products + standard actions
    const buttons: string[] = [];
    for (const p of relevant.slice(0, 4)) buttons.push(p.name);
    buttons.push('Contact Allbotix', 'Back to Menu');

    return { text: responseText, buttons };
  } catch {
    return null;
  }
}

function recommendCategory(raw: string): ChatResponse | null {
  const msg = norm(fixTypos(raw));
  const content = loadContent();

  if (/(patrol|surveill|security)/.test(msg)) return fromNode(content['surveillance_robot']);
  if (/(warehouse|logistic|material\s+transport|forklift|payload|goods\s+transport|supply\s*chain|inventory|distribution|shifting|pallet|cargo\s*transport)/.test(msg)) return fromNode(content['amr']);
  if (/(restaurant|cafe|coffee|hotel|serving|food\s+delivery|tray|dining)/.test(msg)) return fromNode(content['delivery_robot']);
  if (/(clean|mop|scrub|vacuum|sweep|sqft|sq\s*ft|office\s+floor)/.test(msg)) return fromNode(content['cleaning_robot']);
  if (/(reception|visitor|lobby|front\s*desk|check\s*-?in)/.test(msg)) return fromNode(content['reception_robot']);
  if (/(humanoid|bolt|entertainment|greet|stage)/.test(msg)) return fromNode(content['entertainment_robot']);
  if (/(arm|assembly|pick\s*and\s*place|cobot|manufacturing|production\s*line|grip|\bhand(s)?\b|manipulat|arm\s*robot)/.test(msg)) return fromNode(content['robot_arm']);

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

  // Greetings
  if (/^(hi|hello|hey|yo|namaste|howdy|start|menu)(\b.*)?$/i.test(msg)) {
    const robotics = fromNode(content['robotics']);
    return { ...robotics, text: `👋 Hello! Welcome to Allbotix.\n\n${robotics.text}` };
  }

  // Company / about us — check early, always wins over history context
  if (/(about\s*(allbotix|company|nanta|us)|who\s*(are|is)\s*(allbotix|nanta|you|we)|tell.*about.*company|tell.*about.*allbotix|company.*history|history.*company|nanta\s*tech|founded|mission|vision|background|bse|stock\s*exchange|listed|public\s*listed|mnt\s*tech|infocomm|fitag|avicn|palm\s*2024)/.test(msg)) {
    return {
      text: `🏢 **About Allbotix & Nanta Tech Limited**\n\n**Allbotix** is the robotics division of **Nanta Tech Limited** — a publicly listed technology company specialising in advanced Robotics, AI-driven innovation, and AV solutions.\n\n**Company History**\n• Founded in **2018** as MNT Technologies\n• Acquired and rebranded as **Nanta Tech Private Limited** in 2023\n• Achieved **public listing on the Bombay Stock Exchange (BSE – SME Platform)** in 2025 — growing from a startup to a global leader in equitable technology\n• Today, Nanta Tech Limited is a **Public Limited Company**\n\n**Industry Presence**\nDemonstrated innovation at major global expos:\n• INFOCOMM • FITAG • AVICN • Palm 2024\n\n**Our Mission**\nTo put the power of intelligent machines in service of people — building robotics, autonomous vehicle-grade AI, and AV solutions that make industries safer, operations smarter, and human potential limitless.\n\n**Our Vision**\nA world where intelligent machines work alongside humanity as trusted partners — eliminating preventable harm, unlocking human creativity, and making India a global force in robotics and AI.`,
      buttons: ['Explore Robots', 'Contact Allbotix', 'Back to Menu'],
    };
  }

  // Contact — specific intents (demo, meet team, pricing, etc.)
  const humanContact = humanContactResponse(msg);
  if (humanContact) return humanContact;

  // Contact — generic
  if (
    /^contact(\s+allbotix)?$/i.test(msg) ||
    /^(talk\s+to\s+(human|agent|sales|team)|book\s+a?\s*demo|get\s+quote|pricing|price|buy)/i.test(msg) ||
    /connect\s+(me\s+)?(with\s+)?(senior|sales|technical)/i.test(msg)
  ) {
    return contactResponse();
  }

  // Use case query — check early before history context, but only for category-level questions (no specific product named)
  const isUseCaseQuery = /(use\s*case|use\s*cases|application|applications|where.*used|used\s*(for|in|at)|what.*used\s*for|suitable\s*for|good\s*for|purpose|scenario|when\s*to\s*use|explain.*use|use.*explain|industries|industry|environment)/.test(msg);
  const hasNamedProduct = loadProducts().some(p => msg.includes(norm(p.name)));
  if (isUseCaseQuery && !hasNamedProduct) {
    const smart = smartReasoningResponse(msg);
    if (smart) return smart;
  }

  // Menu navigation
  const nodeKey = matchNode(text);
  if (nodeKey && content[nodeKey]) return fromNode(content[nodeKey]);

  const isDetailRequest = /(detail|spec|specification|full\s*info|more\s*info|tell\s*me\s*more|elaborate|describe|accessory|hardware|sensor|camera|dimension|weight|battery|payload|navigation|feature)/.test(msg);
  const isCompareRequest = /(compare|vs|versus|difference|better|which one|which is|prefer)/.test(msg);
  const isHowRequest = /(how\s+\w+(\s+\w+)?\s+(work|perform|function|do|help|handle|use|used|can|does|is)|how\s+(does|can|do|is|it|the|this|that)|how.*\?)/.test(msg);

  // Detect if the current message introduces a NEW topic/category (topic switch)
  const TOPIC_PATTERNS = [
    /(robot\s*arm|cobot|assembly|\bhand(s)?\b|grip|manipulat)/,
    /(surveill|patrol|security|inspect|guard|quadruped|four.?leg)/,  // broader: just "inspect" not "inspection robot"
    /(clean|mop|vacuum|sweep|scrub)/,
    /(deliver|serving|serve|waiter|restaurant|food|tray|dining)/,    // broader: "serve", "food"
    /(reception|receptionist|front\s*desk|lobby|visitor|check.?in)/,
    /(warehouse|amr|autonomous\s*mobile|logistic|supply\s*chain|inventory|distribution|shifting|pallet|cargo)/,
    /(humanoid|entertainment|stage|performance)/,
  ];
  const currentTopic = TOPIC_PATTERNS.findIndex(p => p.test(msg));

  // Find last topic from history — scan ALL past user messages for the most recent one with a known topic
  let lastTopic = -1;
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].role !== 'user') continue;
    const t = TOPIC_PATTERNS.findIndex(p => p.test(norm(history[i].text)));
    if (t !== -1) { lastTopic = t; break; }
  }
  const isTopicSwitch = currentTopic !== -1 && lastTopic !== -1 && currentTopic !== lastTopic;

  const hasProductInMsg = loadProducts().some(p => msg.includes(norm(p.name)));

  // ── TOPIC SWITCH: user changed subject — ignore ALL history, handle fresh ──
  if (isTopicSwitch) {
    if (isHowRequest) { const how = howItWorksResponse(msg); if (how) return how; }
    const smart = smartReasoningResponse(msg);
    if (smart) return smart;
    const rec = recommendCategory(msg);
    if (rec) return rec;
    // Rule-based couldn't handle it — let Claude answer fresh (no stale history context)
    const claudeSwitch = await callClaude(text, []);
    if (claudeSwitch) return claudeSwitch;
  }

  // ── NO TOPIC SWITCH: use history context ────────────────────────────────
  if (!isTopicSwitch) {
    // "How does X category work"
    if (isHowRequest && currentTopic !== -1 && !hasProductInMsg) {
      const how = howItWorksResponse(msg);
      if (how) return how;
    }

    // Area/spec follow-up — "for 500sqft" after a cleaning/delivery query
    const areaInMsg = /(\d[\d,]*)\s*(sq\.?\s*ft|sqft|sq\.?\s*m|sqm|m²|m2|square\s*(feet|foot|meter))/.test(msg);
    if (areaInMsg && !hasProductInMsg && history.length > 0) {
      const lastUserText = [...history].reverse().find(h => h.role === 'user')?.text || '';
      const AREA_CATS: Array<{ pattern: RegExp; keyword: string }> = [
        { pattern: /(clean|mop|vacuum|sweep|scrub)/, keyword: 'clean' },
        { pattern: /(deliver|serving|waiter|restaurant)/, keyword: 'serving' },
        { pattern: /(warehouse|amr|logistics)/, keyword: 'warehouse' },
      ];
      for (const ac of AREA_CATS) {
        if (ac.pattern.test(norm(lastUserText))) {
          const smart = smartReasoningResponse(lastUserText + ' ' + msg);
          if (smart) return smart;
          break;
        }
      }
    }

    // History context — multi or single product follow-up
    if (!hasProductInMsg && history.length > 0) {
      const exchangeProducts = getLastExchangeProducts(history);

      if (exchangeProducts.length > 0) {
        // Detect if current message implies a different category than the history products
        const CATEGORY_SIGNALS: Array<{ pattern: RegExp; categories: string[] }> = [
          { pattern: /(\bhand(s)?\b|grip|manipulat|robot.*arm)/, categories: ['Robot Arm'] },
          { pattern: /(warehouse|amr|logistic|shifting|pallet|supply\s*chain)/, categories: ['Logistics Robot'] },
          { pattern: /(serving|serve|waiter|restaurant|food|tray|dining)/, categories: ['Serving Robot', 'Delivery Robot', 'Delivery & Marketing Robot'] },
          { pattern: /(deliver|dispatch)/, categories: ['Serving Robot', 'Delivery Robot', 'Delivery & Marketing Robot'] },
          { pattern: /(clean|mop|vacuum|sweep|scrub)/, categories: ['Cleaning Robot'] },
          { pattern: /(reception|receptionist|front\s*desk|lobby|visitor|check.?in)/, categories: ['Reception Robot'] },
          { pattern: /(surveill|patrol|security|inspect|guard|quadruped)/, categories: ['Autonomous Robot'] },
          { pattern: /(humanoid|entertainment)/, categories: ['Humanoid Robot'] },
        ];
        let impliedCategories: string[] | null = null;
        for (const cs of CATEGORY_SIGNALS) {
          if (cs.pattern.test(msg)) { impliedCategories = cs.categories; break; }
        }
        const categoryMismatch = impliedCategories !== null &&
          !exchangeProducts.some(p => impliedCategories!.includes(p.category));

        // Category mismatch: history products are from wrong category — use Claude fresh
        if (categoryMismatch) {
          const claudeResp = await callClaude(text, []);
          if (claudeResp) return claudeResp;
          const smart = smartReasoningResponse(msg);
          if (smart) return smart;
          const rec = recommendCategory(msg);
          if (rec) return rec;
        }
      }

      const isSpecificQuestion = /(can|able|capable|does|do|support|handle|work|want|need|looking|suggest|recommend|suitable|good for|feature|spec|technical|sensor|battery|payload|cover|floor|wet|dry|outdoor|indoor|which|better|difference|compare|vs)/.test(msg);

      if (exchangeProducts.length >= 2 && !isHowRequest) {
        if (isSpecificQuestion) {
          const claudeResp = await callClaude(text, history, exchangeProducts);
          if (claudeResp) return claudeResp;
        }
        return answerAboutProducts(msg, exchangeProducts);
      } else if (exchangeProducts.length >= 1 && !isCompareRequest) {
        if (isSpecificQuestion) {
          const claudeResp = await callClaude(text, history, exchangeProducts);
          if (claudeResp) return claudeResp;
        }
        const earlyContext = contextFollowUp(msg, history);
        if (earlyContext) return earlyContext;
      }
    }
  }

  // Comparison — find products in current message first, then fall back to history
  if (isCompareRequest) {
    const products = loadProducts();
    const inMsg: Product[] = [];
    for (const p of products) {
      if (msg.includes(norm(p.name))) inMsg.push(p);
    }
    // If 2+ products explicitly named in message, use message products only (ignore history)
    const contextResp = inMsg.length >= 2
      ? contextFollowUp(msg, [])
      : contextFollowUp(msg, history);
    if (contextResp) return contextResp;
  }

  // "How does X work" — category-level explanation (check before product match)
  if (isHowRequest) {
    const how = howItWorksResponse(msg);
    if (how) return how;
  }

  // Exact product match — check if there's a question about it
  const product = matchProduct(text);
  if (product) {
    // Use case question about a specific product
    if (/(use\s*case|use\s*cases|application|applications|where.*used|used\s*(for|in|at)|what.*used\s*for|suitable\s*for|good\s*for|purpose|scenario|when\s*to\s*use|explain.*use|use.*explain|industry|industries|environment)/.test(msg)) {
      const detail = loadProductDetail(product.name);
      const back = CATEGORY_BACK_BUTTON[product.category];
      const buttons = [...(back ? [back] : []), 'Contact Allbotix', 'Back to Menu'];

      // Pull use case / application pages from detail file if available
      const useCaseLines: string[] = [];
      if (detail) {
        for (const [, page] of Object.entries(detail)) {
          const p = page as { title?: string; content?: unknown };
          if (!p.title) continue;
          if (/(use\s*case|application|scenario|industry|industries|environment|suitable|purpose|where|deploy)/i.test(p.title)) {
            useCaseLines.push(`**${p.title}**`);
            if (Array.isArray(p.content)) {
              for (const item of p.content as string[]) useCaseLines.push(`• ${item}`);
            } else if (typeof p.content === 'string') {
              useCaseLines.push(p.content);
            }
            useCaseLines.push('');
          }
        }
      }

      // Build use case response from product category knowledge + detail data
      const CATEGORY_USE_CASES: Record<string, string[]> = {
        'Cleaning Robot': ['Offices & Corporate Buildings', 'Hotels & Hospitality', 'Retail & Shopping Malls', 'Hospitals & Healthcare Facilities', 'Airports & Transit Hubs', 'Warehouses & Industrial Floors', 'Restaurants & Food Courts', 'Residential Apartments'],
        'Serving Robot': ['Restaurants & Cafes — autonomous table service', 'Hotels — contactless room service delivery', 'Hospitals — meal and medicine transport between wards', 'Corporate Offices — refreshment and parcel delivery', 'Event Venues — guest service at large gatherings'],
        'Delivery Robot': ['Restaurants & Hotels — food and beverage delivery', 'Hospitals — medication and supply transport', 'Office Buildings — inter-floor document and parcel delivery', 'Retail Stores — in-store customer assistance'],
        'Delivery & Marketing Robot': ['Restaurants & Cafes — food delivery with promotional display', 'Malls & Retail — customer engagement and product promotion', 'Hotels — contactless delivery with branded interaction', 'Events & Exhibitions — interactive marketing at venues'],
        'Logistics Robot': ['Warehouses & Fulfilment Centres — autonomous goods transport', 'Manufacturing Plants — material movement along production lines', 'E-Commerce Logistics — high-speed order fulfilment', 'Automotive Assembly — heavy component transport', 'Cold Storage — temperature-controlled materials handling'],
        'Autonomous Robot': ['Security Patrol — 24/7 perimeter and indoor rounds', 'Factory & Plant Inspection — fault and anomaly detection', 'Power Infrastructure — substation and transmission line inspection', 'Construction Sites — safety monitoring and progress tracking', 'Disaster & Rescue — navigate hazardous zones to locate survivors', 'Outdoor Environments — all-terrain patrol in rain, dust, uneven terrain'],
        'Reception Robot': ['Corporate Offices — visitor check-in and host notification', 'Hotels — guest welcome and check-in assistance', 'Hospitals — patient guidance and department wayfinding', 'Shopping Malls — customer assistance and store directions', 'Airports — flight information and passenger guidance', 'Exhibitions & Events — interactive visitor engagement'],
        'Humanoid Robot': ['Hotels & Hospitality — interactive guest engagement', 'Education — interactive learning companion', 'Events & Trade Shows — audience attraction', 'Retail — product demo and customer interaction', 'Healthcare — social companion for elderly patients'],
        'Robot Arm': ['Manufacturing & Assembly — precision component assembly', 'Pick & Place — sorting, packaging, palletising', 'Welding & Fabrication — consistent quality welds', 'Pharmaceutical Packaging — sterile product handling', 'Electronics Assembly — micro-component placement'],
      };

      const categoryUC = CATEGORY_USE_CASES[product.category] || [];
      const lines: string[] = [`📋 **${product.name} — Use Cases & Applications**\n`, product.description, ''];

      if (useCaseLines.length > 0) {
        lines.push(...useCaseLines);
      } else {
        lines.push(`**Where is the ${product.name} used?**`);
        for (const uc of categoryUC) lines.push(`• ${uc}`);
        lines.push('');
      }

      if (product.key_features && product.key_features.length > 0) {
        lines.push(`**Why it fits these use cases:**`);
        for (const f of product.key_features.slice(0, 4)) lines.push(`• ${f}`);
      }

      return { text: lines.join('\n'), buttons };
    }

    // "How does this product do X" — explain using product detail data
    if (isHowRequest) {
      const detail = loadProductDetail(product.name);
      const back = CATEGORY_BACK_BUTTON[product.category];
      const buttons = [...(back ? [back] : []), 'Contact Allbotix', 'Back to Menu'];
      if (detail) {
        const lines: string[] = [`**How ${product.name} Works**\n`, product.description, ''];
        for (const [, page] of Object.entries(detail)) {
          const p = page as { title?: string; content?: unknown };
          if (!p.title) continue;
          lines.push(`**${p.title}**`);
          if (Array.isArray(p.content)) {
            for (const item of p.content as string[]) lines.push(`• ${item}`);
          } else if (typeof p.content === 'string') {
            lines.push(p.content);
          }
          lines.push('');
        }
        return { text: lines.join('\n'), buttons };
      }
      return { text: `**${product.name}** — ${product.description}\n\n**Key Capabilities:**\n${(product.key_features || []).map(f => `• ${f}`).join('\n')}`, buttons };
    }
    if (isDetailRequest && !isCompareRequest) return productResponse(product, true);
    const questionResp = answerProductQuestion(msg, product);
    if (questionResp) return questionResp;
    // For other questions about a named product, let Claude answer with full data
    if (/(can|able|capable|does|do|support|handle|work|suitable|good for|feature|spec|compare|vs|difference|better|which)/.test(msg)) {
      const claudeResp = await callClaude(text, history, [product]);
      if (claudeResp) return claudeResp;
    }
    return productResponse(product);
  }

  // Context-aware follow-up using conversation history
  const contextResp = contextFollowUp(msg, history);
  if (contextResp) return contextResp;

  // "How does it work" using context (product in history)
  if (isHowRequest) {
    const how = howItWorksResponse(msg);
    if (how) return how;
  }

  // Smart reasoning
  const smart = smartReasoningResponse(msg);
  if (smart) return smart;

  // Category routing
  const rec = recommendCategory(msg);
  if (rec) return rec;

  // Claude AI fallback — handles questions outside the rule-based system
  const claudeResp = await callClaude(text, history);
  if (claudeResp) return claudeResp;

  // Final fallback
  if (content['fallback']) return fromNode(content['fallback']);

  return {
    text: "I can help you explore **Allbotix Robotics** — cleaning, reception, delivery, AMR, surveillance, robot arms, or humanoids. Pick a category below 👇",
    buttons: ['Cleaning Robots', 'Reception Robots', 'Delivery Robots', 'AMR', 'Surveillance Robots', 'Robot Arm', 'Entertainment Robots', 'Contact Allbotix'],
  };
}
