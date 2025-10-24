#!/usr/bin/env python
"""
Setup script for Django User Management API
This script helps with initial project setup
"""

import os
import sys
import subprocess
import secrets

def generate_secret_key():
    """Generate a random secret key for Django"""
    return secrets.token_urlsafe(50)

def create_env_file():
    """Create .env file from .env.example"""
    if os.path.exists('.env'):
        print("✓ .env file already exists")
        return
    
    if not os.path.exists('.env.example'):
        print("✗ .env.example file not found")
        return
    
    # Read .env.example
    with open('.env.example', 'r') as f:
        content = f.read()
    
    # Replace placeholder secret key
    secret_key = generate_secret_key()
    content = content.replace('your-secret-key-here', secret_key)
    
    # Write .env file
    with open('.env', 'w') as f:
        f.write(content)
    
    print("✓ .env file created with generated secret key")
    print("  Please update database credentials in .env file")

def install_requirements():
    """Install Python requirements"""
    print("Installing Python requirements...")
    try:
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'])
        print("✓ Requirements installed successfully")
    except subprocess.CalledProcessError as e:
        print(f"✗ Error installing requirements: {e}")
        return False
    return True

def run_migrations():
    """Run Django migrations"""
    print("Running Django migrations...")
    try:
        subprocess.check_call([sys.executable, 'manage.py', 'makemigrations'])
        subprocess.check_call([sys.executable, 'manage.py', 'migrate'])
        print("✓ Migrations completed successfully")
    except subprocess.CalledProcessError as e:
        print(f"✗ Error running migrations: {e}")
        print("  Make sure your database is running and credentials are correct")
        return False
    return True

def create_superuser():
    """Create Django superuser"""
    print("Creating Django superuser...")
    try:
        subprocess.check_call([
            sys.executable, 'manage.py', 'createsuperuser',
            '--username', 'admin',
            '--email', 'admin@example.com',
            '--noinput'
        ])
        print("✓ Superuser created: admin@example.com")
        print("  Default password: admin123456")
    except subprocess.CalledProcessError as e:
        print(f"✗ Error creating superuser: {e}")
        return False
    return True

def main():
    print("Django User Management API - Setup Script")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not os.path.exists('manage.py'):
        print("✗ manage.py not found. Please run this script from the project root.")
        return
    
    # Create .env file
    create_env_file()
    
    # Install requirements
    if not install_requirements():
        return
    
    # Run migrations
    if not run_migrations():
        print("\nPlease ensure:")
        print("1. MySQL server is running")
        print("2. Database 'user_management_db' exists")
        print("3. Database credentials in .env are correct")
        return
    
    # Create superuser
    create_superuser()
    
    print("\n" + "=" * 50)
    print("Setup completed successfully!")
    print("\nNext steps:")
    print("1. Update .env file with your database credentials")
    print("2. Run: python manage.py runserver")
    print("3. Access admin panel: http://localhost:8000/admin/")
    print("4. Test APIs using Postman collection")
    print("5. Run test script: python test_setup.py")

if __name__ == '__main__':
    main()
