from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from courses.models import CourseApplication


class DebugTestView(APIView):
    permission_classes = []  # Pas d'authentification pour le debug

    def post(self, request, application_id):
        """Endpoint de debug simple"""
        try:
            print(f"[DebugTest] Test simple pour l'application {application_id}")
            
            # Vérifier que l'application existe
            application = get_object_or_404(CourseApplication, id=application_id)
            
            print(f"[DebugTest] Application trouvee: {application.id}")
            print(f"[DebugTest] Candidat: {application.candidate.get_full_name()}")
            print(f"[DebugTest] Formation: {application.formation.title}")
            print(f"[DebugTest] CV present: {bool(application.cv)}")
            print(f"[DebugTest] CV deja analyse: {bool(application.cv_text)}")
            print(f"[DebugTest] Score CV actuel: {application.cv_score}")
            
            # Retourner les informations de base
            return Response({
                "message": "Debug test successful",
                "application_id": application.id,
                "candidate_name": application.candidate.get_full_name(),
                "formation_title": application.formation.title,
                "has_cv": bool(application.cv),
                "cv_analyzed": bool(application.cv_text),
                "current_cv_score": application.cv_score,
                "cv_file_path": str(application.cv) if application.cv else None
            })
            
        except Exception as e:
            print(f"[DebugTest] Erreur: {str(e)}")
            return Response({
                "error": f"Debug test failed: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
