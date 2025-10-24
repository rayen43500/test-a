from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from .models import Language, SocialLink
from PIL import Image

User = get_user_model()


# -------------------------------
# Serializers pour Languages et Social Links
# -------------------------------
class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ['language', 'proficiency']


class SocialLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLink
        fields = ['platform', 'url']


# -------------------------------
# Serializer d'inscription
# -------------------------------
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    languages = LanguageSerializer(many=True, required=False)
    social_links = SocialLinkSerializer(many=True, required=False)

    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password_confirm', 'fullname',
            'phone_number', 'role', 'birthdate', 'gender', 'address',
            'skills', 'annees_experience', 'bio', 'website', 'portfolio_url',
            'linkedin_url', 'github_url', 'languages', 'social_links'
        ]

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Les mots de passe ne correspondent pas.")
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm', None)
        languages_data = validated_data.pop('languages', [])
        social_links_data = validated_data.pop('social_links', [])
        user = User.objects.create_user(**validated_data)

        for language_data in languages_data:
            Language.objects.create(user=user, **language_data)
        for social_link_data in social_links_data:
            SocialLink.objects.create(user=user, **social_link_data)
        return user


# -------------------------------
# Serializer de login
# -------------------------------
class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        if email and password:
            user = authenticate(username=email, password=password)
            if not user:
                raise serializers.ValidationError('Email ou mot de passe invalide.')
            if not user.is_active:
                raise serializers.ValidationError('Compte utilisateur désactivé.')
            attrs['user'] = user
            return attrs
        raise serializers.ValidationError('Email et mot de passe requis.')


# -------------------------------
# Serializer du profil utilisateur
# -------------------------------
class UserProfileSerializer(serializers.ModelSerializer):
    languages = LanguageSerializer(many=True, required=False)
    social_links = SocialLinkSerializer(many=True, required=False)
    photo_profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'fullname', 'phone_number', 'role',
            'photo_profile', 'birthdate', 'gender', 'address', 'skills',
            'annees_experience', 'bio', 'website', 'portfolio_url',
            'linkedin_url', 'github_url', 'cv', 'cv_resume', 'projects',
            'languages', 'social_links', 'date_joined', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'role', 'date_joined', 'created_at', 'updated_at']

    def get_photo_profile(self, obj):
        request = self.context.get('request')
        if obj.photo_profile and hasattr(obj.photo_profile, 'url'):
            return request.build_absolute_uri(obj.photo_profile.url) if request else obj.photo_profile.url
        return None

    def update(self, instance, validated_data):
        languages_data = validated_data.pop('languages', [])
        social_links_data = validated_data.pop('social_links', [])

        if languages_data:
            instance.languages.all().delete()
            for lang in languages_data:
                Language.objects.create(user=instance, **lang)

        if social_links_data:
            instance.social_links.all().delete()
            for link in social_links_data:
                SocialLink.objects.create(user=instance, **link)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


# -------------------------------
# Serializer pour upload de photo
# -------------------------------
class ProfilePictureUploadSerializer(serializers.ModelSerializer):
    photo_profile = serializers.ImageField(required=True)

    class Meta:
        model = User
        fields = ['photo_profile']

    def validate_photo_profile(self, value):
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("L'image ne doit pas dépasser 5 Mo.")
        allowed_formats = ['image/jpeg', 'image/png', 'image/webp']
        if value.content_type not in allowed_formats:
            raise serializers.ValidationError("Format non supporté (JPEG, PNG ou WebP uniquement).")

        try:
            image = Image.open(value)
            width, height = image.size
            if width < 200 or height < 200:
                raise serializers.ValidationError("L'image doit être au moins 200x200 pixels.")
            value.seek(0)
        except Exception as e:
            raise serializers.ValidationError(f"Erreur lors de la validation de l'image: {str(e)}")
        
        return value

    def update(self, instance, validated_data):
        if instance.photo_profile:
            instance.photo_profile.delete(save=False)
        instance.photo_profile = validated_data.get('photo_profile')
        instance.save()
        return instance


