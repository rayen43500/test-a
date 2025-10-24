"""
Script de test pour vérifier les utilisateurs dans la base de données
Lancez avec: python manage.py shell < test_users.py
"""

from accounts.models import User

print("\n" + "="*60)
print("🔍 TEST DES UTILISATEURS DANS LA BASE DE DONNÉES")
print("="*60 + "\n")

# Compter les utilisateurs
total_users = User.objects.count()
print(f"📊 Total d'utilisateurs : {total_users}\n")

if total_users == 0:
    print("❌ AUCUN UTILISATEUR TROUVÉ !")
    print("\n💡 Pour créer un admin, exécutez :")
    print("   python manage.py createsuperuser")
else:
    print("✅ Utilisateurs trouvés :\n")
    print(f"{'ID':<5} {'Nom complet':<25} {'Email':<30} {'Rôle':<15} {'Actif'}")
    print("-" * 100)
    
    for user in User.objects.all():
        active = "✓" if user.is_active else "✗"
        print(f"{user.id:<5} {user.fullname:<25} {user.email:<30} {user.role:<15} {active}")
    
    print("\n" + "="*60)
    
    # Statistiques par rôle
    print("\n📈 STATISTIQUES PAR RÔLE :")
    print(f"   - Admins      : {User.objects.filter(role='Admin').count()}")
    print(f"   - Recruteurs  : {User.objects.filter(role='Recruteur').count()}")
    print(f"   - Candidats   : {User.objects.filter(role='Candidat').count()}")
    
    # Vérifier les admins
    admins = User.objects.filter(role='Admin')
    print(f"\n👑 ADMINS ({admins.count()}) :")
    for admin in admins:
        print(f"   - {admin.fullname} ({admin.email})")
        print(f"     is_admin property: {admin.is_admin}")
        print(f"     is_staff: {admin.is_staff}")
        print(f"     is_superuser: {admin.is_superuser}")

print("\n" + "="*60 + "\n")