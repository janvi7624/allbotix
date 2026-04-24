'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import styles from './ChatWidget.module.css';

const SESSION_KEY = 'allbotix_chat_session_id';

type Section = {
  title: string;
  items?: { name: string; link?: string; features?: string[] }[];
};

type RecommendationCardData = {
  type: 'recommendation';
  room_label?: string;
  room_detail?: string;
  sections?: Section[];
  led?: { name?: string; link?: string };
  why?: string;
};

type BotPayload = {
  text?: string;
  image?: string;
  images?: string[];
  video_link?: string;
  buttons?: string[];
  type?: 'normal' | 'recommendation';
};

type ChatMessage =
  | { role: 'user'; text: string }
  | ({ role: 'bot' } & BotPayload)
  | { role: 'bot'; card: RecommendationCardData };

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  const existing = window.localStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const created = 'sess_' + Math.random().toString(36).substring(2, 14);
  window.localStorage.setItem(SESSION_KEY, created);
  return created;
}

function parseBold(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+|\/[^)]+|mailto:[^)]+|tel:[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [buttons, setButtons] = useState<string[]>([]);
  const [showTyping, setShowTyping] = useState(false);
  const [input, setInput] = useState('');
  const sessionIdRef = useRef<string>('');
  const welcomedRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showTyping]);

  const loadWelcome = useCallback(async () => {
    setShowTyping(true);
    try {
      const res = await fetch('/api/chatbot/welcome');
      const data: BotPayload = await res.json();
      setShowTyping(false);
      setMessages((m) => [...m, { role: 'bot', ...data }]);
      setButtons(data.buttons || []);
    } catch {
      setShowTyping(false);
      setMessages((m) => [
        ...m,
        {
          role: 'bot',
          text:
            "👋 *Welcome to Allbotix!*\n\nI'm your robotics assistant. What would you like to explore?",
        },
      ]);
      setButtons(['Explore Robots', 'Our Solutions', 'About Allbotix', 'Contact Sales']);
    }
  }, []);

  useEffect(() => {
    if (isOpen && !welcomedRef.current) {
      welcomedRef.current = true;
      loadWelcome();
    }
  }, [isOpen, loadWelcome]);

  const sendMessage = useCallback(async (overrideText?: string) => {
    const text = typeof overrideText === 'string' ? overrideText : input.trim();
    if (!text || isWaiting) return;

    if (typeof overrideText !== 'string') setInput('');
    setMessages((m) => [...m, { role: 'user', text }]);
    setButtons([]);
    setIsWaiting(true);
    setShowTyping(true);

    try {
      const res = await fetch('/api/chatbot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, session_id: sessionIdRef.current }),
      });
      const data: BotPayload & Partial<RecommendationCardData> = await res.json();
      setShowTyping(false);

      if (data.type === 'recommendation') {
        setMessages((m) => [...m, { role: 'bot', card: data as RecommendationCardData }]);
      } else {
        setMessages((m) => [...m, { role: 'bot', ...data }]);
      }
      setButtons(data.buttons || []);
    } catch {
      setShowTyping(false);
      setMessages((m) => [
        ...m,
        { role: 'bot', text: "Sorry, I'm having trouble connecting. Please try again." },
      ]);
    } finally {
      setIsWaiting(false);
    }
  }, [input, isWaiting]);

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      <button
        className={`${styles.chatFab} ${isOpen ? styles.isOpen : ''}`}
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {!isOpen ? (
          <span className={styles.fabOpenContent}>
            <img src="/logo_light_theme.png" alt="Allbotix" className={styles.fabLogo} />
            <span className={styles.fabText}>How may I help you?</span>
          </span>
        ) : (
          <span className={styles.fabCloseContent}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </span>
        )}
      </button>

      <div className={`${styles.chatWindow} ${isOpen ? styles.open : ''}`} aria-hidden={!isOpen}>
        <div className={styles.chatHeader}>
          <div className={styles.chatHeaderAvatar}>
            <img src="/logo_light_theme.png" alt="Allbotix" />
            <span className={styles.statusDot}></span>
          </div>
          <div className={styles.chatHeaderInfo}>
            <div className={styles.chatAgentName}>Allbotix Assistant</div>
            <div className={styles.chatAgentStatus}>Online · Typically replies instantly</div>
          </div>
          <button className={styles.chatCloseBtn} onClick={() => setIsOpen(false)} aria-label="Close chat">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className={styles.chatMessages} role="log" aria-live="polite">
          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {showTyping && (
          <div className={styles.typingIndicator}>
            <span></span><span></span><span></span>
          </div>
        )}

        <div className={styles.quickReplies}>
          {buttons.map((label, i) => (
            <button key={i} className={styles.qrBtn} onClick={() => sendMessage(label)}>
              {label}
            </button>
          ))}
        </div>

        <div className={styles.chatInputBar}>
          <input
            type="text"
            className={styles.chatInput}
            value={input}
            placeholder="Type your message…"
            autoComplete="off"
            disabled={isWaiting}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
          />
          <button
            className={styles.sendBtn}
            onClick={() => sendMessage()}
            disabled={isWaiting}
            aria-label="Send"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <line x1="22" y1="2" x2="11" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  if (msg.role === 'user') {
    return (
      <div className={`${styles.message} ${styles.user}`}>
        <div className={styles.bubble}>{msg.text}</div>
      </div>
    );
  }

  if ('card' in msg && msg.card) {
    return <RecommendationCard data={msg.card} />;
  }

  const bot = msg as { role: 'bot' } & BotPayload;

  return (
    <div className={`${styles.message} ${styles.bot}`}>
      <div className={styles.botAvatarSm}>
        <img src="/logo_light_theme.png" alt="Allbotix" />
      </div>
      <div className={styles.bubble}>
        {bot.images && bot.images.length > 0 ? (
          <div className={`${styles.bubbleCollage} ${bot.images.length === 3 ? styles.collage3 : ''}`}>
            {bot.images.map((src: string, i: number) => (
              <img key={i} src={src} alt="" className={styles.collageImage} />
            ))}
          </div>
        ) : bot.image ? (
          <img src={bot.image} alt="" className={styles.bubbleImage} />
        ) : null}

        <span dangerouslySetInnerHTML={{ __html: parseBold(bot.text || '') }} />

        {bot.video_link && (
          <div style={{ marginTop: 8 }}>
            <a href={bot.video_link} target="_blank" rel="noopener noreferrer" className={styles.bubbleVideoLink}>
              ▶ Watch Demo Video
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function RecommendationCard({ data }: { data: RecommendationCardData }) {
  const SECTION_ICONS: Record<string, string> = {
    'Video Options': '📷',
    'Audio Options': '🎤',
    'Display / Panel Options': '🖥️',
    Cable: '🔌',
  };

  return (
    <div className={`${styles.message} ${styles.bot}`}>
      <div className={styles.botAvatarSm}>
        <img src="/logo_light_theme.png" alt="Allbotix" />
      </div>
      <div className={`${styles.bubble} ${styles.recCard}`}>
        <div className={styles.recHeader}>
          <div className={styles.recTitle}>Recommended Setup — {data.room_label}</div>
          <div className={styles.recDetail}>{data.room_detail}</div>
        </div>

        {(data.sections || []).map((sec, si) => (
          <div key={si} className={styles.recSection}>
            <div className={styles.recSectionTitle}>
              {SECTION_ICONS[sec.title] || '•'}  {sec.title.toUpperCase()}
            </div>
            {(sec.items || []).map((item, ii) => (
              <div key={ii} className={styles.recItem}>
                <a
                  href={item.link || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.recItemName}
                  style={!item.link ? { pointerEvents: 'none' } : {}}
                >
                  {item.name}
                </a>
                {item.features && item.features.length > 0 && (
                  <ul className={styles.recItemFeats}>
                    {item.features.slice(0, 2).map((f: string, fi: number) => (
                      <li key={fi}>{f}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ))}

        {data.led?.name && (
          <div className={styles.recLed}>
            💡 <span className={styles.recLedLabel}>LED Suggestion:</span>{' '}
            {data.led.link ? (
              <a href={data.led.link} target="_blank" rel="noopener noreferrer">{data.led.name}</a>
            ) : (
              <strong>{data.led.name}</strong>
            )}
          </div>
        )}

        {data.why && (
          <div className={styles.recWhy}>
            <span className={styles.recWhyLabel}>Why this setup:</span>{' '}
            <span dangerouslySetInnerHTML={{ __html: data.why }} />
          </div>
        )}
      </div>
    </div>
  );
}
