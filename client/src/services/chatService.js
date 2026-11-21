import api from './api';

export const chatService = {
  getRooms: async () => {
    const res = await api.get('/chat/rooms');
    return res.data;
  },

  createRoom: async (name, description) => {
    const res = await api.post('/chat/rooms', { name, description });
    return res.data;
  },

  getMessages: async (room) => {
    const res = await api.get(`/chat/messages/${room}`);
    return res.data;
  },

  sendMessage: async (room, message, type = 'text') => {
    const res = await api.post('/chat/messages', { room, message, type });
    return res.data;
  },

  deleteMessage: async (id) => {
    const res = await api.delete(`/chat/messages/${id}`);
    return res.data;
  },
};

export default chatService;
