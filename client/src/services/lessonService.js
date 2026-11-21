import api from './api';

export const lessonService = {
  getLessons: async (params) => {
    const res = await api.get('/lessons', { params });
    return res.data;
  },

  getLesson: async (id) => {
    const res = await api.get(`/lessons/${id}`);
    return res.data;
  },

  getLessonContent: async (id) => {
    const res = await api.get(`/lessons/${id}/content`);
    return res.data;
  },

  createLesson: async (data) => {
    const res = await api.post('/lessons', data);
    return res.data;
  },

  updateLesson: async (id, data) => {
    const res = await api.put(`/lessons/${id}`, data);
    return res.data;
  },

  deleteLesson: async (id) => {
    const res = await api.delete(`/lessons/${id}`);
    return res.data;
  },

  markComplete: async (id) => {
    const res = await api.post(`/lessons/${id}/complete`);
    return res.data;
  },
};

export default lessonService;
