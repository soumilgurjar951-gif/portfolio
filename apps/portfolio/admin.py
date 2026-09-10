from django.contrib import admin
from .models import ContactMessage


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'opportunity', 'created_at')
    list_filter = ('opportunity', 'created_at')
    search_fields = ('name', 'email', 'message')
