const ChatMessage = require('../models/ChatMessage');

// @desc    Get messages for a room
// @route   GET /api/chat/messages/:room
// @access  Public / Private
exports.getMessages = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;
    const skip = (page - 1) * limit;

    const total = await ChatMessage.countDocuments({ room: req.params.room });
    const rawMessages = await ChatMessage.find({ room: req.params.room })
      .populate('sender', 'fullName avatar username role')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const messages = rawMessages.reverse();

    res.json({
      success: true,
      count: messages.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      messages,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message to a room (HTTP fallback + persistence)
// @route   POST /api/chat/messages
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { room, message, type } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập nội dung tin nhắn' });
    }

    const newMsg = await ChatMessage.create({
      sender: req.user._id,
      room: room || 'general',
      message: message.trim(),
      type: type || 'text',
    });

    const populatedMsg = await newMsg.populate('sender', 'fullName avatar username role');

    // Broadcast via Socket.IO if available on req.app
    const io = req.app.get('io');
    if (io) {
      io.to(room || 'general').emit('receive_message', populatedMsg);
    }

    res.status(201).json({
      success: true,
      message: populatedMsg,
      data: populatedMsg,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a message
// @route   DELETE /api/chat/messages/:id
// @access  Private
exports.deleteMessage = async (req, res, next) => {
  try {
    const msg = await ChatMessage.findById(req.params.id);
    if (!msg) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tin nhắn' });
    }

    if (
      msg.sender.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin' &&
      req.user.role !== 'teacher'
    ) {
      return res.status(403).json({ success: false, message: 'Không có quyền xóa tin nhắn này' });
    }

    await msg.deleteOne();
    res.json({ success: true, id: req.params.id });
  } catch (error) {
    next(error);
  }
};

// @desc    Get chat rooms
// @route   GET /api/chat/rooms
// @access  Public / Private
exports.getRooms = async (req, res, next) => {
  try {
    const defaultRooms = [
      {
        id: 'general',
        name: 'Thảo luận chung',
        description: 'Kênh thông báo lịch học, chia sẻ tài liệu và giao lưu học viên toàn trung tâm',
        badge: 'Chung',
      },
      {
        id: 'ic3-spark',
        name: 'Lớp IC3 Spark (Tiểu học)',
        description: 'Hỏi đáp bài tập Máy tính căn bản, các ứng dụng chủ chốt & Cuộc sống trực tuyến (12 buổi)',
        badge: 'IC3 Spark',
      },
      {
        id: 'ic3-gs6',
        name: 'Lớp IC3 GS6 (Level 1-2-3)',
        description: 'Thảo luận 7 chuyên đề năng lực số & giải đề thi thử IC3 GS6 chuẩn Certiport',
        badge: 'IC3 GS6',
      },
      {
        id: 'hoi-dap-thay-co',
        name: 'Hỏi đáp Giáo viên',
        description: 'Đặt câu hỏi trực tiếp cho giảng viên phụ trách để được giải đáp chi tiết',
        badge: 'Hỗ trợ 24/7',
      },
    ];

    res.json({ success: true, rooms: defaultRooms, data: defaultRooms });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a custom chat room
// @route   POST /api/chat/rooms
// @access  Private
exports.createRoom = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập tên phòng thảo luận' });
    }

    const roomId = name
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const room = {
      id: roomId || `room-${Date.now()}`,
      name: name.trim(),
      description: description || 'Nhóm học tập & trao đổi chuyên đề IC3',
      badge: 'Nhóm học tập',
    };

    res.status(201).json({
      success: true,
      room,
      data: room,
    });
  } catch (error) {
    next(error);
  }
};
