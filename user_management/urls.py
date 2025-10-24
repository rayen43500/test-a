"""
URL configuration for user_management project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
"""

from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from accounts.chat_views import ChatAIView
from accounts.application_views import ProcessApplicationView, ApproveApplicationView, RejectApplicationView, ScheduleInterviewFromApplicationView
from accounts.test_cv_analysis import TestCVAnalysisView
from accounts.gemini_cv_test_view import GeminiCVTestView
from accounts.simple_gemini_test import SimpleGeminiTestView
from accounts.debug_gemini_view import DebugGeminiView
from accounts.test_frontend_simulation import TestFrontendSimulationView
from accounts.simple_test import SimpleTestView
from accounts.debug_test import DebugTestView
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # API endpoints
    path('api/', include('accounts.urls')),
    path('api/courses/', include('courses.urls')),
    path('api/notifications/', include('notifications.urls')),
    path('api/ai/chat/', ChatAIView.as_view()),
    path('api/applications/<int:application_id>/process/', ProcessApplicationView.as_view()),
    path('api/applications/<int:application_id>/approve/', ApproveApplicationView.as_view()),
    path('api/applications/<int:application_id>/reject/', RejectApplicationView.as_view()),
    path('api/interviews/schedule/', ScheduleInterviewFromApplicationView.as_view()),
    path('api/test/cv-analysis/<int:application_id>/', TestCVAnalysisView.as_view()),
    path('api/test/gemini-cv-analysis/<int:application_id>/', GeminiCVTestView.as_view()),
    path('api/test/gemini-simple/', SimpleGeminiTestView.as_view()),
    path('api/test/gemini-debug/', DebugGeminiView.as_view()),
    path('api/test/gemini-frontend-sim/<int:application_id>/', TestFrontendSimulationView.as_view()),
    path('api/test/simple/', SimpleTestView.as_view()),
    path('api/test/basic/', lambda request: HttpResponse("Basic test OK")),
    path('api/test/debug/<int:application_id>/', DebugTestView.as_view()),

    # JWT authentication
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),

    # 🆕 Google OAuth2 authentication
    path('auth/', include('social_django.urls', namespace='social')),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
