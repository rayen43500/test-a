from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from courses.models import CourseApplication
import json

# Import conditionnel pour éviter les erreurs
try:
    from accounts.cv_analysis_service import CVAnalysisService
    CV_SERVICE_AVAILABLE = True
except ImportError as e:
    print(f"[TestCVAnalysis] CVAnalysisService non disponible: {e}")
    CV_SERVICE_AVAILABLE = False


class TestCVAnalysisView(APIView):
    permission_classes = []  # Temporairement sans authentification pour le test

    def post(self, request, application_id):
        """Test endpoint pour analyser un CV avec logs détaillés"""
        try:
            print(f"🧪 [TestCVAnalysis] Test d'analyse CV pour l'application {application_id}")
            print(f"👤 [TestCVAnalysis] User: {request.user.username if request.user else 'Anonymous'}")
            
            if not CV_SERVICE_AVAILABLE:
                print("❌ [TestCVAnalysis] CVAnalysisService non disponible")
                return Response({
                    "error": "CVAnalysisService not available",
                    "details": "Required dependencies not installed"
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            print("✅ [TestCVAnalysis] CVAnalysisService disponible")
            application = get_object_or_404(CourseApplication, id=application_id)
            
            print(f"📋 [TestCVAnalysis] Application: {application.id}")
            print(f"👤 [TestCVAnalysis] Candidat: {application.candidate.get_full_name()}")
            print(f"🎓 [TestCVAnalysis] Formation: {application.formation.title}")
            print(f"📄 [TestCVAnalysis] CV présent: {bool(application.cv)}")
            print(f"📝 [TestCVAnalysis] CV déjà analysé: {bool(application.cv_text)}")
            print(f"🎯 [TestCVAnalysis] Score actuel: {application.cv_score}")

            if not application.cv:
                return Response({
                    "error": "No CV file found for this application"
                }, status=status.HTTP_400_BAD_REQUEST)

            print("🚀 [TestCVAnalysis] Début de l'extraction du texte...")
            cv_text = CVAnalysisService.extract_text_from_pdf(application.cv)
            
            if not cv_text:
                return Response({
                    "error": "Failed to extract text from CV"
                }, status=status.HTTP_400_BAD_REQUEST)

            print(f"✅ [TestCVAnalysis] Texte extrait: {len(cv_text)} caractères")
            print(f"📄 [TestCVAnalysis] Aperçu du texte: {cv_text[:200]}...")

            job_description = f"Formation: {application.formation.title}\nDescription: {application.formation.description}"
            print(f"🎓 [TestCVAnalysis] Description du poste: {job_description}")

            print("🤖 [TestCVAnalysis] Appel à l'IA GitHub...")
            ai_result = CVAnalysisService.analyze_cv_with_ai(cv_text, job_description)
            
            print(f"📊 [TestCVAnalysis] Résultat brut de l'IA: {ai_result}")

            # Sauvegarder les résultats
            application.cv_text = cv_text
            
            try:
                if isinstance(ai_result, str):
                    analysis_data = json.loads(ai_result)
                else:
                    analysis_data = ai_result
                    
                cv_score = analysis_data.get('score', 0)
                print(f"🎯 [TestCVAnalysis] Score final: {cv_score}")
                
                application.cv_score = cv_score
                application.cv_analysis = analysis_data
            except (json.JSONDecodeError, TypeError) as e:
                print(f"❌ [TestCVAnalysis] Erreur parsing: {e}")
                application.cv_score = 0
                application.cv_analysis = {"error": "Failed to parse AI analysis"}
            
            application.save()
            print(f"💾 [TestCVAnalysis] Application sauvegardée")

            return Response({
                "message": "CV analysis completed successfully",
                "cv_score": application.cv_score,
                "cv_analysis": application.cv_analysis,
                "cv_text_preview": cv_text[:500] + "..." if len(cv_text) > 500 else cv_text
            })
            
        except Exception as e:
            print(f"💥 [TestCVAnalysis] Erreur: {str(e)}")
            return Response({
                "error": f"Error during CV analysis: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
