from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    formation_title = serializers.SerializerMethodField()
    formation_id = serializers.SerializerMethodField()
    
    class Meta:
        model = Notification
        fields = [
            'id',
            'notification_type',
            'title',
            'message',
            'is_read',
            'read_at',
            'created_at',
            'application',
            'formation_title',
            'formation_id',
        ]
        read_only_fields = ['id', 'created_at', 'read_at']
    
    def get_formation_title(self, obj):
        if obj.application and obj.application.formation:
            return obj.application.formation.title
        return None
    
    def get_formation_id(self, obj):
        if obj.application and obj.application.formation:
            return obj.application.formation.id
        return None
