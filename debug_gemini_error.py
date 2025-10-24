#!/usr/bin/env python
"""
Script de debug pour identifier l'erreur Gemini exacte
"""
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'user_management.settings')
django.setup()

def debug_gemini_step_by_step():
    """Debug étape par étape pour identifier l'erreur"""
    print("🔍 Debug de l'erreur Gemini étape par étape...")
    
    # Étape 1: Vérifier la configuration
    print("\n1️⃣ Vérification de la configuration...")
    try:
        from decouple import config
        api_key = config('GEMINI_API_KEY', default=None)
        model_name = config('GEMINI_MODEL', default='gemini-2.0-flash-exp')
        
        print(f"Clé API: {'✅ Configurée' if api_key else '❌ Manquante'}")
        print(f"Modèle: {model_name}")
        
        if not api_key:
            print("❌ ERREUR: GEMINI_API_KEY manquante dans .env")
            return False
            
    except Exception as e:
        print(f"❌ ERREUR configuration: {e}")
        return False
    
    # Étape 2: Test import et configuration Gemini
    print("\n2️⃣ Test import et configuration Gemini...")
    try:
        import google.generativeai as genai
        print("✅ Import réussi")
        
        genai.configure(api_key=api_key)
        print("✅ Configuration réussie")
        
        model = genai.GenerativeModel(model_name)
        print("✅ Modèle créé")
        
    except ImportError as e:
        print(f"❌ ERREUR import: {e}")
        print("💡 Solution: pip install google-generativeai")
        return False
    except Exception as e:
        print(f"❌ ERREUR configuration: {e}")
        return False
    
    # Étape 3: Test simple de Gemini
    print("\n3️⃣ Test simple de Gemini...")
    try:
        response = model.generate_content("Test simple - réponds 'OK'")
        print(f"Réponse: {response.text}")
        
        if not response.text:
            print("❌ ERREUR: Pas de réponse de Gemini")
            return False
            
    except Exception as e:
        print(f"❌ ERREUR test simple: {e}")
        return False
    
    # Étape 4: Test du service CV
    print("\n4️⃣ Test du service CV...")
    try:
        from accounts.gemini_cv_analysis import GeminiCVAnalysisService
        
        service = GeminiCVAnalysisService()
        print("✅ Service créé")
        
        if not service.api_key:
            print("❌ ERREUR: Service sans clé API")
            return False
            
        if not service.model:
            print("❌ ERREUR: Service sans modèle")
            return False
            
        print("✅ Service configuré")
        
    except Exception as e:
        print(f"❌ ERREUR service: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    # Étape 5: Test avec application réelle
    print("\n5️⃣ Test avec application réelle...")
    try:
        from courses.models import CourseApplication
        
        # Trouver l'application 25
        try:
            app = CourseApplication.objects.get(id=25)
            print(f"✅ Application 25 trouvée")
            print(f"   Candidat: {app.candidate.username}")
            print(f"   Formation: {app.formation.title}")
            print(f"   CV: {app.cv.name if app.cv else 'Aucun'}")
            
            if not app.cv:
                print("❌ ERREUR: Application sans CV")
                return False
                
        except CourseApplication.DoesNotExist:
            print("❌ ERREUR: Application 25 non trouvée")
            return False
        
        # Test d'extraction PDF
        print("\n6️⃣ Test d'extraction PDF...")
        cv_text = service.extract_text_from_pdf(app.cv)
        
        if not cv_text:
            print("❌ ERREUR: Impossible d'extraire le texte du CV")
            return False
            
        print(f"✅ Texte extrait: {len(cv_text)} caractères")
        print(f"Aperçu: {cv_text[:100]}...")
        
        # Test d'analyse Gemini
        print("\n7️⃣ Test d'analyse Gemini...")
        job_description = f"Formation: {app.formation.title}\nDescription: {app.formation.description}"
        
        print(f"Description du poste: {job_description}")
        
        result = service.analyze_cv_with_gemini(cv_text, job_description)
        
        print(f"Résultat de l'analyse:")
        print(f"  Erreur: {result.get('error', 'Aucune')}")
        print(f"  Score: {result.get('score', 'N/A')}")
        print(f"  Résumé: {result.get('summary', 'N/A')[:100]}...")
        
        if result.get('error'):
            print(f"❌ ERREUR analyse: {result['error']}")
            return False
            
        print("✅ Analyse réussie")
        
    except Exception as e:
        print(f"❌ ERREUR test application: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    # Étape 6: Test de l'endpoint Django
    print("\n8️⃣ Test de l'endpoint Django...")
    try:
        from django.test import RequestFactory
        from accounts.gemini_cv_test_view import GeminiCVTestView
        
        factory = RequestFactory()
        request = factory.post(f'/api/test/gemini-cv-analysis/25/')
        
        view = GeminiCVTestView()
        response = view.post(request, 25)
        
        print(f"Status: {response.status_code}")
        print(f"Réponse: {response.data}")
        
        if response.status_code != 200:
            print(f"❌ ERREUR endpoint: {response.data}")
            return False
            
        print("✅ Endpoint fonctionne")
        
    except Exception as e:
        print(f"❌ ERREUR endpoint: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    print("\n🎉 Tous les tests sont passés !")
    return True

if __name__ == "__main__":
    success = debug_gemini_step_by_step()
    
    if success:
        print("\n✅ Le problème n'est pas dans la configuration Gemini.")
        print("💡 Vérifiez les logs du serveur Django pour plus de détails.")
    else:
        print("\n❌ Problème identifié dans la configuration Gemini.")
        print("💡 Suivez les solutions suggérées ci-dessus.")
    
    sys.exit(0 if success else 1)
