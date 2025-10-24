#!/usr/bin/env python
"""
Test rapide pour identifier l'erreur Gemini
"""
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'user_management.settings')
django.setup()

def quick_test():
    """Test rapide de Gemini"""
    print("🚀 Test rapide de Gemini...")
    
    # Test 1: Configuration
    print("\n1️⃣ Vérification de la configuration...")
    try:
        from decouple import config
        api_key = config('GEMINI_API_KEY', default=None)
        model_name = config('GEMINI_MODEL', default='gemini-2.0-flash-exp')
        
        print(f"Clé API: {'✅' if api_key else '❌'}")
        print(f"Modèle: {model_name}")
        
        if not api_key:
            print("❌ ERREUR: GEMINI_API_KEY manquante")
            return False
            
    except Exception as e:
        print(f"❌ ERREUR config: {e}")
        return False
    
    # Test 2: Import Gemini
    print("\n2️⃣ Test import Gemini...")
    try:
        import google.generativeai as genai
        print("✅ Import réussi")
        
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(model_name)
        print("✅ Modèle créé")
        
    except Exception as e:
        print(f"❌ ERREUR import: {e}")
        return False
    
    # Test 3: Test simple
    print("\n3️⃣ Test simple...")
    try:
        response = model.generate_content("Test simple - réponds 'OK'")
        print(f"Réponse: {response.text}")
        
        if not response.text:
            print("❌ ERREUR: Pas de réponse")
            return False
            
    except Exception as e:
        print(f"❌ ERREUR test: {e}")
        return False
    
    # Test 4: Test service CV
    print("\n4️⃣ Test service CV...")
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
    
    # Test 5: Test application 25
    print("\n5️⃣ Test application 25...")
    try:
        from courses.models import CourseApplication
        
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
    except Exception as e:
        print(f"❌ ERREUR application: {e}")
        return False
    
    # Test 6: Test extraction PDF
    print("\n6️⃣ Test extraction PDF...")
    try:
        cv_text = service.extract_text_from_pdf(app.cv)
        
        if not cv_text:
            print("❌ ERREUR: Impossible d'extraire le texte")
            return False
            
        print(f"✅ Texte extrait: {len(cv_text)} caractères")
        print(f"Aperçu: {cv_text[:100]}...")
        
    except Exception as e:
        print(f"❌ ERREUR extraction: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    # Test 7: Test analyse Gemini
    print("\n7️⃣ Test analyse Gemini...")
    try:
        job_description = f"Formation: {app.formation.title}\nDescription: {app.formation.description}"
        
        result = service.analyze_cv_with_gemini(cv_text, job_description)
        
        print(f"Résultat:")
        print(f"  Erreur: {result.get('error', 'Aucune')}")
        print(f"  Score: {result.get('score', 'N/A')}")
        print(f"  Résumé: {result.get('summary', 'N/A')[:100]}...")
        
        if result.get('error'):
            print(f"❌ ERREUR analyse: {result['error']}")
            return False
            
        print("✅ Analyse réussie")
        
    except Exception as e:
        print(f"❌ ERREUR analyse: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    print("\n🎉 Tous les tests sont passés !")
    return True

if __name__ == "__main__":
    success = quick_test()
    
    if success:
        print("\n✅ Gemini fonctionne correctement !")
        print("💡 Le problème pourrait être dans l'endpoint Django.")
    else:
        print("\n❌ Problème détecté dans la configuration Gemini.")
    
    sys.exit(0 if success else 1)
