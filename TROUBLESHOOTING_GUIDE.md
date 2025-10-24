# WebSocket Notifications - Troubleshooting Guide

## 🔍 Checklist: Why Notifications Aren't Appearing

### 1. ✅ Backend Setup

#### Check if migrations are applied:
```bash
python manage.py showmigrations notifications
```
Should show:
```
notifications
 [X] 0001_initial
 [X] 0002_remove_notification_data_notification_application_and_more
```

If not, run:
```bash
python manage.py migrate
```

#### Check if server is running with Daphne:
```bash
# MUST use Daphne for WebSocket support!
daphne -b 0.0.0.0 -p 8000 user_management.asgi:application
```

**⚠️ Important:** Regular `python manage.py runserver` has limited WebSocket support!

#### Verify notifications are being created:
```bash
python manage.py shell
```
```python
from notifications.models import Notification
print(Notification.objects.all())
# Should show your notifications
```

### 2. ✅ Frontend Setup

#### Check browser console (F12):
Look for these messages:
- ✅ `WebSocket Connected` - Good!
- ❌ `WebSocket Error` - Problem with connection
- ❌ `WebSocket Disconnected` - Connection lost

#### Check Network tab:
- Look for WebSocket connection to `ws://localhost:8000/ws/notifications/`
- Status should be `101 Switching Protocols`
- Connection should stay open (not close immediately)

#### Check if token is valid:
```javascript
// In browser console
localStorage.getItem('token')
// Should return a JWT token
```

### 3. 🔧 Common Issues & Solutions

#### Issue 1: "WebSocket connection failed"
**Cause:** Backend not running with Daphne

**Solution:**
```bash
# Stop regular runserver
# Start with Daphne
daphne -b 0.0.0.0 -p 8000 user_management.asgi:application
```

#### Issue 2: "401 Unauthorized" on WebSocket
**Cause:** Invalid or expired JWT token

**Solution:**
1. Log out and log back in
2. Check token in browser console
3. Verify token is being passed in WebSocket URL

#### Issue 3: Notifications stored but not appearing in real-time
**Cause:** WebSocket not connected or not listening

**Solution:**
1. Check browser console for "WebSocket Connected"
2. Verify `useNotifications` hook is being used
3. Check that `WebSocketProvider` wraps your app in `App.js`

#### Issue 4: "CORS error"
**Cause:** CORS not configured for WebSocket

**Solution:** Already configured in `settings.py`:
```python
CORS_ALLOW_ALL_ORIGINS = True  # For development
```

#### Issue 5: Notifications appear on refresh but not in real-time
**Cause:** WebSocket message handler not working

**Solution:**
1. Check browser console for WebSocket messages
2. Verify `useNotifications` hook is properly handling messages
3. Check that notification format matches expected structure

### 4. 🧪 Testing Step-by-Step

#### Test 1: Check Backend API
```bash
# Get your JWT token first by logging in
# Then test the API:
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8000/api/notifications/notifications/
```

Should return JSON with notifications.

#### Test 2: Check WebSocket Connection
1. Open browser DevTools (F12)
2. Go to Network tab
3. Filter by "WS" (WebSocket)
4. Refresh page
5. You should see a WebSocket connection to `/ws/notifications/`

#### Test 3: Test Real-time Notification
1. **Terminal 1:** Start backend
   ```bash
   daphne -b 0.0.0.0 -p 8000 user_management.asgi:application
   ```

2. **Terminal 2:** Start frontend
   ```bash
   cd condidat-frontend
   npm start
   ```

3. **Browser 1:** Log in as Candidate, apply for a formation

4. **Browser 2 (or Incognito):** Log in as Instructor
   - You should see notification appear immediately! 🔔

5. **Browser 2:** Approve/reject the application

6. **Browser 1:** You should see notification appear immediately! ✅

### 5. 🐛 Debug Mode

#### Enable detailed logging in Django:
Add to `settings.py`:
```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'DEBUG',
    },
}
```

