"""
Portfolio views.
Single-page cinematic site: home (#work #about #skills #contact anchors)
+ optional per-project detail pages (also used as modal fallback / SEO).
"""
from django.conf import settings
from django.contrib import messages
from django.core.mail import send_mail
from django.http import Http404
from django.shortcuts import redirect, render

from .models import ContactMessage

GITHUB = 'https://github.com/soumilgurjar951-gif'

# Single source of truth for projects — keep names/repos EXACT as provided.
# Do not invent clients, metrics, or companies.
PROJECTS = [
    {
        'slug': 'university-management-system',
        'title': 'University Management System',
        'tagline': 'Django app to manage students, faculty & courses.',
        'category': 'web-apps',
        'category_label': 'Web App',
        'repo': 'https://github.com/soumilgurjar951-gif/collage-website-',
        'stack': ['Django', 'Python', 'SQLite', 'HTML/CSS', 'Auth', 'CRUD'],
        'accent': 'cyan',
        'icon': '◈',
        'problem': (
            'Universities juggle students, faculty, courses and records across '
            'spreadsheets and paper. Data gets duplicated, access is messy, and '
            'basic CRUD (admissions, updates, lookups) eats staff time.'
        ),
        'solution': (
            'A Django web app with models for students, faculty and courses, '
            'authenticated dashboards, forms + validation, and clean CRUD flows '
            'so records can be created, searched and updated in one place.'
        ),
        'role': 'Solo builder — backend + frontend (models, views, templates, auth).',
        'outcome': 'Working MVP with auth + CRUD; solid Django fundamentals (models, ORM, MVC, forms).',
        'learnings': ['Django ORM & migrations', 'Auth & permissions', 'Forms + validation', 'Template composition'],
    },
    {
        'slug': 'ecommerce-website',
        'title': 'E-Commerce Website',
        'tagline': 'Store with catalog, cart, orders & accounts.',
        'category': 'ecommerce',
        'category_label': 'E-Commerce',
        'repo': 'https://github.com/soumilgurjar951-gif/ecommerce_website',
        'stack': ['Django', 'Python', 'Sessions/Cart', 'HTML/CSS', 'JS'],
        'accent': 'magenta',
        'icon': '⬢',
        'problem': (
            'Small sellers need a simple online store: browse products, add to cart, '
            'place orders and manage accounts — without a heavy enterprise platform.'
        ),
        'solution': (
            'A Django storefront with product catalog, session-based cart, order flow '
            'and user accounts. Covers real e-commerce logic: stock, cart state, '
            'checkout and order history.'
        ),
        'role': 'Solo builder — catalog + cart + orders + auth + UI.',
        'outcome': 'Working store MVP demonstrating sessions/cart, relational order modeling and checkout flow.',
        'learnings': ['Session cart state', 'Order modeling', 'Catalog search/filter', 'Auth-gated checkout'],
    },
    {
        'slug': 'connect-hub',
        'title': 'Connect Hub',
        'tagline': 'Instagram-like social network — posts, likes, follows.',
        'category': 'social',
        'category_label': 'Social',
        'repo': 'https://github.com/soumilgurjar951-gif/connect_hub',
        'stack': ['Django', 'Python', 'PostgreSQL/SQLite', 'HTML/CSS', 'JS'],
        'accent': 'purple',
        'icon': '⬣',
        'problem': (
            'Social apps look simple but hide hard backend work: feeds, likes, comments, '
            'follows and relational queries that must stay fast and consistent.'
        ),
        'solution': (
            'An Instagram-like clone with posts, likes, comments and follow graph. '
            'Feed logic, relational data modeling and auth-protected interactions '
            'built entirely in Django.'
        ),
        'role': 'Solo builder — data modeling + feed + interactions + UI.',
        'outcome': 'Working social MVP proving relational design and feed logic at small scale.',
        'learnings': ['Relational modeling (M2M follows/likes)', 'Feed queries', 'Auth-gated actions', 'Media handling basics'],
    },
    {
        'slug': 'construction-website',
        'title': 'Construction Website',
        'tagline': 'Responsive business site for construction services.',
        'category': 'others',
        'category_label': 'Business Site',
        'repo': 'https://github.com/soumilgurjar951-gif/construction',
        'stack': ['HTML', 'CSS', 'JavaScript', 'Django basics', 'Responsive'],
        'accent': 'cyan',
        'icon': '△',
        'problem': (
            'Service businesses lose trust without a fast, responsive site that clearly '
            'presents services, past work and a way to enquire.'
        ),
        'solution': (
            'A responsive business website for construction services — service sections, '
            'project gallery structure and enquiry entry points, with basic backend '
            'wiring where needed.'
        ),
        'role': 'Solo builder — responsive frontend + basic backend.',
        'outcome': 'Polished responsive business site; demonstrates layout, mobile-first CSS and client-ready structure.',
        'learnings': ['Responsive design', 'Landing-page composition', 'Performance basics', 'Client-focused copy'],
    },
    {
        'slug': 'hospital-receptionist',
        'title': 'Hospital Receptionist System',
        'tagline': 'Front-desk workflow — patients & appointments.',
        'category': 'web-apps',
        'category_label': 'Web App',
        'repo': 'https://github.com/soumilgurjar951-gif/hospital_receptionist',
        'stack': ['Django', 'Python', 'Forms', 'Scheduling', 'HTML/CSS'],
        'accent': 'magenta',
        'icon': '✚',
        'problem': (
            'Clinic front desks juggle patients, appointments and scheduling conflicts '
            'on paper — leading to double-bookings and lost follow-ups.'
        ),
        'solution': (
            'A Django front-desk app to register patients, book and manage appointments '
            'with form validation and scheduling logic, streamlining reception workflow.'
        ),
        'role': 'Solo builder — forms + scheduling + workflow UI.',
        'outcome': 'Working scheduling MVP; shows forms, validation and domain logic for healthcare ops.',
        'learnings': ['Form validation', 'Scheduling logic', 'Domain modeling', 'Workflow UX'],
    },
    {
        'slug': 'paisaai',
        'title': 'PaisaAi',
        'tagline': 'AI money coach — budgets, savings & expenses for teenagers.',
        'category': 'web-apps',
        'category_label': 'Web App · AI',
        'repo': 'https://github.com/soumilgurjar951-gif/paisaAi',
        'stack': ['Django', 'DRF', 'React', 'REST APIs', 'PWA'],
        'accent': 'purple',
        'icon': '₹',
        'problem': (
            'Most teenagers today can’t maintain a monthly budget — money leaks into '
            'random spending and nothing is left to save at month-end.'
        ),
        'solution': (
            'An AI money coach: set monthly budgets, track expenses (including receipt OCR), '
            'manage subscriptions and EMIs, build savings goals and get AI tips — so leftover '
            'money actually gets saved. Django + DRF backend with a React PWA frontend.'
        ),
        'role': 'Solo builder — full-stack (Django + DRF backend, React frontend).',
        'outcome': 'Working full-stack finance app with budgets, goals, subscriptions, investments and AI-coach endpoints.',
        'learnings': ['DRF routers & auth', 'React + PWA', 'Finance data modeling', 'AI feature wiring'],
    },
    {
        'slug': 'freelance',
        'title': 'Freelance Website',
        'tagline': 'Django gig marketplace — connecting clients & freelancers.',
        'category': 'web-apps',
        'category_label': 'Marketplace',
        'repo': 'https://github.com/soumilgurjar951-gif/freelance',
        'stack': ['Django', 'Python', 'HTML/CSS', 'Auth', 'CRUD'],
        'accent': 'cyan',
        'icon': '🤝',
        'problem': (
            'Clients hunting for freelancers and freelancers hunting for work usually '
            'meet over scattered chats and posts — gigs, applications and trust get lost.'
        ),
        'solution': (
            'A Django freelance website (gigbridge app) where gigs can be posted, browsed '
            'and applied to — bridging clients and freelancers in one place with accounts, '
            'listings and application flows.'
        ),
        'role': 'Solo builder — backend + frontend (models, views, templates, auth).',
        'outcome': 'Working marketplace MVP demonstrating listings, applications and user accounts.',
        'learnings': ['Marketplace modeling', 'Listings & search', 'Auth & profiles', 'Template UI'],
    },
]

