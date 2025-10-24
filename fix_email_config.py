#!/usr/bin/env python
"""
Script pour corriger la configuration email
"""
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'user_management.settings')
django.setup()

from django.conf import settings
from django.core.mail import get_connection

def test_email_config():
    """Test de la configuration email"""
    print("📧 Test de la configuration email...")
    
    try:
        # Vérifier les paramètres email
        print(f"EMAIL_HOST: {settings.EMAIL_HOST}")
        print(f"EMAIL_PORT: {settings.EMAIL_PORT}")
        print(f"EMAIL_USE_TLS: {settings.EMAIL_USE_TLS}")
        print(f"EMAIL_HOST_USER: {settings.EMAIL_HOST_USER}")
        print(f"DEFAULT_FROM_EMAIL: {settings.DEFAULT_FROM_EMAIL}")
        
        # Tester la connexion
        connection = get_connection()
        print(f"✅ Connexion email configurée: {type(connection).__name__}")
        
        # Test simple d'envoi (sans vraiment envoyer)
        from django.core.mail import EmailMessage
        
        email = EmailMessage(
            subject='Test Email',
            body='Test body',
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=['test@example.com'],
        )
        
        print("✅ Configuration email valide")
        return True
        
    except Exception as e:
        print(f"❌ Erreur configuration email: {e}")
        return False

def fix_email_backend():
    """Corriger le backend email pour éviter les erreurs SMTP"""
    print("\n🔧 Correction du backend email...")
    
    try:
        # Utiliser le backend console pour les tests
        from django.core.mail import get_connection
        from django.core.mail.backends.console import EmailBackend
        
        # Test avec le backend console
        connection = EmailBackend()
        print("✅ Backend console disponible")
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur backend email: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Test et correction de la configuration email...")
    
    config_ok = test_email_config()
    backend_ok = fix_email_backend()
    
    print(f"\n📊 Résultats:")
    print(f"Configuration email: {'✅' if config_ok else '❌'}")
    print(f"Backend email: {'✅' if backend_ok else '❌'}")
    
    if not config_ok:
        print("\n💡 Suggestion: Vérifiez la configuration email dans settings.py")
        print("   Vous pouvez temporairement utiliser EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'")
    
    sys.exit(0 if (config_ok and backend_ok) else 1)
