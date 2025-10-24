from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
import os
from decouple import config
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential
import logging

logger = logging.getLogger(__name__)


class ChatAIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Allow using Google Gemini API key as an alternative to the Git/Azure model
            gemini_key = config('GEMINI_API_KEY', default=None)
            gemini_model = config('GEMINI_MODEL', default='gemini-2.0-flash-exp')
            # Log the Gemini model being used
            logger.info("Using Gemini model: %s", gemini_model)

            # Vérifier que le token GitHub est configuré (fallback)
            github_token = config("GITHUB_TOKEN", default=None)
            if not github_token and not gemini_key:
                logger.error('Neither GITHUB_TOKEN nor GEMINI_API_KEY is configured for AI chat')
                return Response({
                    "error": "No AI API key configured (GITHUB_TOKEN or GEMINI_API_KEY required)"
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Allow overriding the Azure inference endpoint and model via env for easier local/dev testing
            ai_endpoint = config('AI_INFERENCE_ENDPOINT', default='https://models.github.ai/inference')
            model = config('AI_MODEL', default='openai/gpt-5')

            user_messages = request.data.get("messages", [])
            concise = bool(request.data.get('concise', False))

            # Build the system instruction and honor concise flag
            system_text = (
                "Tu es un assistant carrière spécialisé. Tu aides les candidats à : "
                "1) Analyser leur CV et identifier les points forts/faibles "
                "2) Proposer des formations pertinentes selon leur profil "
                "3) Éclairer sur les métiers du futur et les compétences demandées "
                "4) Donner des conseils pour améliorer leur employabilité. "
                "Réponds en français, sois précis et encourageant."
            )
            if concise:
                system_text = system_text + " Réponds uniquement à la question posée, de façon concise et sans poser de questions supplémentaires."

            messages = [SystemMessage(system_text)]

            # Ajouter les messages utilisateur
            for msg in user_messages:
                if msg.get("role") == "user":
                    messages.append(UserMessage(msg.get("content", "")))

            # If GEMINI_API_KEY is set, prefer calling Google's Generative API (Gemini)
            if gemini_key:
                try:
                    import google.generativeai as genai

                    # Configure the API key
                    genai.configure(api_key=gemini_key)

                    # Build a prompt for Gemini including system_text and user messages
                    prompt_parts = [system_text]
                    for msg in user_messages:
                        if msg.get('role') == 'user':
                            prompt_parts.append("Utilisateur: " + msg.get('content', ''))

                    prompt_text = "\n\n".join(prompt_parts)

                    # Log that we'll forward to Gemini
                    logger.info("Forwarding chat request to Gemini model: %s; incoming path: %s; remote addr: %s", gemini_model, request.path, request.META.get('REMOTE_ADDR'))

                    # Initialize the Gemini model and generate
                    gemini_model_instance = genai.GenerativeModel(gemini_model)
                    response = gemini_model_instance.generate_content(
                        prompt_text,
                        generation_config=genai.types.GenerationConfig(
                            temperature=0.2,
                            max_output_tokens=512,
                        )
                    )

                    reply_text = response.text if getattr(response, 'text', None) else "Désolé, je n'ai pas pu générer de réponse. Veuillez réessayer."
                    return Response({"reply": reply_text})

                except ImportError:
                    logger.error('google-generativeai package not installed')
                    return Response({
                        "error": "Gemini API package not installed"
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                except Exception as e:
                    logger.exception('Gemini API request failed: %s', str(e))
                    return Response({
                        "error": f"Erreur Gemini API: {str(e)}"
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Fallback to Azure/GitHub inference if github_token is available
            if github_token:
                try:
                    client = ChatCompletionsClient(
                        endpoint=ai_endpoint,
                        credential=AzureKeyCredential(github_token),
                    )

                    response = client.complete(
                        messages=messages,
                        model=model
                    )

                    reply_text = None
                    try:
                        reply_text = response.choices[0].message.content
                    except Exception:
                        reply_text = getattr(response, 'message', str(response))

                    return Response({"reply": reply_text})
                except Exception as e:
                    logger.exception('Azure AI fallback failed: %s', str(e))
                    return Response({
                        "error": f"Erreur Azure AI: {str(e)}"
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response({
                "error": "Aucune API IA configurée (GEMINI_API_KEY ou GITHUB_TOKEN requis)"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            # Log full exception for server-side diagnosis
            logger.exception('Exception in ChatAIView.post')
            return Response({
                "error": f"Erreur lors de la communication avec l'IA: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
