from django.core.management.base import BaseCommand
from decouple import config
import requests
import json
try:
    from dotenv import load_dotenv
    DOTENV_AVAILABLE = True
except Exception:
    # python-dotenv not installed; we'll skip loading .env and rely on environment variables
    def load_dotenv(*args, **kwargs):
        return None
    DOTENV_AVAILABLE = False
from pathlib import Path
import os

class Command(BaseCommand):
    help = 'Test Google Gemini / Generative Language API using GEMINI_API_KEY from env'

    def add_arguments(self, parser):
        parser.add_argument('--model', type=str, default=None, help='Optional model override')
        parser.add_argument('--prompt', type=str, default=None, help='Optional prompt to send')

    def handle(self, *args, **options):
        # Attempt to load a .env file from the project root so env vars in .env are discoverable
        project_root = Path(__file__).resolve().parents[2]
        env_path = project_root / '.env'
        if env_path.exists():
            if DOTENV_AVAILABLE:
                load_dotenv(dotenv_path=env_path)
                self.stdout.write(self.style.SUCCESS(f'Loaded .env from {env_path}'))
            else:
                self.stdout.write(self.style.WARNING(f'python-dotenv not installed; found .env at {env_path} but will not load it. Install python-dotenv or run `pip install -r requirements.txt`'))
        else:
            self.stdout.write(self.style.NOTICE(f'.env not found at {env_path}, relying on environment variables'))

        key = config('GEMINI_API_KEY', default=None)
        if not key:
            self.stdout.write(self.style.ERROR('GEMINI_API_KEY not set in environment or .env'))
            return

        model = options.get('model') or config('GEMINI_MODEL', default='gemini-2.0-flash-exp')
        # Use modern Gemini models
        self.stdout.write(f"Using Gemini model: {model}")
        prompt = options.get('prompt') or (
            "Tu es un assistant test. Réponds en une phrase: est-ce que l'API Gemini fonctionne ?"
        )

        self.stdout.write(f'Calling Gemini model {model}...')
        try:
            import google.generativeai as genai
            
            # Configure the API key
            genai.configure(api_key=key)
            
            # Initialize the model
            gemini_model = genai.GenerativeModel(model)
            
            # Generate content
            response = gemini_model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.2,
                    max_output_tokens=256
                )
            )
            
            self.stdout.write(self.style.SUCCESS('Success - Gemini response:'))
            self.stdout.write(response.text)
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error: {e}'))
