// Single source of truth for the React frontend.
// Mirrors apps/portfolio/views.py PROJECTS + SKILL_GROUPS — keep names,
// repos and links EXACT. Do not invent clients, metrics or companies.
export const EMAIL = 'soumilgurjar951@gmail.com';
export const GITHUB_URL = 'https://github.com/soumilgurjar951-gif';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/soumil-gurjar';
export const LOCATION = 'Indore, Madhya Pradesh, India';
export const RESUME_URL = '/static/resume/Soumil-Gurjar-Resume.pdf'; // TODO: add PDF (or absolute Django URL in prod)

// In dev, Vite proxies /api → Django :8000. In prod set VITE_API_URL.
export const API_BASE = import.meta.env.VITE_API_URL || '';

export const PROJECTS = [
  {
    slug: 'university-management-system',
    title: 'University Management System',
    tagline: 'Django app to manage students, faculty & courses.',
    category: 'web-apps',
    categoryLabel: 'Web App',
    repo: 'https://github.com/soumilgurjar951-gif/collage-website-',
    stack: ['Django', 'Python', 'SQLite', 'HTML/CSS', 'Auth', 'CRUD'],
    accent: 'cyan',
    icon: '◈',
    problem:
      'Universities juggle students, faculty, courses and records across spreadsheets and paper. Data gets duplicated, access is messy, and basic CRUD eats staff time.',
    solution:
      'A Django web app with models for students, faculty and courses, authenticated dashboards, forms + validation, and clean CRUD flows in one place.',
    role: 'Solo builder — backend + frontend (models, views, templates, auth).',
    outcome: 'Working MVP with auth + CRUD; solid Django fundamentals (models, ORM, MVC, forms).',
    learnings: 'Django ORM & migrations, Auth & permissions, Forms + validation, Template composition',
  },
  {
    slug: 'ecommerce-website',
    title: 'E-Commerce Website',
    tagline: 'Store with catalog, cart, orders & accounts.',
    category: 'ecommerce',
    categoryLabel: 'E-Commerce',
    repo: 'https://github.com/soumilgurjar951-gif/ecommerce_website',
    stack: ['Django', 'Python', 'Sessions/Cart', 'HTML/CSS', 'JS'],
    accent: 'magenta',
    icon: '⬢',
    problem:
      'Small sellers need a simple online store: browse products, add to cart, place orders and manage accounts — without a heavy enterprise platform.',
    solution:
      'A Django storefront with product catalog, session-based cart, order flow and user accounts — stock, cart state, checkout and order history.',
    role: 'Solo builder — catalog + cart + orders + auth + UI.',
    outcome: 'Working store MVP demonstrating sessions/cart, relational order modeling and checkout flow.',
    learnings: 'Session cart state, Order modeling, Catalog search/filter, Auth-gated checkout',
  },
  {
    slug: 'connect-hub',
    title: 'Connect Hub',
    tagline: 'Instagram-like social network — posts, likes, follows.',
    category: 'social',
    categoryLabel: 'Social',
    repo: 'https://github.com/soumilgurjar951-gif/connect_hub',
    stack: ['Django', 'Python', 'PostgreSQL/SQLite', 'HTML/CSS', 'JS'],
    accent: 'purple',
    icon: '⬣',
    problem:
      'Social apps hide hard backend work: feeds, likes, comments, follows and relational queries that must stay fast and consistent.',
    solution:
      'An Instagram-like clone with posts, likes, comments and follow graph — feed logic, relational modeling and auth-protected interactions in Django.',
    role: 'Solo builder — data modeling + feed + interactions + UI.',
    outcome: 'Working social MVP proving relational design and feed logic at small scale.',
    learnings: 'Relational modeling (M2M follows/likes), Feed queries, Auth-gated actions, Media handling basics',
  },
  {
    slug: 'construction-website',
    title: 'Construction Website',
    tagline: 'Responsive business site for construction services.',
    category: 'others',
    categoryLabel: 'Business Site',
    repo: 'https://github.com/soumilgurjar951-gif/construction',
    stack: ['HTML', 'CSS', 'JavaScript', 'Django basics', 'Responsive'],
    accent: 'cyan',
    icon: '△',
    problem:
      'Service businesses lose trust without a fast, responsive site that clearly presents services, past work and a way to enquire.',
    solution:
      'A responsive business website for construction services — service sections, project gallery structure and enquiry entry points.',
    role: 'Solo builder — responsive frontend + basic backend.',
    outcome: 'Polished responsive business site; layout, mobile-first CSS and client-ready structure.',
    learnings: 'Responsive design, Landing-page composition, Performance basics, Client-focused copy',
  },
  {
    slug: 'hospital-receptionist',
    title: 'Hospital Receptionist System',
    tagline: 'Front-desk workflow — patients & appointments.',
    category: 'web-apps',
    categoryLabel: 'Web App',
    repo: 'https://github.com/soumilgurjar951-gif/hospital_receptionist',
    stack: ['Django', 'Python', 'Forms', 'Scheduling', 'HTML/CSS'],
    accent: 'magenta',
    icon: '✚',
    problem:
      'Clinic front desks juggle patients, appointments and scheduling conflicts on paper — double-bookings and lost follow-ups.',
    solution:
      'A Django front-desk app to register patients and manage appointments with form validation and scheduling logic.',
    role: 'Solo builder — forms + scheduling + workflow UI.',
    outcome: 'Working scheduling MVP; forms, validation and domain logic for healthcare ops.',
    learnings: 'Form validation, Scheduling logic, Domain modeling, Workflow UX',
  },
  {
    slug: 'paisaai',
    title: 'PaisaAi',
    tagline: 'AI money coach — budgets, savings & expenses for teenagers.',
    category: 'web-apps',
    categoryLabel: 'Web App · AI',
    repo: 'https://github.com/soumilgurjar951-gif/paisaAi',
    stack: ['Django', 'DRF', 'React', 'REST APIs', 'PWA'],
    accent: 'purple',
    icon: '₹',
    problem:
      'Most teenagers today can’t maintain a monthly budget — money leaks into random spending and nothing is left to save at month-end.',
    solution:
      'An AI money coach: monthly budgets, expense tracking (incl. receipt OCR), subscriptions & EMIs, savings goals and AI tips — so leftover money actually gets saved. Django + DRF backend, React PWA frontend.',
    role: 'Solo builder — full-stack (Django + DRF backend, React frontend).',
    outcome: 'Working full-stack finance app with budgets, goals, subscriptions, investments and AI-coach endpoints.',
    learnings: 'DRF routers & auth, React + PWA, Finance data modeling, AI feature wiring',
  },
  {
    slug: 'freelance',
    title: 'Freelance Website',
    tagline: 'Django gig marketplace — connecting clients & freelancers.',
    category: 'web-apps',
    categoryLabel: 'Marketplace',
    repo: 'https://github.com/soumilgurjar951-gif/freelance',
    stack: ['Django', 'Python', 'HTML/CSS', 'Auth', 'CRUD'],
    accent: 'cyan',
    icon: '🤝',
    problem:
      'Clients hunting for freelancers and freelancers hunting for work meet over scattered chats and posts — gigs, applications and trust get lost.',
    solution:
      'A Django freelance website (gigbridge app) where gigs can be posted, browsed and applied to — clients and freelancers in one place, with accounts, listings and application flows.',
    role: 'Solo builder — backend + frontend (models, views, templates, auth).',
    outcome: 'Working marketplace MVP demonstrating listings, applications and user accounts.',
    learnings: 'Marketplace modeling, Listings & search, Auth & profiles, Template UI',
  },
];

