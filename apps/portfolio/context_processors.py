"""Context processors — single source of truth for contact/brand config."""
from django.conf import settings


def site_config(request):
    return {
        'SITE_NAME': 'Soumil Gurjar',
        'BRAND_LINE': 'Soumil Gurjar — AI & Full-Stack Developer',
        'PORTFOLIO_EMAIL': getattr(settings, 'PORTFOLIO_EMAIL', 'soumilgurjar951@gmail.com'),
        'PORTFOLIO_RESUME_URL': getattr(settings, 'PORTFOLIO_RESUME_URL', '#'),
        'GITHUB_URL': 'https://github.com/soumilgurjar951-gif',
        'LINKEDIN_URL': 'https://www.linkedin.com/in/soumil-gurjar',
        'LOCATION': 'Indore, Madhya Pradesh, India',
    }
