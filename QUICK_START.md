# WebSocket Notifications - Quick Start Guide

## 🚀 Start the Application

### Step 1: Start Backend (Django with Daphne)

```bash
cd C:\projectsByMe\ahlem

# If port 8000 is already in use, find and kill the process:
# netstat -ano | findstr :8000
# taskkill /PID <PID_NUMBER> /F

# Start with Daphne (REQUIRED for WebSocket)
daphne -b 0.0.0.0 -p 8000 user_management.asgi:application
```

You should see:
```
Starting ASGI/Daphne version 4.0.0 development server at http://127.0.0.1:8000/
```

### Step 2: Start Frontend (React)

Open a **new terminal**:

```bash
cd C:\projectsByMe\ahlem\condidat-frontend
npm start
```

Browser will open at `http://localhost:3000`

## ✅ Verify It's Working

### 1. Check Browser Console (F12)
You should see:
```
WebSocket Connected
```

### 2. Check Network Tab
- Filter by "WS" (WebSocket)
- You should see a connection to `ws://localhost:8000/ws/notifications/`
- Status: `101 Switching Protocols`

### 3. Test Notification Flow

#### Test 1: Application Submitted
1. **Browser 1:** Log in as **Candidate**
2. Apply for a formation
3. **Browser 2 (Incognito):** Log in as **Instructor**
4. ✅ You should see notification appear instantly! 📝

#### Test 2: Application Approved
1. **Browser 2 (Instructor):** Approve the application
2. **Browser 1 (Candidate):** ✅ You should see notification appear instantly! 🎉

#### Test 3: Application Rejected
1. **Browser 2 (Instructor):** Reject an application
2. **Browser 1 (Candidate):** ✅ You should see notification appear instantly! ❌

## 🔔 Notification Features

### Notification Bell
- Located in the top navbar
- Shows unread count badge
- Click to see recent notifications (last 5)
- Click notification to mark as read

### Notifications Page
- Access via `/notifications` route
- Filter by: All, Unread, Read
- Mark individual or all as read
- View full notification details

### Browser Notifications
- Native browser notifications (requires permission)
- Click "Allow" when prompted
- Notifications appear even when tab is not active

## 🐛 Troubleshooting

### Issue: "WebSocket connection failed"
**Solution:** Make sure you're using Daphne, not `python manage.py runserver`

### Issue: "Port 8000 already in use"
**Solution:**
```bash
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Or use a different port
daphne -b 0.0.0.0 -p 8001 user_management.asgi:application
```

### Issue: "Notifications stored but not appearing"
**Solution:**
1. Check browser console for "WebSocket Connected"
2. Refresh the page
3. Check Network tab for WebSocket connection
4. Verify you're logged in with valid token

### Issue: "Module not found: daphne"
**Solution:**
```bash
pip install -r requirements.txt
```

## 📊 API Endpoints

### Notifications API
- `GET /api/notifications/notifications/` - List all notifications
- `POST /api/notifications/notifications/{id}/mark_as_read/` - Mark as read
- `POST /api/notifications/notifications/mark_all_as_read/` - Mark all as read
- `GET /api/notifications/notifications/unread_count/` - Get unread count

### WebSocket
- `ws://localhost:8000/ws/notifications/?token={JWT_TOKEN}`

## 📝 Notification Types

| Type | Recipient | Icon | Color |
|------|-----------|------|-------|
| Application Submitted | Instructor | 📝 | Blue |
| Application Approved | Candidate | ✅ | Green |
| Application Rejected | Candidate | ❌ | Red |

## 🎯 Testing Checklist

- [ ] Backend running with Daphne
- [ ] Frontend running on port 3000
- [ ] Browser console shows "WebSocket Connected"
- [ ] Network tab shows WebSocket connection
- [ ] Can see notification bell in navbar
- [ ] Can create application and see notification
- [ ] Can approve application and see notification
- [ ] Can reject application and see notification
- [ ] Notifications persist in database
- [ ] Can mark notifications as read
- [ ] Unread count updates correctly

## 🔧 Useful Commands

### Backend
```bash
# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Access Django admin
# http://localhost:8000/admin

# Django shell
python manage.py shell

# Check notifications in database
python manage.py shell
>>> from notifications.models import Notification
>>> Notification.objects.all()
```

### Frontend
```bash
# Install dependencies
npm install

# Start dev server
npm start

# Build for production
npm run build

# Clear cache
npm cache clean --force
```

## 📚 Documentation Files

- `WEBSOCKET_README.md` - Complete technical documentation
- `SETUP_INSTRUCTIONS.md` - Detailed setup guide
- `IMPLEMENTATION_SUMMARY.md` - What was implemented
- `TROUBLESHOOTING_GUIDE.md` - Detailed troubleshooting
- `QUICK_START.md` - This file

## 🎉 Success Indicators

You'll know everything is working when:
1. ✅ No errors in terminal
2. ✅ "WebSocket Connected" in browser console
3. ✅ Notification bell appears in navbar
4. ✅ Notifications appear instantly without refresh
5. ✅ Unread count updates in real-time
6. ✅ Browser notifications work (if permitted)

## 🚀 You're Ready!

Your WebSocket notification system is fully functional! Create applications, approve/reject them, and watch the real-time notifications in action! 🎊

**Happy coding!** 💻✨
