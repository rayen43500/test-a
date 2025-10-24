import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCourses } from '../../contexts/CourseContext';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import { PencilIcon, TrashIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const FormationDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getFormation, deleteFormation, loading, error, loadQuizzes, createApplication, getApplications } = useCourses();
  const [formation, setFormation] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [existingApplication, setExistingApplication] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [requiredQuiz, setRequiredQuiz] = useState(null);
  const [checkingQuizStatus, setCheckingQuizStatus] = useState(false);
  const [formData, setFormData] = useState({
    cv: null,
    cvFile: null,
    motivationLetter: '',
    quizCompleted: false,
    quizScore: null,
    quizAttemptId: null
  });
  const checkedCategoriesRef = useRef(new Set()); // Cache for checked categories

  useEffect(() => {
    const loadFormation = async () => {
      try {
        const data = await getFormation(id);
        setFormation(data);
        // Check if current user is enrolled
        if (data.participants && user) {
          const enrolled = data.participants.some(p => p.id === user.id);
          setIsEnrolled(enrolled);
        }

        // Check for existing application
        if (user && user.role === 'Candidat') {
          await checkExistingApplication(data.id);
        }

        // Check for required quiz
        if (data.category && user) {
          console.log('Formation category:', data.category);
          await checkRequiredQuiz(data.category);
        } else {
          console.log('No category found or user not logged in, skipping quiz check');
          setRequiredQuiz(null);
        }
      } catch (error) {
        console.error('Error loading formation:', error);
      }
    };

    loadFormation();
  }, [id, user]);

  // Check for pending application data when component mounts
  useEffect(() => {
    const pendingApp = localStorage.getItem('pendingApplication');
    if (pendingApp) {
      const { cv, motivationLetter, formationId } = JSON.parse(pendingApp);
      if (formationId === id) {
        setFormData(prev => ({
          ...prev,
          cv,
          motivationLetter
        }));
      }
      localStorage.removeItem('pendingApplication');
    }
  }, [id]);

  // Re-check quiz status when component gains focus (user returns from quiz)
  useEffect(() => {
    const handleFocus = async () => {
      // Only re-check if we have a formation and haven't checked recently
      if (formation?.category && user && user.role === 'Candidat' && !checkingQuizStatus) {
        await checkRequiredQuiz(formation.category);
        
        // Check if user has completed the quiz
        if (requiredQuiz) {
          try {
            const response = await fetch(`/api/courses/quizzes/${requiredQuiz.id}/user-status/`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('access')}`,
                'Content-Type': 'application/json',
              }
            });
            
            if (response.ok) {
              const data = await response.json();
              if (data.completed) {
                setFormData(prev => ({
                  ...prev,
                  quizCompleted: true,
                  quizScore: data.score,
                  quizAttemptId: data.attempt_id
                }));
                
                // Auto-submit the application after quiz completion if we have all required data
                if (formData.cvFile) {
                  const success = await submitApplication(data.attempt_id);
                  if (success) {
                    // Clear any pending application data
                    localStorage.removeItem('pendingApplication');
                  }
                }
              }
            }
          } catch (error) {
            console.error('Error checking quiz status:', error);
          }
        }
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [formation?.category, user?.id, requiredQuiz?.id]);

  const checkExistingApplication = async (formationId) => {
    try {
      // Check if user already has an application for this formation
      const applications = await getApplications({ formation: formationId, candidate: user.id });
      if (applications.results && applications.results.length > 0) {
        setExistingApplication(applications.results[0]);
      }
    } catch (error) {
      console.error('Error checking existing application:', error);
    }
  };

  const checkRequiredQuiz = async (categoryId) => {
    // Check cache first to avoid duplicate API calls
    if (checkedCategoriesRef.current.has(categoryId)) {
      return;
    }

    // Prevent multiple simultaneous checks
    if (checkingQuizStatus) {
      return;
    }

    try {
      setCheckingQuizStatus(true);
      const quizzes = await loadQuizzes({ category: categoryId, is_active: true });

      // Mark this category as checked
      checkedCategoriesRef.current.add(categoryId);

      if (quizzes?.results?.length > 0) {
        const activeQuiz = quizzes.results[0];
        // Only update if the quiz is different
        if (JSON.stringify(requiredQuiz) !== JSON.stringify(activeQuiz)) {
          setRequiredQuiz(activeQuiz);
        }
      } else if (requiredQuiz !== null) {
        // Only set to null if it's not already null
        setRequiredQuiz(null);
      }
    } catch (error) {
      console.error('Error checking required quiz:', error);
      if (requiredQuiz !== null) {
        setRequiredQuiz(null);
      }
    } finally {
      setCheckingQuizStatus(false);
    }
  };

  const handleApply = () => {
    if (!user) {
      navigate('/login', { state: { from: `/formations/${id}` } });
      return;
    }

    if (existingApplication) return;
    
    // Toggle application form visibility
    setShowApplicationForm(prev => !prev);
  };

  const submitApplication = async (quizScore = null) => {
    if (!formData.cvFile) {
      toast.error('Please upload your CV');
      return false;
    }

    try {
      setIsApplying(true);
      const applicationData = new FormData();
      
      // Add formation ID
      applicationData.append('formation', id);
      
      // Handle CV file - ensure we're using the File object
      if (formData.cvFile instanceof File) {
        applicationData.append('cv', formData.cvFile);
      } else if (formData.cvFile?.file) {
        applicationData.append('cv', formData.cvFile.file);
      } else if (typeof formData.cvFile === 'string') {
        // If it's a string, it might be a file path - we need the actual file
        const file = await fetch(formData.cvFile).then(r => r.blob())
          .then(blobFile => new File([blobFile], formData.cvFile.split('/').pop(), { type: blobFile.type }));
        applicationData.append('cv', file);
      } else {
        throw new Error('Invalid file format');
      }
      
      // Add motivation letter if it exists
      if (formData.motivationLetter) {
        applicationData.append('motivation_letter', formData.motivationLetter);
      }
      
      // Add quiz score if available
      if (quizScore !== null && quizScore !== undefined) {
        // Convert to number and ensure it's a valid score
        const score = Number(quizScore);
        if (!isNaN(score)) {
          applicationData.append('quiz_score', score);
        }
      }
      
      const newApplication = await createApplication(applicationData);
      setExistingApplication(newApplication);
      setShowApplicationForm(false);
      return true;
    } catch (error) {
      console.error('Error submitting application:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit application';
      return false;
    } finally {
      setIsApplying(false);
    }
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.cvFile) {
      return;
    }
    
    // If quiz is required but not completed
    if (requiredQuiz && !formData.quizCompleted) {
      // Store the actual file object if it exists
      const appData = {
        cv: formData.cv,
        cvFile: formData.cvFile,
        motivationLetter: formData.motivationLetter,
        formationId: id
      };
      
      // Store in localStorage for after quiz completion
      localStorage.setItem('pendingApplication', JSON.stringify(appData));
      
      // Navigate to quiz
      navigate(`/quizzes/${requiredQuiz.id}`, { 
        state: { 
          from: `/formations/${id}`,
          returnAfterCompletion: true,
          applicationData: appData
        } 
      });
      return;
    }
    
    // Submit with the quiz score if we have one
    await submitApplication(formData.quizScore);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this formation? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteFormation(id);
      navigate('/formations');
    } catch (err) {
      console.error('Error deleting formation:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading formation details...</div>;
  if (error) return <div className="text-red-500 text-center py-12">Error: {error}</div>;
  if (!formation) return <div className="text-center py-12">Formation not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Formations
        </button>
        
        <div className="flex space-x-2">
          {(user?.role === 'Admin' || user?.id === formation?.instructor) && (
            <>
              <Link
                to={`/formations/${id}/edit`}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PencilIcon className="-ml-0.5 mr-1.5 h-4 w-4" aria-hidden="true" />
                Edit
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-1.5 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  <>
                    <TrashIcon className="-ml-0.5 mr-1.5 h-4 w-4" aria-hidden="true" />
                    Delete
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {formation.image && (
          <div className="h-64 overflow-hidden">
            <img 
              src={formation.image} 
              alt={formation.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{formation.title}</h1>
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-3">
                  {formation.level ? formation.level.charAt(0).toUpperCase() + formation.level.slice(1) : 'N/A'}
                </span>
                <span className="mr-3">
                  <i className="fas fa-user-tie mr-1"></i>
                  {formation.instructor_name || 'Instructor'}
                </span>
                <span>
                  <i className="fas fa-language mr-1"></i>
                  {formation.language}
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                ${Number(formation.price || 0).toFixed(2)}
                {formation.discount > 0 && (
                  <span className="ml-2 text-sm text-green-600 line-through">
                    ${(Number(formation.price || 0) / (1 - Number(formation.discount) / 100)).toFixed(2)}
                  </span>
                )}
              </div>
              {formation.discount > 0 && (
                <div className="text-sm text-green-600">
                  {Number(formation.discount)}% discount applied
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-4">Description</h3>
                <p className="text-gray-700 mb-6 whitespace-pre-line">{formation.description}</p>
                
                <h3 className="text-lg font-semibold mb-4">What You'll Learn</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Key concepts and principles</li>
                  <li>Practical applications</li>
                  <li>Hands-on exercises</li>
                  <li>Real-world examples</li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Course Details</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-gray-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Start Date</div>
                      <div>{formation.start_date ? format(new Date(formation.start_date), 'MMMM d, yyyy') : 'TBD'}</div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-gray-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Duration</div>
                      <div>{formation.duration || 0} hours</div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-gray-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Location</div>
                      <div>{formation.location}</div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-gray-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Participants</div>
                      <div>{formation.current_participants || 0}/{formation.max_participants || 0} enrolled</div>
                    </div>
                  </li>
                </ul>

                <div className="mt-6">
                 

                  {/* Application Status */}
                  {existingApplication && user?.role === 'Candidat' && (
                    <div className={`mb-4 p-4 rounded-lg border ${
                      existingApplication.status === 'approved' ? 'bg-green-50 border-green-200' :
                      existingApplication.status === 'rejected' ? 'bg-red-50 border-red-200' :
                      'bg-yellow-50 border-yellow-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            existingApplication.status === 'approved' ? 'bg-green-100 text-green-800' :
                            existingApplication.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {existingApplication.status ? existingApplication.status.charAt(0).toUpperCase() + existingApplication.status.slice(1) : 'Unknown'}
                          </span>
                          <span className="ml-2 text-sm text-gray-700">
                            Application submitted {new Date(existingApplication.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      {existingApplication.review_notes && (
                        <div className="mt-2 text-sm text-gray-600">
                          <strong>Instructor Notes:</strong> {existingApplication.review_notes}
                        </div>
                      )}
                    </div>
                  )}

                  {isEnrolled ? (
                    <button
                      disabled
                      className="w-full bg-green-100 text-green-800 py-2 px-4 rounded-md font-medium"
                    >
                      Enrolled
                    </button>
                  ) : existingApplication && existingApplication.status === 'approved' ? (
                    <button
                      disabled
                      className="w-full bg-green-100 text-green-800 py-2 px-4 rounded-md font-medium"
                    >
                      Application Approved - Enrolled
                    </button>
                  ) : existingApplication ? (
                    <div className="space-y-4">
                      <button
                        disabled
                        className={`w-full py-2 px-4 rounded-md font-medium ${
                          existingApplication.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          existingApplication.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-green-100 text-green-800'
                        }`}
                      >
                        {existingApplication.status === 'pending' ? 'Application Pending Review' :
                         existingApplication.status === 'rejected' ? 'Application Rejected' :
                         'Application Approved'}
                      </button>
                      {existingApplication.status === 'rejected' && (
                        <button
                          onClick={handleApply}
                          className="w-full bg-blue-100 text-blue-700 py-2 px-4 rounded-md hover:bg-blue-200 transition-colors"
                          disabled={isApplying}
                        >
                          {isApplying ? 'Processing...' : 'Re-apply'}
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <button
                        onClick={handleApply}
                        disabled={isApplying || (formation && (formation.current_participants || 0) >= (formation.max_participants || 0))}
                        className={`w-full py-2 px-4 rounded-md transition-colors text-white 
                          ${ (formation && (formation.current_participants || 0) >= (formation.max_participants || 0)) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
                        `}
                      >
                        {showApplicationForm ? 'Cancel' : 'Apply Now'}
                      </button>
                      
                      {showApplicationForm && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <h4 className="text-lg font-medium mb-4">Application Form</h4>
                          
                          <form onSubmit={handleApplicationSubmit} className="space-y-4">
                            {/* Quiz Section */}
                            {requiredQuiz && (
                              <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <h4 className="text-sm font-medium text-blue-800 mb-2">Required Quiz: {requiredQuiz.title}</h4>
                                {formData.quizCompleted ? (
                                  <div className="text-sm text-green-700 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Quiz completed {formData.quizScore !== null ? `(Score: ${formData.quizScore}%)` : ''}
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                 
                                  {!formData.cvFile && (
                                    <p className="text-xs text-red-600 mt-1">
                                      Please upload your CV before taking the quiz
                                    </p>
                                  )}
                                </div>
                                )}
                              </div>
                            )}
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                CV (PDF or Word) *
                              </label>
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    setFormData(prev => ({
                                      ...prev,
                                      cv: URL.createObjectURL(file),
                                      cvFile: file
                                    }));
                                    
                                    // Update pending application data if exists
                                    const pendingApp = localStorage.getItem('pendingApplication');
                                    if (pendingApp) {
                                      const appData = JSON.parse(pendingApp);
                                      localStorage.setItem('pendingApplication', JSON.stringify({
                                        ...appData,
                                        cv: URL.createObjectURL(file),
                                        cvFile: file.name
                                      }));
                                    }
                                  }
                                }}
                                required
                                className={`block w-full text-sm text-gray-500
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-md file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-blue-50 file:text-blue-700
                                  hover:file:bg-blue-100
                                  ${!formData.cvFile ? 'border-red-300' : ''}`}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Motivation Letter *
                              </label>
                              <textarea
                                rows={4}
                                value={formData.motivationLetter}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setFormData(prev => ({
                                    ...prev,
                                    motivationLetter: value
                                  }));
                                  
                                  // Update pending application data if exists
                                  const pendingApp = localStorage.getItem('pendingApplication');
                                  if (pendingApp) {
                                    const appData = JSON.parse(pendingApp);
                                    localStorage.setItem('pendingApplication', JSON.stringify({
                                      ...appData,
                                      motivationLetter: value
                                    }));
                                  }
                                }}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Explain why you want to join this formation..."
                              />
                            </div>
                            
                            <button
                              type="submit"
                              className={`w-full py-2 px-4 rounded-md transition-colors ${
                                !formData.cvFile
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-green-600 text-white hover:bg-green-700'
                              }`}
                              disabled={isApplying || !formData.cvFile}
                            >
                              {isApplying ? 'Submitting...' : 'Submit Application'}
                            </button>
                          </form>
                        </div>
                      )}
                    </div>
                  )}

                  {formation && (formation.current_participants || 0) >= (formation.max_participants || 0) && (
                    <p className="mt-2 text-sm text-red-600 text-center">This formation is full</p>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Instructor</h3>
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl font-bold">
                    {formation.instructor_name && formation.instructor_name.length > 0 ? formation.instructor_name.charAt(0).toUpperCase() : 'I'}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium">{formation.instructor_name || 'Instructor'}</h4>
                    <p className="text-sm text-gray-600">Professional Instructor</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default FormationDetail;
