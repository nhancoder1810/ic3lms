# 🎮 IC3 CYBER LMS - Nền Tảng Học Tập & Khảo Thí Tin Học Quốc Tế (IC3 Spark & IC3 GS6)

Hệ thống quản lý học tập (LMS) hiện đại với giao diện **Dark Mode Gaming Style**, được xây dựng trên nền tảng **React (Vite) + Node.js/Express + MongoDB + Socket.IO**.

---

## ✨ Tính Năng Nổi Bật

### 1. Phân Quyền 3 Vai Trò Riêng Biệt
- **👑 Quản trị viên (Admin):** Bảng điều khiển tổng quan hệ thống, quản lý toàn bộ tài khoản người dùng (Học sinh / Giáo viên), quản lý tất cả các khóa học.
- **🎓 Giáo viên (Teacher):** Quản lý danh sách học sinh, bài giảng IC3 Spark / IC3 GS6, ngân hàng câu hỏi và theo dõi tiến độ lớp học.
- **🎮 Học sinh (Student):** Học lý thuyết theo từng Module, làm bài tập ôn luyện & thi khảo thí, tích lũy điểm kinh nghiệm (XP), thăng cấp (Level), mở khóa huy hiệu và tham gia bảng xếp hạng.

### 2. Hệ Thống Bài Kiểm Tra & Khảo Thí Đa Dạng (5 Dạng Câu Hỏi)
- **Trắc nghiệm (Multiple Choice)**
- **Đúng / Sai (True / False)**
- **Kéo thả ghép cặp (Drag & Drop)**
- **Tự luận ngắn (Short Answer)**
- **Mô phỏng thao tác thực tế (Simulation)**
- Hỗ trợ đồng hồ đếm ngược, tính điểm tự động, giải thích đáp án và thưởng XP sau khi thi.

### 3. Gamification & Tương Tác Thời Gian Thực
- **Thanh tiến độ XP & Cấp độ (Level System)**
- **Kho Huy hiệu Thành tích (Badges)**
- **Bảng Vinh Danh / Xếp hạng (Leaderboard)**
- **Phòng Chat Realtime (Socket.IO):** Nhiều kênh thảo luận (`Đại sảnh chung`, `IC3 Spark`, `IC3 GS6`, `Hỏi đáp giáo viên`) kèm trạng thái đang gõ (Typing indicator).

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### Yêu Cầu Môi Trường
- **Node.js** (v18+)
- **MongoDB** đang chạy tại `mongodb://localhost:27017/ic3-lms` (hoặc cấu hình MongoDB Atlas trong `server/.env`)

### Bước 1: Nạp dữ liệu mẫu (Tài khoản Admin/GV/HS, Khóa học IC3 Spark & GS6, Bài thi mẫu)
```bash
cd server
npm run seed
```

### Bước 2: Chạy Backend Server (Port 5000)
```bash
cd server
npm run dev
```

### Bước 3: Chạy Frontend Client (Port 5173)
Mở một cửa sổ terminal mới:
```bash
cd client
npm run dev
```

Truy cập ứng dụng tại: **http://localhost:5173**

---

## 🔑 Tài Khoản Mẫu (Sau Khi Chạy `npm run seed`)

| Vai Trò | Email | Mật Khẩu |
|---|---|---|
| **👑 Quản trị viên (Admin)** | `admin@ic3lms.edu.vn` | `123456` |
| **🎓 Giáo viên (Teacher)** | `teacher@ic3lms.edu.vn` | `123456` |
| **🎮 Học sinh (Student)** | `student1@ic3lms.edu.vn` | `123456` |

*(Ngoài ra trên màn hình Đăng nhập có sẵn 3 nút điền nhanh tài khoản mẫu để bạn trải nghiệm ngay lập tức!)*
