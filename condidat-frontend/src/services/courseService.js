import axios from 'axios';
import authService from './authService';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  // Don't set default Content-Type here
});

// Add request interceptor to include auth token and handle FormData
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Don't set Content-Type for FormData, let the browser set it with the correct boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else if (!config.headers['Content-Type']) {
      // Default to JSON for non-FormData requests
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          localStorage.setItem('accessToken', access);
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

class CourseService {
  // Helper method to handle file uploads and form data
  createFormData = (data) => {
    const formData = new FormData();
    
    // Handle each field individually with proper type checking
    const appendFormData = (key, value) => {
      // Skip undefined and null values
      if (value === undefined || value === null) return;
      
      // Handle File objects
      if (value instanceof File) {
        formData.append(key, value);
      }
      // Handle arrays
      else if (Array.isArray(value)) {
        // Special handling for requirements and learning points
        if (key === 'requirements' || key === 'what_you_will_learn') {
          value.forEach((item, index) => {
            formData.append(`${key}[${index}]`, item);
          });
        } else {
          formData.append(key, JSON.stringify(value));
        }
      }
      // Handle boolean values (convert to string)
      else if (typeof value === 'boolean') {
        formData.append(key, value.toString());
      }
      // Handle numbers and strings
      else if (typeof value === 'number' || typeof value === 'string') {
        formData.append(key, value.toString());
      }
      // Handle nested objects (should be rare, but just in case)
      else if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      }
    };
    
    // Process each field in the data object
    Object.keys(data).forEach(key => {
      appendFormData(key, data[key]);
    });
    
