from django.db import models
from django.conf import settings
from django.utils import timezone


class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('application_submitted', 'Application Submitted'),
        ('application_approved', 'Application Approved'),
        ('application_rejected', 'Application Rejected'),
        ('application_withdrawn', 'Application Withdrawn'),
        ('interview_scheduled', 'Interview Scheduled'),
        ('interview_cancelled', 'Interview Cancelled'),
        ('interview_rescheduled', 'Interview Rescheduled'),
    ]

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    notification_type = models.CharField(
        max_length=50,
        choices=NOTIFICATION_TYPES
    )
    title = models.CharField(max_length=255)
    message = models.TextField()
    
    # Related objects
    application = models.ForeignKey(
        'courses.CourseApplication',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='notifications'
    )
    interview = models.ForeignKey(
        'courses.Interview',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='notifications'
    )
    
    # Metadata
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', '-created_at']),
            models.Index(fields=['recipient', 'is_read']),
        ]
    
    def __str__(self):
        return f"{self.notification_type} - {self.recipient.fullname}"
    
    def mark_as_read(self):
        """Mark notification as read"""
        if not self.is_read:
            self.is_read = True
            self.read_at = timezone.now()
            self.save(update_fields=['is_read', 'read_at'])
    
    def to_dict(self):
        """Convert notification to dictionary for WebSocket"""
        return {
            'id': self.id,
            'type': self.notification_type,
            'title': self.title,
            'message': self.message,
            'is_read': self.is_read,
            'created_at': self.created_at.isoformat(),
            'application_id': self.application.id if self.application else None,
            'formation_title': self.application.formation.title if self.application else None,
            'interview_id': self.interview.id if self.interview else None,
            'interview_date': self.interview.scheduled_date.isoformat() if self.interview else None,
        }