# -------------------------------
# ✅ CORRIGÉ : Serializer pour la liste des utilisateurs (admin)
# -------------------------------
class UserListSerializer(serializers.ModelSerializer):
    photo_profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 
            'username', 
            'email', 
            'fullname', 
            'phone_number', 
            'role',
            'photo_profile', 
            'birthdate', 
            'gender', 
            'address', 
            'skills',
            'annees_experience', 
            'bio', 
            'website', 
            'portfolio_url',
            'linkedin_url', 
            'github_url', 
            'is_active',
            'is_staff',
            'is_superuser',
            'date_joined',
            'last_login'
        ]
        read_only_fields = ['id', 'date_joined', 'last_login']

    def get_photo_profile(self, obj):
        """Retourne l'URL complète de la photo de profil"""
        request = self.context.get('request')
        if obj.photo_profile and hasattr(obj.photo_profile, 'url'):
            try:
                if request:
                    return request.build_absolute_uri(obj.photo_profile.url)
                return obj.photo_profile.url
            except Exception:
                return None
        return None

    def to_representation(self, instance):
        """Personnaliser la représentation pour debug"""
        data = super().to_representation(instance)
        # Debug : afficher les infos utilisateur
        print(f"  📝 Serializing user: {instance.fullname} (role: {instance.role})")
        return data


# -------------------------------
# Serializer pour mise à jour utilisateur (admin ou profil)
# -------------------------------
class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'fullname', 
            'phone_number', 
            'photo_profile', 
            'birthdate',
            'gender',
            'address',
            'skills',
            'annees_experience', 
            'bio', 
            'website', 
            'portfolio_url',
            'linkedin_url', 
            'github_url',
            'is_active',
            'role'
        ]

    def validate_email(self, value):
        """Vérifier que l'email n'est pas déjà utilisé"""
        user = self.instance
        if User.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError("Cet email est déjà utilisé.")
        return value


# -------------------------------
# Password reset request
# -------------------------------
class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def save(self, request=None):
        email = self.validated_data['email']
        try:
            user = User.objects.get(email=email)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            
            # Utiliser le domaine depuis settings
            site_domain = getattr(settings, 'SITE_DOMAIN', 'localhost:3000')
            reset_link = f"http://{site_domain}/reset-password-confirm/{uid}/{token}"

            context = {'user': user, 'reset_link': reset_link}
            
            # Essayer de charger le template HTML, sinon utiliser un message simple
            try:
                html_content = render_to_string('emails/reset_email.html', context)
            except Exception:
                html_content = f"""
                <html>
                <body>
                    <h2>Réinitialisation de votre mot de passe</h2>
                    <p>Bonjour {user.fullname},</p>
                    <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
                    <p><a href="{reset_link}">Réinitialiser mon mot de passe</a></p>
                    <p>Ce lien expire dans 24 heures.</p>
                </body>
                </html>
                """

            msg = EmailMultiAlternatives(
                subject=f'Réinitialisation du mot de passe - {getattr(settings, "SITE_NAME", "Plateforme")}',
                body=f'Veuillez cliquer sur le lien ci-dessous pour réinitialiser votre mot de passe: {reset_link}',
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[user.email]
            )
            msg.attach_alternative(html_content, "text/html")
            msg.send()
        except User.DoesNotExist:
            # Ne pas révéler si l'email existe ou non (sécurité)
            pass


# -------------------------------
# Serializer pour confirmer le reset du mot de passe
# -------------------------------
class PasswordResetConfirmSerializer(serializers.Serializer):
    uidb64 = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, validators=[validate_password])

    def validate(self, attrs):
        try:
            uid = force_str(urlsafe_base64_decode(attrs['uidb64']))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError("Lien invalide")

        if not default_token_generator.check_token(user, attrs['token']):
            raise serializers.ValidationError("Token invalide ou expiré")

        attrs['user'] = user
        return attrs

    def save(self):
        user = self.validated_data['user']
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user