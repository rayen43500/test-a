from google_auth_oauthlib.flow import InstalledAppFlow
import os

def google_auth():
    SCOPES = ['https://www.googleapis.com/auth/calendar']
    credentials_path = os.path.join('accounts', 'google_credentials', 'credentials.json')
    token_path = os.path.join('accounts', 'google_credentials', 'token.json')

    flow = InstalledAppFlow.from_client_secrets_file(
        credentials_path,
        scopes=SCOPES
    )

    # Lancer le serveur local sur le port 8000
    creds = flow.run_local_server(port=8000)

    # Sauvegarder le token
    with open(token_path, 'w') as token_file:
        token_file.write(creds.to_json())

    print("✅ Authentification réussie, token enregistré dans token.json")

if __name__ == "__main__":
    google_auth()
