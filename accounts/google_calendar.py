from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from datetime import datetime, timedelta
import os

def create_meet_event(title, start_time, duration_minutes, attendee_emails):
    """
    Crée un événement Google Calendar avec Google Meet
    """
    token_path = os.path.join('accounts', 'google_credentials', 'token.json')
    
    # Charger les credentials
    creds = Credentials.from_authorized_user_file(token_path)
    
    # Créer le service Calendar
    service = build('calendar', 'v3', credentials=creds)
    
    # Calculer l'heure de fin
    end_time = start_time + timedelta(minutes=duration_minutes)
    
    # Créer l'événement
    event = {
        'summary': title,
        'start': {
            'dateTime': start_time.isoformat(),
            'timeZone': 'Africa/Tunis',
        },
        'end': {
            'dateTime': end_time.isoformat(),
            'timeZone': 'Africa/Tunis',
        },
        'attendees': [{'email': email} for email in attendee_emails],
        'conferenceData': {
            'createRequest': {
                'requestId': f"meet-{datetime.now().timestamp()}",
                'conferenceSolutionKey': {'type': 'hangoutsMeet'}
            }
        },
    }
    
    # Créer l'événement avec Google Meet
    event = service.events().insert(
        calendarId='primary',
        body=event,
        conferenceDataVersion=1,
        sendUpdates='all'
    ).execute()
    
    return {
        'event_id': event['id'],
        'meet_link': event.get('hangoutLink'),
        'html_link': event.get('htmlLink')
    }