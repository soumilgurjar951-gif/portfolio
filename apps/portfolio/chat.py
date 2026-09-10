"""
SoumilBot brain — rule-based portfolio assistant (no API key needed).

Answers ONLY from real data: PROJECTS in views.py + constants below.
Never invents clients, metrics, companies or experience.

Optional upgrade: set CHAT_API_URL + CHAT_API_KEY env vars to forward
messages to any OpenAI-compatible /chat/completions endpoint. On any
failure it silently falls back to these rules. See README + .env.example.
"""
import json
import os
import re
import urllib.request

EMAIL = 'soumilgurjar951@gmail.com'
GITHUB_URL = 'https://github.com/soumilgurjar951-gif'
LINKEDIN_URL = 'https://www.linkedin.com/in/soumil-gurjar'
LOCATION = 'Indore, Madhya Pradesh, India'

SUGGESTIONS_DEFAULT = ['Show projects 💼', 'Skills? ⚙️', 'Open to work? 🟢', 'Contact 📬']

SYSTEM_PROMPT = (
    'You are SoumilBot, the friendly portfolio assistant of Soumil Gurjar, '
    'a Django backend & full-stack developer from Indore, India. '
    'Facts: 7 real projects (Freelance Website gig marketplace, PaisaAi AI money coach, University Management System, E-Commerce Website, '
    'Connect Hub Instagram-like clone, Construction Website, Hospital Receptionist System) '
    'on GitHub github.com/soumilgurjar951-gif; skills Django, DRF, Python, REST APIs, '
    'HTML/CSS/JS, PostgreSQL/SQLite, Git; open to INTERNSHIP and full-stack/Django roles; '
    'email soumilgurjar951@gmail.com; replies in 24-48h. '
    'Rules: answer briefly (under 80 words), only from these facts, never invent '
    'clients, metrics, companies or experience. If unsure, share the email/GitHub.'
)


def _project_hit(text, projects):
    """Return first project whose keywords appear in text, else None."""
    keywords = {
        'university-management-system': ['univers', 'college', 'collage', 'student', 'faculty', 'course', 'campus'],
        'ecommerce-website': ['ecommerce', 'e-commerce', 'shop', 'store', 'cart', 'product', 'order'],
        'connect-hub': ['connect', 'instagram', 'social', 'post', 'like', 'follow', 'feed'],
        'construction-website': ['construct', 'building', 'business site'],
        'hospital-receptionist': ['hospital', 'clinic', 'patient', 'appointment', 'doctor', 'reception'],
        'paisaai': ['paisa', 'paisaai', 'money', 'budget', 'saving', 'expense', 'finance', 'teen'],
        'freelance': ['freelance', 'freelancer', 'gig', 'gigbridge', 'marketplace'],
    }
    for p in projects:
        for kw in keywords.get(p['slug'], []):
            if kw in text:
                return p
    return None


def reply(message, projects):
    """Main entry: (reply_text, suggestions). Tries LLM upgrade, else rules."""
    llm = _try_llm(message)
    if llm:
        return llm, SUGGESTIONS_DEFAULT
    return _rules(message, projects)