export const SKILL_GROUPS = [
  {
    title: 'Backend',
    skills: [
      ['Django', 'Used in University Mgmt, E-Commerce, Connect Hub'],
      ['Django REST Framework', 'REST APIs for web + future AI tools'],
      ['Python', 'Core language across all projects'],
      ['REST APIs', 'CRUD endpoints, JSON, auth'],
    ],
  },
  {
    title: 'Frontend',
    skills: [
      ['HTML', 'Semantic markup in every project'],
      ['CSS', 'Responsive + this cyberpunk theme'],
      ['JavaScript', 'Interactions, fetch, animations'],
      ['React', 'This very site — components + Framer Motion'],
    ],
  },
  {
    title: 'Database',
    skills: [
      ['PostgreSQL', 'Prod-ready relational DB'],
      ['SQLite', 'Dev + MVP default in repos'],
    ],
  },
  {
    title: 'Tools & Dev',
    skills: [
      ['Git', 'Version control, branching'],
      ['GitHub', 'All 5 projects hosted here'],
      ['VS Code', 'Daily driver'],
      ['Deployment basics', 'Render / Railway / Vercel concepts'],
    ],
  },
  {
    title: 'Concepts',
    skills: [
      ['MVC', 'Django MVT in practice'],
      ['ORM', 'Models, queries, migrations'],
      ['Authentication', 'Sessions, login, permissions'],
      ['CRUD', 'Core of all 5 apps'],
      ['Basic AI Integrations', 'API-driven AI features direction'],
    ],
  },
];
