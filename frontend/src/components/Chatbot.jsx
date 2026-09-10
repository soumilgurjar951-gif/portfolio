import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE, EMAIL, GITHUB_URL, LINKEDIN_URL, PROJECTS } from '../data.js';

// SoumilBot for React — talks to Django POST /api/chat/ (proxied in dev).
// If the backend is unreachable (static preview), a local mini-brain
// answers from the same truthful data.js source. No invented facts.
const DEFAULT_CHIPS = ['Show projects 💼', 'Skills? ⚙️', 'Open to work? 🟢', 'Contact 📬'];

function localBrain(text) {
  const t = text.toLowerCase();
  if (/(^|\s)(hi|hello|hey|namaste)\b/.test(t) || t.includes('who are you') || t.includes('help')) {
    return {
      reply: "Hey! I'm SoumilBot 🤖 — ask me about Soumil's projects, skills, internship status, or contact info.",
      suggestions: ['Show projects 💼', 'Skills? ⚙️', 'Contact 📬'],
    };
  }
  if (t.includes('project') || t.includes('work') || t.includes('built') || t.includes('repo')) {
    const lines = PROJECTS.map((p, i) => `${i + 1}. ${p.title} — ${p.tagline}`).join('\n');
    return {
      reply: `Soumil has shipped 7 real apps:\n${lines}\n\nAsk "tell me about ..." for a deep-dive 👇`,
      suggestions: ['Tell me about Connect Hub', 'Skills? ⚙️', 'Contact 📬'],
    };
  }
  const KEYWORDS = { paisaai: ['paisa', 'money', 'budget', 'saving', 'expense', 'finance', 'teen'], freelance: ['freelance', 'freelancer', 'gig', 'gigbridge', 'marketplace'] };
  const hit = PROJECTS.find((p) => {
    const words = p.title.toLowerCase().split(/[\s-]+/).filter((w) => w.length > 3);
    if (words.some((w) => t.includes(w))) return true;
    return (KEYWORDS[p.slug] || []).some((k) => t.includes(k));
  });
  if (hit && /(tell|about|more|detail|what|stack|how)/.test(t)) {
    return {
      reply: `${hit.title} — ${hit.tagline}\n\n${hit.solution}\n\nStack: ${hit.stack.join(', ')}\nRole: ${hit.role}\n\n${hit.repo}`,
      suggestions: DEFAULT_CHIPS,
    };
  }
  if (t.includes('skill') || t.includes('tech') || t.includes('django') || t.includes('python') || t.includes('stack')) {
    return {
      reply: 'Backend: Django, DRF, Python, REST APIs\nFrontend: HTML, CSS, JS, React basics\nDatabase: PostgreSQL, SQLite\nTools: Git, GitHub, VS Code\nEverything maps to a shipped repo. 😄',
      suggestions: ['Show projects 💼', 'Open to work? 🟢'],
    };
  }
  if (t.includes('intern') || t.includes('hire') || t.includes('job') || t.includes('availab') || t.includes('opportunity')) {
    return {
      reply: '🟢 Yes — Soumil is OPEN TO INTERNSHIP and full-stack / Django roles. Use the contact form (replies in 24–48h) or email him directly.',
      suggestions: ['Contact 📬', 'Show projects 💼'],
    };
  }
  if (t.includes('contact') || t.includes('email') || t.includes('mail') || t.includes('linkedin') || t.includes('reach')) {
    return {
      reply: `📬 Email: ${EMAIL}\n💼 LinkedIn: ${LINKEDIN_URL}\n⬡ GitHub: ${GITHUB_URL}`,
      suggestions: ['Open to work? 🟢', 'Show projects 💼'],
    };
  }
  if (t.includes('thank')) {
    return { reply: 'Glad I could help! 🙌', suggestions: ['Contact 📬', 'Show projects 💼'] };
  }
  return { reply: 'Hmm, I only know Soumil’s portfolio stuff 🤖 — try one of these:', suggestions: DEFAULT_CHIPS };
}

function renderRich(text) {
  // **bold** + URLs → React nodes
  const parts = text.split(/(\*\*.+?\*\*|https?:\/\/[^\s)]+)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (/^https?:\/\//.test(part)) {
      return <a key={i} href={part} target="_blank" rel="noreferrer" style={{ color: 'var(--cyan)' }}>{part}</a>;
    }
    return <span key={i}>{part}</span>;
  });
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([]); // {who, text}
  const [chips, setChips] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [msgs, typing]);

  useEffect(() => {
    if (open && msgs.length === 0) {
      const t = setTimeout(() => {
        setMsgs([{ who: 'bot', text: "Hey! I'm SoumilBot 🤖 — ask me about Soumil's projects, skills, or internship status." }]);
        setChips(DEFAULT_CHIPS);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [open, msgs.length]);

  const send = async (raw) => {
    const text = (raw !== undefined ? raw : input).trim();
    if (!text || typing) return;
    setInput('');
    setChips([]);
    setMsgs((m) => [...m, { who: 'user', text }]);
    setTyping(true);
    try {
      const res = await fetch(API_BASE + '/api/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      if (!res.ok) throw new Error('bad status');
      const data = await res.json();
      setMsgs((m) => [...m, { who: 'bot', text: data.reply }]);
      setChips(data.suggestions || []);
    } catch (e) {
      const fb = localBrain(text); // backend unreachable → offline brain
      setMsgs((m) => [...m, { who: 'bot', text: fb.reply }]);
      setChips(fb.suggestions);
    } finally {
      setTyping(false);
    }
  };

  return (
    <>
      <motion.button
        id="chatFab"
        aria-label="Chat with SoumilBot"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.94 }}
      >
        🤖<span className="ping" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="chatPanel"
            className="open"
            role="dialog"
            aria-label="Chat with SoumilBot"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            <div className="chat-head">
              <span className="chat-avatar">🤖</span>
              <span><b>SoumilBot</b><small>● online · asks about Soumil</small></span>
              <button className="chat-x" onClick={() => setOpen(false)} aria-label="Close chat">✕</button>
            </div>
            <div id="chatBody" ref={bodyRef}>
              {msgs.map((m, i) => (
                <motion.div
                  key={i}
                  className={'msg ' + m.who}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {m.who === 'bot' ? renderRich(m.text) : m.text}
                </motion.div>
              ))}
              {typing && (
                <div className="msg bot typing"><i /><i /><i /></div>
              )}
            </div>
            {chips.length > 0 && (
              <div className="chat-chips">
                {chips.map((c) => (
                  <button key={c} type="button" onClick={() => send(c)}>{c}</button>
                ))}
              </div>
            )}
            <form
              className="chat-form"
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about projects, skills…"
                autoComplete="off"
                maxLength={500}
              />
              <button type="submit" aria-label="Send">➤</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