SKILL_GROUPS = [
    {'title': 'Backend', 'skills': [
        ('Django', 'Used in University Mgmt, E-Commerce, Connect Hub'),
        ('Django REST Framework', 'REST APIs for web + future AI tools'),
        ('Python', 'Core language across all projects'),
        ('REST APIs', 'CRUD endpoints, JSON, auth'),
    ]},
    {'title': 'Frontend', 'skills': [
        ('HTML', 'Semantic markup in every project'),
        ('CSS', 'Responsive + this cyberpunk theme'),
        ('JavaScript', 'Interactions, GSAP, fetch'),
        ('React / Next.js basics', 'Optional headless frontend path'),
    ]},
    {'title': 'Database', 'skills': [
        ('PostgreSQL', 'Prod-ready relational DB'),
        ('SQLite', 'Dev + MVP default in repos'),
    ]},
    {'title': 'Tools & Dev', 'skills': [
        ('Git', 'Version control, branching'),
        ('GitHub', 'All 5 projects hosted here'),
        ('VS Code', 'Daily driver'),
        ('Deployment basics', 'Render / Railway / Vercel concepts'),
    ]},
    {'title': 'Concepts', 'skills': [
        ('MVC', 'Django MVT in practice'),
        ('ORM', 'Models, queries, migrations'),
        ('Authentication', 'Sessions, login, permissions'),
        ('CRUD', 'Core of all 5 apps'),
        ('Basic AI Integrations', 'API-driven AI features direction'),
    ]},
]