def _rules(message, projects):
    t = message.lower().strip()

    if (re.search(r'\b(hello|hi|hey|namaste|yo|yoo)\b', t) or 'help' in t
            or 'who are you' in t or 'your name' in t or t == 'start'):
        return (
            "Hey! I'm SoumilBot 🤖 — Soumil's portfolio assistant.\n"
            'Ask me about his projects, skills, internship status, or contact info.',
            ['Show projects 💼', 'Skills? ⚙️', 'Contact 📬'],
        )

    if any(w in t for w in ['thank', 'shukriya', 'great', 'nice', 'awesome', 'cool']):
        return (
            'Glad I could help! 🙌 Want the GitHub link or his email to take it further?',
            ['GitHub 🔗', 'Contact 📬'],
        )

    if any(w in t for w in ['bye', 'alvida', 'see you', 'good night']):
        return ('Bye! Good luck — and ping Soumil if you have a Django role open. 👋',
                SUGGESTIONS_DEFAULT)

    # Specific project?
    hit = _project_hit(t, projects)
    if hit and any(w in t for w in ['tell', 'about', 'detail', 'more', 'what', 'explain', 'info',
                                    'project', 'repo', 'github', 'stack', 'built', 'how']):
        stack = ', '.join(hit['stack'])
        return (
            f"**{hit['title']}** — {hit['tagline']}\n\n"
            f"🧩 Problem: {hit['problem']}\n\n"
            f"✅ Solution: {hit['solution']}\n\n"
            f"🛠 Stack: {stack}\n👤 Role: {hit['role']}\n\n"
            f"🔗 {hit['repo']}",
            ['Show projects 💼', 'Skills? ⚙️', 'Contact 📬'],
        )

    if any(w in t for w in ['project', 'work', 'built', 'portfolio', 'repo', 'github']):
        if any(w in t for w in ['link', 'url', 'github']):
            lines = '\n'.join(f"• {p['title']}: {p['repo']}" for p in projects)
            return (f'Here are all repos 🔗\n{lines}\n\nMain profile: {GITHUB_URL}',
                    ['Skills? ⚙️', 'Contact 📬'])
        lines = '\n'.join(f"{i+1}. **{p['title']}** — {p['tagline']}" for i, p in enumerate(projects))
        return (
            f'Soumil has shipped **7 real apps**:\n{lines}\n\n'
            'Ask "tell me about Connect Hub" for any deep-dive 👇',
            ['Tell me about Connect Hub', 'Skills? ⚙️', 'Contact 📬'],
        )

    if any(w in t for w in ['skill', 'tech', 'stack', 'django', 'python', 'react', 'database', 'tool', 'know', 'learn']):
        return (
            '**Backend:** Django, DRF, Python, REST APIs\n'
            '**Frontend:** HTML, CSS, JavaScript, React basics\n'
            '**Database:** PostgreSQL, SQLite\n'
            '**Tools:** Git, GitHub, VS Code, Render/Railway/Vercel basics\n'
            '**Concepts:** MVC, ORM, Auth, CRUD, basic AI integrations\n\n'
            'Every skill maps to a shipped repo — no badge-collecting. 😄',
            ['Show projects 💼', 'Open to work? 🟢'],
        )

    if any(w in t for w in ['intern', 'hire', 'job', 'work with', 'available', 'availab', 'opportunity',
                            'opening', 'recruit', 'fresher', 'experience']):
        return (
            '🟢 **Yes — Soumil is OPEN TO INTERNSHIP** and full-stack / Django roles.\n'
            'He can own features end-to-end in Django and ship working products. '
            'Drop a message via the contact form (replies in 24–48h) or email him directly.',
            ['Contact 📬', 'Show projects 💼'],
        )

    if any(w in t for w in ['contact', 'email', 'mail', 'phone', 'number', 'reach', 'linkedin', 'connect with']):
        if 'linkedin' in t:
            return (f'Connect here 💼\n{LINKEDIN_URL}', ['Contact 📬', 'Show projects 💼'])
        return (
            f'📬 Email: **{EMAIL}**\n'
            f'💼 LinkedIn: {LINKEDIN_URL}\n'
            f'⬡ GitHub: {GITHUB_URL}\n'
            '⏱ Usually replies within 24–48 hours.',
            ['Open to work? 🟢', 'Show projects 💼'],
        )

    if any(w in t for w in ['where', 'location', 'based', 'city', 'indore', 'india']):
        return (f'📍 Soumil is based in **{LOCATION}** — open to remote internships too.',
                ['Contact 📬', 'Open to work? 🟢'])

    if any(w in t for w in ['resume', 'cv', 'download']):
        return ('📄 Grab the resume from the hero section ("Download Resume" button) — or email him and he’ll send the latest copy.',
                ['Contact 📬'])

    if any(w in t for w in ['ai ', 'artificial', 'machine learning', ' ml ', 'chatbot', 'llm', 'gpt']):
        if any(w in t for w in ['you', 'this bot', 'this chat', 'who made', 'how work']):
            return ('That’s me! 🤖 I’m a rule-based assistant running on this site (with an optional LLM upgrade). I only answer from Soumil’s real portfolio data — try "show projects".',
                    SUGGESTIONS_DEFAULT)
        return ('Soumil’s direction is **API-driven AI features inside Django apps** — and yes, this chatbot is a live sample of that mindset. 😎',
                ['Show projects 💼', 'Skills? ⚙️'])

    if any(w in t for w in ['salary', 'stipend', 'pay', 'package', 'ctc']):
        return ('Best discussed directly with Soumil — drop him a message with the role details and he’ll respond within 24–48h. 📬',
                ['Contact 📬'])

    if any(w in t for w in ['college', 'degree', 'education', 'student', 'study']):
        return ('🎓 Soumil is an engineering student from Indore who learns by shipping — 7 real apps across education, commerce, social, business, healthcare, finance and freelancing.',
                ['Show projects 💼'])

    return (
        'Hmm, I only know Soumil’s portfolio stuff 🤖 — try one of these:',
        ['Show projects 💼', 'Skills? ⚙️', 'Open to work? 🟢', 'Contact 📬'],
    )


def _try_llm(message):
    """Optional OpenAI-compatible upgrade. Returns reply or None."""
    url = os.environ.get('CHAT_API_URL', '').strip()
    key = os.environ.get('CHAT_API_KEY', '').strip()
    if not url or not key:
        return None
    model = os.environ.get('CHAT_MODEL', 'gpt-4o-mini')
    payload = json.dumps({
        'model': model,
        'messages': [
            {'role': 'system', 'content': SYSTEM_PROMPT},
            {'role': 'user', 'content': message[:500]},
        ],
        'max_tokens': 180,
        'temperature': 0.4,
    }).encode()
    try:
        req = urllib.request.Request(
            url.rstrip('/') + '/chat/completions', data=payload,
            headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {key}'},
        )
        with urllib.request.urlopen(req, timeout=15) as res:
            data = json.loads(res.read().decode())
        return data['choices'][0]['message']['content'].strip()
    except Exception:
        return None
