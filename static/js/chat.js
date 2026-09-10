/* ============================================================
   SoumilBot widget — floating chat, talks to POST /api/chat/
   Plain JS (no dependency). Linkifies URLs + **bold** in replies.
   ============================================================ */
(function () {
  const fab = document.getElementById('chatFab');
  const panel = document.getElementById('chatPanel');
  const body = document.getElementById('chatBody');
  const chips = document.getElementById('chatChips');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');
  if (!fab || !panel) return;

  function fmt(text) {
    return text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/(https?:\/\/[^\s)]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
  }
  function scrollDown() { body.scrollTop = body.scrollHeight; }

  function bubble(html, who) {
    const d = document.createElement('div');
    d.className = 'msg ' + who;
    d.innerHTML = html;
    body.appendChild(d);
    scrollDown();
    return d;
  }
  function setChips(list) {
    chips.innerHTML = '';
    (list || []).forEach((s) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = s;
      b.addEventListener('click', () => send(s));
      chips.appendChild(b);
    });
  }

  async function send(text) {
    const msg = (text !== undefined ? text : input.value).trim();
    if (!msg) return;
    input.value = '';
    bubble(fmt(msg), 'user');
    setChips([]);
    const typing = bubble('<i></i><i></i><i></i>', 'bot typing');
    try {
      const res = await fetch('/api/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      typing.remove();
      bubble(fmt(data.reply || 'Hmm, try again?'), 'bot');
      setChips(data.suggestions);
    } catch (e) {
      typing.remove();
      bubble('Offline hoon abhi 😅 — email karo: <a href="mailto:soumilgurjar951@gmail.com">soumilgurjar951@gmail.com</a>', 'bot');
    }
  }

  function toggle(force) {
    const open = force !== undefined ? force : !panel.classList.contains('open');
    panel.classList.toggle('open', open);
    panel.setAttribute('aria-hidden', String(!open));
    if (open && !body.children.length) {
      setTimeout(() => {
        bubble(fmt("Hey! I'm <strong>SoumilBot</strong> 🤖 — ask me about Soumil's projects, skills, or internship status."), 'bot');
        setChips(['Show projects 💼', 'Skills? ⚙️', 'Open to work? 🟢', 'Contact 📬']);
      }, 350);
    }
    if (open) setTimeout(() => input.focus(), 350);
  }

  fab.addEventListener('click', () => toggle());
  document.getElementById('chatClose').addEventListener('click', () => toggle(false));
  form.addEventListener('submit', (e) => { e.preventDefault(); send(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggle(false); });
})();
