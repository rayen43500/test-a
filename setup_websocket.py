#!/usr/bin/env python
"""
WebSocket Notification Setup Script
This script helps set up the WebSocket notification system for the project.
"""

import os
import sys
import subprocess

def run_command(command, description):
    """Run a shell command and print the result"""
    print(f"\n{'='*60}")
    print(f"{description}")
    print(f"{'='*60}")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error: {e}")
        print(e.stderr)
        return False

def main():
    print("""
    ╔══════════════════════════════════════════════════════════╗
    ║   WebSocket Notification System Setup                   ║
    ║   Django Backend + React Frontend                        ║
    ╚══════════════════════════════════════════════════════════╝
    """)

    # Step 1: Install Python dependencies
    print("\n📦 Step 1: Installing Python dependencies...")
    if not run_command("pip install -r requirements.txt", "Installing Django Channels and dependencies"):
        print("❌ Failed to install dependencies. Please check your requirements.txt file.")
        return

    # Step 2: Make migrations
    print("\n🔄 Step 2: Creating database migrations...")
    if not run_command("python manage.py makemigrations notifications", "Creating notifications migrations"):
        print("⚠️  Warning: Could not create migrations. They may already exist.")
    
    # Step 3: Run migrations
    print("\n🔄 Step 3: Running database migrations...")
    if not run_command("python manage.py migrate", "Applying database migrations"):
        print("❌ Failed to run migrations.")
        return

    # Step 4: Instructions for frontend
    print("""
    \n✅ Backend setup complete!
    
    📝 Next steps for Frontend (React):
    
    1. Navigate to the frontend directory:
       cd condidat-frontend
    
    2. The WebSocket context and components are already created:
       ✓ src/contexts/WebSocketContext.js
       ✓ src/hooks/useNotifications.js
       ✓ src/components/common/NotificationBell.js
       ✓ src/components/notifications/NotificationsPage.js
    
    3. Make sure your frontend is configured to connect to the backend:
       - Update API base URL if needed
       - Ensure CORS is properly configured
    
    4. Start the Django server with Daphne (for WebSocket support):
       daphne -b 0.0.0.0 -p 8000 user_management.asgi:application
    
    5. Start the React development server:
       npm start
    
    🎉 Your WebSocket notification system is ready!
    
    📌 Features:
    - Real-time notifications for application approval/rejection
    - Notification bell with unread count
    - Full notifications page
    - Browser notifications support
    - Automatic reconnection on disconnect
    
    🔧 Testing:
    1. Create a new application
    2. Approve or reject an application
    3. Watch for real-time notifications!
    """)

if __name__ == "__main__":
    main()
