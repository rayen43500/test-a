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

class ProfilePictureService {
  
  /**
   * Upload or update profile picture
   * @param {File} file - Image file to upload
   * @returns {Promise} Response with photo URL
   */
  async uploadProfilePicture(file) {
    try {
      const formData = new FormData();
      formData.append('photo_profile', file);

      const response = await api.put('/profile/picture/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update user data in localStorage with new photo URL
      const user = this.getCurrentUser();
      if (user && response.data.photo_profile) {
        user.photo_profile = response.data.photo_profile;
        localStorage.setItem('user', JSON.stringify(user));
      }

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get current profile picture URL
   * @returns {Promise} Response with photo URL
   */
  async getProfilePicture() {
    try {
      const response = await api.get('/profile/picture/get/');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete profile picture
   * @returns {Promise} Confirmation response
   */
  async deleteProfilePicture() {
    try {
      const response = await api.delete('/profile/picture/delete/');

      // Update user data in localStorage to remove photo
      const user = this.getCurrentUser();
      if (user) {
        user.photo_profile = null;
        localStorage.setItem('user', JSON.stringify(user));
      }

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Validate image file before upload
   * @param {File} file - File to validate
   * @returns {Object} { valid: boolean, error: string }
   */
  validateImage(file) {
    // Check if file exists
    if (!file) {
      return { valid: false, error: 'Aucun fichier sélectionné' };
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return { 
        valid: false, 
        error: 'Format non supporté. Utilisez JPEG, PNG ou WebP.' 
      };
    }

    // Check file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return { 
        valid: false, 
        error: 'La taille de l\'image ne doit pas dépasser 5MB.' 
      };
    }

    return { valid: true, error: null };
  }

  /**
   * Validate image dimensions
   * @param {File} file - Image file
   * @returns {Promise<Object>} { valid: boolean, error: string, dimensions: {width, height} }
   */
  validateImageDimensions(file) {
    return new Promise((resolve) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        
        const width = img.width;
        const height = img.height;

        if (width < 200 || height < 200) {
          resolve({ 
            valid: false, 
            error: 'L\'image doit faire au moins 200x200 pixels.',
            dimensions: { width, height }
          });
        } else {
          resolve({ 
            valid: true, 
            error: null,
            dimensions: { width, height }
          });
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve({ 
          valid: false, 
          error: 'Impossible de lire l\'image.',
          dimensions: null
        });
      };

      img.src = objectUrl;
    });
  }

  /**
   * Create image preview (base64)
   * @param {File} file - Image file
   * @returns {Promise<string>} Base64 URL for preview
   */
  createImagePreview(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
      
      reader.readAsDataURL(file);
    });
  }

  /**
   * Get current user from localStorage
   * @returns {Object|null} User object or null
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Get profile picture URL from current user
   * @returns {string|null} Photo URL or null
   */
  getCurrentUserPhoto() {
    const user = this.getCurrentUser();
    return user?.photo_profile || null;
  }

  /**
   * Handle API errors
   * @param {Error} error - Axios error
   * @returns {Object} Formatted error object
   */
  handleError(error) {
    console.error('Profile Picture API Error:', error);
    
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
      return { message: 'Une erreur inattendue est survenue' };
    }
  }
}

export default new ProfilePictureService();