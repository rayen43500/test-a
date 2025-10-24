#!/usr/bin/env python
"""
Test script to verify Django project setup
Run this after setting up the database and running migrations
"""

import os
import sys
import django

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'user_management.settings')
django.setup()

from accounts.models import User, Language, SocialLink
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

def test_user_creation():
    """Test creating a user with all fields"""
    print("Testing user creation...")
    
    # Create a test user
    user_data = {
        'username': 'testuser',
        'email': 'test@example.com',
        'fullname': 'Test User',
        'role': 'Candidat',
        'phone_number': '+1234567890',
        'skills': 'Python, Django, JavaScript',
        'annees_experience': 3,
        'bio': 'Test user bio',
        'website': 'https://testuser.com'
    }
    
    try:
        user = User.objects.create_user(password='testpass123', **user_data)
        print(f"✓ User created successfully: {user.fullname} ({user.email})")
        
        # Add languages
        Language.objects.create(user=user, language='English', proficiency='Native')
        Language.objects.create(user=user, language='French', proficiency='Intermediate')
        print("✓ Languages added successfully")
        
        # Add social links
        SocialLink.objects.create(user=user, platform='LinkedIn', url='https://linkedin.com/in/testuser')
        SocialLink.objects.create(user=user, platform='GitHub', url='https://github.com/testuser')
        print("✓ Social links added successfully")
        
        return user
    except Exception as e:
        print(f"✗ Error creating user: {e}")
        return None

def test_authentication():
    """Test JWT token generation"""
    print("\nTesting JWT authentication...")
    
    try:
        user = authenticate(username='test@example.com', password='testpass123')
        if user:
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token
            print(f"✓ Authentication successful")
            print(f"✓ JWT tokens generated")
            print(f"  Access Token: {str(access_token)[:50]}...")
            print(f"  Refresh Token: {str(refresh)[:50]}...")
        else:
            print("✗ Authentication failed")
    except Exception as e:
        print(f"✗ Error during authentication: {e}")

def test_admin_user():
    """Create an admin user for testing"""
    print("\nCreating admin user...")
    
    try:
        admin_user = User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='admin123456',
            fullname='System Administrator',
            role='Admin',
            is_staff=True,
            is_superuser=True
        )
        print(f"✓ Admin user created: {admin_user.fullname}")
        return admin_user
    except Exception as e:
        print(f"✗ Error creating admin user: {e}")
        return None

def main():
    print("Django User Management API - Setup Test")
    print("=" * 50)
    
    # Test database connection
    try:
        User.objects.count()
        print("✓ Database connection successful")
    except Exception as e:
        print(f"✗ Database connection failed: {e}")
        return
    
    # Clean up existing test data
    User.objects.filter(email__in=['test@example.com', 'admin@example.com']).delete()
    
    # Run tests
    user = test_user_creation()
    if user:
        test_authentication()
    
    admin_user = test_admin_user()
    
    print("\n" + "=" * 50)
    print("Setup test completed!")
    print("\nNext steps:")
    print("1. Run: python manage.py runserver")
    print("2. Test APIs using Postman or curl")
    print("3. Access admin panel at: http://localhost:8000/admin/")
    print(f"   Admin credentials: admin@example.com / admin123456")

if __name__ == '__main__':
    main()
