# WebSocket Notification System

## Overview
This project implements a real-time notification system using WebSockets for instant updates when applications are submitted, approved, or rejected.

## Architecture

### Backend (Django + Channels)
- **Django Channels**: WebSocket support for Django
- **Daphne**: ASGI server for handling WebSocket connections
- **Notification Model**: Stores notification data in the database
- **WebSocket Consumer**: Handles WebSocket connections and messages
- **Notification Utils**: Helper functions to create and send notifications

### Frontend (React)
- **WebSocketContext**: Manages WebSocket connection lifecycle
- **useNotifications Hook**: Custom hook for notification management
- **NotificationBell Component**: Bell icon with unread count
- **NotificationsPage**: Full page to view all notifications

## Installation

### Backend Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run migrations:**
   ```bash
   python manage.py makemigrations notifications
   python manage.py migrate
   ```

3. **Start the server with Daphne:**
   ```bash
   daphne -b 0.0.0.0 -p 8000 user_management.asgi:application
   ```

   Or use the Django development server (limited WebSocket support):
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd condidat-frontend
   ```

2. **Install dependencies (if not already done):**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

## Features

### Real-time Notifications
- ✅ Application submitted (notifies instructor)
- ✅ Application approved (notifies candidate)
- ✅ Application rejected (notifies candidate)

### Notification Bell
- Shows unread notification count
- Dropdown with recent notifications
- Mark as read functionality
- Link to full notifications page

### Notifications Page
- View all notifications
- Filter by read/unread status
- Mark individual or all as read
- Detailed notification information

### Browser Notifications
- Native browser notifications (requires permission)
- Shows notification title and message
- Clickable to navigate to relevant page

## API Endpoints

### Notifications
- `GET /api/notifications/notifications/` - List all notifications
- `GET /api/notifications/notifications/{id}/` - Get single notification
- `POST /api/notifications/notifications/{id}/mark_as_read/` - Mark as read
- `POST /api/notifications/notifications/mark_all_as_read/` - Mark all as read
- `GET /api/notifications/notifications/unread_count/` - Get unread count

### WebSocket
- `ws://localhost:8000/ws/notifications/?token={JWT_TOKEN}` - WebSocket connection

## Usage

### Backend - Creating Notifications

```python
from notifications.utils import create_notification

# Create a notification
create_notification(
    recipient=user,
    notification_type='application_approved',
    title='Application Approved!',
    message='Your application has been approved.',
    application=application_instance
)
```

### Frontend - Using Notifications

```javascript
import useNotifications from '../hooks/useNotifications';

function MyComponent() {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  
  return (
    <div>
      <p>You have {unreadCount} unread notifications</p>
      {notifications.map(notification => (
        <div key={notification.id}>
          <h3>{notification.title}</h3>
          <p>{notification.message}</p>
          <button onClick={() => markAsRead(notification.id)}>
            Mark as read
          </button>
        </div>
      ))}
    </div>
  );
}
```

## Configuration

### Django Settings
```python
# settings.py

INSTALLED_APPS = [
    'daphne',  # Must be first
    # ... other apps
    'channels',
    'notifications',
]

ASGI_APPLICATION = 'user_management.asgi.application'

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer'
    }
}
```

### WebSocket URL
The WebSocket URL is automatically configured based on your environment:
- Development: `ws://localhost:8000/ws/notifications/`
- Production: `wss://yourdomain.com/ws/notifications/`

## Troubleshooting

### WebSocket Connection Issues
1. **Check if Daphne is running**: The server must be started with Daphne for WebSocket support
2. **Verify JWT token**: Ensure the token is valid and not expired
3. **Check CORS settings**: Make sure CORS is properly configured for WebSocket connections
4. **Browser console**: Check for WebSocket connection errors

### Notifications Not Appearing
1. **Check database**: Verify notifications are being created in the database
2. **WebSocket connection**: Ensure WebSocket is connected (check browser console)
3. **User authentication**: Verify the user is properly authenticated
4. **Channel layer**: Ensure channel layer is properly configured

### Performance Optimization
For production, use Redis as the channel layer backend:

```python
# settings.py
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [('127.0.0.1', 6379)],
        },
    },
}
```

Install Redis channel layer:
```bash
pip install channels-redis
```

## Testing

### Manual Testing
1. Create a new application as a candidate
2. Log in as the instructor
3. Approve or reject the application
4. Check if the candidate receives a real-time notification

### Automated Testing
```bash
python manage.py test notifications
```

## Security Considerations

1. **JWT Authentication**: WebSocket connections are authenticated using JWT tokens
2. **User-specific channels**: Each user has their own channel group
3. **Permission checks**: Notifications are only sent to authorized recipients
4. **CORS configuration**: Properly configure CORS for production

## Future Enhancements

- [ ] Email notifications as fallback
- [ ] SMS notifications
- [ ] Notification preferences (user can choose notification types)
- [ ] Notification history with pagination
- [ ] Notification categories and filtering
- [ ] Push notifications for mobile apps
- [ ] Notification sound effects
- [ ] Batch notifications

## Support

For issues or questions, please contact the development team or create an issue in the project repository.
