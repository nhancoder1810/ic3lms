const express = require('express');
const router = express.Router();
const {
  getMessages,
  sendMessage,
  deleteMessage,
  getRooms,
  createRoom,
} = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.get('/rooms', getRooms);
router.post('/rooms', protect, createRoom);
router.get('/messages/:room', getMessages);
router.post('/messages', protect, sendMessage);
router.delete('/messages/:id', protect, deleteMessage);

module.exports = router;
