import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCourses } from '../../contexts/CourseContext';
import { toast } from 'react-toastify';
import { ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const QuizDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getQuiz, startQuizAttempt, submitQuizAnswers, createApplication } = useCourses();
  
  // Get application data from location state if coming from application flow
  const { applicationData, from } = location.state || {};

  const [quiz, setQuiz] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    loadQuiz();
  }, [id]);

  useEffect(() => {
    let timer;
    if (timeRemaining > 0 && !showResults) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeRemaining, showResults]);

  const loadQuiz = async () => {
    try {
      setLoading(true);

      // Load quiz details
      const quizData = await getQuiz(id);
      setQuiz(quizData);

      // Start new attempt directly (QuizDetail is for standalone quiz taking)
      await startNewAttempt();
    } catch (error) {
      console.error('Error loading quiz:', error);
      toast.error('Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const startNewAttempt = async () => {
    try {
      const attemptData = await startQuizAttempt(id);
      setAttempt(attemptData);

      if (quiz?.time_limit) {
        setTimeRemaining(quiz.time_limit * 60);
      }
    } catch (error) {
      console.error('Error starting attempt:', error);
      toast.error('Failed to start quiz');
    }
  };

  const handleAnswerChange = (questionIndex, answerId) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerId
    }));
  };

  const handleSubmit = async () => {
    if (!attempt || isSubmitting) return;

    try {
      setIsSubmitting(true);

      const result = await submitQuizAnswers(attempt.id, answers);
      setResults(result);
      setShowResults(true);
      toast.success('Quiz submitted successfully!');
      
      // If this quiz is part of an application flow, submit the application
      if (applicationData && result.is_passed) {
        try {
          const formData = new FormData();
          formData.append('formation', applicationData.formationId);
          formData.append('motivation_letter', applicationData.motivationLetter || '');
          formData.append('quiz_score', result.score);
          
          // Handle CV file
          if (applicationData.cvFile) {
            if (applicationData.cvFile instanceof File) {
              formData.append('cv', applicationData.cvFile);
            } else if (applicationData.cvFile.file) {
              formData.append('cv', applicationData.cvFile.file);
            } else if (typeof applicationData.cvFile === 'string') {
              try {
                // If it's a string, it might be a file path - we need the actual file
                const file = await fetch(applicationData.cvFile)
                  .then(r => r.blob())
                  .then(blobFile => new File([blobFile], applicationData.cvFile.split('/').pop(), { type: blobFile.type }));
                formData.append('cv', file);
              } catch (fileError) {
                console.error('Error processing CV file:', fileError);
                throw new Error('Failed to process CV file');
              }
            }
          }
          
          await createApplication(formData);
            
          // Clear the pending application data
          localStorage.removeItem('pendingApplication');
          
          // Navigate back to the formation page after a short delay
          setTimeout(() => {
            if (from) {
              navigate(from);
            } else {
              navigate('/formations');
            }
          }, 2000);
          
        } catch (error) {
          console.error('Error submitting application:', error);
          toast.error('Quiz completed, but there was an error submitting your application.');
        }
      }

    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Failed to submit quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <div className="text-center py-12">Loading quiz...</div>;
  }

  if (!quiz) {
    return <div className="text-center py-12">Quiz not found</div>;
  }
  
  // If we have application data, show a message about the application flow
  const renderApplicationInfo = () => {
    if (!applicationData) return null;
    
    return (
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              This quiz is part of your application process. You'll be redirected back to complete your application after successfully passing the quiz.
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (showResults && results) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        {renderApplicationInfo()}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Results</h1>
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-semibold ${
                results.is_passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {results.is_passed ? (
                  <CheckCircleIcon className="h-6 w-6 mr-2" />
                ) : (
                  <XCircleIcon className="h-6 w-6 mr-2" />
                )}
                {results.score}% - {results.is_passed ? 'PASSED' : 'FAILED'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{results.score}%</div>
              <div className="text-sm text-gray-500">Your Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{results.total_questions}</div>
              <div className="text-sm text-gray-500">Total Questions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{quiz.passing_score}%</div>
              <div className="text-sm text-gray-500">Passing Score</div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate('/quizzes')}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Back to Quizzes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Quiz Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{quiz.title}</h1>
            <p className="text-gray-600 mt-2">{quiz.description}</p>
          </div>
          {timeRemaining !== null && (
            <div className="text-right">
              <div className="flex items-center text-red-600 font-semibold">
                <ClockIcon className="h-5 w-5 mr-2" />
                {formatTime(timeRemaining)}
              </div>
              <div className="text-sm text-gray-500">Time Remaining</div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Category: {quiz.category_name}</span>
          <span>{quiz.total_questions} Questions</span>
          {quiz.time_limit && <span>Time Limit: {quiz.time_limit} minutes</span>}
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {quiz.questions?.map((question, questionIndex) => (
          <div key={questionIndex} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">
              Question {questionIndex + 1}: {question.text}
            </h3>

            <div className="space-y-2">
              {question.options?.map((option) => (
                <label key={option.id} className="flex items-center">
                  <input
                    type="radio"
                    name={`question-${questionIndex}`}
                    value={option.id}
                    checked={answers[questionIndex] === option.id}
                    onChange={() => handleAnswerChange(questionIndex, option.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-3 text-gray-700">{option.text}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="mt-8 text-center">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
        </button>
      </div>
    </div>
  );
};

export default QuizDetail;
