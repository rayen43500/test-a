from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'formations', views.FormationViewSet)
router.register(r'quizzes', views.QuizViewSet)
router.register(r'quiz-attempts', views.QuizAttemptViewSet)
router.register(r'applications', views.CourseApplicationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
