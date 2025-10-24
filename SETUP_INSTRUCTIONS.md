# WebSocket Notification System - Setup Instructions

## 🚀 Quick Start Guide

Follow these steps to get your WebSocket notification system up and running.

## Step 1: Backend Setup (Django)

### 1.1 Install Required Packages

```bash
cd C:\projectsByMe\ahlem
pip install -r requirements.txt
```

This will install:
- `channels==4.0.0` - Django Channels for WebSocket support
- `daphne==4.0.0` - ASGI server for Django Channels

### 1.2 Create and Apply Migrations

```bash
python manage.py makemigrations notifications
python manage.py migrate
```

This creates the `Notification` model in your database.

### 1.3 Verify Installation

Check that the notifications app is properly installed:

```bash
python manage.py shell
```

```python
from notifications.models import Notification
from notifications.utils import create_notification
print("✅ Notifications app is ready!")
exit()
```

## Step 2: Frontend Setup (React)

### 2.1 Verify Files Created

Navigate to your frontend directory and verify these files exist:

```bash
cd C:\projectsByMe\ahlem\condidat-frontend
```

**Context & Hooks:**
- ✅ `src/contexts/WebSocketContext.js`
- ✅ `src/hooks/useNotifications.js`

**Components:**
- ✅ `src/components/common/NotificationBell.js`
- ✅ `src/components/notifications/NotificationsPage.js`

**App Configuration:**
- ✅ `src/App.js` (updated with WebSocketProvider and routes)
- ✅ `src/components/layout/Layout.js` (updated with NotificationBell)

### 2.2 Install Frontend Dependencies (if needed)

```bash
npm install
```

## Step 3: Running the Application

### 3.1 Start Django Backend with Daphne

**Important:** You must use Daphne (ASGI server) for WebSocket support!

```bash
cd C:\projectsByMe\ahlem
daphne -b 0.0.0.0 -p 8000 user_management.asgi:application
```

**Alternative (for development only):**
```bash
python manage.py runserver
```
Note: `runserver` has limited WebSocket support. Use Daphne for production.

### 3.2 Start React Frontend

Open a new terminal:

```bash
cd C:\projectsByMe\ahlem\condidat-frontend
npm start
```

The frontend will open at `http://localhost:3000`

## Step 4: Testing the System

### 4.1 Test Notification Flow

1. **Create an Application:**
   - Log in as a Candidate
   - Apply for a formation
   - ✅ Instructor should receive a notification

2. **Approve an Application:**
   - Log in as Instructor/Recruiter
   - Go to Applications page
   - Approve an application
   - ✅ Candidate should receive approval notification in real-time

3. **Reject an Application:**
   - Log in as Instructor/Recruiter
   - Reject an application
   - ✅ Candidate should receive rejection notification in real-time

### 4.2 Check WebSocket Connection

Open browser console (F12) and look for:
```
WebSocket Connected
```

If you see connection errors, check:
- Is Daphne running?
- Is the JWT token valid?
- Are CORS settings correct?

## Step 5: Configuration Details

### Backend Configuration (Already Done)

**Files Modified:**
- ✅ `user_management/settings.py` - Added channels, daphne, notifications
- ✅ `user_management/asgi.py` - Configured WebSocket routing
- ✅ `user_management/urls.py` - Added notifications API endpoints
- ✅ `courses/models.py` - Integrated notification triggers
- ✅ `requirements.txt` - Added channels and daphne

**Files Created:**
- ✅ `notifications/models.py` - Notification model
- ✅ `notifications/views.py` - API views
- ✅ `notifications/serializers.py` - Serializers
- ✅ `notifications/urls.py` - URL routing
- ✅ `notifications/admin.py` - Admin interface
- ✅ `notifications/consumers.py` - WebSocket consumer
- ✅ `notifications/routing.py` - WebSocket routing
- ✅ `notifications/utils.py` - Helper functions
- ✅ `notifications/apps.py` - App configuration

### Frontend Configuration (Already Done)

**Files Modified:**
- ✅ `src/App.js` - Added WebSocketProvider and notifications route
- ✅ `src/components/layout/Layout.js` - Added NotificationBell

**Files Created:**
- ✅ `src/contexts/WebSocketContext.js` - WebSocket connection management
- ✅ `src/hooks/useNotifications.js` - Notifications hook
- ✅ `src/components/common/NotificationBell.js` - Bell icon component
- ✅ `src/components/notifications/NotificationsPage.js` - Full notifications page

