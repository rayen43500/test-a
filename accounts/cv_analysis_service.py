import os
import PyPDF2
import io
from decouple import config
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential


class CVAnalysisService:
    @staticmethod
    def extract_text_from_pdf(pdf_file):
        """Extrait le texte d'un fichier PDF"""
        try:
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            return text.strip()
        except Exception as e:
            print(f"Erreur extraction PDF: {e}")
            return None

    @staticmethod
    def analyze_cv_with_ai(cv_text, job_description=""):
        """Analyse le CV avec l'IA et retourne un score"""
        try:
            github_token = config("GITHUB_TOKEN", default=None)
            if not github_token:
                print("❌ [CV Analysis] GITHUB_TOKEN not configured")
                return {"error": "GITHUB_TOKEN not configured"}

            print("🤖 [CV Analysis] Initialisation du client Azure AI Inference...")
            client = ChatCompletionsClient(
                endpoint="https://models.github.ai/inference",
                credential=AzureKeyCredential(github_token),
            )
            
            model = "openai/gpt-5"
            print(f"🎯 [CV Analysis] Utilisation du modèle: {model}")
            
            system_prompt = """Tu es un expert RH spécialisé dans l'évaluation de CV. 
            Analyse le CV fourni et donne un score sur 100 basé sur:
            1. Expérience professionnelle (30 points)
            2. Formation et compétences (25 points) 
            3. Structure et clarté du CV (20 points)
            4. Pertinence pour le poste (15 points)
            5. Réalisations et projets (10 points)
            
            Réponds UNIQUEMENT avec un JSON contenant:
            {
                "score": [score sur 100],
                "analysis": "[analyse détaillée en français]",
                "strengths": ["point fort 1", "point fort 2"],
                "weaknesses": ["point faible 1", "point faible 2"],
                "recommendations": ["recommandation 1", "recommandation 2"]
            }"""

            user_message = f"CV à analyser:\n\n{cv_text}\n\nDescription du poste:\n{job_description}"
            
            print("📤 [CV Analysis] Messages envoyés à l'IA:")
            print("=" * 50)
            print("🔧 SYSTEM PROMPT:")
            print(system_prompt)
            print("=" * 50)
            print("👤 USER MESSAGE:")
            print(user_message[:500] + "..." if len(user_message) > 500 else user_message)
            print("=" * 50)

            messages = [
                SystemMessage(system_prompt),
                UserMessage(user_message)
            ]
            
            print("🚀 [CV Analysis] Appel à l'API Azure AI Inference...")
            response = client.complete(messages=messages, model=model)
            
            print("✅ [CV Analysis] Réponse reçue de l'IA:")
            print("=" * 50)
            print(response.choices[0].message.content)
            print("=" * 50)
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"❌ [CV Analysis] Erreur lors de l'analyse IA: {str(e)}")
            return {"error": f"Erreur analyse IA: {str(e)}"}

    @staticmethod
    def process_cv_application(cv_file, job_description=""):
        """Traite une candidature CV complète"""
        # Extraire le texte
        cv_text = CVAnalysisService.extract_text_from_pdf(cv_file)
        if not cv_text:
            return {"error": "Impossible d'extraire le texte du CV"}
        
        # Analyser avec l'IA
        ai_result = CVAnalysisService.analyze_cv_with_ai(cv_text, job_description)
        
        return {
            "cv_text": cv_text,
            "ai_analysis": ai_result
        }
