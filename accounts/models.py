from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator


class User(AbstractUser):
    ROLE_CHOICES = [
        ('Admin', 'Admin'),
        ('Candidat', 'Candidat'),
        ('Recruteur', 'Recruteur'),
    ]
    
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]
    
    PROFICIENCY_CHOICES = [
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
        ('Native', 'Native'),
    ]

    # Required fields
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='Candidat')
    email = models.EmailField(unique=True)
    fullname = models.CharField(max_length=255)
    phone_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")
    phone_number = models.CharField(validators=[phone_regex], max_length=17, blank=True)
    photo_profile = models.ImageField(upload_to='profile_photos/', blank=True, null=True)
    birthdate = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True)
    address = models.TextField(blank=True)
    
    # Optional fields
    skills = models.TextField(blank=True, help_text="Comma-separated list of skills")
    annees_experience = models.PositiveIntegerField(blank=True, null=True, help_text="Years of experience")
    bio = models.TextField(blank=True)
    website = models.URLField(blank=True)
    portfolio_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    cv = models.FileField(upload_to='cvs/', blank=True, null=True)
    cv_resume = models.FileField(upload_to='cv/', null=True, blank=True)
    projects = models.TextField(blank=True, help_text="JSON field for projects and achievements")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'fullname']

    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return f"{self.fullname} ({self.email})"
    
    def get_full_name(self):
        """Return the fullname for the user."""
        return self.fullname
    
    @property
    def is_admin(self):
        return self.role == 'Admin'
    
    @property
    def is_candidat(self):
        return self.role == 'Candidat'
    
    @property
    def is_recruteur(self):
        return self.role == 'Recruteur'


class Language(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='languages')
    language = models.CharField(max_length=100)
    proficiency = models.CharField(max_length=20, choices=User.PROFICIENCY_CHOICES)
    
    class Meta:
        unique_together = ('user', 'language')
        db_table = 'user_languages'
    
    def __str__(self):
        return f"{self.user.fullname} - {self.language} ({self.proficiency})"


class SocialLink(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='social_links')
    platform = models.CharField(max_length=50)  # LinkedIn, GitHub, Twitter, etc.
    url = models.URLField()
    
    class Meta:
        unique_together = ('user', 'platform')
        db_table = 'user_social_links'
    
    def __str__(self):
        return f"{self.user.fullname} - {self.platform}"