## API Endpoints Reference

### Notifications API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications/notifications/` | List all user notifications |
| GET | `/api/notifications/notifications/{id}/` | Get single notification |
| POST | `/api/notifications/notifications/{id}/mark_as_read/` | Mark notification as read |
| POST | `/api/notifications/notifications/mark_all_as_read/` | Mark all as read |
| GET | `/api/notifications/notifications/unread_count/` | Get unread count |

### WebSocket Connection

**URL:** `ws://localhost:8000/ws/notifications/?token={JWT_TOKEN}`

**Message Format:**
```json
{
  "type": "notification",
  "notification": {
    "id": 1,
    "type": "application_approved",
    "title": "Application Approved!",
    "message": "Your application has been approved.",
    "is_read": false,
    "created_at": "2024-01-01T12:00:00Z",
    "application_id": 5,
    "formation_title": "Python Development"
  }
}
```

## Troubleshooting

### Problem: WebSocket won't connect

**Solution:**
1. Ensure Daphne is running (not just `runserver`)
2. Check browser console for errors
3. Verify JWT token is valid
4. Check CORS settings in `settings.py`

### Problem: Notifications not appearing

**Solution:**
1. Check database - are notifications being created?
   ```bash
   python manage.py shell
   from notifications.models import Notification
   print(Notification.objects.all())
   ```
2. Check WebSocket connection in browser console
3. Verify user is authenticated
4. Check that `notify_application_*` functions are being called

### Problem: "Module not found" errors

**Solution:**
```bash
# Backend
pip install -r requirements.txt

# Frontend
cd condidat-frontend
npm install
```

### Problem: Migration errors

**Solution:**
```bash
python manage.py makemigrations
python manage.py migrate --run-syncdb
```

## Production Deployment

### Use Redis for Channel Layer

1. **Install Redis:**
   ```bash
   pip install channels-redis
   ```

2. **Update settings.py:**
   ```python
   CHANNEL_LAYERS = {
       'default': {
           'BACKEND': 'channels_redis.core.RedisChannelLayer',
           'CONFIG': {
               "hosts": [('127.0.0.1', 6379)],
           },
       },
   }
   ```

3. **Start Redis:**
   ```bash
   redis-server
   ```

### Use Nginx for WebSocket Proxy

```nginx
location /ws/ {
    proxy_pass http://localhost:8000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

## Features Implemented

✅ **Real-time Notifications**
- Application submitted (notifies instructor)
- Application approved (notifies candidate)
- Application rejected (notifies candidate)

✅ **Notification Bell Component**
- Shows unread count badge
- Dropdown with recent notifications
- Mark as read functionality
- Links to full notifications page

✅ **Notifications Page**
- View all notifications
- Filter by read/unread status
- Mark individual or all as read
- Detailed notification cards

✅ **WebSocket Features**
- Automatic reconnection with exponential backoff
- JWT authentication
- User-specific channels
- Browser notification support

✅ **Backend Features**
- RESTful API for notifications
- Database persistence
- Admin interface
- Automatic notification creation on application status change

## Next Steps

1. **Customize Notification Types:**
   - Add more notification types in `notifications/models.py`
   - Create corresponding utility functions in `notifications/utils.py`

2. **Add Email Notifications:**
   - Extend notification system to send emails
   - Use Django's email backend

3. **Add Notification Preferences:**
   - Let users choose which notifications they want to receive
   - Create a preferences model

4. **Add Push Notifications:**
   - Integrate with Firebase Cloud Messaging
   - Support mobile app notifications

## Support

If you encounter any issues:
1. Check the `WEBSOCKET_README.md` for detailed documentation
2. Review the troubleshooting section above
3. Check browser console and Django logs for errors
4. Verify all files are created correctly

## Success Checklist

- [ ] Backend dependencies installed
- [ ] Migrations applied successfully
- [ ] Daphne server running
- [ ] Frontend dependencies installed
- [ ] React app running
- [ ] WebSocket connection established (check browser console)
- [ ] Notification bell appears in layout
- [ ] Can create and view notifications
- [ ] Real-time notifications working

🎉 **Congratulations!** Your WebSocket notification system is ready!