def get_project(slug):
    for p in PROJECTS:
        if p['slug'] == slug:
            return p
    return None


def home(request):
    if request.method == 'POST':
        name = request.POST.get('name', '').strip()
        email = request.POST.get('email', '').strip()
        opportunity = request.POST.get('opportunity', 'internship')
        message = request.POST.get('message', '').strip()
        if name and email and message:
            try:
                ContactMessage.objects.create(
                    name=name, email=email, opportunity=opportunity, message=message
                )
            except Exception:
                pass  # DB may be read-only / unmigrated in preview — still send email
            subject = f'[Portfolio] {opportunity} — {name}'
            body = f'From: {name} <{email}>\nOpportunity: {opportunity}\n\n{message}'
            try:
                send_mail(subject, body, settings.DEFAULT_FROM_EMAIL,
                          [settings.CONTACT_RECIPIENT], fail_silently=True)
            except Exception:
                pass
            messages.success(request, 'Message received. I usually reply within 24–48 hours.')
            return redirect('/?sent=1#contact')
        messages.error(request, 'Please fill name, email and message.')
        return redirect('/#contact')

    return render(request, 'portfolio/index.html', {
        'projects': PROJECTS,
        'skill_groups': SKILL_GROUPS,
    })


def project_detail(request, slug):
    project = get_project(slug)
    if not project:
        raise Http404('Project not found')
    idx = PROJECTS.index(project)
    prev_p = PROJECTS[idx - 1] if idx > 0 else None
    next_p = PROJECTS[idx + 1] if idx < len(PROJECTS) - 1 else None
    return render(request, 'portfolio/project_detail.html', {
        'project': project,
        'projects': PROJECTS,
        'prev_project': prev_p,
        'next_project': next_p,
    })


# ---- Headless JSON API (Option B: React/Vite + Framer Motion frontend) ----
# No DRF needed for this MVP — pure Django JsonResponse using the same
# PROJECTS source of truth above, so Django templates + React stay in sync.
import json as _json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


def api_projects(request):
    """GET /api/projects/ → list of all projects (truthful, from PROJECTS)."""
    if request.method != 'GET':
        return JsonResponse({'detail': 'Method not allowed'}, status=405)
    return JsonResponse({'projects': PROJECTS})


def api_project_detail(request, slug):
    """GET /api/projects/<slug>/ → single project or 404."""
    project = get_project(slug)
    if not project:
        return JsonResponse({'detail': 'Project not found'}, status=404)
    return JsonResponse({'project': project})


@csrf_exempt  # React dev server runs on another origin; prod: use CORS + CSRF properly (see README)
def api_contact(request):
    """POST /api/contact/ {name, email, opportunity, message} → save + email."""
    if request.method != 'POST':
        return JsonResponse({'detail': 'Method not allowed'}, status=405)
    try:
        data = _json.loads(request.body.decode('utf-8') or '{}')
    except ValueError:
        return JsonResponse({'detail': 'Invalid JSON'}, status=400)
    name = str(data.get('name', '')).strip()
    email = str(data.get('email', '')).strip()
    opportunity = str(data.get('opportunity', 'internship')).strip() or 'internship'
    message = str(data.get('message', '')).strip()
    if not name or not email or '@' not in email or not message:
        return JsonResponse({'detail': 'Please provide name, a valid email and a message.'}, status=400)
    try:
        ContactMessage.objects.create(
            name=name, email=email, opportunity=opportunity, message=message
        )
    except Exception:
        pass
    try:
        send_mail(f'[Portfolio] {opportunity} — {name}',
                  f'From: {name} <{email}>\nOpportunity: {opportunity}\n\n{message}',
                  settings.DEFAULT_FROM_EMAIL, [settings.CONTACT_RECIPIENT],
                  fail_silently=True)
    except Exception:
        pass
    return JsonResponse({'ok': True, 'detail': 'Message received. I usually reply within 24–48 hours.'})


@csrf_exempt  # stateless bot endpoint; no auth/session involved
def api_chat(request):
    """POST /api/chat/ {message} → {reply, suggestions} from SoumilBot brain."""
    if request.method != 'POST':
        return JsonResponse({'detail': 'Method not allowed'}, status=405)
    try:
        data = _json.loads(request.body.decode('utf-8') or '{}')
    except ValueError:
        return JsonResponse({'detail': 'Invalid JSON'}, status=400)
    message = str(data.get('message', '')).strip()
    if not message:
        return JsonResponse({'detail': 'Empty message'}, status=400)
    from .chat import reply as bot_reply
    text, suggestions = bot_reply(message[:500], PROJECTS)
    return JsonResponse({'reply': text, 'suggestions': suggestions})
