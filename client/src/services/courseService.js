import api from './api';

export const courseService = {
  getCourses: async (params) => {
    const res = await api.get('/courses', { params });
    return res.data;
  },

  getCourse: async (id) => {
    const res = await api.get(`/courses/${id}`);
    return res.data;
  },

  createCourse: async (data) => {
    const res = await api.post('/courses', data);
    return res.data;
  },

  updateCourse: async (id, data) => {
    const res = await api.put(`/courses/${id}`, data);
    return res.data;
  },

  deleteCourse: async (id) => {
    const res = await api.delete(`/courses/${id}`);
    return res.data;
  },

  enroll: async (id) => {
    const res = await api.post(`/courses/${id}/enroll`);
    return res.data;
  },

  unenroll: async (id) => {
    const res = await api.post(`/courses/${id}/unenroll`);
    return res.data;
  },

  getEnrolledCourses: async () => {
    const res = await api.get('/courses/enrolled');
    return res.data;
  },

  getCourseProgress: async (id) => {
    const res = await api.get(`/courses/${id}/progress`);
    return res.data;
  },
};

export default courseService;
