import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// IMPORTANTE: troque pelo IP da máquina onde o back-end está rodando.
// - Emulador Android: 10.0.2.2 costuma apontar para o localhost da máquina.
// - Dispositivo físico / Expo Go: use o IP da sua rede local, ex: 192.168.0.10.
// - iOS Simulator: localhost funciona normalmente.
export const BASE_URL = 'http://192.168.15.2:3000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Anexa o token JWT (se existir) em toda requisição
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@blog:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Trata erros de forma centralizada (mensagem amigável)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      'Não foi possível conectar ao servidor. Verifique sua conexão.';
    return Promise.reject(new Error(message));
  }
);

// ---------- Autenticação ----------
export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  me: () => api.get('/auth/me'),
};

// ---------- Posts ----------
export const postsApi = {
  getAll: () => api.get('/posts'),
  search: (q) => api.get('/posts/search', { params: { q } }),
  getById: (id) => api.get(`/posts/${id}`),
  create: (payload) => api.post('/posts', payload),
  update: (id, payload) => api.put(`/posts/${id}`, payload),
  remove: (id) => api.delete(`/posts/${id}`),
};

// ---------- Professores ----------
export const teachersApi = {
  getAll: (page = 1, limit = 10) => api.get('/teachers', { params: { page, limit } }),
  getById: (id) => api.get(`/teachers/${id}`),
  create: (payload) => api.post('/teachers', payload),
  update: (id, payload) => api.put(`/teachers/${id}`, payload),
  remove: (id) => api.delete(`/teachers/${id}`),
};

// ---------- Alunos ----------
export const studentsApi = {
  getAll: (page = 1, limit = 10) => api.get('/students', { params: { page, limit } }),
  getById: (id) => api.get(`/students/${id}`),
  create: (payload) => api.post('/students', payload),
  update: (id, payload) => api.put(`/students/${id}`, payload),
  remove: (id) => api.delete(`/students/${id}`),
};

export default api;
