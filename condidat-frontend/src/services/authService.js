import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

class AuthService {
  // Register new user
  async register(userData) {
    try {
      const response = await api.post('/register/', userData);
      if (response.data.tokens) {
        this.setAuthData(response.data);
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Login user
  async login(email, password) {
    try {
      const response = await api.post('/login/', { email, password });
      if (response.data.tokens) {
        this.setAuthData(response.data);
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Logout user
  logout() {
    // Clear both naming conventions
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  // Get current user profile
  async getProfile() {
    try {
      const response = await api.get('/profile/');
      return response.data.user;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await api.put('/profile/', profileData);
      const updatedUser = response.data.user;
      
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ✅ CORRIGÉ : Get all users (admin only)
  async getUsers() {
    try {
      const response = await api.get('/users/');
      console.log('📊 API Response:', response.data);
      
      // Si Django retourne un format paginé avec results
      if (response.data && response.data.results) {
        console.log('✅ Users found (paginated):', response.data.results.length);
        return response.data.results;
      }
      
      // Si Django retourne directement un tableau
      if (Array.isArray(response.data)) {
        console.log('✅ Users found (array):', response.data.length);
        return response.data;
      }
      
      // Sinon retourner un tableau vide
      console.warn('⚠️ No users found in response');
      return [];
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      console.error('Error details:', error.response?.data);
      throw this.handleError(error);
    }
  }

  // Get user by ID (admin only)
  async getUserById(userId) {
    try {
      const response = await api.get(`/users/${userId}/`);
      return response.data.user || response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update user by ID (admin only)
  async updateUser(userId, userData) {
    try {
      const response = await api.put(`/users/${userId}/`, userData);
      return response.data.user || response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete user by ID (admin only)
  async deleteUser(userId) {
    try {
      const response = await api.delete(`/users/${userId}/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Helper methods
  setAuthData(data) {
    const { tokens, user } = data;
    // Store both naming variants for compatibility across the app
    localStorage.setItem('accessToken', tokens.access);
    localStorage.setItem('refreshToken', tokens.refresh);
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  }

  getUserRole() {
    const user = this.getCurrentUser();
    return user?.role || null;
  }

  isAdmin() {
    return this.getUserRole() === 'Admin';
  }

  isCandidat() {
    return this.getUserRole() === 'Candidat';
  }

  isRecruteur() {
    return this.getUserRole() === 'Recruteur';
  }

  handleError(error) {
    console.error('API Error:', error);
    
    if (error.response?.data) {
      // Return server error message with details
      const errorData = error.response.data;
      
      // If it's a validation error with field-specific messages
      if (typeof errorData === 'object' && !errorData.message) {
        const fieldErrors = [];
        Object.keys(errorData).forEach(field => {
          if (Array.isArray(errorData[field])) {
            fieldErrors.push(`${field}: ${errorData[field].join(', ')}`);
          } else {
            fieldErrors.push(`${field}: ${errorData[field]}`);
          }
        });
        return { message: fieldErrors.join('; ') };
      }
      
      return errorData;
    } else if (error.message) {
      // Return axios error message
      return { message: error.message };
    } else {
      // Return generic error
      return { message: 'An unexpected error occurred' };
    }
  }
}

const authServiceInstance = new AuthService();
export default authServiceInstance;