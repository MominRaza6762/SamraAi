import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const sendChatMessage = async (message, sessionId) => {
  const response = await api.post('/chat/send', { message, sessionId });
  return response.data;
};

export const getChatHistory = async (sessionId) => {
  const response = await api.get(`/chat/history/${sessionId}`);
  return response.data;
};

export const uploadFile = async (file, prompt, sessionId) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('prompt', prompt);
  formData.append('sessionId', sessionId);

  const response = await api.post('/file/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const getAllSessions = async () => {
  const response = await api.get('/session/all');
  return response.data;
};

export const createSession = async (sessionId, title) => {
  const response = await api.post('/session/create', { sessionId, title });
  return response.data;
};

export const adminLogin = async (username, password) => {
  const response = await api.post('/admin/login', { username, password });
  return response.data;
};

export const getAllChats = async () => {
  const response = await api.get('/admin/chats');
  return response.data;
};

export const getAllFiles = async () => {
  const response = await api.get('/admin/files');
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

export default api;