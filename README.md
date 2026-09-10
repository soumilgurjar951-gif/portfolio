# Soumil Gurjar — AI & Full-Stack Developer · Cinematic Cyberpunk Portfolio

Two frontends, one Django backend. Pick either:

| | **Option A — Django templates** | **Option B — React + Framer Motion** ✅ NEW |
|---|---|---|
| Folder | `templates/` + `static/` | `frontend/` (Vite + React 18 + Framer Motion 11) |
| Animations | GSAP ScrollTrigger + Three.js | Framer Motion + 2D canvas particles |
| Run | `python manage.py runserver` → :8000 | `npm run dev` → :5173 (proxies `/api` → Django) |
| Deploy | Render/Railway (same server) | Vercel/Netlify + Django API on Render/Railway |

Both share the same truthful content (7 real projects, same repos/links) and the same
Django `PROJECTS` source of truth via `/api/projects/`.

**Live goal:** in 5–7s a visitor knows *who* (Soumil Gurjar), *what* (Django backend & full-stack),
*ask* (Open to Internship / Full-Stack-Django roles).

## 1) Project structure (Option A — implemented)

```
portfolio/
├── manage.py
├── config/
│   ├── settings.py      # apps, static, templates, PORTFOLIO_EMAIL / RESUME_URL env vars
│   ├── urls.py          # admin + portfolio urls
│   └── wsgi.py / asgi.py
├── apps/portfolio/
│   ├── views.py         # home + project_detail; PROJECTS + SKILL_GROUPS (single source of truth)
│   ├── urls.py          # '' → home, 'work/<slug>/' → detail
│   ├── models.py        # ContactMessage (optional persistence)
│   ├── admin.py
│   └── context_processors.py  # SITE_NAME, GITHUB_URL, LINKEDIN_URL, PORTFOLIO_EMAIL…
├── templates/
│   ├── base.html        # navbar / footer / backdrop layers / CDN (three, gsap)
│   └── portfolio/
│       ├── index.html   # hero, marquee, work, about, skills, contact, modal
│       └── project_detail.html
├── static/
│   ├── css/style.css    # cyberpunk variables, cards, glow, modal, responsive
│   ├── js/hero-three.js # particle field + grid + orbs (auto-degrades)
│   ├── js/main.js       # preloader, GSAP reveals, filters, modal, tilt, cursor
│   ├── img/             # TODO: add soumil.jpg + screenshots
│   └── resume/          # TODO: add Soumil-Gurjar-Resume.pdf
├── requirements.txt  .env.example  README.md
```

### Option B — React + Vite + Framer Motion (implemented in `frontend/`)

```
frontend/
├── package.json            # react, react-dom, framer-motion, vite, @vitejs/plugin-react
├── vite.config.js          # dev proxy: /api → http://127.0.0.1:8000
├── index.html
└── src/
    ├── main.jsx            # React root
    ├── App.jsx             # composition (Backdrop, Navbar, Hero, Work, About…)
    ├── data.js             # PROJECTS + SKILL_GROUPS mirror (keep in sync with views.py)
    ├── styles.css          # same cyberpunk tokens as static/css/style.css
    └── components/
        ├── Backdrop.jsx    # 2D canvas particle network (no three.js; mobile-aware)
        ├── Navbar.jsx      # motion.nav slide-down
        ├── Hero.jsx        # staggered line reveal + spring 3D-tilt holo card
        ├── Work.jsx        # layout-animated filters + AnimatePresence case-study modal
        └── Sections.jsx    # About, Skills, Contact (POST /api/contact/), Footer
```

Headless API (pure Django `JsonResponse`, no DRF needed — `apps/portfolio/views.py`):
`GET /api/projects/` → all projects · `GET /api/projects/<slug>/` → one ·
`POST /api/contact/ {name,email,opportunity,message}` → saves + emails (same as Django form).
Framer Motion replaces the GSAP timelines: `variants` stagger in `Hero.jsx`,
`whileInView` reveals via `Reveal`, `layout` + `AnimatePresence` for filters/modal in `Work.jsx`.

## 2) Key code map

| Concern | File |
|---|---|
| Theme vars / glow / cards | `static/css/style.css` (`:root`, `.proj`, `.pill`, `.btn`) |
| Navbar / footer / layers | `templates/base.html` |
| Hero + all sections | `templates/portfolio/index.html` |
| Detail pages | `templates/portfolio/project_detail.html` |
| Home / detail / contact POST | `apps/portfolio/views.py` |
| Site-wide brand/contact | `apps/portfolio/context_processors.py` |
| GSAP ScrollTrigger reveals | `static/js/main.js` (hero timeline, `.reveal`, `ScrollTrigger.batch('.proj')`) |
| Three.js background | `static/js/hero-three.js` |

## 3) Animation implementation

**GSAP (`static/js/main.js`):**
- Hero split reveal: `#heroTitle .line-inner` stagger `yPercent:110 → 0`, then pill/sub/CTAs/chips/meta cascade.
- Scroll cinematics: `.hero-grid` scrub fade on exit; `.reveal` fade-up on enter (`start:'top 88%'`);
  `.proj` batch stagger; `.h2` letter-spacing sweep.