#### Add console logs in frontend:
In `useNotifications.js`, add:
```javascript
useEffect(() => {
  if (!ws) {
    console.log('❌ WebSocket not available');
    return;
  }
  
  console.log('✅ WebSocket available, adding listener');
  
  const handleMessage = (event) => {
    console.log('📨 Received WebSocket message:', event.data);
    // ... rest of code
  };
  
  ws.addEventListener('message', handleMessage);
  return () => ws.removeEventListener('message', handleMessage);
}, [ws]);
```

### 6. 📊 Verification Commands

#### Check if Daphne is installed:
```bash
pip show daphne
```

#### Check if Channels is installed:
```bash
pip show channels
```

#### Check Django apps:
```bash
python manage.py shell
```
```python
from django.conf import settings
print('daphne' in settings.INSTALLED_APPS)  # Should be True
print('channels' in settings.INSTALLED_APPS)  # Should be True
print('notifications' in settings.INSTALLED_APPS)  # Should be True
```

#### Test notification creation manually:
```bash
python manage.py shell
```
```python
from notifications.utils import create_notification
from accounts.models import User

# Get a user
user = User.objects.first()

# Create test notification
notification = create_notification(
    recipient=user,
    notification_type='application_approved',
    title='Test Notification',
    message='This is a test',
    application=None
)

print(f"Created notification: {notification}")
```

### 7. 🎯 Quick Diagnostic Script

Save this as `test_websocket.py`:
```python
import asyncio
import websockets
import json

async def test_connection():
    uri = "ws://localhost:8000/ws/notifications/?token=YOUR_JWT_TOKEN"
    
    try:
        async with websockets.connect(uri) as websocket:
            print("✅ WebSocket connected!")
            
            # Wait for messages
            while True:
                message = await websocket.recv()
                print(f"📨 Received: {message}")
                
    except Exception as e:
        print(f"❌ Error: {e}")

# Run test
asyncio.run(test_connection())
```

Run with:
```bash
pip install websockets
python test_websocket.py
```

### 8. 🔍 Browser Console Checks

Open browser console and run:
```javascript
// Check if WebSocketProvider is working
console.log('WebSocket Context:', window);

// Check if notifications are being fetched
fetch('http://localhost:8000/api/notifications/notifications/', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(data => console.log('Notifications:', data));

// Check WebSocket connection
console.log('WebSocket state:', window.ws?.readyState);
// 0 = CONNECTING, 1 = OPEN, 2 = CLOSING, 3 = CLOSED
```

### 9. ✅ Success Indicators

You'll know it's working when:
1. ✅ Browser console shows "WebSocket Connected"
2. ✅ Network tab shows WebSocket connection (Status: 101)
3. ✅ Notifications appear in database
4. ✅ Notifications appear in UI without refresh
5. ✅ Bell icon shows unread count
6. ✅ Browser notifications appear (if permitted)

### 10. 🆘 Still Not Working?

#### Check these files exist:
- ✅ `notifications/models.py`
- ✅ `notifications/consumers.py`
- ✅ `notifications/routing.py`
- ✅ `notifications/utils.py`
- ✅ `user_management/asgi.py` (updated)
- ✅ `condidat-frontend/src/contexts/WebSocketContext.js`
- ✅ `condidat-frontend/src/hooks/useNotifications.js`
- ✅ `condidat-frontend/src/components/common/NotificationBell.js`

#### Restart everything:
```bash
# Backend
Ctrl+C  # Stop server
daphne -b 0.0.0.0 -p 8000 user_management.asgi:application

# Frontend (new terminal)
Ctrl+C  # Stop server
npm start

# Clear browser cache
Ctrl+Shift+Delete
```

#### Check Python version:
```bash
python --version
# Should be 3.8 or higher
```

#### Reinstall dependencies:
```bash
pip install -r requirements.txt --force-reinstall
```

## 📞 Getting Help

If you're still stuck:
1. Check Django logs for errors
2. Check browser console for JavaScript errors
3. Verify all files were created correctly
4. Make sure you're using Daphne, not runserver
5. Try creating a notification manually in Django shell
6. Check if WebSocket connection appears in Network tab

## 🎉 Success!

Once you see "WebSocket Connected" in the console and notifications appear in real-time, you're all set! 🚀
