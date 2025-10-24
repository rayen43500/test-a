from django.db import models
from django.conf import settings
from django.utils import timezone
from django.urls import reverse
from django.template.loader import render_to_string
from django.core.mail import send_mail
from django.utils.html import strip_tags
import os


class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']


class Formation(models.Model):
    LEVEL_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    duration = models.PositiveIntegerField(help_text="Total hours")
    start_date = models.DateField()
    end_date = models.DateField()
    instructor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='taught_formations'
    )
    language = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    location = models.CharField(max_length=100, default="Online")
    max_participants = models.PositiveIntegerField()
    current_participants = models.PositiveIntegerField(default=0)
    image = models.ImageField(upload_to='formations/')
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='formations',
        null=True,
        blank=True
    )
    participants = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='enrolled_formations',
        blank=True
    )
    requirements = models.JSONField(default=list, blank=True, help_text="List of prerequisites")
    learning_points = models.JSONField(default=list, blank=True, help_text="List of learning points")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.get_level_display()})"

    class Meta:
        ordering = ['-created_at']


class Quiz(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='quizzes'
    )
    passing_score = models.PositiveIntegerField(default=70, help_text="Minimum score to pass (percentage)")
    time_limit = models.PositiveIntegerField(null=True, blank=True, help_text="Time limit in minutes")
    is_active = models.BooleanField(default=True)
    questions = models.JSONField(help_text="JSON array of questions with answers")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.category.name}"

    class Meta:
        ordering = ['-created_at']

    def get_total_questions(self):
        """Return the total number of questions in the quiz"""
        return len(self.questions) if self.questions else 0


class QuizAttempt(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='attempts')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='quiz_attempts')
    score = models.PositiveIntegerField()
    total_questions = models.PositiveIntegerField()
    answers = models.JSONField(help_text="JSON object of question_id: answer_id mappings")
    is_passed = models.BooleanField(default=False)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.quiz.title} - {self.score}%"

    class Meta:
        ordering = ['-started_at']
        # Removed unique_together to allow multiple attempts per user per quiz


