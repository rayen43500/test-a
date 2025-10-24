from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode
from rest_framework.parsers import MultiPartParser, FormParser
from datetime import datetime, timedelta
from django.utils import timezone
from decouple import config
import os
import logging
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential

from .serializers import (
    UserRegistrationSerializer, 
    UserLoginSerializer, 
    UserProfileSerializer,
    UserListSerializer,
    UserUpdateSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
    ProfilePictureUploadSerializer
)

User = get_user_model()

logger = logging.getLogger(__name__)

# -----------------------------
# Page d'accueil après login
# -----------------------------
@login_required
def home(request):
    return render(request, 'home.html', {'user': request.user})


# -----------------------------
# Permission admin personnalisée
# -----------------------------
class IsAdminUser(permissions.BasePermission):
    """Accès réservé aux admins"""
    def has_permission(self, request, view):
        print(f"🔐 Checking permissions for user: {request.user}")
        print(f"   - Authenticated: {request.user.is_authenticated}")
        print(f"   - Role: {getattr(request.user, 'role', 'N/A')}")
        print(f"   - is_admin: {getattr(request.user, 'is_admin', 'N/A')}")
        
        is_admin = request.user and request.user.is_authenticated and request.user.is_admin
        print(f"   - Permission granted: {is_admin}")
        return is_admin


class IsRecruiterUser(permissions.BasePermission):
    """Accès réservé aux recruteurs"""
    def has_permission(self, request, view):
        return (request.user and 
                request.user.is_authenticated and 
                getattr(request.user, 'role', '').lower() == 'recruteur')


# -----------------------------
# Enregistrement utilisateur
# -----------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Utilisateur enregistré avec succès',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'fullname': user.fullname,
                'role': user.role
            },
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -----------------------------
# Connexion utilisateur
# -----------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    serializer = UserLoginSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Connexion réussie',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'fullname': user.fullname,
                'role': user.role
            },
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -----------------------------
# Rafraîchir token
# -----------------------------
class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            return Response({
                'message': 'Token renouvelé avec succès',
                'access': response.data['access']
            })
        return response


# -----------------------------
# Profil utilisateur
# -----------------------------
class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        return Response({'message': 'Profil récupéré avec succès', 'user': response.data})

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        return Response({'message': 'Profil mis à jour avec succès', 'user': response.data})


