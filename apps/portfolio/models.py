from django.db import models


class ContactMessage(models.Model):
    """Optional: persist contact-form submissions (admin-viewable)."""
    OPPORTUNITY_CHOICES = [
        ('internship', 'Internship'),
        ('fulltime', 'Full-time'),
        ('collab', 'Collaboration'),
        ('other', 'Other'),
    ]
    name = models.CharField(max_length=120)
    email = models.EmailField()
    opportunity = models.CharField(max_length=20, choices=OPPORTUNITY_CHOICES, default='internship')
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.name} <{self.email}> — {self.opportunity}'
