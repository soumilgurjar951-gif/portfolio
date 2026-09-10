from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('work/<slug:slug>/', views.project_detail, name='project-detail'),
    # Headless API for the React + Framer Motion frontend (frontend/)
    path('api/projects/', views.api_projects, name='api-projects'),
    path('api/projects/<slug:slug>/', views.api_project_detail, name='api-project-detail'),
    path('api/contact/', views.api_contact, name='api-contact'),
    path('api/chat/', views.api_chat, name='api-chat'),
]