    return formData;
  };
  // Category endpoints
  getCategories = async (params = {}) => {
    try {
      const response = await api.get('/courses/categories/', { 
        params,
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  };

  createCategory = async (categoryData) => {
    try {
      const response = await api.post('/courses/categories/', categoryData, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  };

  getCategory = async (id) => {
    try {
      const response = await api.get(`/courses/categories/${id}/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  };

  createCategory = async (categoryData) => {
    try {
      const response = await api.post('/courses/categories/', categoryData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  };

  updateCategory = async (id, categoryData) => {
    try {
      const response = await api.put(`/courses/categories/${id}/`, categoryData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  };

  deleteCategory = async (id) => {
    try {
      await api.delete(`/courses/categories/${id}/`);
      return true;
    } catch (error) {
      throw this.handleError(error);
    }
  };

  // Formation endpoints
  getFormations = async (params = {}) => {
    try {
      const response = await api.get('/courses/formations/', { 
        params,
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  };

  getFormation = async (id) => {
    try {
      const response = await api.get(`/courses/formations/${id}/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  };

  createFormation = async (formationData) => {
    try {
      const formData = this.createFormData(formationData);
      
      // Log the FormData to verify its contents
      for (let pair of formData.entries()) {
        console.log('FormData:', pair[0], pair[1]);
      }
      
      const response = await api.post('/courses/formations/', formData, {
        // Let the browser set the Content-Type with boundary
        headers: {
          'Accept': 'application/json',
        },
        // Ensure axios doesn't transform the FormData
        transformRequest: (data) => data,
      });
      
      return response.data;
    } catch (error) {
      console.error('Error in createFormation:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request:', error.request);
      }
      throw this.handleError(error);
    }
  };

  updateFormation = async (id, formationData) => {
    try {
      const formData = this.createFormData(formationData);
      
      // Log the FormData to verify its contents
      for (let pair of formData.entries()) {
        console.log('Update FormData:', pair[0], pair[1]);
      }
      
      const response = await api.put(`/courses/formations/${id}/`, formData, {
        // Let the browser set the Content-Type with boundary
        headers: {
          'Accept': 'application/json',
        },
        // Ensure axios doesn't transform the FormData
        transformRequest: (data) => data,
      });
      
      return response.data;
    } catch (error) {
      console.error('Error in updateFormation:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request:', error.request);
      }
      throw this.handleError(error);
    }
  };

  deleteFormation = async (id) => {
    try {
      await api.delete(`/courses/formations/${id}/`);
      return true;
    } catch (error) {
      throw this.handleError(error);
    }
  };

  // Enrollment endpoints
  enrollInFormation = async (formationId) => {
    try {
      const response = await api.post(`/courses/formations/${formationId}/enroll/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  };

  getFormationParticipants = async (formationId) => {
    try {
      const response = await api.get(`/courses/formations/${formationId}/participants/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  };

  // Quiz endpoints
  getQuizzes = async (params = {}) => {
    try {
      const response = await api.get('/courses/quizzes/', {
        params,
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  };

  getQuiz = async (id) => {
    try {
      const response = await api.get(`/courses/quizzes/${id}/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  };

  createQuiz = async (quizData) => {
    try {
      const response = await api.post('/courses/quizzes/', quizData, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  };

  updateQuiz = async (id, quizData) => {
    try {
      const response = await api.put(`/courses/quizzes/${id}/`, quizData, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  };

  deleteQuiz = async (id) => {
    try {
      await api.delete(`/courses/quizzes/${id}/`);
      return true;
    } catch (error) {
      throw this.handleError(error);
    }
  };

  getQuizQuestions = async (id) => {
    try {
      const response = await api.get(`/courses/quizzes/${id}/questions/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  };

  startQuizAttempt = async (quizId) => {
    try {
      const response = await api.post(`/courses/quizzes/${quizId}/start_attempt/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  };

  submitQuizAnswers = async (attemptId, answers) => {
    try {
      const response = await api.post(`/courses/quiz-attempts/${attemptId}/submit_answers/`, {
        answers
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  };

  getQuizAttempts = async (params = {}) => {
    try {
      const response = await api.get('/courses/quiz-attempts/', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  };

  getQuizAttempt = async (id) => {
    try {
      const response = await api.get(`/courses/quiz-attempts/${id}/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  };

  // ✅ NOUVELLE VERSION OPTIMISÉE
getApplications = async (params = {}) => {
  try {
    // ✅ Construction des paramètres avec pagination
    const queryParams = {
      page_size: 10,  // ← AJOUT CRUCIAL
      ...params       // Garde les autres filtres (status, formation, etc.)
    };

    console.log('🔵 [courseService] Appel API avec params:', queryParams);

    const response = await api.get('/courses/applications/', {
      params: queryParams,
      headers: { 'Content-Type': 'application/json' }
    });

    console.log('✅ [courseService] Réponse:', response.data);
    console.log('📊 [courseService] Nombre:', response.data?.results?.length || response.data?.length);

    return response.data;
  } catch (error) {
    console.error('❌ [courseService] Erreur:', error);
    throw this.handleError(error);
  }
};

  createApplication = async (applicationData) => {
    try {
      // Check if applicationData is FormData
      const isFormData = applicationData instanceof FormData;
      
      // Log the data being sent for debugging
      if (isFormData) {
        console.log('Sending FormData with fields:');
        for (let pair of applicationData.entries()) {
          console.log(pair[0], pair[1]);
        }
      } else {
        console.log('Sending JSON data:', applicationData);
      }

      const response = await api.post('/courses/applications/', applicationData, {
        headers: isFormData ? {
          // Let the browser set the Content-Type with the correct boundary
        } : { 
          'Content-Type': 'application/json' 
        },
        // Ensure axios doesn't try to JSON stringify the FormData
        transformRequest: isFormData ? [(data) => data] : undefined
      });
      
      return response.data;
    } catch (error) {
      console.error('Error in createApplication:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
      throw this.handleError(error);
    }
  };

  approveApplication = async (id, notes = '') => {
    try {
      const response = await api.post(`/courses/applications/${id}/approve/`, {
        review_notes: notes
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  };

  rejectApplication = async (id, notes = '') => {
    try {
      const response = await api.post(`/courses/applications/${id}/reject/`, {
        review_notes: notes
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  };
  handleError = (error) => {
    console.error('API Error:', error);
    
    // Handle network errors
    if (error.code === 'ERR_NETWORK') {
      const networkError = new Error('Network error. Please check your internet connection.');
      networkError.name = 'NetworkError';
      throw networkError;
    }

    // Handle HTTP errors
    if (error.response) {
      const { status, data } = error.response;
      let errorMessage = 'An error occurred';
      
      // Handle different HTTP status codes
      switch (status) {
        case 400:
          errorMessage = data?.message || 'Invalid request data';
          // Handle validation errors
          if (data?.errors) {
            errorMessage = Object.values(data.errors)
              .flat()
              .join('\n');
          }
          break;
        case 401:
          errorMessage = 'Please log in to continue';
          // Optionally trigger logout
          // localStorage.removeItem('token');
          // window.location.href = '/login';
          break;
        case 403:
          errorMessage = 'You do not have permission to perform this action';
          break;
        case 404:
          errorMessage = 'The requested resource was not found';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later';
          break;
        default:
          errorMessage = data?.message || `Error: ${status}`;
      }
      
      const httpError = new Error(errorMessage);
      httpError.status = status;
      httpError.data = data;
      throw httpError;
    }
    
    // Handle request setup errors
    if (error.request) {
      const requestError = new Error('No response received from server. Please try again.');
      requestError.name = 'RequestError';
      throw requestError;
    }
    
    // Handle other errors
    const genericError = new Error(error.message || 'An unexpected error occurred');
    throw genericError;
  };
}

export default new CourseService();
