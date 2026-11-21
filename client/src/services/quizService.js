import api from './api';

export const quizService = {
  getQuizzes: async (params) => {
    const res = await api.get('/quizzes', { params });
    return res.data;
  },

  getQuiz: async (id) => {
    const res = await api.get(`/quizzes/${id}`);
    return res.data;
  },

  createQuiz: async (data) => {
    const res = await api.post('/quizzes', data);
    return res.data;
  },

  updateQuiz: async (id, data) => {
    const res = await api.put(`/quizzes/${id}`, data);
    return res.data;
  },

  deleteQuiz: async (id) => {
    const res = await api.delete(`/quizzes/${id}`);
    return res.data;
  },

  submitAttempt: async (id, answers) => {
    const res = await api.post(`/quizzes/${id}/submit`, { answers });
    return res.data;
  },

  getAttempts: async (params) => {
    const res = await api.get('/quizzes/attempts', { params });
    return res.data;
  },

  getQuizResults: async (id) => {
    const res = await api.get(`/quizzes/${id}/results`);
    return res.data;
  },
};

export default quizService;