# -----------------------------
# Upload photo de profil
# -----------------------------
class ProfilePictureUploadView(generics.UpdateAPIView):
    serializer_class = ProfilePictureUploadSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()

            photo_url = None
            if instance.photo_profile:
                photo_url = request.build_absolute_uri(instance.photo_profile.url)

            return Response({
                'message': 'Photo de profil mise à jour avec succès ✅',
                'photo_profile': photo_url,
                'user': {
                    'id': instance.id,
                    'fullname': instance.fullname,
                    'email': instance.email,
                    'photo_profile': photo_url
                }
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_profile_picture(request):
    user = request.user
    if not user.photo_profile:
        return Response({'message': 'Aucune photo à supprimer'}, status=status.HTTP_404_NOT_FOUND)

    try:
        user.photo_profile.delete(save=False)
        user.photo_profile = None
        user.save()
        return Response({'message': 'Photo supprimée avec succès'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile_picture(request):
    user = request.user
    photo_url = None
    if user.photo_profile:
        photo_url = request.build_absolute_uri(user.photo_profile.url)
    return Response({'photo_profile': photo_url}, status=status.HTTP_200_OK)


# -----------------------------
# Gestion utilisateurs (Admin)
# -----------------------------
class UserListView(generics.ListAPIView):
    queryset = User.objects.all().order_by('-id')
    serializer_class = UserListSerializer
    permission_classes = [IsAdminUser]
    
    def list(self, request, *args, **kwargs):
        print(f"\n{'='*50}")
        print(f"📊 UserListView called")
        print(f"   - User: {request.user}")
        print(f"   - Role: {request.user.role if hasattr(request.user, 'role') else 'N/A'}")
        print(f"   - Total users in DB: {User.objects.count()}")
        
        queryset = self.get_queryset()
        print(f"   - Users in queryset: {queryset.count()}")
        
        serializer = self.get_serializer(queryset, many=True)
        print(f"   - Serialized users: {len(serializer.data)}")
        print(f"{'='*50}\n")
        
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserManagementView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    permission_classes = [IsAdminUser]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return UserUpdateSerializer
        return UserListSerializer


# -----------------------------
# Réinitialisation mot de passe
# -----------------------------
class PasswordResetRequestView(generics.GenericAPIView):
    serializer_class = PasswordResetRequestSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(request)
        return Response({"message": "Email envoyé si l'adresse existe."}, status=status.HTTP_200_OK)


class PasswordResetConfirmView(generics.GenericAPIView):
    serializer_class = PasswordResetConfirmSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Mot de passe réinitialisé."}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password_confirm(request):
    uidb64 = request.data.get('uidb64')
    token = request.data.get('token')
    new_password = request.data.get('new_password')

    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return Response({"error": "Lien invalide"}, status=status.HTTP_400_BAD_REQUEST)

    if not default_token_generator.check_token(user, token):
        return Response({"error": "Token invalide ou expiré"}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.save()
    return Response({"success": "Mot de passe réinitialisé"}, status=status.HTTP_200_OK)


# ==========================================
# 🆕 GOOGLE CALENDAR - PLANIFICATION ENTRETIENS
# ==========================================

from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import os
from courses.models import Interview

def get_calendar_service():
    """
    Crée et retourne le service Google Calendar
    """
    token_path = os.path.join('accounts', 'google_credentials', 'token.json')
    
    if not os.path.exists(token_path):
        raise FileNotFoundError("Token Google Calendar non trouvé. Exécutez authorize.py d'abord.")
    
    creds = Credentials.from_authorized_user_file(token_path)
    service = build('calendar', 'v3', credentials=creds)
    return service


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_interview_event(request):
    """
    Crée un événement Google Calendar avec Google Meet pour un entretien
    
    Body attendu:
    {
        "candidat_id": 123,
        "candidat_email": "candidat@example.com",
        "candidat_nom": "Jean Dupont",
        "date": "2025-10-25",
        "heure": "14:00",
        "duree": 60,
        "titre": "Entretien final - Poste Développeur"
    }
    """
    # Vérifier que l'utilisateur est un recruteur (case-insensitive)
    if getattr(request.user, 'role', '').lower() != 'recruteur':
        return Response({
            'error': 'Seuls les recruteurs peuvent planifier des entretiens'
        }, status=status.HTTP_403_FORBIDDEN)
    
    # Récupérer les données
    candidat_email = request.data.get('candidat_email')
    candidat_nom = request.data.get('candidat_nom')
    date_str = request.data.get('date')  # Format: "2025-10-25"
    heure_str = request.data.get('heure')  # Format: "14:00"
    duree = request.data.get('duree', 60)  # Par défaut 60 minutes
    titre = request.data.get('titre', f"Entretien - {candidat_nom}")
    
    # Validation
    if not all([candidat_email, candidat_nom, date_str, heure_str]):
        return Response({
            'error': 'Tous les champs sont requis: candidat_email, candidat_nom, date, heure'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Parser la date et l'heure
        date_heure_str = f"{date_str} {heure_str}"
        start_time = datetime.strptime(date_heure_str, "%Y-%m-%d %H:%M")
        end_time = start_time + timedelta(minutes=int(duree))
        
        # Créer le service Calendar
        service = get_calendar_service()
        
        # Créer l'événement
        event = {
            'summary': titre,
            'description': f'Entretien avec {candidat_nom}\nRecruteur: {request.user.fullname}',
            'start': {
                'dateTime': start_time.isoformat(),
                'timeZone': 'Africa/Tunis',
            },
            'end': {
                'dateTime': end_time.isoformat(),
                'timeZone': 'Africa/Tunis',
            },
            'attendees': [
                {'email': candidat_email},
                {'email': request.user.email}
            ],
            'conferenceData': {
                'createRequest': {
                    'requestId': f"meet-{datetime.now().timestamp()}",
                    'conferenceSolutionKey': {'type': 'hangoutsMeet'}
                }
            },
            'reminders': {
                'useDefault': False,
                'overrides': [
                    {'method': 'email', 'minutes': 24 * 60},  # 1 jour avant
                    {'method': 'popup', 'minutes': 30},  # 30 min avant
                ],
            },
        }
        
        # Insérer l'événement avec Google Meet
        created_event = service.events().insert(
            calendarId='primary',
            body=event,
            conferenceDataVersion=1,
            sendUpdates='all'  # Envoie les invitations par email
        ).execute()
        
        return Response({
            'message': 'Entretien planifié avec succès ✅',
            'event': {
                'id': created_event['id'],
                'meet_link': created_event.get('hangoutLink'),
                'calendar_link': created_event.get('htmlLink'),
                'start': created_event['start']['dateTime'],
                'end': created_event['end']['dateTime'],
                'titre': titre,
                'candidat': candidat_nom
            }
        }, status=status.HTTP_201_CREATED)
        
    except ValueError as e:
        return Response({
            'error': f'Format de date/heure invalide: {str(e)}'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    except FileNotFoundError as e:
        return Response({
            'error': 'Configuration Google Calendar manquante. Contactez l\'administrateur.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    except HttpError as e:
        return Response({
            'error': f'Erreur Google Calendar: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    except Exception as e:
        return Response({
            'error': f'Erreur inattendue: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_upcoming_interviews(request):
    """
    Liste les prochains entretiens du recruteur
    """
    if getattr(request.user, 'role', '').lower() != 'recruteur':
        return Response({
            'error': 'Accessible uniquement aux recruteurs'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        # First, check interviews saved in the local DB for this recruiter
        now_dt = timezone.now()
        db_interviews_qs = Interview.objects.filter(scheduled_by=request.user, scheduled_date__gte=now_dt).order_by('scheduled_date')
        db_interviews = []
        logger.debug(f"Found {db_interviews_qs.count()} DB interviews for user={request.user}")
        for it in db_interviews_qs:
            # meeting_link and calendar_link are stored on the Interview model as meeting_link
            meeting_link = getattr(it, 'meeting_link', None)
            # build attendees list safely
            attendees = []
            try:
                if it.application and it.application.candidate and getattr(it.application.candidate, 'email', None):
                    attendees.append(it.application.candidate.email)
            except Exception:
                logger.exception("Failed to retrieve attendee email for interview id=%s", getattr(it, 'id', 'n/a'))

            db_interviews.append({
                'id': it.id,
                'titre': getattr(it.application.formation, 'title', str(it.application)),
                'start': it.scheduled_date.isoformat() if it.scheduled_date else None,
                'meet_link': meeting_link,
                'calendar_link': None,
                'attendees': attendees
            })

        if db_interviews:
            return Response({
                'message': 'Entretiens récupérés (depuis la base de données)',
                'count': len(db_interviews),
                'interviews': db_interviews
            }, status=status.HTTP_200_OK)

        service = get_calendar_service()
        
        # Obtenir les événements futurs
        now = datetime.utcnow().isoformat() + 'Z'
        events_result = service.events().list(
            calendarId='primary',
            timeMin=now,
            maxResults=20,
            singleEvents=True,
            orderBy='startTime'
        ).execute()
        
        events = events_result.get('items', [])
        
        interviews = []
        for event in events:
            interviews.append({
                'id': event['id'],
                'titre': event.get('summary', 'Sans titre'),
                'start': event['start'].get('dateTime', event['start'].get('date')),
                'meet_link': event.get('hangoutLink'),
                'calendar_link': event.get('htmlLink'),
                'attendees': [a.get('email') for a in event.get('attendees', [])]
            })
        
        return Response({
            'message': 'Entretiens récupérés',
            'count': len(interviews),
            'interviews': interviews
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'Erreur: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# =============================
# 🆕 AI Chat Proxy (Azure AI Inference via GitHub Models)
# =============================
from rest_framework.views import APIView
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential


class ChatAIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        token = config('GITHUB_TOKEN', default=None)
        if not token:
            return Response({'error': 'GITHUB_TOKEN is not configured on the server'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        messages_payload = request.data.get('messages', [])
        try:
            client = ChatCompletionsClient(
                endpoint="https://models.github.ai/inference",
                credential=AzureKeyCredential(token),
            )

            # Build conversation
            messages = [
                SystemMessage(
                    "Tu es un assistant carrière: tu aides à analyser les CV, proposer des formations pertinentes de notre plateforme, et informer sur les métiers du futur. Réponds en français, clair et concis."
                )
            ]
            for m in messages_payload:
                content = (m or {}).get('content', '')
                if content:
                    messages.append(UserMessage(content))

            response = client.complete(messages=messages, model="openai/gpt-5")
            return Response({'reply': response.choices[0].message.content})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def cancel_interview_event(request, event_id):
    """
    Annule un entretien (supprime l'événement Google Calendar)
    """
    if getattr(request.user, 'role', '').lower() != 'recruteur':
        return Response({
            'error': 'Seuls les recruteurs peuvent annuler des entretiens'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        service = get_calendar_service()
        
        # Supprimer l'événement
        service.events().delete(
            calendarId='primary',
            eventId=event_id,
            sendUpdates='all'  # Notifier les participants
        ).execute()
        
        return Response({
            'message': 'Entretien annulé avec succès'
        }, status=status.HTTP_200_OK)
        
    except HttpError as e:
        if e.resp.status == 404:
            return Response({
                'error': 'Événement non trouvé'
            }, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            'error': f'Erreur Google Calendar: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    except Exception as e:
        return Response({
            'error': f'Erreur: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_interview_event(request, event_id):
    """
    Modifie un entretien existant (date, heure, durée)
    
    Body:
    {
        "date": "2025-10-26",
        "heure": "15:00",
        "duree": 90
    }
    """
    if getattr(request.user, 'role', '').lower() != 'recruteur':
        return Response({
            'error': 'Seuls les recruteurs peuvent modifier des entretiens'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        service = get_calendar_service()
        
        # Récupérer l'événement existant
        event = service.events().get(calendarId='primary', eventId=event_id).execute()
        
        # Mettre à jour les champs si fournis
        if 'date' in request.data and 'heure' in request.data:
            date_str = request.data['date']
            heure_str = request.data['heure']
            duree = request.data.get('duree', 60)
            
            date_heure_str = f"{date_str} {heure_str}"
            start_time = datetime.strptime(date_heure_str, "%Y-%m-%d %H:%M")
            end_time = start_time + timedelta(minutes=int(duree))
            
            event['start'] = {
                'dateTime': start_time.isoformat(),
                'timeZone': 'Africa/Tunis'
            }
            event['end'] = {
                'dateTime': end_time.isoformat(),
                'timeZone': 'Africa/Tunis'
            }
        
        # Mettre à jour l'événement
        updated_event = service.events().update(
            calendarId='primary',
            eventId=event_id,
            body=event,
            sendUpdates='all'
        ).execute()
        
        return Response({
            'message': 'Entretien modifié avec succès',
            'event': {
                'id': updated_event['id'],
                'meet_link': updated_event.get('hangoutLink'),
                'start': updated_event['start']['dateTime']
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'Erreur: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)