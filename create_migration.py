#!/usr/bin/env python
"""
Script pour créer une migration pour corriger les champs dupliqués
"""
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'user_management.settings')
django.setup()

from django.core.management import call_command

def create_migration():
    """Créer une migration pour corriger les champs dupliqués"""
    print("🔄 Création de la migration...")
    
    try:
        # Créer la migration
        call_command('makemigrations', 'courses', name='fix_duplicate_fields', verbosity=2)
        print("✅ Migration créée avec succès")
        
        # Appliquer la migration
        call_command('migrate', 'courses', verbosity=2)
        print("✅ Migration appliquée avec succès")
        
        return True
    except Exception as e:
        print(f"❌ Erreur lors de la création/applicaton de la migration: {e}")
        return False

if __name__ == "__main__":
    success = create_migration()
    sys.exit(0 if success else 1)