- Filters re-trigger a small `fromTo` pop; tilt uses pointer-driven `rotateX/Y` with rAF.

**Three.js (`static/js/hero-three.js`):**
- `THREE.Points` particle field (cyan/purple/magenta, additive), `GridHelper` floor, 3 additive orbs,
  sparse `LineSegments` (desktop only), mouse-parallax camera, scroll fade.
- **Performance tuning:** `PARTICLE_COUNT` 900 desktop / 350 mobile; `setPixelRatio(min(dpr,2)/1.5)`;
  auto-halves draw + hides lines if FPS < 28; pauses when tab hidden or hero off-screen;
  `?static=1` or `prefers-reduced-motion` disables canvas entirely (CSS gradient fallback remains).

**Accessibility:** `prefers-reduced-motion` kills GSAP + canvas + marquee motion; modal has
`role=dialog aria-modal`, Esc/backdrop close, keyboard-operable cards; contrast-checked text colors.

## 4) Content placeholders (TODO for Soumil)

- [x] `PORTFOLIO_EMAIL` — set to `soumilgurjar951@gmail.com` (override via env var if needed).
- [ ] Resume — drop PDF at `static/resume/Soumil-Gurjar-Resume.pdf` (hero button already wired).
- [ ] Photo — replace `.avatar` block in `index.html` with `<img src="…/img/soumil.jpg">`.
- [ ] Screenshots — add `static/img/<slug>-1.png` (2–4 per project) + render in `project_detail.html`.
- [ ] Truthfulness — project names/repos/LinkedIn/GitHub are exact; no fake clients or metrics invented.
- Exact links used: `collage-website-`, `ecommerce_website`, `connect_hub`, `construction`,
  `hospital_receptionist` under `github.com/soumilgurjar951-gif`; LinkedIn `/in/soumil-gurjar`.

## 5) AI Chatbot — SoumilBot 🤖

Floating assistant (bottom-left) on **both** frontends, powered by one brain:

- Brain: `apps/portfolio/chat.py` — rule-based, answers only from real data
  (`PROJECTS` + email/links/location). Intents: greeting, project list + per-project
  deep-dive, skills, internship availability, contact, location, resume, AI, salary-deflect, fallback.
- API: `POST /api/chat/ {message}` → `{reply, suggestions}` (verified for all intents).
- Django site: widget markup in `templates/base.html` + `static/js/chat.js` + CSS in `style.css`.
- React site: `frontend/src/components/Chatbot.jsx` (Framer Motion panel, typing dots,
  suggestion chips) — uses `/api/chat/` via proxy, falls back to an offline mini-brain
  from `data.js` when the backend is unreachable.
- Optional LLM upgrade (no code change): set `CHAT_API_URL` + `CHAT_API_KEY`
  (+ `CHAT_MODEL`, default `gpt-4o-mini`) — any OpenAI-compatible `/chat/completions`
  endpoint; failures silently fall back to rules. See `.env.example`.

## 6) Run locally

**Option A — Django templates:**
```powershell
python -m venv .venv; .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
# → http://127.0.0.1:8000/  (contact form uses console email backend by default)
```

**Option B — React + Framer Motion (needs Django running for /api):**
```powershell
# terminal 1 — Django API on :8001
python manage.py runserver 127.0.0.1:8001
# terminal 2 — React dev server (auto-proxies /api → :8001, see vite.config.js)
cd frontend; npm install; npm run dev -- --port 5199 --strictPort
# → http://127.0.0.1:5199/
# prod preview: npm run build; npm run preview
# point at deployed Django: $env:VITE_API_URL="https://your-django.onrender.com"; npm run build
# NOTE: default ports are Django :8000 / Vite :5173 — this machine runs another
# project (PaisaAI) on those, hence :8001/:5199 here. On a clean machine the
# defaults work; `vite.config.js` proxy must match your Django port.
```

Contact form: saves `ContactMessage` (viewable in `/admin/`) + `send_mail` to `CONTACT_RECIPIENT`.
Set real SMTP via env (see `.env.example`) for production.

## 6) Deploy

**Backend (Render / Railway):**
1. Push repo; set env: `DJANGO_SECRET_KEY`, `DJANGO_DEBUG=False`,
   `DJANGO_ALLOWED_HOSTS=.onrender.com,.up.railway.app`, `PORTFOLIO_EMAIL`, `DATABASE_URL` (optional Postgres).
2. Build: `pip install -r requirements.txt && python manage.py migrate --noinput && python manage.py collectstatic --noinput`.
3. Start: `gunicorn config.wsgi:application` (add `gunicorn` to requirements for prod).
4. Static served by WhiteNoise (`CompressedManifestStaticFilesStorage`) — no extra CDN needed for MVP.

**Frontend options:** same server (Option A, simplest) **or** split — Django as API
+ React build (`frontend/dist/`) deployed to Vercel/Netlify with `VITE_API_URL` pointing
at the Django URL. Prod CORS: add `django-cors-headers` and allow the Vercel origin
(dev proxy + `csrf_exempt` on `/api/contact/` already cover local dev).

**Assets:** compress images (`cwebp`/`squoosh`), lazy-load screenshots (`loading="lazy"`),
keep hero dependency-free except pinned CDN three@r128 + gsap@3.12.5.
