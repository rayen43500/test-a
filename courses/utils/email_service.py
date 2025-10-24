from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags

def send_application_email(subject, to_email, template_name, context=None):
    """
    Send an email using a template
    
    Args:
        subject (str): Email subject
        to_email (str): Recipient email address
        template_name (str): Path to the email template
        context (dict): Context variables for the template
    """
    if context is None:
        context = {}
        
    # Render HTML content
    html_message = render_to_string(template_name, context)
    plain_message = strip_tags(html_message)
    
    # Send email
    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[to_email],
        html_message=html_message,
        fail_silently=False,
    )
