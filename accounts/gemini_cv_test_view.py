#!/usr/bin/env python
"""
Vue de test pour l'analyse de CV avec Gemini
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from courses.models import CourseApplication
import json
import logging

logger = logging.getLogger(__name__)

# Import conditionnel pour éviter les erreurs
try:
    from accounts.gemini_cv_analysis import GeminiCVAnalysisService
    GEMINI_CV_SERVICE_AVAILABLE = True
except ImportError as e:
    logger.error(f"Gemini CV service not available: {e}")
    GEMINI_CV_SERVICE_AVAILABLE = False


class GeminiCVTestView(APIView):
    permission_classes = []  # Temporairement sans authentification pour le test

    def post(self, request, application_id):
        """Test endpoint pour analyser un CV avec Gemini"""
        try:
            if not GEMINI_CV_SERVICE_AVAILABLE:
                return Response({
                    "error": "Gemini CV analysis service not available",
                    "success": False,
                    "application_id": application_id,
                    "cv_score": 0,
                    "cv_analysis": {},
                    "cv_summary": "Service non disponible",
                    "gemini_model": "N/A"
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            print(f"🧪 [GeminiCVTest] Test d'analyse CV pour l'application {application_id}")
            
            # Récupérer l'application
            application = get_object_or_404(CourseApplication, id=application_id)
            print(f"📋 [GeminiCVTest] Application trouvée: {application.id}")
            print(f"👤 [GeminiCVTest] Candidat: {application.candidate.username}")
            print(f"🎓 [GeminiCVTest] Formation: {application.formation.title}")
            
            # Vérifier l'authentification si disponible
            if hasattr(request, 'user') and request.user.is_authenticated:
                print(f"🔐 [GeminiCVTest] Utilisateur authentifié: {request.user.username}")
            else:
                print(f"⚠️ [GeminiCVTest] Aucune authentification - mode test")

            # Vérifier que l'application a un CV
            if not application.cv:
                return Response({
                    "error": "No CV file found for this application"
                }, status=status.HTTP_400_BAD_REQUEST)

            print(f"📄 [GeminiCVTest] CV trouvé: {application.cv.name}")

            # Initialiser le service Gemini
            cv_service = GeminiCVAnalysisService()
            
            # Vérifier la configuration
            if not cv_service.api_key:
                return Response({
                    "error": "Gemini API key not configured"
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            print(f"🔑 [GeminiCVTest] Clé API Gemini configurée")
            print(f"🤖 [GeminiCVTest] Modèle: {cv_service.model_name}")

            # Préparer la description du poste
            job_description = f"""
            Formation: {application.formation.title}
            Description: {application.formation.description}
            Instructeur: {application.formation.instructor.get_full_name()}
            """
            
            print(f"📝 [GeminiCVTest] Description du poste: {job_description}")

            # Analyser le CV
            print("🚀 [GeminiCVTest] Début de l'analyse avec Gemini...")
            result = cv_service.process_cv_application(application.cv, job_description)
            
            print(f"📊 [GeminiCVTest] Résultat de l'analyse:")
            print(f"   Score: {result.get('cv_score', 'N/A')}")
            print(f"   Erreur: {result.get('error', 'Aucune')}")
            print(f"   Résumé: {result.get('cv_summary', 'N/A')[:100]}...")

            # Sauvegarder les résultats dans l'application
            if not result.get('error'):
                application.cv_text = result.get('cv_text', '')
                application.cv_score = result.get('cv_score', 0)
                application.cv_resume = result.get('cv_resume', '')
                application.cv_analysis = result.get('cv_analysis', {})
                application.save()
                
                print(f"💾 [GeminiCVTest] Application mise à jour avec les résultats")
            else:
                print(f"❌ [GeminiCVTest] Erreur lors de l'analyse: {result.get('error')}")

            return Response({
                "message": "CV analysis completed with Gemini",
                "success": not bool(result.get('error')),
                "cv_score": result.get('cv_score', 0),
                "cv_analysis": result.get('cv_analysis', {}),
                "cv_summary": result.get('cv_summary', ''),
                "cv_resume": result.get('cv_resume', ''),
                "cv_text_preview": result.get('cv_text', '')[:500] + "..." if len(result.get('cv_text', '')) > 500 else result.get('cv_text', ''),
                "error": result.get('error'),
                "gemini_model": cv_service.model_name
            })
            
        except Exception as e:
            logger.error(f"Erreur dans GeminiCVTestView: {e}")
            import traceback
            traceback.print_exc()
            return Response({
                "error": f"Internal server error: {str(e)}",
                "success": False,
                "application_id": application_id,
                "cv_score": 0,
                "cv_analysis": {},
                "cv_summary": "Erreur lors de l'analyse",
                "gemini_model": "N/A"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request, application_id):
        """Récupérer les résultats d'analyse existants"""
        try:
            application = get_object_or_404(CourseApplication, id=application_id)
            
            return Response({
                "application_id": application.id,
                "has_cv": bool(application.cv),
                "cv_score": application.cv_score,
                "cv_analysis": application.cv_analysis,
                "cv_resume": application.cv_resume,
                "cv_text_preview": application.cv_text[:500] + "..." if application.cv_text and len(application.cv_text) > 500 else application.cv_text,
                "has_analysis": bool(application.cv_analysis),
                "formation_title": application.formation.title,
                "candidate_name": application.candidate.get_full_name()
            })
            
        except Exception as e:
            logger.error(f"Erreur dans GeminiCVTestView GET: {e}")
            return Response({
                "error": f"Internal server error: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
