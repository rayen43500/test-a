from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Language, SocialLink


# Inlines pour les langues et liens sociaux
class LanguageInline(admin.TabularInline):
    model = Language
    extra = 1


class SocialLinkInline(admin.TabularInline):
    model = SocialLink
    extra = 1


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    # Colonnes affichées dans la liste des utilisateurs
    list_display = ('email', 'fullname', 'username', 'role', 'is_active', 'is_staff', 'is_superuser', 'date_joined')
    list_filter = ('role', 'is_active', 'is_staff', 'is_superuser', 'date_joined', 'gender')
    search_fields = ('email', 'fullname', 'username')
    ordering = ('-date_joined',)
    inlines = [LanguageInline, SocialLinkInline]

    # Organisation des champs dans la page détail utilisateur
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {
            'fields': ('fullname', 'email', 'phone_number', 'photo_profile', 
                       'birthdate', 'gender', 'address')
        }),
        ('Professional info', {
            'fields': ('role', 'skills', 'annees_experience', 'bio', 
                       'website', 'portfolio_url', 'linkedin_url', 'github_url',
                       'cv_resume', 'projects')
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 
                       'groups', 'user_permissions'),
        }),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    # Champs utilisés lors de l'ajout d'un utilisateur depuis l'admin
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'fullname', 'role', 'password1', 'password2'),
        }),
    )

    # Surcharge du queryset pour afficher tous les utilisateurs
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            # Les superusers voient tous les utilisateurs
            return qs
        # Les staff normaux peuvent voir uniquement les utilisateurs non superuser
        return qs.filter(is_superuser=False)


# Admin pour les langues
@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    list_display = ('user', 'language', 'proficiency')
    list_filter = ('proficiency',)
    search_fields = ('user__fullname', 'user__email', 'language')


# Admin pour les liens sociaux
@admin.register(SocialLink)
class SocialLinkAdmin(admin.ModelAdmin):
    list_display = ('user', 'platform', 'url')
    list_filter = ('platform',)
    search_fields = ('user__fullname', 'user__email', 'platform')
