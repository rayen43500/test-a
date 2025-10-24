import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import { useCourses } from '../../contexts/CourseContext';
import { 
  ClockIcon, 
  AcademicCapIcon, 
  ArrowLeftIcon, 
  ArrowRightIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  },
  exit: { opacity: 0 }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  },
  exit: { y: -20, opacity: 0 }
};

const optionVariants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.02,
    transition: { type: 'spring', stiffness: 400, damping: 10 }
  },
  selected: { 
    scale: 1.03,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: '#3b82f6'
  }
};

const QuizTaking = ({ quizId, onComplete, onCancel, applicationData }) => {
  const { startQuizAttempt, submitQuizAnswers, getQuiz } = useCourses();
  
  // Memoize the quiz ID to prevent unnecessary re-renders
  const quizIdRef = useRef(quizId);
  
  // Update the ref if quizId changes
  useEffect(() => {
    quizIdRef.current = quizId;
  }, [quizId]);
  const [quiz, setQuiz] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Load quiz data on mount
  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      try {
        setLoading(true);
        const quizData = await getQuiz(quizIdRef.current);
        if (isMounted) {
          setQuiz(prevQuiz => {
            return JSON.stringify(prevQuiz) === JSON.stringify(quizData) ? prevQuiz : quizData;
          });
        }
      } catch (error) {
        console.error('Error loading quiz:', error);
        toast.error('Failed to load quiz');
        if (isMounted) onCancel();
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    loadData();
    
    return () => {
      isMounted = false;
    };
  }, [getQuiz, onCancel]);

  // Handle timer
  useEffect(() => {
    if (attempt && timeRemaining !== null && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Auto-submit when time runs out
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeRemaining, attempt]);

  const startQuiz = useCallback(async () => {
    try {
      setLoading(true);
      // Start attempt only when user clicks start
      const attemptData = await startQuizAttempt(quizIdRef.current);
      
      // Update state in a single call to prevent partial updates
      setQuiz(prevQuiz => ({
        ...prevQuiz,
        started: true
      }));
      
      setAttempt(prevAttempt => 
        JSON.stringify(prevAttempt) === JSON.stringify(attemptData) ? prevAttempt : attemptData
      );

      if (quiz?.time_limit) {
        setTimeRemaining(prev => prev === quiz.time_limit * 60 ? prev : quiz.time_limit * 60);
      }
    } catch (error) {
      console.error('Error starting quiz:', error);
      toast.error('Failed to start quiz');
      onCancel();
    } finally {
      setLoading(false);
    }
  }, [quiz?.time_limit, startQuizAttempt, onCancel]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!attempt || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const result = await submitQuizAnswers(attempt.id, answers);

      toast.success(`Quiz submitted! Score: ${result.score}%`);

      onComplete({
        score: parseInt(result.score), // Ensure score is a number
        applicationData
      });
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
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-16 w-16 rounded-full border-4 border-blue-500 border-t-transparent"
        />
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-lg font-medium text-gray-700"
        >
          Preparing your quiz...
        </motion.p>
      </div>
    );
  }
  
  // Show start screen if quiz is loaded but not started
  if (!attempt && quiz) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center"
        >
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-blue-50">
            <AcademicCapIcon className="h-12 w-12 text-blue-600" />
          </div>
          
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {quiz.title}
          </h2>
          
          <div className="mt-6 bg-white shadow rounded-lg p-6 text-left max-w-md mx-auto">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-blue-600">
                  <CheckCircleIcon className="h-6 w-6" />
                </div>
                <p className="ml-3 text-base text-gray-700">
                  <span className="font-medium">{quiz.questions?.length || 0} questions</span>
                </p>
              </div>
              
              {quiz.time_limit && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 text-blue-600">
                    <ClockIcon className="h-6 w-6" />
                  </div>
                  <p className="ml-3 text-base text-gray-700">
                    <span className="font-medium">{quiz.time_limit} minute{quiz.time_limit !== 1 ? 's' : ''}</span> time limit
                  </p>
                </div>
              )}
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-blue-600">
                  <CheckCircleIcon className="h-6 w-6" />
                </div>
                <p className="ml-3 text-base text-gray-700">
                  <span className="font-medium">{quiz.passing_score}%</span> passing score
                </p>
              </div>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={startQuiz}
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
                    Starting...
                  </span>
                ) : (
                  'Start Quiz'
                )}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={onCancel}
                className="w-full sm:w-auto px-8 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                Cancel
              </motion.button>
            </div>
          </div>
          
          <p className="mt-8 text-sm text-gray-500">
            Make sure you're in a quiet place with a stable internet connection.
          </p>
        </motion.div>
      </motion.div>
    );
  }

  if (!quiz || !attempt) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md mx-auto py-12 px-4 text-center"
      >
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
          <XCircleIcon className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="mt-2 text-lg font-medium text-gray-900">Failed to load quiz</h3>
        <p className="mt-1 text-sm text-gray-500">
          We couldn't load the quiz. Please try again later.
        </p>
        <div className="mt-6">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCancel}
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
          >
            Go Back
          </motion.button>
        </div>
      </motion.div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-4xl mx-auto bg-gray-50 min-h-screen"
    >
      {/* Header */}
      <motion.div 
        variants={itemVariants}
        className="bg-white shadow-sm sticky top-0 z-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{quiz.title}</h1>
              <p className="text-sm text-gray-500">
                Question <span className="font-medium">{currentQuestionIndex + 1}</span> of{' '}
                <span className="font-medium">{quiz.questions.length}</span>
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {timeRemaining !== null && (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center px-3 py-1.5 bg-red-50 rounded-full"
                >
                  <ClockIcon className="h-5 w-5 text-red-600" />
                  <span className="ml-1.5 font-mono text-lg font-medium text-red-700">
                    {formatTime(timeRemaining)}
                  </span>
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={onCancel}
                className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                Exit Quiz
              </motion.button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        variants={itemVariants}
        className="px-4 py-8 sm:px-6 lg:px-8"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* Question */}
            <div className="p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-800 font-medium text-sm">
                  {currentQuestionIndex + 1}
                </span>
                <h2 className="ml-3 text-lg font-medium text-gray-900">
                  {currentQuestion.question_text}
                </h2>
              </div>

              {/* Options */}
              <motion.div 
                variants={containerVariants}
                className="space-y-3 mt-6"
              >
                {currentQuestion.choices.map((choice, index) => {
                  const isSelected = answers[currentQuestion.id] === choice;
                  return (
                    <motion.label 
                      key={index}
                      variants={optionVariants}
                      className={`block cursor-pointer`}
                      whileHover="hover"
                      animate={isSelected ? 'selected' : 'rest'}
                    >
                      <div className={`relative rounded-lg border-2 p-4 transition-all duration-200 ${isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-300'}`}>
                        <div className="flex items-center">
                          <div className={`flex items-center justify-center h-5 w-5 rounded-full border-2 ${isSelected 
                            ? 'bg-blue-600 border-blue-600' 
                            : 'border-gray-300'}`}>
                            {isSelected && (
                              <div className="h-2 w-2 rounded-full bg-white" />
                            )}
                          </div>
                          <span className="ml-3 text-gray-700">
                            {choice}
                          </span>
                        </div>
                        <input
                          type="radio"
                          name={`question-${currentQuestion.id}`}
                          value={choice}
                          checked={isSelected}
                          onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                          className="sr-only"
                        />
                      </div>
                    </motion.label>
                  );
                })}
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <motion.div 
          variants={itemVariants}
          className="mt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0"
        >
          <motion.button
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`w-full sm:w-auto flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md ${
              currentQuestionIndex === 0 
                ? 'text-gray-400 bg-gray-50 cursor-not-allowed' 
                : 'text-gray-700 bg-white hover:bg-gray-50'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200`}
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Previous
          </motion.button>

          <div className="flex space-x-1">
            {quiz.questions.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`h-2.5 w-2.5 rounded-full transition-colors duration-200 ${
                  index === currentQuestionIndex
                    ? 'bg-blue-600 scale-125'
                    : answers[quiz.questions[index].id]
                    ? 'bg-green-500'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to question ${index + 1}`}
              />
            ))}
          </div>

          {currentQuestionIndex === quiz.questions.length - 1 ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                isSubmitting 
                  ? 'bg-green-500' 
                  : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200`}
            >
              {isSubmitting ? (
                <>
                  <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />
                  Submitting...
                </>
              ) : (
                'Submit Quiz'
              )}
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              Next
              <ArrowRightIcon className="h-4 w-4 ml-2" />
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(QuizTaking);
