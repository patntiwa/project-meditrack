import axios from 'axios';

// Utilitaire pour lire les cookies manuellement
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Intercepteur pour attacher XSRF et token Bearer
api.interceptors.request.use((config) => {
  const csrfToken = getCookie('XSRF-TOKEN');
  if (csrfToken) {
    config.headers['X-XSRF-TOKEN'] = csrfToken;
  }

  const bearerToken = localStorage.getItem('token');
  if (bearerToken) {
    config.headers['Authorization'] = `Bearer ${bearerToken}`;
  }

  return config;
});

// Intercepteur de réponse : redirection si 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Supprime le token et redirige
      localStorage.removeItem("token");
      window.location.href = "/login"; //  forcé, hors React Router
    }
    return Promise.reject(error);
  }
);


export default api;
