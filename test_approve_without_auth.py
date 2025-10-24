#!/usr/bin/env python
"""
Test des endpoints d'approbation sans authentification
"""
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'user_management.settings')
django.setup()

def test_approve_without_auth():
    """Test de l'endpoint d'approbation sans authentification"""
    print("🧪 Test de l'endpoint d'approbation sans authentification...")
    
    try:
        from django.test import RequestFactory
        from accounts.application_views import ApproveApplicationView
        from courses.models import CourseApplication
        
        # Trouver une application en attente
        app = CourseApplication.objects.filter(status='pending').first()
        
        if not app:
            print("❌ Aucune application en attente trouvée")
            return False
        
        print(f"✅ Application trouvée: {app.id}")
        print(f"   Candidat: {app.candidate.username}")
        print(f"   Formation: {app.formation.title}")
        print(f"   Statut actuel: {app.status}")
        
        # Créer une requête simulée sans authentification
        factory = RequestFactory()
        request = factory.post(f'/api/applications/{app.id}/approve/')
        # Pas de request.user - pas d'authentification
        
        # Tester la vue
        view = ApproveApplicationView()
        response = view.post(request, app.id)
        
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.data
            print(f"✅ Approbation réussie")
            print(f"   Message: {data.get('message', 'N/A')}")
            print(f"   Application ID: {data.get('application', {}).get('id', 'N/A')}")
            
            # Vérifier que l'application est bien approuvée
            app.refresh_from_db()
            if app.status == 'approved':
                print("✅ Application approuvée en base")
                print(f"   Revisé par: {app.reviewed_by.username if app.reviewed_by else 'N/A'}")
            else:
                print(f"❌ Application non approuvée: {app.status}")
            
            return True
        else:
            print(f"❌ Erreur: {response.data}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_reject_without_auth():
    """Test de l'endpoint de rejet sans authentification"""
    print("\n🧪 Test de l'endpoint de rejet sans authentification...")
    
    try:
        from django.test import RequestFactory
        from accounts.application_views import RejectApplicationView
        from courses.models import CourseApplication
        
        # Trouver une application en attente
        app = CourseApplication.objects.filter(status='pending').first()
        
        if not app:
            print("❌ Aucune application en attente trouvée")
            return False
        
        print(f"✅ Application trouvée: {app.id}")
        print(f"   Candidat: {app.candidate.username}")
        print(f"   Formation: {app.formation.title}")
        print(f"   Statut actuel: {app.status}")
        
        # Créer une requête simulée sans authentification
        factory = RequestFactory()
        request = factory.post(f'/api/applications/{app.id}/reject/')
        # Pas de request.user - pas d'authentification
        
        # Tester la vue
        view = RejectApplicationView()
        response = view.post(request, app.id)
        
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.data
            print(f"✅ Rejet réussi")
            print(f"   Message: {data.get('message', 'N/A')}")
            print(f"   Application ID: {data.get('application', {}).get('id', 'N/A')}")
            
            # Vérifier que l'application est bien rejetée
            app.refresh_from_db()
            if app.status == 'rejected':
                print("✅ Application rejetée en base")
                print(f"   Revisé par: {app.reviewed_by.username if app.reviewed_by else 'N/A'}")
            else:
                print(f"❌ Application non rejetée: {app.status}")
            
            return True
        else:
            print(f"❌ Erreur: {response.data}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_frontend_call():
    """Test de l'appel frontend simulé"""
    print("\n🌐 Test de l'appel frontend simulé...")
    
    try:
        from django.test import Client
        
        # Créer un client de test
        client = Client()
        
        # Trouver une application
        from courses.models import CourseApplication
        app = CourseApplication.objects.filter(status='pending').first()
        
        if not app:
            print("❌ Aucune application en attente trouvée")
            return False
        
        print(f"✅ Application trouvée: {app.id}")
        
        # Simuler l'appel frontend
        response = client.post(f'/api/applications/{app.id}/approve/', {
            'Content-Type': 'application/json'
        })
        
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Appel frontend réussi")
            return True
        else:
            print(f"❌ Erreur: {response.content}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Test des endpoints sans authentification...")
    
    # Test des endpoints
    approve_ok = test_approve_without_auth()
    reject_ok = test_reject_without_auth()
    frontend_ok = test_frontend_call()
    
    print(f"\n📊 Résumé:")
    print(f"Approbation sans auth: {'✅' if approve_ok else '❌'}")
    print(f"Rejet sans auth: {'✅' if reject_ok else '❌'}")
    print(f"Appel frontend: {'✅' if frontend_ok else '❌'}")
    
    if approve_ok and reject_ok and frontend_ok:
        print("\n🎉 Tous les tests sont passés !")
        print("💡 Le bouton 'Approuver' devrait maintenant fonctionner.")
    else:
        print("\n❌ Certains tests ont échoué.")
    
    sys.exit(0 if (approve_ok and reject_ok and frontend_ok) else 1)
