#!/usr/bin/env python
"""
Endpoint de test simple pour Gemini sans authentification
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)

# Import conditionnel pour éviter les erreurs
try:
    from accounts.gemini_cv_analysis import GeminiCVAnalysisService
    GEMINI_CV_SERVICE_AVAILABLE = True
except ImportError as e:
    logger.error(f"Gemini CV service not available: {e}")
    GEMINI_CV_SERVICE_AVAILABLE = False


class SimpleGeminiTestView(APIView):
    permission_classes = []  # Pas d'authentification requise

    def get(self, request):
        """Test simple de Gemini"""
        try:
            if not GEMINI_CV_SERVICE_AVAILABLE:
                return Response({
                    "error": "Gemini CV analysis service not available"
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            print("🧪 [SimpleGeminiTest] Test simple de Gemini...")
            
            # Initialiser le service
            service = GeminiCVAnalysisService()
            
            if not service.api_key:
                return Response({
                    "error": "Gemini API key not configured",
                    "status": "error"
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            print(f"✅ [SimpleGeminiTest] Service initialisé avec le modèle: {service.model_name}")

            # CV de test simple
            cv_text = """
            Marie Dupont
            Développeuse Python
            
            EXPÉRIENCE:
            - 3 ans Python/Django
            - Projets web full-stack
            - Bases de données PostgreSQL
            
            FORMATION:
            - Master Informatique
            - Certification Python
            
            COMPÉTENCES:
            - Python, Django, Flask
            - JavaScript, HTML, CSS
            - PostgreSQL, Git
            """
            
            job_description = "Formation Développement Web - Python, Django, bases de données"
            
            print("📄 [SimpleGeminiTest] CV de test créé")
            print("🎓 [SimpleGeminiTest] Description du poste créée")
            
            # Tester l'analyse
            print("🚀 [SimpleGeminiTest] Début de l'analyse...")
            result = service.analyze_cv_with_gemini(cv_text, job_description)
            
            print(f"📊 [SimpleGeminiTest] Résultat de l'analyse:")
            print(f"   Score: {result.get('score', 'N/A')}")
            print(f"   Erreur: {result.get('error', 'Aucune')}")
            
            if result.get('error'):
                return Response({
                    "error": result['error'],
                    "status": "error",
                    "gemini_model": service.model_name
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                return Response({
                    "message": "Gemini test successful",
                    "status": "success",
                    "cv_score": result.get('score', 0),
                    "cv_summary": result.get('summary', ''),
                    "cv_analysis": result.get('analysis', {}),
                    "gemini_model": service.model_name
                })
                
        except Exception as e:
            logger.error(f"Erreur dans SimpleGeminiTestView: {e}")
            return Response({
                "error": f"Internal server error: {str(e)}",
                "status": "error"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
