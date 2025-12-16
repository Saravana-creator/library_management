import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('librarian');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const booksAPI = {
  getBooks: (params) => api.get('/books', { params }),
  createBook: (book) => api.post('/books', book),
  updateBook: (id, book) => api.put(`/books/${id}`, book),
  deleteBook: (id) => api.delete(`/books/${id}`),
};

export const issuesAPI = {
  getIssues: (params) => api.get('/issues', { params }),
  issueBook: (data) => api.post('/issues/issue', data),
  returnBook: (id) => api.put(`/issues/return/${id}`),
};

export const approvalsAPI = {
  getApprovals: (params) => api.get('/approvals', { params }),
  createApproval: (data) => api.post('/approvals', data),
  reviewApproval: (id, data) => api.put(`/approvals/${id}/review`, data),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

export default api;