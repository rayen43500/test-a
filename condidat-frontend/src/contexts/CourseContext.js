import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import courseService from '../services/courseService';
import { toast } from 'react-toastify';

const CourseContext = createContext();

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};

export const CourseProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [formations, setFormations] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load all categories
  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await courseService.getCategories();
      setCategories(data.results || data);
      return data;
    } catch (err) {
      const errorMsg = err.message || 'Failed to load categories';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load all formations with optional filters
  const loadFormations = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      const data = await courseService.getFormations(filters);
      setFormations(data.results || data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get a single formation by ID
  const getFormation = async (id) => {
    try {
      setLoading(true);
      return await courseService.getFormation(id);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update category
  const updateCategory = useCallback(async (id, data) => {
    try {
      setLoading(true);
      const updated = await courseService.updateCategory(id, data);
      setCategories(prev => prev.map(c => c.id === id ? updated : c));
      toast.success('Category updated successfully!');
      return updated;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update category';
      setError(msg);
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCategory = useCallback(async (id) => {
    try {
      setLoading(true);
      await courseService.deleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
      toast.success('Category deleted successfully!');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to delete category';
      setError(msg);
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new category
  const createCategory = useCallback(async (categoryData) => {
    try {
      setLoading(true);
      const newCategory = await courseService.createCategory(categoryData);
      setCategories(prev => [newCategory, ...prev]);
      toast.success('Category created successfully!');
      return newCategory;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create category';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new formation
  const createFormation = async (formationData) => {
    try {
      setLoading(true);
      const newFormation = await courseService.createFormation(formationData);
      setFormations(prev => [newFormation, ...prev]);
      toast.success('Formation created successfully!');
      return newFormation;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create formation';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update a formation
  const updateFormation = async (id, formationData) => {
    try {
      setLoading(true);
      const updatedFormation = await courseService.updateFormation(id, formationData);
      setFormations(prev => 
        prev.map(f => f.id === id ? updatedFormation : f)
      );
      toast.success('Formation updated successfully!');
      return updatedFormation;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update formation';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a formation
  const deleteFormation = async (id) => {
    try {
      setLoading(true);
      await courseService.deleteFormation(id);
      setFormations(prev => prev.filter(f => f.id !== id));
      toast.success('Formation deleted successfully!');
      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to delete formation';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Enroll in a formation
  const enrollInFormation = async (formationId) => {
    try {
      setLoading(true);
      const result = await courseService.enrollInFormation(formationId);
      // Update the formation in the state
      setFormations(prev => 
        prev.map(f => 
          f.id === formationId 
            ? { 
                ...f, 
                current_participants: f.current_participants + 1,
                participants: [...(f.participants || []), { id: result.user_id }] // Add current user to participants
              } 
            : f
        )
      );
      toast.success('Successfully enrolled in the formation!');
      return result;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to enroll in the formation';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get formation participants
  const getFormationParticipants = async (formationId) => {
    try {
      setLoading(true);
      const participants = await courseService.getFormationParticipants(formationId);
      return participants;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to load participants';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Quiz management functions
  const loadQuizzes = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      const data = await courseService.getQuizzes(filters);
      setQuizzes(data.results || data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getQuiz = async (id) => {
    try {
      setLoading(true);
      return await courseService.getQuiz(id);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createQuiz = async (quizData) => {
    try {
      setLoading(true);
      const newQuiz = await courseService.createQuiz(quizData);
      setQuizzes(prev => [newQuiz, ...prev]);
      toast.success('Quiz created successfully!');
      return newQuiz;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create quiz';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuiz = async (id, quizData) => {
    try {
      setLoading(true);
      const updatedQuiz = await courseService.updateQuiz(id, quizData);
      setQuizzes(prev =>
        prev.map(q => q.id === id ? updatedQuiz : q)
      );
      toast.success('Quiz updated successfully!');
      return updatedQuiz;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update quiz';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteQuiz = async (id) => {
    try {
      setLoading(true);
      await courseService.deleteQuiz(id);
      setQuizzes(prev => prev.filter(q => q.id !== id));
      toast.success('Quiz deleted successfully!');
      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to delete quiz';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const startQuizAttempt = async (quizId) => {
    try {
      setLoading(true);
      const attempt = await courseService.startQuizAttempt(quizId);
      return attempt;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to start quiz';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitQuizAnswers = async (attemptId, answers) => {
    try {
      setLoading(true);
      const result = await courseService.submitQuizAnswers(attemptId, answers);
      return result;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to submit quiz';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Clear errors
  const clearError = () => setError(null);

  // Remplacez seulement la fonction getApplications dans votre CourseContext.js

const getApplications = async (params = {}) => {
  try {
    setLoading(true);
    
    // ✅ Construction des paramètres avec pagination
    const searchParams = new URLSearchParams();
    
    // ✅ PAGINATION : 10 éléments par page
    searchParams.append('page_size', '10');
    
    // Ajouter les filtres
    if (params.status) {
      searchParams.append('status', params.status);
    }
    if (params.formation) {
      searchParams.append('formation', params.formation);
    }
    if (params.page) {
      searchParams.append('page', params.page);
    }

    console.log('🔵 [CourseContext] Appel getApplications avec params:', searchParams.toString());
    
    const data = await courseService.getApplications(Object.fromEntries(searchParams));
    
    console.log('✅ [CourseContext] Données reçues:', data);
    console.log('📊 [CourseContext] Nombre d\'applications:', data?.results?.length || data?.length || 0);
    
    return data;
  } catch (err) {
    console.error('❌ [CourseContext] Erreur:', err);
    setError(err.message);
    throw err;
  } finally {
    setLoading(false);
  }
};

  const createApplication = async (applicationData) => {
    try {
      setLoading(true);
      const newApplication = await courseService.createApplication(applicationData);
      toast.success('Application submitted successfully!');
      return newApplication;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to submit application';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const approveApplication = async (id, notes = '') => {
    try {
      setLoading(true);
      const updatedApplication = await courseService.approveApplication(id, notes);
      toast.success('Application approved successfully!');
      return updatedApplication;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to approve application';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const rejectApplication = async (id, notes = '') => {
    try {
      setLoading(true);
      const updatedApplication = await courseService.rejectApplication(id, notes);
      toast.success('Application rejected successfully!');
      return updatedApplication;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to reject application';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CourseContext.Provider
      value={{
        categories,
        formations,
        quizzes,
        loading,
        error,
        loadCategories,
        createCategory,
        updateCategory,
        deleteCategory,
        loadFormations,
        getFormation,
        createFormation,
        updateFormation,
        deleteFormation,
        enrollInFormation,
        getFormationParticipants,
        loadQuizzes,
        getQuiz,
        createQuiz,
        updateQuiz,
        deleteQuiz,
        startQuizAttempt,
        submitQuizAnswers,
        getApplications,
        createApplication,
        approveApplication,
        rejectApplication,
        clearError,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export default CourseContext;
