from rest_framework import serializers
from .models import Category, Formation, Quiz, QuizAttempt, CourseApplication

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

class FormationListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    instructor_name = serializers.CharField(source='instructor.get_full_name', read_only=True)
    
    class Meta:
        model = Formation
        fields = [
            'id', 'title', 'description', 'level', 'duration', 'start_date', 'end_date',
            'instructor', 'instructor_name', 'language', 'price', 'discount',
            'location', 'max_participants', 'current_participants', 'image',
            'category', 'category_name', 'requirements', 'learning_points', 'created_at', 'updated_at'
        ]
        read_only_fields = ('created_at', 'updated_at', 'current_participants')

class FormationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Formation
        fields = [
            'title', 'description', 'level', 'duration', 'start_date', 'end_date',
            'language', 'price', 'discount', 'location', 'max_participants', 'image', 'category',
            'requirements', 'learning_points'
        ]
        read_only_fields = ('instructor', 'current_participants', 'created_at', 'updated_at')

class FormationDetailSerializer(FormationListSerializer):
    class Meta(FormationListSerializer.Meta):
        fields = '__all__'


class QuizSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    total_questions = serializers.SerializerMethodField()

    class Meta:
        model = Quiz
        fields = [
            'id', 'title', 'description', 'category', 'category_name',
            'passing_score', 'time_limit', 'is_active', 'questions',
            'total_questions', 'created_at', 'updated_at'
        ]
        read_only_fields = ('created_at', 'updated_at')

    def get_total_questions(self, obj):
        return obj.get_total_questions()


class QuizCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = [
            'title', 'description', 'category', 'passing_score',
            'time_limit', 'is_active', 'questions'
        ]


class QuizAttemptSerializer(serializers.ModelSerializer):
    quiz_title = serializers.CharField(source='quiz.title', read_only=True)
    user_fullname = serializers.CharField(source='user.get_full_name', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = QuizAttempt
        fields = [
            'id', 'quiz', 'quiz_title', 'user', 'user_fullname', 'username',
            'score', 'total_questions', 'answers', 'is_passed',
            'started_at', 'completed_at'
        ]
        read_only_fields = ('started_at', 'completed_at', 'is_passed')


class QuizAttemptCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizAttempt
        fields = ['quiz', 'score', 'total_questions', 'answers', 'is_passed']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class CourseApplicationSerializer(serializers.ModelSerializer):
    candidate_name = serializers.CharField(source='candidate.get_full_name', read_only=True)
    candidate_email = serializers.EmailField(source='candidate.email', read_only=True)
    formation_title = serializers.CharField(source='formation.title', read_only=True)
    quiz_score_display = serializers.SerializerMethodField()
    quiz_passed = serializers.SerializerMethodField()
    reviewed_by_name = serializers.CharField(source='reviewed_by.get_full_name', read_only=True)
    
    # ✅ AJOUT : Champs IA
    cv_score = serializers.IntegerField(read_only=True)
    cv_resume = serializers.CharField(read_only=True)
    has_ai_analysis = serializers.SerializerMethodField()

    def get_quiz_score_display(self, obj):
        return obj.quiz_score or (obj.quiz_attempt.score if obj.quiz_attempt else None)

    def get_quiz_passed(self, obj):
        if obj.quiz_score is not None:
            formation = obj.formation
            if hasattr(formation, 'quiz') and formation.quiz:
                return obj.quiz_score >= formation.quiz.passing_score
            return obj.quiz_score >= 70
        return obj.quiz_attempt.is_passed if obj.quiz_attempt else False
    
    def get_has_ai_analysis(self, obj):
        """Indique si l'analyse IA a été effectuée"""
        return obj.cv_score is not None and obj.cv_resume is not None

    class Meta:
        model = CourseApplication
        fields = [
            'id', 'candidate', 'candidate_name', 'candidate_email',
            'formation', 'formation_title', 'quiz_attempt', 
            'quiz_score', 'quiz_score_display', 'quiz_passed',
            'status', 'cv', 'application_message', 'review_notes',
            'reviewed_by', 'reviewed_by_name', 'reviewed_at',
            'cv_score', 'cv_resume', 'has_ai_analysis',  # ✅ Champs IA
            'created_at', 'updated_at'
        ]
        read_only_fields = ('created_at', 'updated_at', 'reviewed_at', 'reviewed_by', 'cv_score', 'cv_resume')


class CourseApplicationCreateSerializer(serializers.ModelSerializer):
    # Alias pour compatibilité avec le frontend
    motivation_letter = serializers.CharField(source='application_message', required=False, allow_blank=True)
    
    class Meta:
        model = CourseApplication
        fields = ['formation', 'quiz_attempt', 'quiz_score', 'cv', 'application_message', 'motivation_letter']
        extra_kwargs = {
            'quiz_attempt': {'required': False, 'allow_null': True},
            'quiz_score': {'required': False, 'allow_null': True},
            'application_message': {'required': False, 'allow_blank': True},
        }

    def validate(self, data):
        formation = data.get('formation')
        if formation and hasattr(formation, 'quiz'):
            if not data.get('quiz_attempt') and data.get('quiz_score') is None:
                raise serializers.ValidationError("Either quiz_attempt or quiz_score is required for this formation.")
        return data

    def create(self, validated_data):
        validated_data['candidate'] = self.context['request'].user
        return super().create(validated_data)