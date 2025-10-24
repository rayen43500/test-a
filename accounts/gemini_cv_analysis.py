#!/usr/bin/env python
"""
Service d'analyse de CV utilisant Google Gemini
"""
import os
import PyPDF2
import io
import json
from decouple import config
import google.generativeai as genai
import logging

logger = logging.getLogger(__name__)

class GeminiCVAnalysisService:
    def __init__(self):
        self.api_key = config('GEMINI_API_KEY', default=None)
        self.model_name = config('GEMINI_MODEL', default='gemini-2.0-flash-exp')
        
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel(self.model_name)
        else:
            self.model = None
            logger.warning("GEMINI_API_KEY not configured")

    def extract_text_from_pdf(self, pdf_file):
        """Extrait le texte d'un fichier PDF"""
        try:
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            return text.strip()
        except Exception as e:
            logger.error(f"Erreur extraction PDF: {e}")
            return None

    def analyze_cv_with_gemini(self, cv_text, job_description=""):
        """Analyse un CV avec Gemini et retourne un score et une analyse détaillée"""
        if not self.model:
            return {
                "error": "Gemini API not configured",
                "score": 0,
                "analysis": "Service non disponible"
            }

        try:
            # Prompt pour l'analyse de CV
            system_prompt = """Tu es un expert en recrutement et analyse de CV. 
            Ton rôle est d'analyser un CV par rapport à une offre d'emploi/formation et de donner un score de 0 à 100.
            
            Tu dois retourner une réponse JSON avec cette structure exacte :
            {
                "score": 85,
                "analysis": {
                    "strengths": ["Point fort 1", "Point fort 2"],
                    "weaknesses": ["Point faible 1", "Point faible 2"],
                    "recommendations": ["Recommandation 1", "Recommandation 2"],
                    "match_percentage": 85,
                    "missing_skills": ["Compétence manquante 1"],
                    "excellent_skills": ["Compétence excellente 1"]
                },
                "summary": "Résumé de l'analyse en 2-3 phrases",
                "resume": "Résumé du CV en 3-4 phrases"
            }
            
            Analyse le CV de manière objective et professionnelle."""

            user_prompt = f"""
            CV à analyser :
            {cv_text}
            
            Offre d'emploi/Formation :
            {job_description}
            
            Analyse ce CV et donne un score de 0 à 100 basé sur :
            1. Pertinence des compétences par rapport au poste
            2. Expérience professionnelle
            3. Formation et certifications
            4. Qualité de la présentation
            5. Potentiel de développement
            
            Retourne uniquement le JSON, sans texte supplémentaire.
            """

            # Appel à Gemini
            response = self.model.generate_content(
                f"{system_prompt}\n\n{user_prompt}",
                generation_config=genai.types.GenerationConfig(
                    temperature=0.3,
                    max_output_tokens=2048,
                )
            )

            if response.text:
                # Nettoyer la réponse pour extraire le JSON
                response_text = response.text.strip()
                
                # Chercher le JSON dans la réponse
                if response_text.startswith('```json'):
                    response_text = response_text[7:]
                if response_text.endswith('```'):
                    response_text = response_text[:-3]
                
                # Parser le JSON
                try:
                    analysis_data = json.loads(response_text)
                    
                    # Valider la structure
                    if 'score' not in analysis_data:
                        analysis_data['score'] = 0
                    if 'analysis' not in analysis_data:
                        analysis_data['analysis'] = {}
                    if 'summary' not in analysis_data:
                        analysis_data['summary'] = "Analyse effectuée"
                    if 'resume' not in analysis_data:
                        analysis_data['resume'] = "Résumé du CV"
                    
                    # S'assurer que le score est entre 0 et 100
                    analysis_data['score'] = max(0, min(100, int(analysis_data['score'])))
                    
                    return analysis_data
                    
                except json.JSONDecodeError as e:
                    logger.error(f"Erreur parsing JSON Gemini: {e}")
                    return {
                        "error": "Failed to parse Gemini response",
                        "score": 0,
                        "analysis": {"error": "Réponse invalide de l'IA"},
                        "summary": "Erreur d'analyse",
                        "resume": "Impossible d'analyser le CV"
                    }
            else:
                return {
                    "error": "Empty response from Gemini",
                    "score": 0,
                    "analysis": {"error": "Réponse vide de l'IA"},
                    "summary": "Erreur d'analyse",
                    "resume": "Impossible d'analyser le CV"
                }

        except Exception as e:
            logger.error(f"Erreur analyse Gemini: {e}")
            import traceback
            traceback.print_exc()
            return {
                "error": f"Gemini analysis failed: {str(e)}",
                "score": 0,
                "analysis": {"error": f"Erreur: {str(e)}"},
                "summary": "Erreur d'analyse",
                "resume": "Impossible d'analyser le CV"
            }

    def process_cv_application(self, cv_file, job_description=""):
        """Traite une candidature CV complète avec Gemini"""
        # Extraire le texte
        cv_text = self.extract_text_from_pdf(cv_file)
        if not cv_text:
            return {
                "error": "Impossible d'extraire le texte du CV",
                "score": 0,
                "analysis": {"error": "Extraction PDF échouée"},
                "summary": "Erreur d'extraction",
                "resume": "Impossible d'extraire le texte"
            }
        
        # Analyser avec Gemini
        ai_result = self.analyze_cv_with_gemini(cv_text, job_description)
        
        return {
            "cv_text": cv_text,
            "cv_score": ai_result.get('score', 0),
            "cv_analysis": ai_result.get('analysis', {}),
            "cv_summary": ai_result.get('summary', ''),
            "cv_resume": ai_result.get('resume', ''),
            "ai_result": ai_result
        }
