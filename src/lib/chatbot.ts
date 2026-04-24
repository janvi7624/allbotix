/**
 * Allbotix chatbot flow — data-driven.
 *
 * Content is loaded from:
 *   - data/chatbot/content.json        (menu nodes: text, buttons, image, video_link)
 *   - data/chatbot/robots_products.json (per-product details, demo links, specs)
 *
 * Image paths in content.json use "/static/images/…" — we rewrite those to
 * "/chatbot/images/…" where the actual public assets live.
 */

import fs from 'node:fs';
import path from 'node:path';

export type ChatResponse = {
  text: string;
  image?: string;
  images?: string[];
  video_link?: string;
  buttons?: string[];
  type?: 'normal' | 'recommendation';
};

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

/**
 * Button labels (title-case) → content.json keys (snake_case).
 * "Back to …" labels map to the parent node.
 */
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
];

/**
 * Product-category → "Back to …" button label.
 * Used to decorate product responses with a relevant back-link.
 */
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

function matchNode(raw: string): string | null {
  const msg = norm(raw);
  for (const row of LABEL_TO_NODE) {
    if (row.match.test(msg)) return row.key;
  }
  return null;
}

function matchProduct(raw: string): Product | null {
  const msg = norm(raw);
  const products = loadProducts();
  for (const p of products) {
    if (norm(p.name) === msg) return p;
  }
  // Loose contains match (e.g. "tell me about at20 pro")
  for (const p of products) {
    if (msg.includes(norm(p.name))) return p;
  }
  return null;
}

function productResponse(p: Product): ChatResponse {
  const lines: string[] = [];
  lines.push(`**${p.name}**`);
  lines.push('');
  lines.push(p.description);

  if (p.key_features && p.key_features.length > 0) {
    lines.push('');
    lines.push('**Key Features:**');
    for (const f of p.key_features) lines.push(`• ${f}`);
  }

  if (p.tech_highlights && p.tech_highlights.length > 0) {
    lines.push('');
    lines.push('**Tech Highlights:**');
    for (const t of p.tech_highlights) lines.push(`• ${t}`);
  }

  const buttons: string[] = [];
  const back = CATEGORY_BACK_BUTTON[p.category];
  if (back) buttons.push(back);
  buttons.push('Contact Allbotix', 'Back to Menu');

  const resp: ChatResponse = {
    text: lines.join('\n'),
    buttons,
  };
  if (p.demo_link) resp.video_link = p.demo_link;
  return resp;
}

function contactResponse(): ChatResponse {
  return {
    text:
      "📞 *Contact Allbotix*\n\nOur team is ready to help you pick the right robot, schedule a live demo, or send a tailored quote.\n\n**Email:** [info@allbotix.com](mailto:info@allbotix.com)\n**WhatsApp:** +91 98980 00000\n**Office:** Ahmedabad, Gujarat, India\n\n👉 [Open the contact page](/contacts) and share your use case — we usually reply the same day.",
    buttons: ['Robotics', 'Back to Menu'],
  };
}

function recommendCategory(raw: string): ChatResponse | null {
  const msg = norm(raw);
  const content = loadContent();

  // Surveillance / inspection / patrol hints
  if (/(inspect|patrol|surveill|security|heat\s*monitor|workstation\s*inspection)/.test(msg)) {
    return {
      text:
        "For workstation inspection, patrol, or safety monitoring, these categories fit best:\n\n• **Surveillance Robots** — rugged quadruped robots for patrol & inspection\n• **AMR** — autonomous movement across large work areas\n\nChoose a category below and I'll suggest the best-fit models.",
      buttons: ['Surveillance Robots', 'AMR', 'Contact Allbotix', 'Back to Menu'],
    };
  }

  // Warehouse / logistics hints
  if (/(warehouse|logistic|material\s+transport|forklift|payload|goods\s+transport)/.test(msg)) {
    return fromNode(content['amr']);
  }

  // Restaurant / food / hotel hints
  if (/(restaurant|cafe|coffee|hotel|serving|food\s+delivery|tray|dining)/.test(msg)) {
    return fromNode(content['delivery_robot']);
  }

  // Office / cleaning / sqft hints
  if (/(clean|mop|scrub|vacuum|sweep|sqft|sq\s*ft|office\s+floor)/.test(msg)) {
    return fromNode(content['cleaning_robot']);
  }

  // Reception / visitor hints
  if (/(reception|visitor|lobby|front\s*desk|check\s*-?in)/.test(msg)) {
    return fromNode(content['reception_robot']);
  }

  // Humanoid hints
  if (/(humanoid|bolt|entertainment|greet|stage)/.test(msg)) {
    return fromNode(content['entertainment_robot']);
  }

  // Arm / manufacturing hints
  if (/(arm|assembly|pick\s*and\s*place|cobot|manufacturing|production\s*line|grip)/.test(msg)) {
    return fromNode(content['robot_arm']);
  }

  return null;
}

/* ─── Public API ───────────────────────────────────────────────── */

export function welcome(): ChatResponse {
  const content = loadContent();
  // Open the widget directly on the Robotics hub — matches the reference
  // bot behavior captured in data/chatbot/chat_history.json.
  return fromNode(content['robotics']);
}

export function reply(raw: string): ChatResponse {
  const text = (raw || '').trim();
  if (!text) return welcome();

  const msg = norm(text);
  const content = loadContent();

  // Greetings
  if (/^(hi|hello|hey|yo|namaste|howdy|start|menu)$/i.test(msg)) {
    return fromNode(content['robotics']);
  }

  // Contact
  if (
    /^contact(\s+allbotix)?$/i.test(msg) ||
    /^(talk\s+to\s+(human|agent|sales|team)|book\s+a?\s*demo|get\s+quote|pricing|price|buy)/i.test(msg) ||
    /connect\s+(me\s+)?(with\s+)?(senior|sales|technical)/i.test(msg)
  ) {
    return contactResponse();
  }

  // Menu navigation
  const nodeKey = matchNode(text);
  if (nodeKey && content[nodeKey]) {
    return fromNode(content[nodeKey]);
  }

  // Product detail
  const product = matchProduct(text);
  if (product) {
    return productResponse(product);
  }

  // Free-text category recommendation
  const rec = recommendCategory(text);
  if (rec) return rec;

  // Fallback — content.json has a dedicated fallback node
  if (content['fallback']) {
    return fromNode(content['fallback']);
  }

  return {
    text:
      "I can help you explore **Allbotix Robotics** — cleaning, reception, delivery, AMR, surveillance, robot arms, or humanoids. Pick a category below 👇",
    buttons: [
      'Cleaning Robots',
      'Reception Robots',
      'Delivery Robots',
      'AMR',
      'Surveillance Robots',
      'Robot Arm',
      'Entertainment Robots',
      'Contact Allbotix',
    ],
  };
}
