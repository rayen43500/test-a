from .models import Notification
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


def create_notification(recipient, notification_type, title, message, application=None, interview=None):
    """
    Create a notification and send it via WebSocket
    """
    print(f"Creating notification for {recipient.fullname}: {title}")
    
    notification = Notification.objects.create(
        recipient=recipient,
        notification_type=notification_type,
        title=title,
        message=message,
        application=application,
        interview=interview
    )
    
    print(f"Notification created with ID: {notification.id}")
    
    # Send notification via WebSocket
    send_notification_to_user(recipient.id, notification.to_dict())
    
    return notification


def send_notification_to_user(user_id, notification_data):
    """
    Send notification to a specific user via WebSocket
    """
    print(f"Sending WebSocket notification to user {user_id}")
    
    channel_layer = get_channel_layer()
    if channel_layer:
        print(f"Channel layer found, sending to group: user_{user_id}")
        async_to_sync(channel_layer.group_send)(
            f'user_{user_id}',
            {
                'type': 'notification_message',
                'notification': notification_data
            }
        )
    else:
        print("No channel layer found!")


def notify_application_submitted(application):
    """Notify instructor when a new application is submitted"""
    print(f"notify_application_submitted called for application {application.id}")
    
    instructor = application.formation.instructor
    print(f"Instructor: {instructor.fullname} (ID: {instructor.id})")
    
    create_notification(
        recipient=instructor,
        notification_type='application_submitted',
        title='New Application Received',
        message=f'{application.candidate.fullname} has applied for {application.formation.title}',
        application=application
    )


def notify_application_approved(application):
    """Notify candidate when their application is approved"""
    create_notification(
        recipient=application.candidate,
        notification_type='application_approved',
        title='Application Approved!',
        message=f'Congratulations! Your application for {application.formation.title} has been approved.',
        application=application
    )


def notify_application_rejected(application):
    """Notify candidate when their application is rejected"""
    create_notification(
        recipient=application.candidate,
        notification_type='application_rejected',
        title='Application Update',
        message=f'Your application for {application.formation.title} has been reviewed.',
        application=application
    )


def notify_interview_scheduled(interview):
    """Notify candidate when an interview is scheduled"""
    create_notification(
        recipient=interview.candidate,
        notification_type='interview_scheduled',
        title='Interview Scheduled!',
        message=f'An interview has been scheduled for {interview.formation.title} on {interview.scheduled_date.strftime("%Y-%m-%d at %H:%M")}.',
        application=interview.application,
        interview=interview
    )
