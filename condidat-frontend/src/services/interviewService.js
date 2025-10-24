import axios from 'axios';
import api from './api';

// Fonction pour rafraîchir le token
const refreshToken = async () => {
  try {
    // Support both naming conventions for refresh token
    const refresh = localStorage.getItem('refresh_token') || localStorage.getItem('refreshToken');
    if (!refresh) {
      throw new Error('No refresh token');
    }
    
    console.log('🔄 Rafraîchissement du token...');
    const response = await api.post('/token/refresh/', { refresh });

    const newAccessToken = response.data.access;
    const newRefreshToken = response.data.refresh || refresh;
    // Keep compatibility: set both keys for access and refresh
    localStorage.setItem('access_token', newAccessToken);
    localStorage.setItem('accessToken', newAccessToken);
    if (newRefreshToken) {
      localStorage.setItem('refresh_token', newRefreshToken);
      localStorage.setItem('refreshToken', newRefreshToken);
    }
    console.log('✅ Token rafraîchi avec succès');
    return newAccessToken;
  } catch (error) {
    console.error('❌ Impossible de rafraîchir le token:', error);
    // Clear tokens to force re-login
    localStorage.removeItem('access_token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('refreshToken');
    throw error;
  }
};

// Fonction helper pour faire des requêtes avec retry automatique
const makeAuthenticatedRequest = async (requestFn) => {
  try {
    return await requestFn();
  } catch (error) {
    // Si erreur 401, tenter de rafraîchir le token et réessayer
    if (error.response?.status === 401) {
      console.log('⚠️ Token expiré, tentative de rafraîchissement...');
      try {
        await refreshToken();
        // Réessayer la requête avec le nouveau token
        return await requestFn();
      } catch (refreshError) {
        console.error('❌ Échec du rafraîchissement, redirection vers login');
        // Ne pas rediriger automatiquement, laisser l'utilisateur gérer
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }
    }
    throw error;
  }
};

const interviewService = {
  createInterview: async (data) => {
    try {
      console.log('🔵 Création entretien avec:', data);
      
      const result = await makeAuthenticatedRequest(async () => {
        return await api.post('/interviews/create/', data);
      });
      
      console.log('✅ Réponse:', result.data);
      return { success: true, data: result.data };
    } catch (error) {
      console.error('❌ Erreur création:', error);
      return {
        success: false,
        error: error.message || error.response?.data?.error || 'Erreur lors de la création de l\'entretien'
      };
    }
  },

  listInterviews: async () => {
    try {
      console.log('🔵 Récupération des entretiens...');
      
      const result = await makeAuthenticatedRequest(async () => {
        return await api.get('/interviews/list/');
      });
      
      console.log('✅ Entretiens récupérés:', result.data);
      return { success: true, data: result.data };
    } catch (error) {
      console.error('❌ Erreur récupération:', error);
      return {
        success: false,
        error: error.message || error.response?.data?.error || 'Erreur lors de la récupération des entretiens'
      };
    }
  },

  cancelInterview: async (eventId) => {
    try {
      const result = await makeAuthenticatedRequest(async () => {
        return await api.delete(`/interviews/${eventId}/cancel/`);
      });
      
      return { success: true, data: result.data };
    } catch (error) {
      return {
        success: false,
        error: error.message || error.response?.data?.error || 'Erreur lors de l\'annulation'
      };
    }
  },

  updateInterview: async (eventId, data) => {
    try {
      const result = await makeAuthenticatedRequest(async () => {
        return await api.patch(`/interviews/${eventId}/update/`, data);
      });
      
      return { success: true, data: result.data };
    } catch (error) {
      return {
        success: false,
        error: error.message || error.response?.data?.error || 'Erreur lors de la modification'
      };
    }
  }
};

export default interviewService;