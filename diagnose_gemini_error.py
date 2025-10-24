#!/usr/bin/env python
"""
Script de diagnostic pour l'erreur Gemini
"""
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'user_management.settings')
django.setup()

def check_gemini_config():
    """Vérifier la configuration Gemini"""
    print("🔧 Vérification de la configuration Gemini...")
    
    try:
        from decouple import config
        
        api_key = config('GEMINI_API_KEY', default=None)
        model = config('GEMINI_MODEL', default='gemini-2.0-flash-exp')
        
        print(f"Clé API: {'✅ Configurée' if api_key else '❌ Manquante'}")
        print(f"Modèle: {model}")
        
        if api_key:
            print(f"Aperçu clé: {api_key[:10]}...{api_key[-5:]}")
        
        return bool(api_key)
        
    except Exception as e:
        print(f"❌ Erreur configuration: {e}")
        return False

def test_gemini_import():
    """Tester l'import de Gemini"""
    print("\n📦 Test d'import Gemini...")
    
    try:
        import google.generativeai as genai
        print("✅ google.generativeai importé avec succès")
        
        # Tester la configuration
        from decouple import config
        api_key = config('GEMINI_API_KEY', default=None)
        
        if api_key:
            genai.configure(api_key=api_key)
            print("✅ Configuration Gemini réussie")
            
            # Tester la création d'un modèle
            model = genai.GenerativeModel('gemini-2.0-flash-exp')
            print("✅ Modèle Gemini créé")
            
            return True
        else:
            print("❌ Clé API manquante")
            return False
            
    except ImportError as e:
        print(f"❌ Erreur import: {e}")
        return False
    except Exception as e:
        print(f"❌ Erreur configuration: {e}")
        return False

def test_cv_service():
    """Tester le service CV"""
    print("\n🔍 Test du service CV...")
    
    try:
        from accounts.gemini_cv_analysis import GeminiCVAnalysisService
        
        service = GeminiCVAnalysisService()
        print(f"✅ Service créé")
        print(f"   Clé API: {'✅' if service.api_key else '❌'}")
        print(f"   Modèle: {service.model_name}")
        
        if not service.api_key:
            print("❌ Clé API non configurée")
            return False
        
        if not service.model:
            print("❌ Modèle non initialisé")
            return False
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur service: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_application_exists():
    """Vérifier qu'une application existe"""
    print("\n📋 Vérification des applications...")
    
    try:
        from courses.models import CourseApplication
        
        # Chercher une application avec CV
        application = CourseApplication.objects.filter(cv__isnull=False).first()
        
        if application:
            print(f"✅ Application trouvée: {application.id}")
            print(f"   Candidat: {application.candidate.username}")
            print(f"   Formation: {application.formation.title}")
            print(f"   CV: {application.cv.name if application.cv else 'Aucun'}")
            return application.id
        else:
            print("❌ Aucune application avec CV trouvée")
            return None
            
    except Exception as e:
        print(f"❌ Erreur applications: {e}")
        return None

def test_gemini_analysis(application_id):
    """Tester l'analyse Gemini"""
    print(f"\n🧪 Test d'analyse pour l'application {application_id}...")
    
    try:
        from accounts.gemini_cv_analysis import GeminiCVAnalysisService
        from courses.models import CourseApplication
        
        application = CourseApplication.objects.get(id=application_id)
        
        service = GeminiCVAnalysisService()
        
        # Préparer la description du poste
        job_description = f"""
        Formation: {application.formation.title}
        Description: {application.formation.description}
        Instructeur: {application.formation.instructor.get_full_name()}
        """
        
        print(f"📝 Description du poste: {job_description[:100]}...")
        
        # Tester l'analyse
        result = service.process_cv_application(application.cv, job_description)
        
        print(f"📊 Résultat:")
        print(f"   Erreur: {result.get('error', 'Aucune')}")
        print(f"   Score: {result.get('cv_score', 'N/A')}")
        print(f"   Résumé: {result.get('cv_summary', 'N/A')[:50]}...")
        
        if result.get('error'):
            print(f"❌ Erreur détaillée: {result['error']}")
            return False
        else:
            print("✅ Analyse réussie")
            return True
            
    except Exception as e:
        print(f"❌ Erreur analyse: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("🚀 Diagnostic de l'erreur Gemini...")
    
    config_ok = check_gemini_config()
    import_ok = test_gemini_import()
    service_ok = test_cv_service()
    app_id = test_application_exists()
    analysis_ok = test_gemini_analysis(app_id) if app_id else False
    
    print(f"\n📊 Résultats du diagnostic:")
    print(f"Configuration: {'✅' if config_ok else '❌'}")
    print(f"Import Gemini: {'✅' if import_ok else '❌'}")
    print(f"Service CV: {'✅' if service_ok else '❌'}")
    print(f"Application: {'✅' if app_id else '❌'}")
    print(f"Analyse: {'✅' if analysis_ok else '❌'}")
    
    if not config_ok:
        print("\n💡 Solution: Vérifiez que GEMINI_API_KEY est configurée dans .env")
    elif not import_ok:
        print("\n💡 Solution: Installez google-generativeai avec: pip install google-generativeai")
    elif not service_ok:
        print("\n💡 Solution: Vérifiez la configuration du service")
    elif not app_id:
        print("\n💡 Solution: Créez une application avec un CV")
    elif not analysis_ok:
        print("\n💡 Solution: Vérifiez les logs pour l'erreur spécifique")
    
    sys.exit(0 if (config_ok and import_ok and service_ok and app_id and analysis_ok) else 1)
