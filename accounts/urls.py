from django.urls import path
from . import views

urlpatterns = [
    # Authentification
    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),
    path('token/refresh/', views.CustomTokenRefreshView.as_view(), name='token_refresh'),
    
    # Profil
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('profile/picture/', views.ProfilePictureUploadView.as_view(), name='profile-picture-upload'),
    path('profile/picture/get/', views.get_profile_picture, name='get-profile-picture'),
    path('profile/picture/delete/', views.delete_profile_picture, name='delete-profile-picture'),
    
    # Gestion utilisateurs (Admin)
    path('users/', views.UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', views.UserManagementView.as_view(), name='user-detail'),
    
    # Réinitialisation mot de passe
    path('password-reset/', views.PasswordResetRequestView.as_view(), name='password-reset'),
    path('password-reset-confirm/', views.PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    path('reset-password/', views.reset_password_confirm, name='reset-password-confirm'),
    
    # 🆕 Google Calendar - Entretiens
    path('interviews/create/', views.create_interview_event, name='create-interview'),
    path('interviews/list/', views.list_upcoming_interviews, name='list-interviews'),
    path('interviews/<str:event_id>/cancel/', views.cancel_interview_event, name='cancel-interview'),
    path('interviews/<str:event_id>/update/', views.update_interview_event, name='update-interview'),
]