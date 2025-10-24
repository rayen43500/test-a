from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.pagination import PageNumberPagination  # ✅ AJOUT
from .models import Category, Formation, Quiz, QuizAttempt, CourseApplication
from .serializers import (
    CategorySerializer, FormationListSerializer, FormationDetailSerializer, 
    FormationCreateSerializer, QuizSerializer, QuizCreateSerializer, 
    QuizAttemptSerializer, QuizAttemptCreateSerializer, 
    CourseApplicationSerializer, CourseApplicationCreateSerializer
)
from rest_framework.parsers import MultiPartParser, FormParser
import logging

# from accounts.services import process_application_with_ai  # SUPPRIMÉ - Seul l'IA GitHub est utilisé

logger = logging.getLogger(__name__)


# ✅ AJOUT : Pagination personnalisée
class ApplicationPagination(PageNumberPagination):
    page_size = 10  # 10 candidatures par page
    page_size_query_param = 'page_size'
    max_page_size = 50


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']


class FormationViewSet(viewsets.ModelViewSet):
    queryset = Formation.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'level', 'language', 'instructor']
    search_fields = ['title', 'description', 'instructor__username']
    ordering_fields = ['start_date', 'price', 'created_at']
    parser_classes = [MultiPartParser, FormParser]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return FormationCreateSerializer
        elif self.action == 'retrieve':
            return FormationDetailSerializer
        return FormationListSerializer

    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)

    @action(detail=True, methods=['get'])
    def participants(self, request, pk=None):
        formation = self.get_object()
        participants = formation.participants.all()
        return Response([
            {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'full_name': user.get_full_name() if hasattr(user, 'get_full_name') else user.username,
                'profile_picture': request.build_absolute_uri(user.profile_picture.url) if user.profile_picture else None,
                'enrolled_at': user.formation_participation.through.objects.filter(
                    formation=formation,
                    user=user
                ).first().enrolled_at if hasattr(user, 'formation_participation') else None
            }
            for user in participants
        ])

    def create(self, request, *args, **kwargs):
        logger.info("Request data: %s", request.data)
        logger.info("Request FILES: %s", request.FILES)
        logger.info("Request content type: %s", request.content_type)
        
        logger.info("Request data keys: %s", list(request.data.keys()))
        for key, value in request.data.items():
            logger.info("Field %s: %s (type: %s)", key, value, type(value))
        
        if hasattr(request.data, '_mutable'):
            request.data._mutable = True
        
        request.data['instructor'] = request.user.id
        
        return super().create(request, *args, **kwargs)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def upload_image(self, request, pk=None):
        formation = self.get_object()
        
        if request.user != formation.instructor and not request.user.is_staff:
            return Response(
                {'error': 'You do not have permission to perform this action.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if 'image' not in request.FILES:
            return Response(
                {'error': 'No image file provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        image_file = request.FILES['image']
        
        if not image_file.content_type.startswith('image/'):
            return Response(
                {'error': 'File is not an image'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        formation.image = image_file
        formation.save()
        
        return Response(
            {'image_url': request.build_absolute_uri(formation.image.url)},
            status=status.HTTP_200_OK
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({
            'request': self.request
        })
        return context


class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'is_active']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'title']

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return QuizCreateSerializer
        return QuizSerializer

    def get_queryset(self):
        queryset = Quiz.objects.all()
        if not self.request.user.is_staff and not self.request.user.role == 'Admin':
            queryset = queryset.filter(is_active=True)
        return queryset

    @action(detail=True, methods=['get'])
    def attempts(self, request, pk=None):
        quiz = self.get_object()
        attempts = quiz.attempts.all()

        if not request.user.is_staff and not request.user.role == 'Admin':
            attempts = attempts.filter(user=request.user)

        serializer = QuizAttemptSerializer(attempts, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def start_attempt(self, request, pk=None):
        quiz = self.get_object()
        
        QuizAttempt.objects.filter(
            quiz=quiz,
            user=request.user,
            completed_at__isnull=True
        ).delete()
        
        attempt = QuizAttempt.objects.create(
            quiz=quiz,
            user=request.user,
            score=0,
            total_questions=quiz.get_total_questions(),
            answers={},
            is_passed=False
        )

        serializer = QuizAttemptSerializer(attempt)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def questions(self, request, pk=None):
        quiz = self.get_object()

        is_admin = request.user.is_staff or request.user.role == 'Admin'

        questions = quiz.questions or []

        if not is_admin:
            sanitized_questions = []
            for question in questions:
                sanitized_question = question.copy()
                if 'options' in sanitized_question:
                    for option in sanitized_question['options']:
                        option.pop('is_correct', None)
                sanitized_questions.append(sanitized_question)
            questions = sanitized_questions

        return Response({
            'quiz_id': quiz.id,
            'quiz_title': quiz.title,
            'time_limit': quiz.time_limit,
            'questions': questions
        })


class QuizAttemptViewSet(viewsets.ModelViewSet):
    queryset = QuizAttempt.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['quiz', 'user', 'is_passed']
    search_fields = ['quiz__title', 'user__username']
    ordering_fields = ['started_at', 'completed_at', 'score']

    def get_serializer_class(self):
        if self.action == 'create':
            return QuizAttemptCreateSerializer
        return QuizAttemptSerializer

    def get_queryset(self):
        queryset = QuizAttempt.objects.all()
        if not self.request.user.is_staff and not self.request.user.role == 'Admin':
            queryset = queryset.filter(user=self.request.user)
        return queryset.order_by('-started_at')

    @action(detail=True, methods=['post'])
    def submit_answers(self, request, pk=None):
        attempt = self.get_object()

        if attempt.user != request.user and not request.user.is_staff and not request.user.role == 'Admin':
            return Response(
                {'error': 'You can only submit answers for your own attempts'},
                status=status.HTTP_403_FORBIDDEN
            )

        if attempt.completed_at:
            return Response(
                {'error': 'This attempt has already been completed'},
                status=status.HTTP_400_BAD_REQUEST
            )

        answers = request.data.get('answers', {})
        quiz = attempt.quiz

        questions = quiz.questions or []
        correct_answers = 0
        total_questions = len(questions)

        for i, question in enumerate(questions):
            question_id = str(i)
            user_answer = answers.get(question_id)

            if user_answer is not None:
                for option in question.get('options', []):
                    if option.get('is_correct', False):
                        if str(option.get('id')) == str(user_answer):
                            correct_answers += 1
                        break

        score = int((correct_answers / total_questions) * 100) if total_questions > 0 else 0
        is_passed = score >= quiz.passing_score

        from django.utils import timezone
        attempt.score = score
        attempt.total_questions = total_questions
        attempt.answers = answers
        attempt.is_passed = is_passed
        attempt.completed_at = timezone.now()
        attempt.save()

        serializer = QuizAttemptSerializer(attempt)
        return Response(serializer.data)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({
            'request': self.request
        })
        return context


# ✅✅✅ VIEWSET OPTIMISÉ POUR LES CANDIDATURES ✅✅✅
class CourseApplicationViewSet(viewsets.ModelViewSet):
    # ✅ OBLIGATOIRE : queryset de base pour le router DRF
    queryset = CourseApplication.objects.all()
    
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['formation', 'candidate', 'status', 'reviewed_by']
    search_fields = ['candidate__username', 'formation__title', 'application_message']
    ordering_fields = ['created_at', 'reviewed_at', 'status']
    pagination_class = ApplicationPagination  # ✅ AJOUT : Pagination

    def get_serializer_class(self):
        if self.action == 'create':
            return CourseApplicationCreateSerializer
        return CourseApplicationSerializer

    # ✅✅✅ OPTIMISATION CRITIQUE : select_related + prefetch_related ✅✅✅
    def get_queryset(self):
        """
        Optimise les requêtes avec select_related et prefetch_related
        pour éviter le problème N+1
        """
        user = self.request.user
        
        # ✅ Optimisation des requêtes avec select_related et prefetch_related
        queryset = CourseApplication.objects.select_related(
            'candidate',           # Charge le candidat en une seule requête
            'formation',           # Charge la formation
            'formation__instructor',  # Charge l'instructeur
            'formation__category', # Charge la catégorie
            'quiz_attempt',        # Charge la tentative de quiz
            'quiz_attempt__quiz',  # Charge le quiz
            'reviewed_by'          # Charge le revieweur
        ).order_by('-created_at')  # ✅ Tri par date décroissante

        # Filtrage par rôle
        if not user.is_staff and user.role != 'Admin':
            if user.role == 'Recruteur':
                queryset = queryset.filter(formation__instructor=user)
            else:
                queryset = queryset.filter(candidate=user)

        return queryset

    def perform_create(self, serializer):
        """
        Crée une candidature et lance automatiquement l'analyse IA du CV
        """
        application = serializer.save(candidate=self.request.user)
        
        print(f"📝 Nouvelle candidature créée: {application.id}")
        
        # ANALYSE IA SUPPRIMÉE - Seul l'IA GitHub est utilisé via l'endpoint /api/test/cv-analysis/
        # L'analyse CV se fait maintenant manuellement via le bouton "🧪 Test CV"
        if application.cv:
            print("📄 CV uploadé - Analyse disponible via l'endpoint de test")
        else:
            print("⚠️ Pas de CV uploadé")

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        application = self.get_object()

        if application.formation.instructor != request.user and not request.user.is_staff and request.user.role != 'Admin':
            return Response(
                {'error': 'You can only approve applications for formations you teach'},
                status=status.HTTP_403_FORBIDDEN
            )

        notes = request.data.get('review_notes', '')
        application.approve(request.user, notes)

        serializer = CourseApplicationSerializer(application)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        application = self.get_object()

        if application.formation.instructor != request.user and not request.user.is_staff and request.user.role != 'Admin':
            return Response(
                {'error': 'You can only reject applications for formations you teach'},
                status=status.HTTP_403_FORBIDDEN
            )

        notes = request.data.get('review_notes', '')
        application.reject(request.user, notes)

        serializer = CourseApplicationSerializer(application)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def my_applications(self, request):
        """Candidatures de l'utilisateur connecté (optimisé)"""
        applications = self.get_queryset().filter(candidate=request.user)
        
        # ✅ Utilise la pagination
        page = self.paginate_queryset(applications)
        if page is not None:
            serializer = CourseApplicationSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        
        serializer = CourseApplicationSerializer(applications, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def pending_reviews(self, request):
        """Candidatures en attente pour le recruteur (optimisé)"""
        if request.user.role != 'Recruteur' and not request.user.is_staff and request.user.role != 'Admin':
            return Response(
                {'error': 'Only instructors can view pending reviews'},
                status=status.HTTP_403_FORBIDDEN
            )

        applications = self.get_queryset().filter(
            formation__instructor=request.user,
            status='pending'
        )
        
        # ✅ Utilise la pagination
        page = self.paginate_queryset(applications)
        if page is not None:
            serializer = CourseApplicationSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        
        serializer = CourseApplicationSerializer(applications, many=True, context={'request': request})
        return Response(serializer.data)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({
            'request': self.request
        })
        return context