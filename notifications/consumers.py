import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model

User = get_user_model()


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """Handle WebSocket connection"""
        # Get token from query string
        query_string = self.scope['query_string'].decode()
        token = None
        
        # Parse query string to get token
        for param in query_string.split('&'):
            if param.startswith('token='):
                token = param.split('=')[1]
                break
        
        if not token:
            print("❌ No token provided in WebSocket connection")
            await self.close()
            return
        
        # Authenticate user
        user = await self.get_user_from_token(token)
        if not user:
            print("❌ Invalid token in WebSocket connection")
            await self.close()
            return
        
        self.user = user
        self.user_group_name = f'user_{user.id}'
        
        print(f"🔌 WebSocket connected for user: {user.fullname} (ID: {user.id})")
        print(f"📡 Joining group: {self.user_group_name}")
        
        # Join user-specific group
        await self.channel_layer.group_add(
            self.user_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Send connection confirmation
        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': 'WebSocket connected successfully'
        }))
    
    async def disconnect(self, close_code):
        """Handle WebSocket disconnection"""
        if hasattr(self, 'user_group_name'):
            await self.channel_layer.group_discard(
                self.user_group_name,
                self.channel_name
            )
    
    async def receive(self, text_data):
        """Handle messages from WebSocket"""
        try:
            data = json.loads(text_data)
            message_type = data.get('type')
            
            if message_type == 'ping':
                await self.send(text_data=json.dumps({
                    'type': 'pong',
                    'message': 'pong'
                }))
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Invalid JSON'
            }))
    
    async def notification_message(self, event):
        """Handle notification messages from channel layer"""
        notification = event['notification']
        
        print(f"🔔 WebSocket consumer received notification: {notification.get('title', 'No title')}")
        
        # Send notification to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'notification',
            'notification': notification
        }))
        
        print(f"📤 Notification sent to WebSocket client")
    
    @database_sync_to_async
    def get_user_from_token(self, token):
        """Authenticate user from JWT token"""
        try:
            access_token = AccessToken(token)
            user_id = access_token['user_id']
            user = User.objects.get(id=user_id)
            return user
        except Exception as e:
            print(f"Authentication error: {e}")
            return None
