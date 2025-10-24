import React, { useState, useEffect, useRef, useCallback } from 'react';
import { XMarkIcon, DocumentIcon, AcademicCapIcon, PencilSquareIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import QuizTaking from '../quizzes/QuizTaking';

const ApplicationModal = ({ isOpen, onClose, formation, requiredQuiz, onSubmit }) => {
  // State for modal steps and form data
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    cv: null,
    cvFile: null,
    motivationLetter: '',
  });
  const [quizState, setQuizState] = useState({
    attempt: null,
    completed: false,
    score: 0,
    passed: false,
    showQuiz: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize modal when opened
  const initializedRef = useRef(false);
  
  useEffect(() => {
    if (isOpen && !initializedRef.current) {
      // Only initialize once when the modal first opens
      initializedRef.current = true;
      setCurrentStep(1);
      setFormData({
        cv: null,
        cvFile: null,
        motivationLetter: '',
      });
      setQuizState({
        attempt: null,
        completed: false,
        score: 0,
        passed: false,
        showQuiz: false,
      });
    }
    
    return () => {
      // Reset the initialized state when modal closes
      if (!isOpen) {
        initializedRef.current = false;
      }
    };
  }, [isOpen]);

  // Calculate step information
  const totalSteps = requiredQuiz ? 3 : 2;
  const cvStep = requiredQuiz ? 2 : 1;
  const motivationStep = requiredQuiz ? 3 : 2;

  // Navigation handlers
  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Form handlers
  const handleCvUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF or Word document');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setFormData(prev => ({
      ...prev,
      cv: URL.createObjectURL(file),
      cvFile: file
    }));
    toast.success('CV uploaded successfully!');
  };

  // Handle quiz completion
  const handleQuizComplete = useCallback(async (score, passed) => {
    try {
      setQuizState(prev => {
        // Only update if the state is actually changing
        if (prev.completed && prev.score === score && prev.passed === passed) {
          return prev;
        }
        return {
          ...prev,
          completed: true,
          score,
          passed,
          showQuiz: false
        };
      });
      
      // If quiz is passed, move to next step
      if (passed) {
        setCurrentStep(prev => Math.max(prev, 2)); // Move to CV step
      }
    } catch (error) {
      console.error('Error handling quiz completion:', error);
      toast.error('Failed to process quiz results');
    }
  }, []);

  const handleSubmit = async () => {
    // Validation
    if (requiredQuiz && !quizState.completed) {
      toast.error('Please complete the quiz first');
      return;
    }

    if (requiredQuiz && !quizState.passed) {
      toast.error('You must pass the quiz to apply');
      return;
    }

    if (!formData.cvFile) {
      toast.error('Please upload your CV');
      return;
    }

    if (!formData.motivationLetter.trim()) {
      toast.error('Please write a motivation letter');
      return;
    }

    try {
      setIsSubmitting(true);
      const formDataObj = new FormData();
      formDataObj.append('formation', formation.id);
      
      if (requiredQuiz && quizState.attempt) {
        formDataObj.append('quiz_attempt', quizState.attempt.id);
      }
      
      formDataObj.append('cv', formData.cvFile);
      formDataObj.append('application_message', formData.motivationLetter);

      await onSubmit(formDataObj);
      onClose();
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Memoize the quiz step to prevent unnecessary re-renders
  const renderQuizStep = useCallback(() => {
    // If quiz is completed, show the result
    if (quizState.completed) {
      return (
        <div className="text-center py-8">
          <div className={`p-4 rounded-lg mb-6 ${quizState.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center justify-center">
              {quizState.passed ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
              )}
              <span className="text-sm font-medium">
                Quiz {quizState.passed ? 'Passed' : 'Failed'}: {quizState.score}% 
                (Required: {requiredQuiz?.passing_score}%)
              </span>
            </div>
          </div>
          
          {quizState.passed ? (
            <p className="text-green-600 mb-4">You've passed the quiz! You can now continue with your application.</p>
          ) : (
            <div className="mb-4">
              <p className="text-red-600 mb-2">You didn't pass the quiz. Please try again.</p>
              <button
                onClick={() => setQuizState(prev => ({
                  ...prev,
                  completed: false,
                  score: 0,
                  passed: false,
                  showQuiz: true
                }))}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Retake Quiz
              </button>
            </div>
          )}
        </div>
      );
    }

    // Show the quiz taking interface
    return (
      <div className="space-y-6">
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-2">Take the Required Quiz</h4>
          <p className="text-sm text-gray-600 mb-4">
            You must pass this quiz to complete your application. Passing score: {requiredQuiz?.passing_score}%
          </p>

          <div className="border rounded-lg p-6">
            <QuizTaking
              key={quizState.attempt?.id || 'quiz'}
              quizId={requiredQuiz?.id}
              onComplete={handleQuizComplete}
              onCancel={() => {
                // If user cancels, go back to the start
                setQuizState(prev => ({
                  ...prev,
                  attempt: null,
                  completed: false,
                  score: 0,
                  passed: false,
                  showQuiz: false
                }));
              }}
            />
          </div>
        </div>
      </div>
    );
  }, [quizState.completed, quizState.passed, quizState.score, requiredQuiz, handleQuizComplete]);

  // Render CV upload step
  const renderCvStep = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-2">Upload Your CV</h4>
        <p className="text-sm text-gray-600 mb-4">
          Upload your CV in PDF or Word format (max 5MB)
        </p>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="text-center">
            {formData.cv ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <DocumentIcon className="h-12 w-12 text-blue-500" />
                </div>
                <p className="text-sm text-gray-600">CV uploaded successfully</p>
                <button
                  onClick={() => setFormData(prev => ({ ...prev, cv: null, cvFile: null }))}
                  className="text-sm text-red-600 hover:text-red-800 transition-colors"
                >
                  Remove and upload new CV
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <DocumentIcon className="h-12 w-12 text-gray-400" />
                </div>
                <div>
                  <label htmlFor="cv-upload" className="cursor-pointer">
                    <span className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors">
                      Upload your CV
                    </span>
                    <input
                      id="cv-upload"
                      name="cv"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleCvUpload}
                      className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 5MB</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Render motivation letter step
  const renderMotivationStep = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-2">Write Your Motivation Letter</h4>
        <p className="text-sm text-gray-600 mb-4">
          Tell the instructor why you want to join this formation and what you hope to achieve.
        </p>

        {requiredQuiz && quizState.completed && (
          <div className={`p-4 rounded-lg mb-4 ${quizState.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center">
              <AcademicCapIcon className={`h-5 w-5 mr-2 ${quizState.passed ? 'text-green-500' : 'text-red-500'}`} />
              <span className="text-sm font-medium">
                Quiz Result: {quizState.score}% {quizState.passed ? '(Passed)' : '(Failed)'}
              </span>
            </div>
          </div>
        )}

        <textarea
          value={formData.motivationLetter}
          onChange={(e) => setFormData(prev => ({ ...prev, motivationLetter: e.target.value }))}
          rows={8}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="Write your motivation letter here... Explain why you're interested in this formation, your background, and what you hope to achieve."
        />
      </div>
    </div>
  );

  // Determine if we can proceed to next step
  const canProceed = () => {
    if (currentStep === 1 && requiredQuiz) {
      return quizState.completed && quizState.passed;
    }
    if (currentStep === cvStep) {
      return !!formData.cvFile;
    }
    return true;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Apply for {formation?.title}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isSubmitting}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-8">
              {requiredQuiz && (
                <>
                  <div className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                      currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      <AcademicCapIcon className="w-4 h-4" />
                    </div>
                    <span className="ml-2 text-sm font-medium">Quiz</span>
                  </div>
                  <div className={`w-12 h-0.5 mx-4 transition-colors ${
                    currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'
                  }`}></div>
                </>
              )}
              
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                  currentStep >= cvStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  <DocumentIcon className="w-4 h-4" />
                </div>
                <span className="ml-2 text-sm font-medium">CV</span>
              </div>
              
              <div className={`w-12 h-0.5 mx-4 transition-colors ${
                currentStep >= motivationStep ? 'bg-blue-600' : 'bg-gray-200'
              }`}></div>
              
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                  currentStep >= motivationStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  <PencilSquareIcon className="w-4 h-4" />
                </div>
                <span className="ml-2 text-sm font-medium">Motivation</span>
              </div>
            </div>

            {/* Step Content */}
            <div className="min-h-[400px]">
              {currentStep === 1 && requiredQuiz && (
                <div key="quiz-step">
                  {renderQuizStep()}
                </div>
              )}
              {currentStep === cvStep && renderCvStep()}
              {currentStep === motivationStep && renderMotivationStep()}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <div className="flex justify-between w-full">
              {currentStep < totalSteps ? (
                <button
                  onClick={goToNextStep}
                  disabled={!canProceed() || isSubmitting}
                  className={`px-4 py-2 rounded-md text-white transition-colors ${
                    !canProceed() || isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {currentStep === totalSteps - 1 ? 'Review & Submit' : 'Continue'}
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`px-4 py-2 rounded-md text-white transition-colors ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              )}

              {currentStep > 1 && (
                <button
                  onClick={goToPreviousStep}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Back
                </button>
              )}

              <button
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationModal;
