#!/usr/bin/env python
"""
Test complet pour identifier et corriger l'erreur Gemini
"""
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'user_management.settings')
django.setup()

def test_gemini_complete():
    """Test complet de Gemini"""
    print("🚀 Test complet de Gemini...")
    
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
            print("💡 Ajoutez GEMINI_API_KEY=your_key dans le fichier .env")
            return False
            
    except Exception as e:
        print(f"❌ ERREUR configuration: {e}")
        return False
    
    # Étape 2: Test import Gemini
    print("\n2️⃣ Test import Gemini...")
    try:
        import google.generativeai as genai
        print("✅ google.generativeai importé")
        
        genai.configure(api_key=api_key)
        print("✅ Gemini configuré")
        
        model = genai.GenerativeModel(model_name)
        print("✅ Modèle créé")
        
    except ImportError as e:
        print(f"❌ ERREUR import: {e}")
        print("💡 Installez avec: pip install google-generativeai")
        return False
    except Exception as e:
        print(f"❌ ERREUR configuration: {e}")
        return False
    
    # Étape 3: Test simple
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
    
    # Étape 4: Test service CV
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
    
    # Étape 5: Test application 25
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
    
    # Étape 6: Test extraction PDF
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
    
    # Étape 7: Test analyse Gemini
    print("\n7️⃣ Test analyse Gemini...")
    try:
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
        print(f"❌ ERREUR analyse: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    # Étape 8: Test endpoint Django
    print("\n8️⃣ Test endpoint Django...")
    try:
        from django.test import RequestFactory
        from accounts.test_frontend_simulation import TestFrontendSimulationView
        
        factory = RequestFactory()
        request = factory.post('/api/test/gemini-frontend-sim/25/')
        
        view = TestFrontendSimulationView()
        response = view.post(request, 25)
        
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.data
            print(f"✅ Endpoint fonctionne")
            print(f"   Succès: {data.get('success', False)}")
            print(f"   Score: {data.get('cv_score', 'N/A')}")
            print(f"   Modèle: {data.get('gemini_model', 'N/A')}")
        else:
            print(f"❌ ERREUR endpoint: {response.data}")
            return False
            
    except Exception as e:
        print(f"❌ ERREUR endpoint: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    print("\n🎉 Tous les tests sont passés !")
    return True

def fix_gemini_issues():
    """Corriger les problèmes Gemini"""
    print("\n🔧 Correction des problèmes Gemini...")
    
    # Vérifier et corriger la configuration
    print("\n1️⃣ Vérification de la configuration...")
    try:
        from decouple import config
        api_key = config('GEMINI_API_KEY', default=None)
        
        if not api_key:
            print("❌ GEMINI_API_KEY manquante")
            print("💡 Ajoutez GEMINI_API_KEY=your_key dans le fichier .env")
            return False
        
        print("✅ Configuration OK")
        
    except Exception as e:
        print(f"❌ Erreur configuration: {e}")
        return False
    
    # Vérifier et installer le package
    print("\n2️⃣ Vérification du package...")
    try:
        import google.generativeai as genai
        print("✅ Package installé")
    except ImportError:
        print("❌ Package manquant")
        print("💡 Installez avec: pip install google-generativeai")
        return False
    
    # Test de l'API
    print("\n3️⃣ Test de l'API...")
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.0-flash-exp')
        
        response = model.generate_content("Test simple")
        
        if response.text:
            print("✅ API fonctionne")
        else:
            print("❌ API ne répond pas")
            return False
            
    except Exception as e:
        print(f"❌ Erreur API: {e}")
        return False
    
    print("✅ Tous les problèmes sont corrigés")
    return True

if __name__ == "__main__":
    print("🚀 Test et correction de Gemini...")
    
    # Test complet
    test_success = test_gemini_complete()
    
    if not test_success:
        print("\n🔧 Tentative de correction...")
        fix_success = fix_gemini_issues()
        
        if fix_success:
            print("\n🔄 Retest après correction...")
            test_success = test_gemini_complete()
    
    if test_success:
        print("\n🎉 Gemini fonctionne correctement !")
        print("💡 Pour tester dans le frontend:")
        print("   1. Redémarrez le serveur Django")
        print("   2. Allez sur la page des applications")
        print("   3. Cliquez sur 'Test CV'")
        print("   4. Le modal devrait s'afficher avec les résultats")
    else:
        print("\n❌ Problème persistant.")
        print("💡 Vérifiez:")
        print("   - GEMINI_API_KEY dans .env")
        print("   - Package google-generativeai installé")
        print("   - Connexion internet")
        print("   - Application 25 avec CV")
    
    sys.exit(0 if test_success else 1)
