import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // ton backend Django
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach JWT access token to every request if present
api.interceptors.request.use((config) => {
    try {
        // Support both 'accessToken' and 'access_token' keys in localStorage for backward compatibility
        const token = localStorage.getItem('accessToken') || localStorage.getItem('access_token');
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (_) {}
    return config;
});

export default api;
