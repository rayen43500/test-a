#!/usr/bin/env python
"""
Vue de debug pour Gemini
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)

class DebugGeminiView(APIView):
    permission_classes = []  # Pas d'authentification requise

    def get(self, request):
        """Debug complet de Gemini"""
        debug_info = {
            "step": "Configuration",
            "success": False,
            "details": {},
            "errors": []
        }
        
        try:
            # Étape 1: Configuration
            from decouple import config
            api_key = config('GEMINI_API_KEY', default=None)
            model_name = config('GEMINI_MODEL', default='gemini-2.0-flash-exp')
            
            debug_info["details"]["api_key_configured"] = bool(api_key)
            debug_info["details"]["model_name"] = model_name
            
            if not api_key:
                debug_info["errors"].append("GEMINI_API_KEY not configured")
                return Response(debug_info, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            debug_info["step"] = "Import"
            
            # Étape 2: Import
            try:
                import google.generativeai as genai
                debug_info["details"]["import_success"] = True
            except ImportError as e:
                debug_info["errors"].append(f"Import error: {str(e)}")
                return Response(debug_info, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            debug_info["step"] = "Configuration"
            
            # Étape 3: Configuration Gemini
            try:
                genai.configure(api_key=api_key)
                model = genai.GenerativeModel(model_name)
                debug_info["details"]["gemini_configured"] = True
            except Exception as e:
                debug_info["errors"].append(f"Gemini configuration error: {str(e)}")
                return Response(debug_info, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            debug_info["step"] = "Test"
            
            # Étape 4: Test simple
            try:
                response = model.generate_content("Test simple - réponds 'OK'")
                debug_info["details"]["test_response"] = response.text if response.text else "No response"
                debug_info["details"]["test_success"] = bool(response.text)
            except Exception as e:
                debug_info["errors"].append(f"Test error: {str(e)}")
                return Response(debug_info, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            debug_info["step"] = "Service"
            
            # Étape 5: Test service CV
            try:
                from accounts.gemini_cv_analysis import GeminiCVAnalysisService
                service = GeminiCVAnalysisService()
                debug_info["details"]["service_created"] = True
                debug_info["details"]["service_has_api_key"] = bool(service.api_key)
                debug_info["details"]["service_has_model"] = bool(service.model)
            except Exception as e:
                debug_info["errors"].append(f"Service error: {str(e)}")
                return Response(debug_info, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            debug_info["step"] = "Application"
            
            # Étape 6: Test application
            try:
                from courses.models import CourseApplication
                app = CourseApplication.objects.filter(cv__isnull=False).first()
                if app:
                    debug_info["details"]["application_found"] = True
                    debug_info["details"]["application_id"] = app.id
                    debug_info["details"]["has_cv"] = bool(app.cv)
                else:
                    debug_info["errors"].append("No application with CV found")
                    return Response(debug_info, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            except Exception as e:
                debug_info["errors"].append(f"Application error: {str(e)}")
                return Response(debug_info, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            debug_info["step"] = "CV Analysis"
            
            # Étape 7: Test analyse CV
            try:
                cv_text = service.extract_text_from_pdf(app.cv)
                debug_info["details"]["cv_text_extracted"] = bool(cv_text)
                debug_info["details"]["cv_text_length"] = len(cv_text) if cv_text else 0
                
                if cv_text:
                    job_desc = f"Formation: {app.formation.title}"
                    result = service.analyze_cv_with_gemini(cv_text, job_desc)
                    debug_info["details"]["analysis_result"] = result
                    debug_info["details"]["analysis_success"] = not bool(result.get('error'))
                else:
                    debug_info["errors"].append("Could not extract CV text")
                    return Response(debug_info, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                    
            except Exception as e:
                debug_info["errors"].append(f"CV analysis error: {str(e)}")
                return Response(debug_info, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            debug_info["step"] = "Complete"
            debug_info["success"] = True
            
            return Response(debug_info)
            
        except Exception as e:
            debug_info["errors"].append(f"Unexpected error: {str(e)}")
            import traceback
            debug_info["details"]["traceback"] = traceback.format_exc()
            return Response(debug_info, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
