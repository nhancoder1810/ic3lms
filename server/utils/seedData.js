const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('../models/User');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const Badge = require('../models/Badge');
const ChatMessage = require('../models/ChatMessage');

const seedData = async (isStandalone = false) => {
  try {
    if (isStandalone && mongoose.connection.readyState === 0) {
      const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ic3-lms';
      await mongoose.connect(mongoUri);
      console.log('Connected to MongoDB for seeding...');
    }

    await User.deleteMany({});
    await Course.deleteMany({});
    await Lesson.deleteMany({});
    await Quiz.deleteMany({});
    await Badge.deleteMany({});
    await ChatMessage.deleteMany({});

    console.log('Cleared existing data.');

    // 1. Create Badges
    const badges = await Badge.create([
      {
        name: 'Khởi Đầu Tri Thức Số',
        description: 'Hoàn thành bài kiểm tra ôn luyện đầu tiên trên hệ thống',
        icon: '🎯',
        condition: 'first-quiz',
        requiredValue: 1,
        points: 50,
      },
      {
        name: 'Điểm Tuyệt Đối 1000/1000',
        description: 'Đạt điểm tối đa 100% trong một đề thi thử IC3',
        icon: '🏆',
        condition: 'perfect-score',
        requiredValue: 1,
        points: 150,
      },
      {
        name: 'Kiên Trì 7 Ngày',
        description: 'Duy trì chuỗi học tập và ôn luyện 7 ngày liên tiếp',
        icon: '🔥',
        condition: 'streak-7',
        requiredValue: 7,
        points: 200,
      },
      {
        name: 'Chứng Nhận Hoàn Thành Khóa Học',
        description: 'Hoàn thành 100% các buổi học và bài tập của một khóa IC3',
        icon: '🎓',
        condition: 'complete-course',
        requiredValue: 1,
        points: 300,
      },
      {
        name: 'Gương Mặt Tiêu Biểu',
        description: 'Lọt vào Top 3 học viên có điểm tích lũy cao nhất tuần',
        icon: '🌟',
        condition: 'top-leaderboard',
        requiredValue: 3,
        points: 500,
      },
    ]);

    // 2. Create Users
    const plainPassword = '123456';

    const admin = await User.create({
      username: 'admin',
      email: 'admin@ic3lms.edu.vn',
      password: plainPassword,
      fullName: 'Quản Trị Viên Trung Tâm',
      role: 'admin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AdminIC3',
      points: 1500,
      level: 15,
      badges: [{ badge: badges[0]._id }, { badge: badges[3]._id }],
    });

    const teacher = await User.create({
      username: 'giaovien',
      email: 'teacher@ic3lms.edu.vn',
      password: plainPassword,
      fullName: 'Thầy Nguyễn Văn An (Giảng viên IC3)',
      role: 'teacher',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TeacherAn',
      points: 950,
      level: 10,
      badges: [{ badge: badges[0]._id }, { badge: badges[3]._id }],
    });

    const student1 = await User.create({
      username: 'minhquan',
      email: 'student1@ic3lms.edu.vn',
      password: plainPassword,
      fullName: 'Trần Minh Quân',
      role: 'student',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MinhQuan',
      points: 680,
      level: 7,
      badges: [{ badge: badges[0]._id }, { badge: badges[1]._id }, { badge: badges[4]._id }],
    });

    const student2 = await User.create({
      username: 'thutrang',
      email: 'student2@ic3lms.edu.vn',
      password: plainPassword,
      fullName: 'Lê Thu Trang',
      role: 'student',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ThuTrang',
      points: 540,
      level: 6,
      badges: [{ badge: badges[0]._id }, { badge: badges[2]._id }],
    });

    const student3 = await User.create({
      username: 'giabao',
      email: 'student3@ic3lms.edu.vn',
      password: plainPassword,
      fullName: 'Phạm Gia Bảo',
      role: 'student',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GiaBao',
      points: 420,
      level: 5,
      badges: [{ badge: badges[0]._id }],
    });

    const student4 = await User.create({
      username: 'khanhlinh',
      email: 'student4@ic3lms.edu.vn',
      password: plainPassword,
      fullName: 'Đỗ Khánh Linh',
      role: 'student',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=KhanhLinh',
      points: 350,
      level: 4,
      badges: [{ badge: badges[0]._id }],
    });

    // =========================================================================
    // COURSE 1: IC3 SPARK - LỘ TRÌNH 12 BUỔI CHUẨN CHO HỌC SINH TIỂU HỌC
    // =========================================================================
    const courseSpark = await Course.create({
      title: 'IC3 Spark - Tin Học Quốc Tế Tiểu Học (Lộ Trình 12 Buổi Chuẩn Certiport)',
      slug: 'ic3-spark-lo-trinh-12-buoi-tieu-hoc',
      description:
        'Khóa học tiêu chuẩn 12 buổi (90 phút/buổi) dành cho học sinh Tiểu học (Lớp 3, 4, 5). Phân bổ trọn vẹn 3 học phần: Máy tính căn bản (Buổi 1-4), Các ứng dụng chủ chốt Word/Excel/PowerPoint (Buổi 5-8) và Cuộc sống trực tuyến & Luyện đề (Buổi 9-12).',
      category: 'ic3-spark',
      thumbnail:
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
      teacher: teacher._id,
      isPublished: true,
      students: [student1._id, student2._id, student3._id, student4._id],
      modules: [
        {
          title: 'Học phần 1 (Buổi 1 - Buổi 4): Máy tính căn bản (Computing Fundamentals)',
          description: '4 buổi (8 tiết): Phần cứng, phần mềm, bộ nhớ, hệ điều hành Windows và quản lý tệp/thư mục',
          order: 1,
          lessons: [],
        },
        {
          title: 'Học phần 2 (Buổi 5 - Buổi 8): Các ứng dụng chủ chốt (Key Applications)',
          description: '4 buổi (8 tiết): Soạn thảo Word (.docx), Bảng tính Excel (.xlsx) và Trình chiếu PowerPoint (.pptx)',
          order: 2,
          lessons: [],
        },
        {
          title: 'Học phần 3 (Buổi 9 - Buổi 12): Cuộc sống trực tuyến (Living Online) & Thi thử',
          description: '4 buổi (8 tiết): Internet, Trình duyệt Web, Tìm kiếm, Email, An toàn mạng và Thi thử tổng hợp',
          order: 3,
          lessons: [],
        },
      ],
    });

    const sparkLessons = await Lesson.create([
      {
        title: 'Buổi 1: Làm quen Máy tính, Phần cứng (Hardware), Phần mềm (Software) & Thiết bị Nhập/Xuất',
        course: courseSpark._id,
        module: 1,
        type: 'theory',
        duration: 90,
        order: 1,
        content: `
          <h2>Mục tiêu Buổi 1 (90 phút = 2 tiết)</h2>
          <p>Học sinh phân biệt được các loại máy tính (PC, Laptop, Tablet, Smartphone), hiểu rõ sự khác biệt giữa Phần cứng và Phần mềm, và phân loại chính xác Thiết bị Đầu vào (Input) / Đầu ra (Output).</p>
          <h2>1. Phần cứng (Hardware) và Phần mềm (Software)</h2>
          <ul>
            <li><strong>Phần cứng (Hardware):</strong> Các bộ phận vật lý của máy tính mà em có thể nhìn thấy và chạm vào được (Màn hình, bàn phím, chuột, thân máy, loa, máy in).</li>
            <li><strong>Phần mềm (Software):</strong> Các chương trình chứa câu lệnh hướng dẫn phần cứng hoạt động (Windows 11, Microsoft Word, Google Chrome, Paint).</li>
          </ul>
          <h2>2. Bảng phân loại Thiết bị Đầu vào (Input) và Đầu ra (Output)</h2>
          <table>
            <thead>
              <tr>
                <th>Thiết bị Đầu vào (Input Devices)</th>
                <th>Thiết bị Đầu ra (Output Devices)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Bàn phím (Keyboard):</strong> Nhập văn bản, con số và lệnh.</td>
                <td><strong>Màn hình (Monitor):</strong> Hiển thị hình ảnh, văn bản ra ngoài.</td>
              </tr>
              <tr>
                <td><strong>Chuột (Mouse) / Touchpad:</strong> Điều khiển con trỏ, chọn đối tượng.</td>
                <td><strong>Loa (Speaker) / Tai nghe:</strong> Phát âm thanh từ máy tính ra ngoài.</td>
              </tr>
              <tr>
                <td><strong>Micro (Microphone) / Webcam / Máy quét (Scanner)</strong></td>
                <td><strong>Máy in (Printer) / Máy chiếu (Projector)</strong></td>
              </tr>
            </tbody>
          </table>
          <h2>3. Hoạt động Thực hành tại lớp (30 phút cuối buổi)</h2>
          <ul>
            <li>Trò chơi phân loại nhanh 15 thẻ thiết bị phần cứng vào 2 cột Input và Output.</li>
            <li>Hoàn thành 10 câu hỏi trắc nghiệm củng cố Buổi 1 trên hệ thống LMS.</li>
          </ul>
        `,
      },
      {
        title: 'Buổi 2: Bộ xử lý CPU, Bộ nhớ (RAM/ROM, HDD/SSD) & Đơn vị đo thông tin (Bit/Byte)',
        course: courseSpark._id,
        module: 1,
        type: 'theory',
        duration: 90,
        order: 2,
        content: `
          <h2>Mục tiêu Buổi 2 (90 phút)</h2>
          <p>Hiểu vai trò của "bộ não" CPU, phân biệt bộ nhớ tạm thời RAM với bộ nhớ lưu trữ lâu dài, và nắm vững bảng đơn vị đo dữ liệu trong máy tính.</p>
          <h2>1. Bộ xử lý trung tâm CPU & Bộ nhớ RAM/ROM</h2>
          <ul>
            <li><strong>CPU (Central Processing Unit):</strong> "Bộ não" của máy tính, thực hiện mọi phép tính và điều khiển toàn bộ hệ thống.</li>
            <li><strong>RAM (Random Access Memory):</strong> Bộ nhớ lưu dữ liệu <strong>tạm thời</strong> khi chương trình đang mở. <em>Lưu ý quan trọng khi đi thi: Khi tắt máy hoặc mất điện, dữ liệu trong RAM sẽ bị mất hoàn toàn.</em></li>
            <li><strong>ROM (Read-Only Memory):</strong> Bộ nhớ chỉ đọc chứa chương trình khởi động máy, không bị mất khi tắt nguồn.</li>
            <li><strong>Thiết bị lưu trữ lâu dài:</strong> Ổ cứng HDD, ổ cứng thể rắn SSD (nhanh hơn HDD), USB Flash, thẻ nhớ SD.</li>
          </ul>
          <h2>2. Thang đo Đơn vị Dữ liệu Số</h2>
          <p>Đơn vị nhỏ nhất để đo thông tin trong máy tính là <strong>Bit</strong> (mang giá trị 0 hoặc 1):</p>
          <p><code>8 Bit = 1 Byte</code> → <code>1024 Byte = 1 KB (Kilobyte)</code> → <code>1024 KB = 1 MB (Megabyte)</code> → <code>1024 MB = 1 GB (Gigabyte)</code> → <code>1024 GB = 1 TB (Terabyte)</code>.</p>
        `,
      },
      {
        title: 'Buổi 3: Hệ điều hành Windows, Giao diện Desktop & Các chế độ Tắt máy (Shut down, Sleep, Restart)',
        course: courseSpark._id,
        module: 1,
        type: 'practice',
        duration: 90,
        order: 3,
        content: `
          <h2>Mục tiêu Buổi 3 (90 phút)</h2>
          <p>Làm chủ giao diện màn hình nền Desktop, thanh tác vụ Taskbar, Start Menu và sử dụng đúng các chế độ nguồn của máy tính.</p>
          <h2>1. Hệ điều hành (Operating System)</h2>
          <ul>
            <li><strong>Trên máy tính:</strong> Microsoft Windows (Windows 10/11), Apple macOS, Linux.</li>
            <li><strong>Trên điện thoại / máy tính bảng:</strong> Google Android, Apple iOS / iPadOS.</li>
          </ul>
          <h2>2. Các chế độ nguồn trong Windows (Câu hỏi trọng tâm IC3 Spark)</h2>
          <ul>
            <li><strong>Shut down (Tắt máy):</strong> Đóng toàn bộ các tập tin, chương trình đang mở và tắt hoàn toàn nguồn điện máy tính.</li>
            <li><strong>Restart (Khởi động lại):</strong> Đóng các chương trình, tắt máy và tự động bật lại ngay (dùng khi vừa cài đặt phần mềm hoặc máy bị chậm).</li>
            <li><strong>Sleep (Ngủ):</strong> Giữ nguyên phiên làm việc trong bộ nhớ RAM ở chế độ tiết kiệm điện để mở lại tức thì.</li>
          </ul>
        `,
      },
      {
        title: 'Buổi 4: Quản lý Tệp tin (File), Thư mục (Folder), Phím tắt Windows & Kiểm tra Học phần 1',
        course: courseSpark._id,
        module: 1,
        type: 'practice',
        duration: 90,
        order: 4,
        content: `
          <h2>Mục tiêu Buổi 4 (90 phút)</h2>
          <p>Thực hành tạo cây thư mục học tập, sao chép, di chuyển, đổi tên tệp/thư mục và làm bài kiểm tra kết thúc Học phần 1.</p>
          <h2>1. Thao tác chuẩn với Thư mục (Folder) và Tệp tin (File)</h2>
          <ul>
            <li><strong>Tạo thư mục mới trên Desktop:</strong> Nhấp chuột phải vào vùng trống trên Desktop → chọn <strong>New</strong> → chọn <strong>Folder</strong> → nhập tên → nhấn <strong>Enter</strong>.</li>
            <li><strong>Đổi tên (Rename):</strong> Nhấp chuột phải vào tệp/thư mục → chọn <strong>Rename</strong> (hoặc nhấn phím <code>F2</code>) → nhập tên mới → nhấn <strong>Enter</strong>.</li>
            <li><strong>Xóa và Khôi phục:</strong> Nhấn phím <code>Delete</code> để đưa vào Thùng rác (<strong>Recycle Bin</strong>). Có thể mở Recycle Bin và chọn <strong>Restore</strong> để khôi phục tệp về vị trí cũ.</li>
          </ul>
          <h2>2. Bảng Phím tắt Windows bắt buộc ghi nhớ</h2>
          <ul>
            <li><code>Ctrl + C</code>: Sao chép (Copy) • <code>Ctrl + X</code>: Cắt/Di chuyển (Cut) • <code>Ctrl + V</code>: Dán (Paste)</li>
            <li><code>Ctrl + Z</code>: Hoàn tác (Undo) • <code>Ctrl + A</code>: Chọn tất cả (Select All)</li>
          </ul>
        `,
      },
      {
        title: 'Buổi 5: Soạn thảo văn bản Microsoft Word (.docx) - Định dạng Phông chữ & Đoạn văn',
        course: courseSpark._id,
        module: 2,
        type: 'practice',
        duration: 90,
        order: 1,
        content: `
          <h2>Mục tiêu Buổi 5 (90 phút)</h2>
          <p>Làm quen giao diện Ribbon của Microsoft Word, phân biệt đuôi tệp <code>.docx</code> và thực hành định dạng văn bản thẩm mỹ.</p>
          <h2>1. Nhóm lệnh Font & Paragraph trong thẻ Home</h2>
          <ul>
            <li><strong>Kiểu chữ:</strong> In đậm <strong>Bold</strong> (<code>Ctrl + B</code>), In nghiêng <em>Italic</em> (<code>Ctrl + I</code>), Gạch chân <u>Underline</u> (<code>Ctrl + U</code>).</li>
            <li><strong>Căn lề đoạn văn:</strong> Căn trái (<code>Ctrl + L</code>), Căn giữa (<code>Ctrl + E</code>), Căn phải (<code>Ctrl + R</code>), Căn đều hai bên (<code>Ctrl + J</code>).</li>
            <li><strong>Danh sách liệt kê:</strong> Tạo dấu đầu dòng (<strong>Bullets</strong>) và danh sách đánh số tự động (<strong>Numbering</strong>).</li>
          </ul>
        `,
      },
      {
        title: 'Buổi 6: Microsoft Word (Phần 2) - Chèn Hình ảnh, Bảng biểu (Table), In ấn & Lưu tệp (Save As)',
        course: courseSpark._id,
        module: 2,
        type: 'practice',
        duration: 90,
        order: 2,
        content: `
          <h2>Mục tiêu Buổi 6 (90 phút)</h2>
          <p>Thực hành chèn hình ảnh minh họa, tạo thời khóa biểu bằng Table và nắm vững quy trình Lưu / In tài liệu.</p>
          <h2>1. Chèn Đối tượng trong thẻ Insert</h2>
          <ul>
            <li><strong>Insert → Pictures:</strong> Chèn hình ảnh từ máy tính vào văn bản.</li>
            <li><strong>Insert → Table:</strong> Tạo bảng gồm các hàng và cột để trình bày danh sách, thời khóa biểu.</li>
            <li><strong>Insert →Shapes:</strong> Vẽ các hình khối (mũi tên, hình chữ nhật, biểu ngữ).</li>
          </ul>
          <h2>2. Phân biệt Save và Save As</h2>
          <ul>
            <li><strong>File → Save (<code>Ctrl + S</code>):</strong> Lưu cập nhật trực tiếp lên tệp hiện tại.</li>
            <li><strong>File → Save As:</strong> Lưu tài liệu thành một tệp mới với tên khác hoặc thư mục khác mà vẫn giữ nguyên tệp gốc.</li>
          </ul>
        `,
      },
      {
        title: 'Buổi 7: Bảng tính Microsoft Excel (.xlsx) - Hàng, Cột, Ô tính & Hàm tính toán cơ bản',
        course: courseSpark._id,
        module: 2,
        type: 'practice',
        duration: 90,
        order: 3,
        content: `
          <h2>Mục tiêu Buổi 7 (90 phút)</h2>
          <p>Hiểu cấu trúc trang tính Excel (đuôi tệp <code>.xlsx</code>), cách đọc địa chỉ ô tính và sử dụng công thức/hàm để tính toán danh sách số liệu.</p>
          <h2>1. Cấu trúc Bảng tính & Công thức Excel</h2>
          <ul>
            <li><strong>Cột (Column):</strong> Ký hiệu bằng chữ cái <code>A, B, C, D...</code> • <strong>Hàng (Row):</strong> Đánh số <code>1, 2, 3, 4...</code></li>
            <li><strong>Địa chỉ Ô (Cell):</strong> Ghép tên Cột trước, Hàng sau (Ví dụ: <code>B3</code>, <code>C10</code>).</li>
            <li><strong>Quy tắc vàng:</strong> Mọi công thức trong Excel luôn bắt đầu bằng dấu bằng (<code>=</code>).</li>
            <li><strong>Các hàm cơ bản trong IC3 Spark:</strong> <code>=SUM(A1:A5)</code> (Tính tổng), <code>=AVERAGE(A1:A5)</code> (Trung bình cộng), <code>=MAX(A1:A5)</code> (Giá trị lớn nhất), <code>=MIN(A1:A5)</code> (Giá trị nhỏ nhất).</li>
          </ul>
        `,
      },
      {
        title: 'Buổi 8: Trình chiếu Microsoft PowerPoint (.pptx) - Thiết kế Slide, Transitions & Animations',
        course: courseSpark._id,
        module: 2,
        type: 'practice',
        duration: 90,
        order: 4,
        content: `
          <h2>Mục tiêu Buổi 8 (90 phút)</h2>
          <p>Tạo bài thuyết trình sinh động (đuôi tệp <code>.pptx</code>) với hình ảnh, hiệu ứng chuyển trang và hiệu ứng hoạt hình.</p>
          <h2>1. Các thao tác cốt lõi trong PowerPoint</h2>
          <ul>
            <li><strong>Thêm trang chiếu mới (New Slide):</strong> Nhấn nút <strong>New Slide</strong> trong thẻ Home hoặc phím tắt <code>Ctrl + M</code>.</li>
            <li><strong>Transitions (Hiệu ứng chuyển trang):</strong> Hiệu ứng khi lật từ Slide này sang Slide kế tiếp.</li>
            <li><strong>Animations (Hiệu ứng đối tượng):</strong> Hiệu ứng bay vào, nổi bật hoặc biến mất dành cho từng hộp văn bản, hình ảnh trên một Slide.</li>
            <li><strong>Trình chiếu toàn màn hình:</strong> Nhấn phím <code>F5</code> (bắt đầu từ Slide 1) và nhấn phím <code>Esc</code> để thoát trình chiếu.</li>
          </ul>
        `,
      },
      {
        title: 'Buổi 9: Mạng máy tính, Internet, WWW, Địa chỉ URL & Sử dụng Trình duyệt Web',
        course: courseSpark._id,
        module: 3,
        type: 'theory',
        duration: 90,
        order: 1,
        content: `
          <h2>Mục tiêu Buổi 9 (90 phút)</h2>
          <p>Hiểu khái niệm mạng Internet, World Wide Web (WWW), giải mã các thành phần của một địa chỉ URL và thao tác trên trình duyệt Web.</p>
          <h2>1. Các khái niệm trọng tâm trong đề thi IC3 Spark</h2>
          <ul>
            <li><strong>WWW:</strong> Viết tắt của <strong>World Wide Web</strong> (Mạng lưới thông tin toàn cầu).</li>
            <li><strong>Trình duyệt Web (Web Browser):</strong> Phần mềm dùng để mở và xem các trang web (Ví dụ: <em>Google Chrome, Microsoft Edge, Mozilla Firefox, Apple Safari</em>).</li>
            <li><strong>Địa chỉ URL:</strong> Gồm <strong>Giao thức (Protocol)</strong> như <code>https://</code> (chữ <strong>s</strong> là <em>Secure</em> - bảo mật) và <strong>Tên miền (Domain Name)</strong> như <code>certiport.com</code>, <code>iigvietnam.edu.vn</code>.</li>
          </ul>
        `,
      },
      {
        title: 'Buổi 10: Tìm kiếm thông tin trên Internet & Sử dụng Thư điện tử (Email: To, Cc, Bcc)',
        course: courseSpark._id,
        module: 3,
        type: 'practice',
        duration: 90,
        order: 2,
        content: `
          <h2>Mục tiêu Buổi 10 (90 phút)</h2>
          <p>Sử dụng máy tìm kiếm Google hiệu quả và thực hành soạn, gửi, trả lời thư điện tử (Email) đúng quy chuẩn.</p>
          <h2>1. Thành phần của một bức Thư điện tử (Email)</h2>
          <ul>
            <li><strong>To:</strong> Địa chỉ email người nhận chính • <strong>Subject:</strong> Chủ đề tóm tắt nội dung thư.</li>
            <li><strong>Cc (Carbon Copy):</strong> Gửi bản sao công khai • <strong>Bcc (Blind Carbon Copy):</strong> Gửi bản sao ẩn danh.</li>
            <li><strong>Attachment (Biểu tượng kẹp giấy 📎):</strong> Đính kèm tệp tài liệu, hình ảnh.</li>
            <li><strong>Reply vs Reply All:</strong> <em>Reply</em> chỉ trả lời cho người gửi; <em>Reply All</em> trả lời cho tất cả mọi người có trong thư.</li>
          </ul>
        `,
      },
      {
        title: 'Buổi 11: Đạo đức mạng (Netiquette), Bảo mật thông tin cá nhân & Phòng chống Cyberbullying',
        course: courseSpark._id,
        module: 3,
        type: 'theory',
        duration: 90,
        order: 3,
        content: `
          <h2>Mục tiêu Buổi 11 (90 phút)</h2>
          <p>Trang bị kỹ năng tự bảo vệ bản thân trên môi trường mạng và ứng xử văn minh khi giao tiếp trực tuyến.</p>
          <h2>1. Quy tắc An toàn Trực tuyến Vàng cho Học sinh</h2>
          <ul>
            <li><strong>Không tiết lộ thông tin nhạy cảm:</strong> Mật khẩu, địa chỉ nhà, số điện thoại, lịch trình cá nhân cho người lạ trên mạng.</li>
            <li><strong>Xử lý Email/Link lạ:</strong> Khi nhận được email từ người lạ có đường link hoặc tệp đính kèm không rõ nguồn gốc → <strong>Tuyệt đối không mở tệp, không nhấp link và báo ngay cho bố mẹ hoặc thầy cô giáo.</strong></li>
            <li><strong>Ứng phó Bắt nạt qua mạng (Cyberbullying):</strong> Không trả đũa, lưu bằng chứng, chặn tài khoản và nhờ người lớn can thiệp.</li>
          </ul>
        `,
      },
      {
        title: 'Buổi 12: Tổng ôn tập 3 Học phần (CF - KA - LO) & Thi thử Tổng hợp IC3 Spark',
        course: courseSpark._id,
        module: 3,
        type: 'practice',
        duration: 90,
        order: 4,
        content: `
          <h2>Mục tiêu Buổi 12 (90 phút)</h2>
          <p>Hệ thống hóa toàn bộ kiến thức 11 buổi học và thực hiện bài Thi thử tổng hợp IC3 Spark theo đúng áp lực thời gian thực tế.</p>
          <h2>Cấu trúc bài thi chuẩn Certiport IC3 Spark</h2>
          <ul>
            <li><strong>Số lượng câu hỏi:</strong> 40 - 45 câu hỏi (Trắc nghiệm, Đúng/Sai, Nối cặp, Tình huống mô phỏng thao tác).</li>
            <li><strong>Thời gian làm bài:</strong> 50 phút • <strong>Điểm tối đa:</strong> 1000 điểm (Điểm đạt chuẩn Pass: <strong>700/1000 điểm</strong>).</li>
            <li>Hãy nhấn vào <strong>Đề Thi Thử Tổng Hợp IC3 Spark</strong> bên dưới để bắt đầu làm bài ngay!</li>
          </ul>
        `,
      },
    ]);

    courseSpark.modules[0].lessons = [
      sparkLessons[0]._id,
      sparkLessons[1]._id,
      sparkLessons[2]._id,
      sparkLessons[3]._id,
    ];
    courseSpark.modules[1].lessons = [
      sparkLessons[4]._id,
      sparkLessons[5]._id,
      sparkLessons[6]._id,
      sparkLessons[7]._id,
    ];
    courseSpark.modules[2].lessons = [
      sparkLessons[8]._id,
      sparkLessons[9]._id,
      sparkLessons[10]._id,
      sparkLessons[11]._id,
    ];
    await courseSpark.save();

    // =========================================================================
    // COURSE 2: IC3 GS6 LEVEL 1 - LỘ TRÌNH 12 BUỔI CHUẨN 7 CHUYÊN ĐỀ CERTIPORT
    // =========================================================================
    const courseGS6L1 = await Course.create({
      title: 'IC3 GS6 Level 1 - Nền Tảng Công Nghệ Số (Lộ Trình 12 Buổi Chuẩn 7 Chuyên Đề)',
      slug: 'ic3-gs6-level-1-lo-trinh-12-buoi',
      description:
        'Giáo trình giảng dạy 12 buổi (24 tiết) cho chứng chỉ quốc tế IC3 Digital Literacy GS6 Level 1 (Cấp độ Nhận biết / Know). Phân bổ khoa học toàn bộ 7 chuyên đề năng lực số từ Phần cứng, Hệ điều hành, Đám mây, Công dân số, Bản quyền đến An toàn Bảo mật.',
      category: 'ic3-gs6',
      thumbnail:
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
      teacher: teacher._id,
      isPublished: true,
      students: [student1._id, student2._id, student3._id],
      modules: [
        {
          title: 'Giai đoạn 1 (Buổi 1 - Buổi 4): Công nghệ Cơ bản & Công dân Kỷ nguyên số',
          description: 'Phần cứng, cổng kết nối, hệ điều hành, đám mây, dấu chân số và luật bản quyền số',
          order: 1,
          lessons: [],
        },
        {
          title: 'Giai đoạn 2 (Buổi 5 - Buổi 8): Quản lý Thông tin, Sáng tạo Nội dung & Truyền thông',
          description: 'Trình duyệt, kỹ thuật tìm kiếm, lưu trữ đám mây, soạn thảo tài liệu và giao tiếp đồng bộ/không đồng bộ',
          order: 2,
          lessons: [],
        },
        {
          title: 'Giai đoạn 3 (Buổi 9 - Buổi 12): Cộng tác Trực tuyến, An toàn Bảo mật & Thi thử Level 1',
          description: 'Phân quyền chia sẻ tài liệu, mật khẩu mạnh, 2FA/MFA, phòng chống Phishing/Malware và giải đề chuẩn',
          order: 3,
          lessons: [],
        },
      ],
    });

    const gs6L1Lessons = await Lesson.create([
      {
        title: 'Buổi 1 - 2 (Chuyên đề 1 - Technology Basics): Phần cứng, Cổng kết nối (USB, HDMI, Ethernet), Hệ điều hành & Đám mây',
        course: courseGS6L1._id,
        module: 1,
        type: 'theory',
        duration: 90,
        order: 1,
        content: `
          <h2>Nội dung Giảng dạy Buổi 1 & Buổi 2 (Chuyên đề 1: Công nghệ cơ bản)</h2>
          <ul>
            <li><strong>Cổng kết nối thông dụng:</strong>
              <ul>
                <li><strong>USB (USB-A, USB-C):</strong> Kết nối thiết bị ngoại vi (chuột, bàn phím, ổ nhớ Flash, máy in) và truyền dữ liệu/sạc điện.</li>
                <li><strong>HDMI:</strong> Truyền tải đồng thời cả <strong>hình ảnh độ phân giải cao và âm thanh</strong> sang màn hình hoặc máy chiếu.</li>
                <li><strong>Ethernet (RJ-45):</strong> Kết nối mạng dây (LAN) tốc độ cao và ổn định.</li>
              </ul>
            </li>
            <li><strong>Phân loại Hệ điều hành & Phần mềm:</strong>
              <ul>
                <li><strong>Mã nguồn mở (Open Source):</strong> Cho phép xem và chỉnh sửa mã nguồn (<em>Linux, Android</em>).</li>
                <li><strong>Độc quyền / Mã nguồn đóng (Proprietary):</strong> Thuộc bản quyền nhà phát triển (<em>Windows 11, macOS, iOS</em>).</li>
                <li><strong>Phần mềm dịch vụ đám mây (SaaS):</strong> Sử dụng trực tiếp qua trình duyệt Internet như <em>Google Docs, Microsoft 365 Web, Google Drive, OneDrive</em>.</li>
              </ul>
            </li>
          </ul>
        `,
      },
      {
        title: 'Buổi 3 - 4 (Chuyên đề 2 - Digital Citizenship): Dấu chân Kỹ thuật số (Active/Passive) & Bản quyền (Copyright, CC)',
        course: courseGS6L1._id,
        module: 1,
        type: 'theory',
        duration: 90,
        order: 2,
        content: `
          <h2>Nội dung Giảng dạy Buổi 3 & Buổi 4 (Chuyên đề 2: Công dân kỷ nguyên số)</h2>
          <ul>
            <li><strong>Dấu chân Kỹ thuật số (Digital Footprint):</strong>
              <ul>
                <li><strong>Chủ động (Active):</strong> Bài viết, hình ảnh, bình luận, email do chính người dùng chủ động đăng tải.</li>
                <li><strong>Thụ động (Passive):</strong> Địa chỉ IP, lịch sử duyệt web, vị trí địa lý, cookie được thu thập tự động.</li>
              </ul>
            </li>
            <li><strong>Sở hữu trí tuệ & Bản quyền:</strong>
              <ul>
                <li><strong>Bản quyền (Copyright ©):</strong> Bảo vệ quyền tác giả đối với tác phẩm gốc.</li>
                <li><strong>Đạo văn (Plagiarism):</strong> Sao chép bài viết/ý tưởng của người khác làm của mình mà không trích dẫn nguồn.</li>
                <li><strong>Phạm vi công cộng (Public Domain):</strong> Tác phẩm không còn giới hạn bản quyền, được tự do sử dụng.</li>
                <li><strong>Giấy phép Creative Commons (CC):</strong> <code>BY</code> (Ghi công tác giả), <code>NC</code> (Phi thương mại), <code>ND</code> (Không làm tác phẩm phái sinh), <code>SA</code> (Chia sẻ tương tự).</li>
              </ul>
            </li>
          </ul>
        `,
      },
      {
        title: 'Buổi 5 - 6 (Chuyên đề 3 & 4): Quản lý Thông tin, Kỹ thuật Tìm kiếm (Ctrl+F, "...") & Sáng tạo Nội dung số',
        course: courseGS6L1._id,
        module: 2,
        type: 'practice',
        duration: 90,
        order: 1,
        content: `
          <h2>Nội dung Giảng dạy Buổi 5 & Buổi 6 (Quản lý thông tin & Sáng tạo nội dung)</h2>
          <ul>
            <li><strong>Kỹ thuật Tìm kiếm & Trình duyệt:</strong>
              <ul>
                <li>Phím tắt <code>Ctrl + F</code>: Tìm nhanh một từ khóa ngay trên trang web hoặc tài liệu đang mở.</li>
                <li>Dấu ngoặc kép <code>"chứng chỉ IC3 GS6"</code>: Tìm kiếm chính xác cụm từ theo đúng thứ tự.</li>
                <li>Phân biệt <strong>Bookmarks/Favorites</strong> (Lưu trang yêu thích), <strong>History</strong> (Lịch sử truy cập), <strong>Cache</strong> (Bộ nhớ đệm tăng tốc tải trang) và <strong>Cookies</strong> (Lưu phiên đăng nhập & tùy chọn cá nhân).</li>
              </ul>
            </li>
            <li><strong>Sáng tạo Nội dung cơ bản:</strong> Bố cục văn bản Word (Hướng trang Portrait/Landscape, Lề trang Margins), Bảng tính Excel và Trình chiếu PowerPoint.</li>
          </ul>
        `,
      },
      {
        title: 'Buổi 7 - 8 (Chuyên đề 5 - Communication): Giao tiếp Đồng bộ (Synchronous) vs Không đồng bộ (Asynchronous)',
        course: courseGS6L1._id,
        module: 2,
        type: 'theory',
        duration: 90,
        order: 2,
        content: `
          <h2>Nội dung Giảng dạy Buổi 7 & Buổi 8 (Chuyên đề 5: Truyền thông số)</h2>
          <table>
            <thead>
              <tr>
                <th>Giao tiếp Đồng bộ (Synchronous)</th>
                <th>Giao tiếp Không đồng bộ (Asynchronous)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Diễn ra trực tiếp theo <strong>thời gian thực (Real-time)</strong>, các bên phản hồi tức thì.</td>
                <td>Có độ trễ thời gian; người nhận có thể đọc và trả lời vào lúc khác.</td>
              </tr>
              <tr>
                <td><strong>Ví dụ:</strong> Gọi điện thoại, Họp video (Zoom, Google Meet, MS Teams), Live Chat.</td>
                <td><strong>Ví dụ:</strong> Thư điện tử (Email), Diễn đàn (Forum), Bình luận trên tài liệu.</td>
              </tr>
            </tbody>
          </table>
        `,
      },
      {
        title: 'Buổi 9 - 10 (Chuyên đề 6 & 7): Cộng tác Đám mây (Viewer/Commenter/Editor), Mật khẩu mạnh & Xác thực 2FA',
        course: courseGS6L1._id,
        module: 3,
        type: 'practice',
        duration: 90,
        order: 1,
        content: `
          <h2>Nội dung Giảng dạy Buổi 9 & Buổi 10 (Cộng tác & Bảo mật tài khoản)</h2>
          <ul>
            <li><strong>3 Cấp độ Phân quyền Chia sẻ Tài liệu Đám mây:</strong>
              <ul>
                <li><strong>Người xem (Viewer / Can view):</strong> Chỉ đọc tài liệu.</li>
                <li><strong>Người nhận xét (Commenter / Can comment):</strong> Được đọc và gắn bình luận góp ý bên lề, không xóa/sửa trực tiếp nội dung gốc.</li>
                <li><strong>Người chỉnh sửa (Editor / Can edit):</strong> Toàn quyền chỉnh sửa nội dung tài liệu.</li>
              </ul>
            </li>
            <li><strong>Mật khẩu mạnh & Xác thực đa yếu tố (2FA / MFA):</strong>
              <ul>
                <li>Mật khẩu mạnh dài ≥ 8-12 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt (Ví dụ: <code>Tr@mH0c#IC3!2026</code>).</li>
                <li>Xác thực 2 yếu tố (2FA) kết hợp Mật khẩu + Mã OTP điện thoại hoặc Sinh trắc học (Vân tay, Khuôn mặt).</li>
              </ul>
            </li>
          </ul>
        `,
      },
      {
        title: 'Buổi 11 - 12 (Chuyên đề 7 & Thi thử): Phòng chống Phishing, Malware, Công thái học & Giải đề IC3 GS6 Level 1',
        course: courseGS6L1._id,
        module: 3,
        type: 'practice',
        duration: 90,
        order: 2,
        content: `
          <h2>Nội dung Giảng dạy Buổi 11 & Buổi 12 (An ninh mạng & Thi thử Level 1)</h2>
          <ul>
            <li><strong>Nhận diện Tấn công mạng:</strong>
              <ul>
                <li><strong>Phishing (Giả mạo lừa đảo):</strong> Email/tin nhắn giả danh ngân hàng, trường học chứa link giả để đánh cắp tài khoản.</li>
                <li><strong>Malware (Phần mềm độc hại):</strong> Virus, Trojan (ngụy trang phần mềm hợp pháp), Ransomware (mã hóa đòi tiền chuộc), Spyware (gián điệp).</li>
              </ul>
            </li>
            <li><strong>Công thái học (Ergonomics):</strong> Tư thế ngồi thẳng lưng, mắt ngang tầm mép trên màn hình, quy tắc 20-20-20 bảo vệ thị lực.</li>
            <li><strong>Thi thử cuối khóa:</strong> Làm bài thi thử chuẩn Certiport IC3 GS6 Level 1 (Mục tiêu đạt ≥ 700/1000 điểm).</li>
          </ul>
        `,
      },
    ]);

    courseGS6L1.modules[0].lessons = [gs6L1Lessons[0]._id, gs6L1Lessons[1]._id];
    courseGS6L1.modules[1].lessons = [gs6L1Lessons[2]._id, gs6L1Lessons[3]._id];
    courseGS6L1.modules[2].lessons = [gs6L1Lessons[4]._id, gs6L1Lessons[5]._id];
    await courseGS6L1.save();

    // =========================================================================
    // COURSE 3: IC3 GS6 LEVEL 2 - LỘ TRÌNH 10 BUỔI THỰC HÀNH TRUNG CẤP (DO)
    // =========================================================================
    const courseGS6L2 = await Course.create({
      title: 'IC3 GS6 Level 2 - Thực Hành Kỹ Năng Số Trung Cấp (Lộ Trình 10 Buổi Chuyên Sâu)',
      slug: 'ic3-gs6-level-2-lo-trinh-10-buoi',
      description:
        'Khóa học 10 buổi (20 tiết) rèn luyện năng lực Thực hành (Do) theo chuẩn IC3 GS6 Level 2: Tinh chỉnh thiết bị hiển thị (Contrast/Brightness), công nghệ máy in (Laser/Inkjet), tự động hóa văn phòng (AutoCorrect, Heading Styles, Mục lục tự động, Hàm Excel) và kiểm chứng nguồn tin khoa học.',
      category: 'ic3-gs6',
      thumbnail:
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
      teacher: teacher._id,
      isPublished: true,
      students: [student1._id, student2._id],
      modules: [
        {
          title: 'Học phần 1 (Buổi 1 - Buổi 5): Cấu hình Phần cứng, Hệ điều hành & Đánh giá Nguồn tin Khoa học',
          description: 'Cài đặt màn hình Contrast/Brightness, máy in Laser/Inkjet, mạng không dây và kiểm chứng nghiên cứu',
          order: 1,
          lessons: [],
        },
        {
          title: 'Học phần 2 (Buổi 6 - Buổi 10): Tự động hóa Word/Excel/PowerPoint, Bảo mật & Thi thử Level 2',
          description: 'AutoCorrect, Heading Styles, Table of Contents, Hàm Excel, Trình duyệt ẩn danh và Giải đề Level 2',
          order: 2,
          lessons: [],
        },
      ],
    });

    const gs6L2Lessons = await Lesson.create([
      {
        title: 'Buổi 1 - 3: Tinh chỉnh Hiển thị (Contrast vs Brightness), Công nghệ Máy in (Laser vs Inkjet) & Thiết bị',
        course: courseGS6L2._id,
        module: 1,
        type: 'practice',
        duration: 90,
        order: 1,
        content: `
          <h2>Nội dung Trọng tâm Buổi 1 - Buổi 3 (IC3 GS6 Level 2)</h2>
          <ul>
            <li><strong>Cài đặt Hiển thị Màn hình:</strong>
              <ul>
                <li><strong>Độ tương phản (Contrast):</strong> Điều chỉnh sự chênh lệch giữa vùng tối và vùng sáng. <em>Tình huống đề thi: Khi màn hình hiển thị vùng tối quá tối và vùng sáng quá sáng gây lóa, cần chỉnh <strong>Contrast (Độ tương phản)</strong>.</em></li>
                <li><strong>Độ sáng (Brightness):</strong> Tăng/giảm mức sáng tổng thể của màn hình theo ánh sáng môi trường.</li>
              </ul>
            </li>
            <li><strong>Phân biệt Công nghệ Máy in:</strong>
              <ul>
                <li><strong>Máy in Laser (Laser Printer):</strong> Sử dụng <strong>mực dạng bột (Powdered Toner)</strong> và nhiệt ép mực, giúp tài liệu <strong>khô mực ngay lập tức khi vừa in ra</strong>, tốc độ in nhanh.</li>
                <li><strong>Máy in Phun (Inkjet Printer):</strong> Phun các giọt mực lỏng (Liquid Ink) lên giấy.</li>
                <li><strong>Máy in Nhiệt (Thermal Printer):</strong> Dùng nhiệt trên giấy cảm nhiệt (in hóa đơn POS).</li>
              </ul>
            </li>
          </ul>
        `,
      },
      {
        title: 'Buổi 4 - 5: Kiểm chứng Độ tin cậy của Nghiên cứu Khoa học, Trích dẫn Nguồn & Duyệt Web Ẩn danh',
        course: courseGS6L2._id,
        module: 1,
        type: 'theory',
        duration: 90,
        order: 2,
        content: `
          <h2>Nội dung Trọng tâm Buổi 4 - Buổi 5 (Quản lý thông tin & Quyền riêng tư)</h2>
          <ul>
            <li><strong>Tiêu chí đánh giá Độ tin cậy của Nghiên cứu Khoa học trên mạng (Câu hỏi Đúng/Sai chuẩn Certiport):</strong>
              <ul>
                <li><strong>CÓ xem xét:</strong> Tổ chức tài trợ cho nghiên cứu, Đơn vị công bố kết quả nghiên cứu, Chuyên môn của tác giả, Kiểm duyệt đồng cấp (Peer-reviewed).</li>
                <li><strong>KHÔNG dùng làm căn cứ:</strong> Số lượt thích (Likes) hoặc lượt chia sẻ trên mạng xã hội.</li>
              </ul>
            </li>
            <li><strong>Chế độ Duyệt web Ẩn danh (Incognito / InPrivate):</strong> Không lưu lịch sử duyệt web, cookie và dữ liệu biểu mẫu trên máy tính cục bộ sau khi đóng cửa sổ (nhưng nhà cung cấp mạng ISP và trang web đích vẫn biết bạn truy cập).</li>
          </ul>
        `,
      },
      {
        title: 'Buổi 6 - 8: Thực hành Word/Excel/PowerPoint Trung cấp - AutoCorrect, Heading Styles & Hàm Excel',
        course: courseGS6L2._id,
        module: 2,
        type: 'practice',
        duration: 90,
        order: 1,
        content: `
          <h2>Nội dung Trọng tâm Buổi 6 - Buổi 8 (Sáng tạo nội dung Trung cấp)</h2>
          <ul>
            <li><strong>Tính năng Tự động sửa lỗi (AutoCorrect trong Word):</strong> Tự động sửa lỗi chính tả hoặc từ gõ sai ngay khi đang nhập liệu (Ví dụ: gõ <code>"see you latet"</code> tự động đổi thành <code>"see you later"</code>).</li>
            <li><strong>Tạo Mục lục tự động (Table of Contents):</strong> Bước 1: Áp dụng <strong>Heading Styles (Heading 1, Heading 2, Heading 3)</strong> cho các tiêu đề chương/mục → Bước 2: Vào thẻ <strong>References → Table of Contents</strong>.</li>
            <li><strong>Hàm tính toán & Xử lý dữ liệu Excel:</strong> Sử dụng địa chỉ tuyệt đối (<code>$A$1</code>), hàm <code>SUM, AVERAGE, COUNT, MAX, MIN</code>, Sắp xếp (<code>Sort</code>), Lọc (<code>Filter</code>) và Biểu đồ (<code>Charts</code>).</li>
          </ul>
        `,
      },
      {
        title: 'Buổi 9 - 10: Quản lý Hộp thư Nâng cao, Bảo mật Giao dịch Trực tuyến & Giải đề IC3 GS6 Level 2',
        course: courseGS6L2._id,
        module: 2,
        type: 'practice',
        duration: 90,
        order: 2,
        content: `
          <h2>Nội dung Trọng tâm Buổi 9 - Buổi 10 (Truyền thông, Bảo mật & Thi thử Level 2)</h2>
          <ul>
            <li><strong>Quản lý Email & Lịch làm việc:</strong> Thiết lập Bộ lọc tự động (Rules/Filters), Chữ ký tự động (Signature), Trả lời tự động khi vắng mặt (Out of Office / Automatic Replies) và Đặt lịch họp trực tuyến kèm múi giờ.</li>
            <li><strong>An toàn Giao dịch Trực tuyến:</strong> Kiểm tra giao thức <code>https://</code> và biểu tượng ổ khóa SSL trước khi nhập thông tin thanh toán; không giao dịch ngân hàng trên Wi-Fi công cộng không mật khẩu.</li>
          </ul>
        `,
      },
    ]);

    courseGS6L2.modules[0].lessons = [gs6L2Lessons[0]._id, gs6L2Lessons[1]._id];
    courseGS6L2.modules[1].lessons = [gs6L2Lessons[2]._id, gs6L2Lessons[3]._id];
    await courseGS6L2.save();

    // =========================================================================
    // COURSE 4: IC3 GS6 LEVEL 3 - LỘ TRÌNH 10 BUỔI CHUYÊN MÔN NÂNG CAO (LEAD)
    // =========================================================================
    const courseGS6L3 = await Course.create({
      title: 'IC3 GS6 Level 3 - Quản Trị Hệ Thống, Bảo Mật & Xử Lý Sự Cố (Lộ Trình 10 Buổi Nâng Cao)',
      slug: 'ic3-gs6-level-3-lo-trinh-10-buoi',
      description:
        'Khóa học 10 buổi (20 tiết) cho cấp độ cao nhất IC3 GS6 Level 3 (Lead): Chẩn đoán và xử lý sự cố mạng/hệ thống, bảo mật VPN/Firewall/Mã hóa, chiến lược sao lưu Incremental vs Full Backup, quản trị phiên bản tài liệu (Track Changes, Version History, Document Inspector) và phân tích dữ liệu.',
      category: 'ic3-gs6',
      thumbnail:
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
      teacher: teacher._id,
      isPublished: true,
      students: [student1._id],
      modules: [
        {
          title: 'Học phần 1 (Buổi 1 - Buổi 5): Quản trị Hệ thống, Xử lý Sự cố Mạng, VPN, Firewall & Sao lưu Dữ liệu',
          description: 'Troubleshooting, Task Manager, IP/DNS, VPN, Firewall, Encryption và chiến lược Backup',
          order: 1,
          lessons: [],
        },
        {
          title: 'Học phần 2 (Buổi 6 - Buổi 10): Cộng tác Chuyên sâu (Track Changes, Metadata), Phân tích Dữ liệu & Thi thử Level 3',
          description: 'Track Changes, Version History, Document Inspector, Sở hữu trí tuệ nâng cao và Giải đề Level 3',
          order: 2,
          lessons: [],
        },
      ],
    });

    const gs6L3Lessons = await Lesson.create([
      {
        title: 'Buổi 1 - 5: Chẩn đoán Sự cố (Troubleshooting), Bảo mật Mạng (VPN, Firewall) & Sao lưu (Full vs Incremental Backup)',
        course: courseGS6L3._id,
        module: 1,
        type: 'theory',
        duration: 90,
        order: 1,
        content: `
          <h2>Nội dung Trọng tâm Buổi 1 - Buổi 5 (IC3 GS6 Level 3)</h2>
          <ul>
            <li><strong>Bảo mật Mạng Doanh nghiệp & Làm việc Từ xa:</strong>
              <ul>
                <li><strong>VPN (Virtual Private Network - Mạng riêng ảo):</strong> Tạo đường hầm kết nối được <strong>mã hóa an toàn</strong> khi làm việc qua Wi-Fi công cộng (sân bay, quán cà phê), giúp ẩn địa chỉ IP và bảo vệ dữ liệu.</li>
                <li><strong>Firewall (Tường lửa):</strong> Giám sát và chặn các kết nối mạng trái phép ra/vào hệ thống dựa trên quy tắc bảo mật.</li>
                <li><strong>Encryption (Mã hóa dữ liệu):</strong> Biến đổi dữ liệu sang dạng mật mã mà chỉ người có khóa giải mã hợp lệ mới đọc được.</li>
              </ul>
            </li>
            <li><strong>Chiến lược Sao lưu Dữ liệu (Backup):</strong>
              <ul>
                <li><strong>Full Backup (Sao lưu toàn bộ):</strong> Sao chép toàn bộ dữ liệu; an toàn nhưng tốn nhiều thời gian và dung lượng nhất.</li>
                <li><strong>Incremental Backup (Sao lưu tăng dần):</strong> Chỉ sao chép các tệp mới hoặc đã thay đổi kể từ lần sao lưu gần nhất, giúp tiết kiệm tối đa thời gian và dung lượng lưu trữ.</li>
              </ul>
            </li>
          </ul>
        `,
      },
      {
        title: 'Buổi 6 - 10: Quản trị Tài liệu (Track Changes, Version History, Document Inspector) & Thi thử Level 3',
        course: courseGS6L3._id,
        module: 2,
        type: 'practice',
        duration: 90,
        order: 1,
        content: `
          <h2>Nội dung Trọng tâm Buổi 6 - Buổi 10 (Cộng tác chuyên sâu & Thi thử Level 3)</h2>
          <ul>
            <li><strong>Theo dõi Thay đổi (Track Changes trong thẻ Review của Word):</strong> Ghi lại toàn bộ chỉnh sửa của từng người để chủ sở hữu tài liệu xem xét và nhấn <strong>Accept (Chấp nhận)</strong> hoặc <strong>Reject (Từ chối)</strong> từng thay đổi.</li>
            <li><strong>Lịch sử Phiên bản (Version History):</strong> Xem và khôi phục (Restore) tài liệu về các phiên bản lưu trước đó trên đám mây.</li>
            <li><strong>Kiểm tra và Xóa Siêu dữ liệu ẩn (Document Inspector / Metadata):</strong> Trước khi phát hành tài liệu ra bên ngoài, vào <strong>File → Info → Check for Issues → Inspect Document</strong> để xóa thông tin ẩn như tên tác giả, ghi chú ẩn, thuộc tính cá nhân.</li>
          </ul>
        `,
      },
    ]);

    courseGS6L3.modules[0].lessons = [gs6L3Lessons[0]._id];
    courseGS6L3.modules[1].lessons = [gs6L3Lessons[1]._id];
    await courseGS6L3.save();

    // =========================================================================
    // QUIZZES & MOCK EXAMS (7 BỘ ĐỀ ÔN TẬP & ĐỀ THI THỬ IC3 SPARK & IC3 GS6)
    // =========================================================================
    await Quiz.create([
      {
        title: 'Bài tập Ôn luyện IC3 Spark #1: Máy tính căn bản (Buổi 1 - Buổi 4)',
        course: courseSpark._id,
        lesson: sparkLessons[0]._id,
        type: 'practice',
        timeLimit: 15,
        passingScore: 70,
        questions: [
          {
            questionText: 'Câu 1: Đâu KHÔNG phải là một thiết bị đầu vào (Input Device) phổ biến của máy tính?',
            questionType: 'multiple-choice',
            options: [
              { text: 'Bàn phím (Keyboard)', isCorrect: false },
              { text: 'Chuột máy tính (Mouse)', isCorrect: false },
              { text: 'Loa (Speaker)', isCorrect: true },
              { text: 'Micro (Microphone)', isCorrect: false },
            ],
            explanation: 'Loa (Speaker) phát âm thanh từ máy tính ra ngoài nên là thiết bị đầu ra (Output Device).',
            points: 10,
          },
          {
            questionText: 'Câu 2: Khi em nhấp chuột chọn nút Shut down trong Windows, điều gì sẽ xảy ra?',
            questionType: 'multiple-choice',
            options: [
              { text: 'Máy tính chỉ tắt màn hình nhưng các ứng dụng vẫn chạy ngầm', isCorrect: false },
              { text: 'Máy tính chuyển sang chế độ ngủ (Sleep) tiết kiệm điện', isCorrect: false },
              { text: 'Đóng tất cả các tập tin, chương trình đang mở và tắt hoàn toàn máy tính', isCorrect: true },
              { text: 'Máy tính tự động khởi động lại từ đầu', isCorrect: false },
            ],
            explanation: 'Shut down sẽ đóng toàn bộ ứng dụng, tệp đang mở và tắt hẳn nguồn máy tính.',
            points: 10,
          },
          {
            questionText: 'Câu 3: Bộ nhớ RAM lưu trữ dữ liệu tạm thời và sẽ bị mất dữ liệu khi máy tính bị tắt nguồn. Đúng hay Sai?',
            questionType: 'true-false',
            options: [
              { text: 'Đúng', isCorrect: true },
              { text: 'Sai', isCorrect: false },
            ],
            correctAnswer: 'Đúng',
            explanation: 'RAM (Random Access Memory) là bộ nhớ khả biến (Volatile), dữ liệu sẽ mất khi ngắt nguồn điện.',
            points: 10,
          },
          {
            questionText: 'Câu 4: Đơn vị nào là đơn vị NHỎ NHẤT để đo lượng thông tin trong máy tính? (Nhập tên đơn vị bằng tiếng Anh gồm 3 chữ cái)',
            questionType: 'short-answer',
            correctAnswer: 'Bit',
            explanation: 'Bit (Binary Digit) là đơn vị nhỏ nhất đo lượng thông tin trong máy tính (8 Bit = 1 Byte).',
            points: 10,
          },
          {
            questionText: 'Câu 5: [Mô phỏng thao tác Windows] Em hãy chọn thao tác ĐÚNG để tạo một thư mục (Folder) mới trên màn hình nền Desktop:',
            questionType: 'simulation',
            options: [
              { text: 'Nhấp chuột phải vào vùng trống trên Desktop -> Chọn New -> Chọn Folder -> Nhập tên -> Nhấn Enter', isCorrect: true },
              { text: 'Nhấp đúp chuột trái vào biểu tượng Recycle Bin -> Nhấn phím Delete', isCorrect: false },
              { text: 'Nhấn tổ hợp phím Ctrl + P trên màn hình Desktop', isCorrect: false },
              { text: 'Mở Start Menu -> Chọn Shut down', isCorrect: false },
            ],
            explanation: 'Thao tác chuẩn trên Windows: Chuột phải vào vùng trống trên Desktop -> New -> Folder.',
            points: 15,
          },
        ],
      },
      {
        title: 'Bài tập Ôn luyện IC3 Spark #2: Ứng dụng chủ chốt & Cuộc sống trực tuyến (Buổi 5 - Buổi 11)',
        course: courseSpark._id,
        lesson: sparkLessons[4]._id,
        type: 'practice',
        timeLimit: 15,
        passingScore: 70,
        questions: [
          {
            questionText: 'Câu 1: Giáo viên giao cho em bài tập tạo một bài thuyết trình có hình ảnh và hiệu ứng chuyển động về các loài động vật. Phần mềm nào phù hợp nhất?',
            questionType: 'multiple-choice',
            options: [
              { text: 'Microsoft Word', isCorrect: false },
              { text: 'Microsoft Excel', isCorrect: false },
              { text: 'Microsoft PowerPoint', isCorrect: true },
              { text: 'Windows File Explorer', isCorrect: false },
            ],
            explanation: 'Microsoft PowerPoint là phần mềm chuyên dụng để thiết kế các trang chiếu (Slide) thuyết trình.',
            points: 10,
          },
          {
            questionText: 'Câu 2: Huấn luyện viên yêu cầu em lập danh sách cầu thủ gồm tên, tuổi, điểm số và cần tính tổng điểm tự động. Phần mềm nào phù hợp nhất?',
            questionType: 'multiple-choice',
            options: [
              { text: 'Microsoft Excel', isCorrect: true },
              { text: 'Microsoft Paint', isCorrect: false },
              { text: 'Notepad', isCorrect: false },
              { text: 'Google Chrome', isCorrect: false },
            ],
            explanation: 'Microsoft Excel là phần mềm bảng tính giúp quản lý danh sách số liệu và tính toán bằng công thức/hàm.',
            points: 10,
          },
          {
            questionText: 'Câu 3: Sắp xếp các phần mở rộng (đuôi tệp) theo thứ tự: (1) Văn bản Word -> (2) Bảng tính Excel -> (3) Bài trình chiếu PowerPoint -> (4) Hình ảnh',
            questionType: 'drag-drop',
            options: [
              { text: '1. .docx (Tài liệu Microsoft Word)', isCorrect: true, position: 1 },
              { text: '2. .xlsx (Bảng tính Microsoft Excel)', isCorrect: true, position: 2 },
              { text: '3. .pptx (Trình chiếu Microsoft PowerPoint)', isCorrect: true, position: 3 },
              { text: '4. .jpg / .png (Tệp hình ảnh)', isCorrect: true, position: 4 },
            ],
            explanation: '.docx là Word, .xlsx là Excel, .pptx là PowerPoint, .jpg/.png là định dạng tệp hình ảnh.',
            points: 15,
          },
          {
            questionText: 'Câu 4: Khi nhận được một Email từ người lạ có kèm theo đường link trúng thưởng hoặc tệp đính kèm không rõ nguồn gốc, việc làm an toàn nhất là gì?',
            questionType: 'multiple-choice',
            options: [
              { text: 'Nhấp vào đường link ngay lập tức để nhận thưởng', isCorrect: false },
              { text: 'Tải tập tin xuống máy tính và mở lên xem thử', isCorrect: false },
              { text: 'Không mở tập tin, không nhấp vào đường link và báo cho bố mẹ hoặc giáo viên biết', isCorrect: true },
              { text: 'Chuyển tiếp (Forward) bức thư đó cho tất cả bạn bè trong lớp', isCorrect: false },
            ],
            explanation: 'Tuyệt đối không mở tệp/link lạ để tránh virus và lừa đảo trực tuyến (Phishing), đồng thời báo cho người lớn.',
            points: 15,
          },
        ],
      },
      {
        title: 'Đề Thi Thử Tổng Hợp Chứng Chỉ Quốc Tế IC3 Spark (Buổi 12 - Full 3 Học Phần)',
        course: courseSpark._id,
        lesson: sparkLessons[11]._id,
        type: 'exam',
        timeLimit: 25,
        passingScore: 70,
        questions: [
          {
            questionText: 'Câu 1: Thành phần nào được ví như "bộ não" của máy tính, chịu trách nhiệm kiểm soát mọi hoạt động và xử lý dữ liệu?',
            questionType: 'multiple-choice',
            options: [
              { text: 'RAM (Bộ nhớ tạm thời)', isCorrect: false },
              { text: 'CPU (Bộ xử lý trung tâm)', isCorrect: true },
              { text: 'HDD (Ổ đĩa cứng)', isCorrect: false },
              { text: 'Monitor (Màn hình)', isCorrect: false },
            ],
            explanation: 'CPU (Central Processing Unit) là bộ xử lý trung tâm hay "bộ não" của máy tính.',
            points: 10,
          },
          {
            questionText: 'Câu 2: Chữ "www" trong địa chỉ các trang web là viết tắt của cụm từ tiếng Anh nào?',
            questionType: 'multiple-choice',
            options: [
              { text: 'World Wide Web', isCorrect: true },
              { text: 'Word Wide Web', isCorrect: false },
              { text: 'Web World Wide', isCorrect: false },
              { text: 'Wide World Web', isCorrect: false },
            ],
            explanation: 'WWW là viết tắt của World Wide Web (Mạng lưới thông tin toàn cầu).',
            points: 10,
          },
          {
            questionText: 'Câu 3: Địa chỉ URL của một trang web cấu thành từ hai thành phần cơ bản nào?',
            questionType: 'multiple-choice',
            options: [
              { text: 'Giao thức (Protocol) và Tên miền / Tên tài nguyên', isCorrect: true },
              { text: 'Mật khẩu Wi-Fi và Tên người dùng', isCorrect: false },
              { text: 'Dung lượng RAM và Tốc độ CPU', isCorrect: false },
              { text: 'Tên máy in và Cổng USB', isCorrect: false },
            ],
            explanation: 'URL gồm Giao thức (như https://) và Tên miền / đường dẫn tài nguyên (như www.certiport.com).',
            points: 10,
          },
          {
            questionText: 'Câu 4: Trong Microsoft Excel, mọi công thức tính toán đều phải bắt đầu bằng dấu bằng (=). Đúng hay Sai?',
            questionType: 'true-false',
            options: [
              { text: 'Đúng', isCorrect: true },
              { text: 'Sai', isCorrect: false },
            ],
            correctAnswer: 'Đúng',
            explanation: 'Trong Excel, dấu bằng (=) báo hiệu cho phần mềm biết dữ liệu nhập vào là một công thức hoặc hàm.',
            points: 10,
          },
          {
            questionText: 'Câu 5: [Mô phỏng Microsoft Word] Để lưu một tài liệu Word hiện tại sang một tệp mới với tên khác mà vẫn giữ nguyên tệp gốc, em thực hiện thao tác nào?',
            questionType: 'simulation',
            options: [
              { text: 'Chọn thẻ File -> Chọn Save As -> Chọn thư mục lưu -> Nhập tên tệp mới -> Nhấn Save', isCorrect: true },
              { text: 'Nhấn tổ hợp phím Ctrl + P -> Chọn Print', isCorrect: false },
              { text: 'Chọn thẻ Home -> Nhấn biểu tượng chữ B (Bold)', isCorrect: false },
              { text: 'Đóng cửa sổ Word và chọn Don\'t Save', isCorrect: false },
            ],
            explanation: 'Lệnh File -> Save As dùng để lưu tài liệu thành một bản sao mới với tên hoặc vị trí lưu khác.',
            points: 20,
          },
        ],
      },
      {
        title: 'Bài tập Ôn luyện IC3 GS6 Level 1: Công nghệ cơ bản, Công dân số & Bảo mật (Buổi 1 - Buổi 6)',
        course: courseGS6L1._id,
        lesson: gs6L1Lessons[0]._id,
        type: 'practice',
        timeLimit: 20,
        passingScore: 70,
        questions: [
          {
            questionText: 'Câu 1: Thiết bị nào sau đây được sử dụng chủ yếu để nhập văn bản vào máy tính?',
            questionType: 'multiple-choice',
            options: [
              { text: 'Màn hình (Monitor)', isCorrect: false },
              { text: 'Bàn phím (Keyboard)', isCorrect: true },
              { text: 'Loa (Speaker)', isCorrect: false },
              { text: 'Máy chiếu (Projector)', isCorrect: false },
            ],
            explanation: 'Bàn phím là thiết bị nhập (Input Device) chuẩn dùng để nhập văn bản và lệnh vào máy tính.',
            points: 10,
          },
          {
            questionText: 'Câu 2: Khi bạn muốn tìm kiếm nhanh một từ khóa cụ thể trên một trang web dài, tổ hợp phím tắt nào được sử dụng?',
            questionType: 'multiple-choice',
            options: [
              { text: 'Ctrl + V', isCorrect: false },
              { text: 'Ctrl + C', isCorrect: false },
              { text: 'Ctrl + F', isCorrect: true },
              { text: 'Ctrl + P', isCorrect: false },
            ],
            explanation: 'Ctrl + F (Find) mở hộp thoại tìm kiếm từ khóa ngay trên trang web hoặc tài liệu hiện tại.',
            points: 10,
          },
          {
            questionText: 'Câu 3: Đâu là một ví dụ về Hệ điều hành (Operating System) dành cho máy tính cá nhân?',
            questionType: 'multiple-choice',
            options: [
              { text: 'Microsoft Word', isCorrect: false },
              { text: 'Windows 11', isCorrect: true },
              { text: 'Google Chrome', isCorrect: false },
              { text: 'Adobe Photoshop', isCorrect: false },
            ],
            explanation: 'Windows 11 là hệ điều hành; còn Word, Chrome, Photoshop là các phần mềm ứng dụng.',
            points: 10,
          },
          {
            questionText: 'Câu 4: Hành vi lấy toàn bộ hoặc một phần bài viết của người khác trên Internet và nộp dưới tên của mình mà không trích dẫn nguồn được gọi là Đạo văn (Plagiarism). Đúng hay Sai?',
            questionType: 'true-false',
            options: [
              { text: 'Đúng', isCorrect: true },
              { text: 'Sai', isCorrect: false },
            ],
            correctAnswer: 'Đúng',
            explanation: 'Sử dụng tác phẩm/ý tưởng của người khác mà không ghi nguồn trích dẫn là hành vi đạo văn (Plagiarism).',
            points: 10,
          },
          {
            questionText: 'Câu 5: Cổng kết nối nào trên máy tính truyền tải đồng thời cả HÌNH ẢNH độ phân giải cao và ÂM THANH sang màn hình hoặc máy chiếu? (Viết tắt 4 chữ cái tiếng Anh)',
            questionType: 'short-answer',
            correctAnswer: 'HDMI',
            explanation: 'HDMI (High-Definition Multimedia Interface) truyền đồng thời cả tín hiệu hình ảnh và âm thanh số.',
            points: 10,
          },
        ],
      },
      {
        title: 'Đề Thi Thử Chuẩn Certiport IC3 GS6 Level 1 (Buổi 12 - Đánh Giá Toàn Diện 7 Chủ Đề)',
        course: courseGS6L1._id,
        lesson: gs6L1Lessons[5]._id,
        type: 'exam',
        timeLimit: 30,
        passingScore: 70,
        questions: [
          {
            questionText: 'Câu 1: Hình thức giao tiếp nào sau đây thuộc loại Giao tiếp KHÔNG đồng bộ (Asynchronous Communication)?',
            questionType: 'multiple-choice',
            options: [
              { text: 'Cuộc gọi video trực tiếp qua Google Meet / Zoom', isCorrect: false },
              { text: 'Cuộc gọi điện thoại di động trực tiếp', isCorrect: false },
              { text: 'Gửi và nhận Thư điện tử (Email)', isCorrect: true },
              { text: 'Hội nghị truyền hình thời gian thực', isCorrect: false },
            ],
            explanation: 'Email là giao tiếp không đồng bộ vì người gửi và người nhận không cần trực tuyến cùng một thời điểm.',
            points: 10,
          },
          {
            questionText: 'Câu 2: Khi chia sẻ tài liệu trên Google Drive / OneDrive, nếu bạn muốn đồng nghiệp chỉ đọc và để lại nhận xét bên lề mà KHÔNG tự ý xóa nội dung gốc, bạn nên cấp quyền nào?',
            questionType: 'multiple-choice',
            options: [
              { text: 'Người chỉnh sửa (Editor / Can edit)', isCorrect: false },
              { text: 'Người nhận xét (Commenter / Can comment)', isCorrect: true },
              { text: 'Chủ sở hữu (Owner)', isCorrect: false },
              { text: 'Quản trị viên hệ thống (Administrator)', isCorrect: false },
            ],
            explanation: 'Quyền Commenter (Người nhận xét) cho phép xem và thêm bình luận/gợi ý mà không sửa trực tiếp văn bản gốc.',
            points: 10,
          },
          {
            questionText: 'Câu 3: Mật khẩu nào dưới đây đạt tiêu chuẩn Mật khẩu mạnh (Strong Password) theo khuyến nghị an toàn thông tin IC3 GS6?',
            questionType: 'multiple-choice',
            options: [
              { text: '123456789', isCorrect: false },
              { text: 'nguyenvanan2010', isCorrect: false },
              { text: 'Tr@mH0c#IC3!2026', isCorrect: true },
              { text: 'password', isCorrect: false },
            ],
            explanation: 'Mật khẩu mạnh cần đủ độ dài và kết hợp chữ hoa, chữ thường, chữ số cùng ký tự đặc biệt.',
            points: 10,
          },
          {
            questionText: 'Câu 4: Sắp xếp các bước thiết lập Xác thực 2 yếu tố (2FA) khi đăng nhập tài khoản trực tuyến:',
            questionType: 'drag-drop',
            options: [
              { text: 'Bước 1: Mở cài đặt Bảo mật (Security Settings) của tài khoản', isCorrect: true, position: 1 },
              { text: 'Bước 2: Chọn bật Xác thực 2 yếu tố (Two-Factor Authentication)', isCorrect: true, position: 2 },
              { text: 'Bước 3: Liên kết số điện thoại hoặc ứng dụng tạo mã Authenticator', isCorrect: true, position: 3 },
              { text: 'Bước 4: Nhập mã xác nhận OTP để hoàn tất kích hoạt', isCorrect: true, position: 4 },
            ],
            explanation: 'Quy trình chuẩn kích hoạt 2FA: Vào Security -> Bật 2FA -> Liên kết phương thức nhận mã -> Nhập OTP xác nhận.',
            points: 15,
          },
          {
            questionText: 'Câu 5: [Mô phỏng Trình duyệt Web] Để tìm kiếm chính xác những trang web có chứa nguyên vẹn cụm từ "Chứng chỉ quốc tế IC3 GS6" theo đúng thứ tự từ, bạn nên nhập vào ô tìm kiếm như thế nào?',
            questionType: 'simulation',
            options: [
              { text: 'Nhập cụm từ trong dấu ngoặc kép: "Chứng chỉ quốc tế IC3 GS6"', isCorrect: true },
              { text: 'Nhập dấu trừ ở đầu mỗi từ: -Chứng -chỉ -IC3 -GS6', isCorrect: false },
              { text: 'Chỉ nhập từ khóa: chứng chỉ', isCorrect: false },
              { text: 'Nhấn phím F5 để tải lại trang trắng', isCorrect: false },
            ],
            explanation: 'Đặt cụm từ trong dấu ngoặc kép ("...") yêu cầu công cụ tìm kiếm trả về kết quả khớp chính xác cụm từ đó.',
            points: 15,
          },
        ],
      },
      {
        title: 'Đề Thi Thử Chuẩn Certiport IC3 GS6 Level 2 (Thực Hành & Tình Huống Trung Cấp)',
        course: courseGS6L2._id,
        lesson: gs6L2Lessons[0]._id,
        type: 'exam',
        timeLimit: 30,
        passingScore: 70,
        questions: [
          {
            questionText: 'Câu 1: Tính năng phần mềm nào giúp tự động sửa lỗi chính tả hoặc thay thế các từ gõ sai ngay khi bạn đang nhập văn bản (ví dụ: gõ "see you latet" tự động đổi thành "see you later")?',
            questionType: 'multiple-choice',
            options: [
              { text: 'Tự động sửa lỗi (AutoCorrect)', isCorrect: true },
              { text: 'Trình kiểm tra ngữ pháp (Grammar Checker)', isCorrect: false },
              { text: 'Tự động hóa quy trình (Automation)', isCorrect: false },
              { text: 'Tự động hoàn thành (AutoComplete)', isCorrect: false },
            ],
            explanation: 'AutoCorrect tự động thay thế các lỗi gõ sai phổ biến ngay trong quá trình nhập văn bản.',
            points: 10,
          },
          {
            questionText: 'Câu 2: Nội dung hiển thị trên màn hình máy tính quá khó xem do vùng tối quá tối và vùng sáng quá sáng. Bạn nên điều chỉnh cài đặt nào của màn hình?',
            questionType: 'multiple-choice',
            options: [
              { text: 'Độ tương phản (Contrast)', isCorrect: true },
              { text: 'Nguồn đầu vào (Input Source)', isCorrect: false },
              { text: 'Âm lượng màn hình (Volume)', isCorrect: false },
              { text: 'Tần số làm tươi (Refresh Rate)', isCorrect: false },
            ],
            explanation: 'Khi sự chênh lệch giữa vùng sáng và vùng tối trên màn hình quá gắt, cần điều chỉnh Độ tương phản (Contrast).',
            points: 10,
          },
          {
            questionText: 'Câu 3: Loại máy in nào sử dụng mực dạng bột (Powdered Toner) và có ưu điểm là tài liệu khô mực ngay khi vừa in ra?',
            questionType: 'multiple-choice',
            options: [
              { text: 'Máy in phun (Inkjet Printer)', isCorrect: false },
              { text: 'Máy in 3D (3D Printer)', isCorrect: false },
              { text: 'Máy in Laser (Laser Printer)', isCorrect: true },
              { text: 'Máy in kim (Dot Matrix Printer)', isCorrect: false },
            ],
            explanation: 'Máy in Laser dùng mực bột (Toner) và nhiệt độ cao để ép mực nên bản in khô ngay lập tức.',
            points: 10,
          },
          {
            questionText: 'Câu 4: Khi đánh giá độ tin cậy của một nghiên cứu khoa học trên mạng, "Tổ chức tài trợ cho nghiên cứu" và "Đơn vị công bố kết quả" là các yếu tố quan trọng cần phải xem xét. Đúng hay Sai?',
            questionType: 'true-false',
            options: [
              { text: 'Đúng', isCorrect: true },
              { text: 'Sai', isCorrect: false },
            ],
            correctAnswer: 'Đúng',
            explanation: 'Đơn vị tài trợ và tổ chức công bố giúp xác định tính khách quan và uy tín học thuật của nghiên cứu.',
            points: 10,
          },
          {
            questionText: 'Câu 5: [Mô phỏng Microsoft Word] Để tạo Mục lục tự động (Table of Contents) cho báo cáo dài 20 trang, trước tiên bạn cần định dạng các tiêu đề chương/mục bằng công cụ nào?',
            questionType: 'simulation',
            options: [
              { text: 'Áp dụng các mẫu Heading Styles (Heading 1, Heading 2, Heading 3) trong thẻ Home, sau đó vào References -> Table of Contents', isCorrect: true },
              { text: 'Tô màu vàng (Text Highlight Color) cho toàn bộ văn bản trong báo cáo', isCorrect: false },
              { text: 'Chuyển toàn bộ phông chữ sang in nghiêng (Ctrl + I)', isCorrect: false },
              { text: 'Vào thẻ View -> Chọn Zoom 200%', isCorrect: false },
            ],
            explanation: 'Word dựa vào hệ thống phân cấp Heading Styles (Heading 1, 2, 3) để trích xuất và tạo Mục lục tự động.',
            points: 20,
          },
        ],
      },
      {
        title: 'Đề Thi Thử Chuẩn Certiport IC3 GS6 Level 3 (Quản Trị, Bảo Mật & Xử Lý Sự Cố)',
        course: courseGS6L3._id,
        lesson: gs6L3Lessons[0]._id,
        type: 'exam',
        timeLimit: 30,
        passingScore: 70,
        questions: [
          {
            questionText: 'Câu 1: Khi làm việc từ xa qua mạng Wi-Fi công cộng tại sân bay, giải pháp nào giúp mã hóa toàn bộ lưu lượng truy cập và bảo vệ dữ liệu công ty an toàn nhất?',
            questionType: 'multiple-choice',
            options: [
              { text: 'Kết nối thông qua Mạng riêng ảo (VPN - Virtual Private Network)', isCorrect: true },
              { text: 'Giảm độ sáng màn hình máy tính xuống mức thấp nhất', isCorrect: false },
              { text: 'Tắt tường lửa (Firewall) của hệ điều hành', isCorrect: false },
              { text: 'Xóa thùng rác (Recycle Bin) trên màn hình nền', isCorrect: false },
            ],
            explanation: 'VPN tạo đường hầm mã hóa an toàn cho toàn bộ dữ liệu truyền qua mạng công cộng.',
            points: 15,
          },
          {
            questionText: 'Câu 2: Phương pháp sao lưu (Backup) nào chỉ sao chép những tệp mới hoặc đã thay đổi kể từ lần sao lưu gần nhất nhằm tiết kiệm thời gian và dung lượng lưu trữ?',
            questionType: 'multiple-choice',
            options: [
              { text: 'Sao lưu toàn bộ (Full Backup)', isCorrect: false },
              { text: 'Sao lưu tăng dần (Incremental Backup)', isCorrect: true },
              { text: 'Định dạng lại ổ đĩa (Disk Formatting)', isCorrect: false },
              { text: 'Chống phân mảnh ổ cứng (Disk Defragmentation)', isCorrect: false },
            ],
            explanation: 'Incremental Backup chỉ sao lưu phần dữ liệu thay đổi so với lần backup liền trước.',
            points: 15,
          },
          {
            questionText: 'Câu 3: Trong Microsoft Word, tính năng nào giúp ghi lại mọi chỉnh sửa của các thành viên trong nhóm để người chủ trì có thể Chấp nhận (Accept) hoặc Từ chối (Reject) từng thay đổi?',
            questionType: 'multiple-choice',
            options: [
              { text: 'Track Changes (Theo dõi thay đổi trong thẻ Review)', isCorrect: true },
              { text: 'Format Painter (Sao chép định dạng)', isCorrect: false },
              { text: 'Word Count (Đếm số từ)', isCorrect: false },
              { text: 'Mail Merge (Trộn thư)', isCorrect: false },
            ],
            explanation: 'Track Changes (thẻ Review) theo dõi chi tiết từng thao tác thêm/xóa/định dạng khi cộng tác tài liệu.',
            points: 15,
          },
          {
            questionText: 'Câu 4: Trước khi gửi tệp tài liệu quan trọng ra bên ngoài tổ chức, việc sử dụng công cụ Document Inspector giúp kiểm tra và xóa các thông tin ẩn (Metadata như tên tác giả, ghi chú ẩn). Đúng hay Sai?',
            questionType: 'true-false',
            options: [
              { text: 'Đúng', isCorrect: true },
              { text: 'Sai', isCorrect: false },
            ],
            correctAnswer: 'Đúng',
            explanation: 'Document Inspector (File -> Info -> Check for Issues -> Inspect Document) giúp loại bỏ Metadata nhạy cảm.',
            points: 15,
          },
        ],
      },
    ]);

    // Seed rich chat messages across all 4 channels
    await ChatMessage.create([
      {
        sender: teacher._id,
        room: 'general',
        message:
          'Chào mừng các em học viên đến với Trung tâm Đào tạo Tin học Quốc tế IC3! Lộ trình chuẩn của trung tâm gồm 12 buổi/khóa đối với IC3 Spark & IC3 GS6 Level 1, và 10 buổi/khóa đối với Level 2 & Level 3.',
        type: 'text',
      },
      {
        sender: student1._id,
        room: 'general',
        message:
          'Thầy ơi, em vừa xem lộ trình 12 buổi trong mục Khóa học và làm thử đề thi IC3 GS6 Level 1 đạt 90% rồi ạ!',
        type: 'text',
      },
      {
        sender: teacher._id,
        room: 'ic3-spark',
        message:
          'Các bạn lớp IC3 Spark Tiểu học lưu ý: Từ Buổi 1 đến Buổi 4 chúng ta học Máy tính căn bản (CF), Buổi 5 đến Buổi 8 học Word/Excel/PowerPoint (KA), và Buổi 9 đến Buổi 12 học Cuộc sống trực tuyến (LO) kèm thi thử nhé!',
        type: 'text',
      },
      {
        sender: student2._id,
        room: 'ic3-spark',
        message:
          'Dạ thầy, em đã học xong Buổi 1 về thiết bị Input/Output và Buổi 2 về RAM/ROM, chuẩn bị làm bài tập ôn luyện #1 ạ.',
        type: 'text',
      },
      {
        sender: teacher._id,
        room: 'ic3-gs6',
        message:
          'Nhắc nhở lớp IC3 GS6: Đề thi thật của IIG/Certiport gồm 40-45 câu trong 50 phút, điểm đạt là 700/1000. Các em nhớ ôn kỹ 7 chuyên đề và làm hết các câu hỏi mô phỏng nhé!',
        type: 'text',
      },
      {
        sender: student3._id,
        room: 'hoi-dap-thay-co',
        message:
          'Thầy cho em hỏi: Trong câu hỏi về màn hình bị vùng tối quá tối và vùng sáng quá chói thì mình chọn Contrast hay Brightness ạ?',
        type: 'text',
      },
      {
        sender: teacher._id,
        room: 'hoi-dap-thay-co',
        message:
          'Chào Gia Bảo! Khi sự chênh lệch giữa vùng tối và vùng sáng quá gắt thì em chọn Độ tương phản (Contrast) nhé. Còn khi toàn bộ màn hình đều tối hoặc đều sáng thì mới chỉnh Độ sáng (Brightness).',
        type: 'text',
      },
    ]);

    student1.enrolledCourses = [
      courseSpark._id,
      courseGS6L1._id,
      courseGS6L2._id,
      courseGS6L3._id,
    ];
    student2.enrolledCourses = [courseSpark._id, courseGS6L1._id, courseGS6L2._id];
    student3.enrolledCourses = [courseSpark._id, courseGS6L1._id];
    student4.enrolledCourses = [courseSpark._id];
    await student1.save();
    await student2.save();
    await student3.save();
    await student4.save();

    console.log('Seeding finished successfully! 🎉 (4 IC3 Courses, 24 Session Lessons, 7 Quizzes/Exams, 4 Chat Channels)');
    if (isStandalone) process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    if (isStandalone) process.exit(1);
  }
};

if (require.main === module) {
  seedData(true);
}

module.exports = seedData;
