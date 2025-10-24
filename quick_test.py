#!/usr/bin/env python
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'user_management.settings')
django.setup()

from decouple import config
import google.generativeai as genai

# Test simple
gemini_key = config('GEMINI_API_KEY', default=None)
gemini_model = config('GEMINI_MODEL', default='gemini-2.0-flash-exp')

print(f"Clé API: {'OK' if gemini_key else 'MANQUANTE'}")
print(f"Modèle: {gemini_model}")

if gemini_key:
    try:
        genai.configure(api_key=gemini_key)
        model = genai.GenerativeModel(gemini_model)
        response = model.generate_content("Test simple")
        print(f"✅ Réponse: {response.text[:50]}...")
    except Exception as e:
        print(f"❌ Erreur: {e}")
else:
    print("❌ Clé API manquante")
