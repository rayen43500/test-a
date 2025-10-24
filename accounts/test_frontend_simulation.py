#!/usr/bin/env python
"""
Simulation de l'appel frontend pour tester Gemini
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)

class TestFrontendSimulationView(APIView):
    permission_classes = []  # Pas d'authentification requise

    def post(self, request, application_id):
        """Simulation exacte de l'appel frontend"""
        try:
            print(f"🧪 [FrontendSimulation] Test pour l'application {application_id}")
            
            # Import du service
            try:
                from accounts.gemini_cv_analysis import GeminiCVAnalysisService
                service = GeminiCVAnalysisService()
                print("✅ Service importé")
            except Exception as e:
                print(f"❌ Erreur import service: {e}")
                return Response({
                    "error": f"Service import error: {str(e)}",
                    "success": False,
                    "application_id": application_id,
                    "cv_score": 0,
                    "cv_analysis": {},
                    "cv_summary": "Erreur d'import",
                    "gemini_model": "N/A"
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            # Vérifier la configuration
            if not service.api_key:
                print("❌ Clé API manquante")
                return Response({
                    "error": "GEMINI_API_KEY not configured",
                    "success": False,
                    "application_id": application_id,
                    "cv_score": 0,
                    "cv_analysis": {},
                    "cv_summary": "Clé API manquante",
                    "gemini_model": "N/A"
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            if not service.model:
                print("❌ Modèle non initialisé")
                return Response({
                    "error": "Gemini model not initialized",
                    "success": False,
                    "application_id": application_id,
                    "cv_score": 0,
                    "cv_analysis": {},
                    "cv_summary": "Modèle non initialisé",
                    "gemini_model": "N/A"
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            print("✅ Configuration OK")
            
            # Récupérer l'application
            try:
                from courses.models import CourseApplication
                application = CourseApplication.objects.get(id=application_id)
                print(f"✅ Application trouvée: {application.id}")
                print(f"   Candidat: {application.candidate.username}")
                print(f"   Formation: {application.formation.title}")
                print(f"   CV: {application.cv.name if application.cv else 'Aucun'}")
            except CourseApplication.DoesNotExist:
                print("❌ Application non trouvée")
                return Response({
                    "error": f"Application {application_id} not found",
                    "success": False,
                    "application_id": application_id,
                    "cv_score": 0,
                    "cv_analysis": {},
                    "cv_summary": "Application non trouvée",
                    "gemini_model": "N/A"
                }, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                print(f"❌ Erreur récupération application: {e}")
                return Response({
                    "error": f"Application retrieval error: {str(e)}",
                    "success": False,
                    "application_id": application_id,
                    "cv_score": 0,
                    "cv_analysis": {},
                    "cv_summary": "Erreur récupération application",
                    "gemini_model": "N/A"
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            # Vérifier le CV
            if not application.cv:
                print("❌ Application sans CV")
                return Response({
                    "error": "No CV file found for this application",
                    "success": False,
                    "application_id": application_id,
                    "cv_score": 0,
                    "cv_analysis": {},
                    "cv_summary": "Aucun CV trouvé",
                    "gemini_model": "N/A"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            print("✅ CV trouvé")
            
            # Extraire le texte du CV
            try:
                cv_text = service.extract_text_from_pdf(application.cv)
                if not cv_text:
                    print("❌ Impossible d'extraire le texte")
                    return Response({
                        "error": "Failed to extract text from CV",
                        "success": False,
                        "application_id": application_id,
                        "cv_score": 0,
                        "cv_analysis": {},
                        "cv_summary": "Impossible d'extraire le texte",
                        "gemini_model": service.model_name
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                print(f"✅ Texte extrait: {len(cv_text)} caractères")
                
            except Exception as e:
                print(f"❌ Erreur extraction: {e}")
                import traceback
                traceback.print_exc()
                return Response({
                    "error": f"CV text extraction error: {str(e)}",
                    "success": False,
                    "application_id": application_id,
                    "cv_score": 0,
                    "cv_analysis": {},
                    "cv_summary": "Erreur extraction texte",
                    "gemini_model": service.model_name
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            # Préparer la description du poste
            job_description = f"""
            Formation: {application.formation.title}
            Description: {application.formation.description}
            Instructeur: {application.formation.instructor.get_full_name()}
            """
            
            print(f"✅ Description du poste préparée")
            
            # Analyser avec Gemini
            try:
                print("🚀 Début de l'analyse Gemini...")
                result = service.analyze_cv_with_gemini(cv_text, job_description)
                
                print(f"📊 Résultat de l'analyse:")
                print(f"   Erreur: {result.get('error', 'Aucune')}")
                print(f"   Score: {result.get('score', 'N/A')}")
                print(f"   Résumé: {result.get('summary', 'N/A')[:100]}...")
                
                if result.get('error'):
                    print(f"❌ Erreur dans l'analyse: {result['error']}")
                    return Response({
                        "error": f"Gemini analysis error: {result['error']}",
                        "success": False,
                        "application_id": application_id,
                        "cv_score": 0,
                        "cv_analysis": {},
                        "cv_summary": "Erreur analyse Gemini",
                        "gemini_model": service.model_name
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
                print("✅ Analyse Gemini réussie")
                
            except Exception as e:
                print(f"❌ Erreur analyse Gemini: {e}")
                import traceback
                traceback.print_exc()
                return Response({
                    "error": f"Gemini analysis exception: {str(e)}",
                    "success": False,
                    "application_id": application_id,
                    "cv_score": 0,
                    "cv_analysis": {},
                    "cv_summary": "Exception analyse Gemini",
                    "gemini_model": service.model_name
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            # Sauvegarder les résultats
            try:
                application.cv_text = cv_text
                application.cv_score = result.get('score', 0)
                application.cv_analysis = result.get('analysis', {})
                application.cv_resume = result.get('summary', '')
                application.save()
                
                print("✅ Résultats sauvegardés")
                
            except Exception as e:
                print(f"⚠️ Erreur sauvegarde: {e}")
                # Continue même si la sauvegarde échoue
            
            # Retourner la réponse
            response_data = {
                "message": "CV analyzed successfully with Gemini",
                "success": True,
                "application_id": application_id,
                "formation_title": application.formation.title,
                "candidate_name": application.candidate.get_full_name(),
                "cv_score": result.get('score', 0),
                "cv_analysis": result.get('analysis', {}),
                "cv_summary": result.get('summary', ''),
                "cv_text_preview": cv_text[:500] + "..." if len(cv_text) > 500 else cv_text,
                "gemini_model": service.model_name
            }
            
            print("✅ Réponse préparée")
            return Response(response_data, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"❌ Erreur générale: {e}")
            import traceback
            traceback.print_exc()
            return Response({
                "error": f"Unexpected error: {str(e)}",
                "success": False,
                "application_id": application_id,
                "cv_score": 0,
                "cv_analysis": {},
                "cv_summary": "Erreur inattendue",
                "gemini_model": "N/A"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