class CourseApplication(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('withdrawn', 'Withdrawn'),
    ]

    candidate = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='course_applications'
    )
    formation = models.ForeignKey(
        Formation,
        on_delete=models.CASCADE,
        related_name='applications'
    )
    quiz_attempt = models.ForeignKey(
        QuizAttempt,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='course_applications',
        help_text="Optional: Link to full quiz attempt details"
    )
    quiz_score = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Quiz score percentage (0-100)"
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    cv = models.FileField(
        upload_to='applications/cv/',
        blank=True,
        null=True,
        help_text="Candidate's CV file"
    )
    application_message = models.TextField(
        blank=True,
        null=True,
        help_text="Motivation letter from candidate to instructor"
    )
    review_notes = models.TextField(
        blank=True,
        null=True,
        help_text="Notes from instructor during review"
    )
    cv_text = models.TextField(
        blank=True,
        null=True,
        help_text="Extracted text from CV"
    )
    cv_score = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="AI-generated CV score (0-100)"
    )
    cv_resume = models.TextField(
        null=True, 
        blank=True, 
        help_text="AI-generated resume of the CV"
    )
    cv_analysis = models.JSONField(
        blank=True,
        null=True,
        help_text="Detailed AI analysis of CV"
    )
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reviewed_applications'
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def save(self, *args, **kwargs):
        is_new = self.pk is None
        print(f"💾 CourseApplication.save() called, is_new: {is_new}")
        
        super().save(*args, **kwargs)

        # Send notification to instructor when new application is created
        if is_new:
            print(f"📧 Sending email notification...")
            try:
                self._send_new_application_notification()
            except Exception as e:
                print(f"⚠️ Email notification failed: {e}")
                # Continue without failing the application creation
            
            print(f"🔔 Sending WebSocket notification...")
            try:
                # Send WebSocket notification
                from notifications.utils import notify_application_submitted
                notify_application_submitted(self)
            except Exception as e:
                print(f"⚠️ WebSocket notification failed: {e}")
                # Continue without failing the application creation

    def _send_email_notification(self, subject_template, email_template, to_email, context=None):
        """Helper method to send email notifications"""
        if context is None:
            context = {}
            
        # Add common context variables
        context.update({
            'application': self,
            'candidate': self.candidate,
            'formation': self.formation,
            'instructor': self.formation.instructor,
            'site_name': getattr(settings, 'SITE_NAME', 'eLearning Platform'),
            'site_domain': getattr(settings, 'SITE_DOMAIN', 'example.com'),
        })
        
        # Render subject and email content
        subject = render_to_string(subject_template, context).strip()
        html_message = render_to_string(email_template, context)
        plain_message = strip_tags(html_message)
        
        # Send email
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[to_email],
            html_message=html_message,
            fail_silently=False,
        )

    def _send_new_application_notification(self):
        """Send notification to instructor about new application"""
        instructor = self.formation.instructor
        context = {
            'action_url': f'/api/courses/applications/{self.id}/',
        }
        self._send_email_notification(
            subject_template='emails/new_application_subject.txt',
            email_template='emails/new_application.html',
            to_email=instructor.email,
            context=context
        )

    def approve(self, reviewer, notes=None):
        """Approve the application"""
        self.status = 'approved'
        self.reviewed_by = reviewer
        self.reviewed_at = timezone.now()
        if notes:
            self.review_notes = notes
        self.save()

        # Add candidate to formation participants
        self.formation.participants.add(self.candidate)
        self.formation.current_participants += 1
        self.formation.save()

        # Send approval email to candidate
        context = {
            'action_url': '/api/courses/formations/{self.formation.id}/',
            'reviewer_notes': notes,
        }
        self._send_email_notification(
            subject_template='emails/application_approved_subject.txt',
            email_template='emails/application_approved.html',
            to_email=self.candidate.email,
            context=context
        )
        
        # Send WebSocket notification
        from notifications.utils import notify_application_approved
        notify_application_approved(self)

    def reject(self, reviewer, notes=None):
        """Reject the application"""
        self.status = 'rejected'
        self.reviewed_by = reviewer
        self.reviewed_at = timezone.now()
        if notes:
            self.review_notes = notes
        self.save()

        # Send rejection email to candidate
        context = {
            'action_url': '/api/courses/formations/',  # Changed to list of formations
            'reviewer_notes': notes,
        }
        self._send_email_notification(
            subject_template='emails/application_rejected_subject.txt',
            email_template='emails/application_rejected.html',
            to_email=self.candidate.email,
            context=context
        )
        
        # Send WebSocket notification
        from notifications.utils import notify_application_rejected
        notify_application_rejected(self)


class Interview(models.Model):
    """Model for storing interview information"""
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('rescheduled', 'Rescheduled'),
    ]
    
    MEETING_TYPE_CHOICES = [
        ('online', 'Online (Teams/Zoom)'),
        ('in_person', 'In Person'),
        ('phone', 'Phone Call'),
    ]

    application = models.ForeignKey(
        CourseApplication,
        on_delete=models.CASCADE,
        related_name='interviews'
    )
    scheduled_date = models.DateTimeField()
    duration = models.PositiveIntegerField(
        default=60,
        help_text="Duration in minutes"
    )
    meeting_type = models.CharField(
        max_length=20,
        choices=MEETING_TYPE_CHOICES,
        default='online'
    )
    meeting_link = models.URLField(
        blank=True,
        null=True,
        help_text="Meeting link for online interviews"
    )
    location = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="Location for in-person interviews"
    )
    notes = models.TextField(
        blank=True,
        null=True,
        help_text="Additional notes about the interview"
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='scheduled'
    )
    scheduled_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='scheduled_interviews'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-scheduled_date']
        indexes = [
            models.Index(fields=['application', '-scheduled_date']),
            models.Index(fields=['scheduled_date']),
        ]

    def __str__(self):
        return f"Interview for {self.application.candidate.fullname} - {self.scheduled_date.strftime('%Y-%m-%d %H:%M')}"

    @property
    def candidate(self):
        return self.application.candidate

    @property
    def formation(self):
        return self.application.formation

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        
        # Send notification to candidate when interview is scheduled
        if is_new:
            self._send_interview_notification()

    def _send_interview_notification(self):
        """Send notification to candidate about scheduled interview"""
        try:
            from notifications.utils import notify_interview_scheduled
            notify_interview_scheduled(self)
        except Exception as e:
            print(f"Interview notification failed: {e}")
            # Continue without failing the interview creation
