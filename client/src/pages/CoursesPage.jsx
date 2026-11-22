import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseList from '../components/courses/CourseList';
import courseService from '../services/courseService';
import { FaCalendarAlt, FaCheckCircle, FaClock } from 'react-icons/fa';
import styles from './CoursesPage.module.css';

const SYLLABUS_ROADMAPS = {
  spark: {
    title: 'Lộ trình 12 Buổi Chuẩn - IC3 Spark (Dành cho học sinh Tiểu học: Lớp 3, 4, 5)',
    duration: '12 Buổi × 90 phút (24 tiết) • Tần suất: 2 buổi/tuần (1.5 tháng)',
    sessions: [
      { buoi: 'Buổi 1', module: 'Máy tính căn bản (CF)', topic: 'Làm quen Máy tính, Phần cứng (Hardware), Phần mềm (Software) & Thiết bị Nhập/Xuất (Input/Output)', practice: 'Phân loại 15 thiết bị ngoại vi & Trắc nghiệm Buổi 1' },
      { buoi: 'Buổi 2', module: 'Máy tính căn bản (CF)', topic: 'Bộ xử lý CPU, Bộ nhớ (RAM/ROM, HDD/SSD, USB) & Đơn vị đo thông tin (Bit, Byte, KB, MB, GB, TB)', practice: 'So sánh RAM vs Ổ cứng & Bài tập quy đổi đơn vị dữ liệu' },
      { buoi: 'Buổi 3', module: 'Máy tính căn bản (CF)', topic: 'Hệ điều hành Windows, Giao diện Desktop, Taskbar & Chế độ nguồn (Shut down, Restart, Sleep)', practice: 'Thực hành thao tác cửa sổ Windows & Tắt máy an toàn' },
      { buoi: 'Buổi 4', module: 'Máy tính căn bản (CF)', topic: 'Quản lý Tệp tin (File), Thư mục (Folder), Phím tắt Windows (Ctrl+C/X/V/Z) & Thùng rác Recycle Bin', practice: 'Tạo cây thư mục học tập & Làm bài kiểm tra Học phần 1' },
      { buoi: 'Buổi 5', module: 'Ứng dụng chủ chốt (KA)', topic: 'Soạn thảo Microsoft Word (.docx) - Gõ tiếng Việt, Định dạng Font (B, I, U) & Căn lề đoạn văn', practice: 'Trình bày bài văn mẫu và danh sách Bullets/Numbering' },
      { buoi: 'Buổi 6', module: 'Ứng dụng chủ chốt (KA)', topic: 'Microsoft Word (P2) - Chèn Hình ảnh (Pictures), Bảng biểu (Table), Định dạng Trang & Save / Save As', practice: 'Thiết kế Thời khóa biểu cá nhân có hình minh họa' },
      { buoi: 'Buổi 7', module: 'Ứng dụng chủ chốt (KA)', topic: 'Bảng tính Microsoft Excel (.xlsx) - Hàng, Cột, Địa chỉ Ô tính & Hàm cơ bản (=SUM, AVERAGE, MAX, MIN)', practice: 'Lập bảng điểm lớp học và tính tổng/trung bình tự động' },
      { buoi: 'Buổi 8', module: 'Ứng dụng chủ chốt (KA)', topic: 'Trình chiếu Microsoft PowerPoint (.pptx) - Thiết kế Slide, Hiệu ứng Transitions & Animations', practice: 'Tạo bài thuyết trình 5 Slide & Kiểm tra Học phần 2' },
      { buoi: 'Buổi 9', module: 'Cuộc sống trực tuyến (LO)', topic: 'Mạng Internet, WWW (World Wide Web), Cấu trúc địa chỉ URL (https://, tên miền) & Trình duyệt Web', practice: 'Thực hành điều hướng Tab, Bookmark & Lịch sử duyệt web' },
      { buoi: 'Buổi 10', module: 'Cuộc sống trực tuyến (LO)', topic: 'Tìm kiếm thông tin trên Google & Sử dụng Thư điện tử (Email: To, Cc, Bcc, Subject, Đính kèm tệp)', practice: 'Soạn và gửi Email nộp bài tập có đính kèm tệp Word' },
      { buoi: 'Buổi 11', module: 'Cuộc sống trực tuyến (LO)', topic: 'Đạo đức mạng (Netiquette), Bảo mật thông tin cá nhân, Phòng chống Cyberbullying & Cảnh giác link lạ', practice: 'Xử lý tình huống an toàn mạng & Bài tập ôn luyện #2' },
      { buoi: 'Buổi 12', module: 'Tổng ôn & Khảo thí', topic: 'Hệ thống hóa kiến thức 3 Học phần (CF - KA - LO) & Thi thử tổng hợp IC3 Spark trên phần mềm', practice: 'Làm Đề Thi Thử Tổng Hợp IC3 Spark (Mục tiêu ≥ 700/1000)' },
    ],
  },
  gs6_l1: {
    title: 'Lộ trình 12 Buổi Chuẩn - IC3 GS6 Level 1 (Cấp độ Nền tảng / Know - 7 Chuyên đề)',
    duration: '12 Buổi × 90 phút (24 tiết) • Dành cho học sinh THCS, THPT & Sinh viên',
    sessions: [
      { buoi: 'Buổi 1', module: '1. Công nghệ cơ bản', topic: 'Kiến trúc phần cứng, Thiết bị nhập/xuất, Cổng kết nối (USB-A/C, HDMI truyền hình+tiếng, Ethernet)', practice: 'Nhận diện cổng kết nối & thông số cấu hình máy tính' },
      { buoi: 'Buổi 2', module: '1. Công nghệ cơ bản', topic: 'Hệ điều hành nguồn mở (Linux, Android) vs độc quyền (Windows 11, macOS, iOS) & Điện toán đám mây (SaaS)', practice: 'Phân loại phần mềm hệ thống, ứng dụng và dịch vụ Cloud' },
      { buoi: 'Buổi 3', module: '2. Công dân kỷ nguyên số', topic: 'Danh tính trực tuyến, Dấu chân kỹ thuật số Chủ động (Active) vs Thụ động (Passive Digital Footprint)', practice: 'Phân tích tình huống quản lý danh tiếng số cá nhân' },
      { buoi: 'Buổi 4', module: '2. Công dân kỷ nguyên số', topic: 'Luật Bản quyền (Copyright ©), Đạo văn (Plagiarism), Phạm vi công cộng (Public Domain) & Creative Commons', practice: 'Thực hành ghi trích dẫn nguồn và phân biệt các giấy phép CC' },
      { buoi: 'Buổi 5', module: '3. Quản lý thông tin', topic: 'Lưu trữ Đám mây (Google Drive/OneDrive), Trình duyệt (Bookmarks, History, Cache, Cookies) & Tìm kiếm (Ctrl+F, "...")', practice: 'Thực hành tìm kiếm chính xác và quản lý tệp trên Cloud' },
      { buoi: 'Buổi 6', module: '4. Sáng tạo nội dung', topic: 'Soạn thảo tài liệu số trong Microsoft Word - Định dạng trang (Portrait/Landscape, Margins) & In ấn', practice: 'Soạn thảo văn bản hành chính/học thuật chuẩn định dạng' },
      { buoi: 'Buổi 7', module: '4. Sáng tạo nội dung', topic: 'Tạo bảng dữ liệu cơ bản trong Excel & Thiết kế bài trình chiếu PowerPoint theo mẫu (Templates)', practice: 'Thực hành tạo bảng biểu và Slide thuyết trình nhóm' },
      { buoi: 'Buổi 8', module: '5. Truyền thông số', topic: 'Phân biệt Giao tiếp Đồng bộ (Synchronous: Video call, Live Chat) và Không đồng bộ (Asynchronous: Email, Forum)', practice: 'Soạn thảo Email chuyên nghiệp và quy tắc trả lời Reply/Reply All' },
      { buoi: 'Buổi 9', module: '6. Cộng tác trực tuyến', topic: 'Làm việc nhóm trên tài liệu đám mây & 3 cấp phân quyền: Người xem (Viewer), Nhận xét (Commenter), Chỉnh sửa (Editor)', practice: 'Chia sẻ tài liệu Google Docs/OneDrive theo đúng quyền hạn' },
      { buoi: 'Buổi 10', module: '7. An toàn & Bảo mật', topic: 'Thiết lập Mật khẩu mạnh (Strong Password), Xác thực 2 yếu tố (2FA/MFA) & Bảo mật sinh trắc học', practice: 'Kiểm tra độ mạnh mật khẩu & Mô phỏng quy trình bật 2FA' },
      { buoi: 'Buổi 11', module: '7. An toàn & Bảo mật', topic: 'Nhận diện Tấn công giả mạo (Phishing), Phần mềm độc hại (Virus, Trojan, Ransomware, Spyware) & Công thái học', practice: 'Phân tích Email giả mạo Phishing & Làm bài ôn luyện GS6 L1' },
      { buoi: 'Buổi 12', module: 'Tổng ôn & Thi thử L1', topic: 'Tổng hợp 7 miền kiến thức IC3 GS6 Level 1 & Giải đề thi thử chuẩn Certiport (45 câu / 50 phút)', practice: 'Thi thử Đề chuẩn Certiport IC3 GS6 Level 1 (Đạt ≥ 700/1000)' },
    ],
  },
  gs6_l2: {
    title: 'Lộ trình 10 Buổi Chuyên sâu - IC3 GS6 Level 2 (Cấp độ Thực hành Trung cấp / Do)',
    duration: '10 Buổi × 90 phút (20 tiết) • Tập trung kỹ năng vận dụng và xử lý tình huống thực tế',
    sessions: [
      { buoi: 'Buổi 1', module: 'Cấu hình Thiết bị', topic: 'Tinh chỉnh Màn hình (Độ tương phản Contrast vs Độ sáng Brightness, Resolution) & Đa màn hình', practice: 'Xử lý tình huống hiển thị màn hình trong đề thi GS6 Level 2' },
      { buoi: 'Buổi 2', module: 'Máy in & Hệ thống', topic: 'Công nghệ Máy in (Máy in Laser dùng mực bột Toner khô ngay vs Máy in phun Inkjet, Máy in nhiệt) & Kết nối mạng', practice: 'Cài đặt máy in mặc định và xử lý hàng đợi in (Print Queue)' },
      { buoi: 'Buổi 3', module: 'Quyền riêng tư & Web', topic: 'Kiểm soát quyền riêng tư mạng xã hội, Quản lý Cookie theo dõi & Chế độ duyệt web ẩn danh (Incognito/InPrivate)', practice: 'Cấu hình quyền riêng tư trình duyệt và xóa dữ liệu cục bộ' },
      { buoi: 'Buổi 4', module: 'Đánh giá Nguồn tin', topic: 'Phương pháp kiểm chứng Nghiên cứu khoa học trực tuyến (Tổ chức tài trợ, Đơn vị công bố, Peer-reviewed)', practice: 'Phân tích độ tin cậy của bài báo khoa học & Trích dẫn APA/MLA' },
      { buoi: 'Buổi 5', module: 'Word Trung cấp', topic: 'Tự động hóa soạn thảo: AutoCorrect (tự sửa lỗi khi gõ) vs AutoComplete, Định dạng Heading Styles & Mục lục tự động', practice: 'Áp dụng Heading 1/2/3 và trích xuất Table of Contents tự động' },
      { buoi: 'Buổi 6', module: 'Excel Trung cấp', topic: 'Địa chỉ tương đối/tuyệt đối ($A$1), Hàm tính toán (SUM, AVERAGE, COUNT, MAX, MIN), Sắp xếp (Sort) & Lọc (Filter)', practice: 'Xử lý bảng dữ liệu tài chính/học tập và vẽ Biểu đồ (Charts)' },
      { buoi: 'Buổi 7', module: 'PowerPoint Trung cấp', topic: 'Thiết kế Slide Master đồng bộ, Chèn biểu đồ/video, Thiết lập trình chiếu & Xuất bản tài liệu sang PDF', practice: 'Chuẩn hóa bộ Slide báo cáo bằng Slide Master' },
      { buoi: 'Buổi 8', module: 'Truyền thông & Lịch', topic: 'Quản lý hộp thư bằng Bộ lọc tự động (Rules/Filters), Chữ ký (Signature), Trả lời tự động & Lên lịch họp đa múi giờ', practice: 'Thiết lập quy tắc phân loại Email tự động và tạo lịch họp' },
      { buoi: 'Buổi 9', module: 'Bảo mật Giao dịch', topic: 'An toàn thanh toán trực tuyến (HTTPS, Chứng chỉ SSL), Trình quản lý mật khẩu & Phòng chống Social Engineering', practice: 'Nhận diện trang giao dịch an toàn và bẫy lừa đảo trực tuyến' },
      { buoi: 'Buổi 10', module: 'Tổng ôn & Thi thử L2', topic: 'Luyện kỹ năng thao tác mô phỏng GMetrix & Giải đề thi thử chuẩn Certiport IC3 GS6 Level 2', practice: 'Thi thử Đề chuẩn Certiport IC3 GS6 Level 2 (Đạt ≥ 700/1000)' },
    ],
  },
  gs6_l3: {
    title: 'Lộ trình 10 Buổi Nâng cao - IC3 GS6 Level 3 (Cấp độ Chuyên môn & Quản trị / Lead)',
    duration: '10 Buổi × 90 phút (20 tiết) • Tập trung xử lý sự cố, bảo mật nâng cao và cộng tác chuyên sâu',
    sessions: [
      { buoi: 'Buổi 1-2', module: 'Xử lý Sự cố Hệ thống', topic: 'Quy trình Troubleshooting, Task Manager (Ctrl+Shift+Esc), Quản lý tiến trình, Cập nhật Driver/Firmware', practice: 'Chẩn đoán và khắc phục sự cố treo ứng dụng & xung đột phần mềm' },
      { buoi: 'Buổi 3-4', module: 'Quản trị Mạng & Bảo mật', topic: 'Địa chỉ IP, DNS, Tường lửa (Firewall), Mạng riêng ảo (VPN khi dùng Wi-Fi công cộng) & Mã hóa dữ liệu (Encryption)', practice: 'Thiết lập kết nối VPN an toàn và cấu hình quy tắc Firewall' },
      { buoi: 'Buổi 5', module: 'Sao lưu & Khôi phục', topic: 'Chiến lược Backup dữ liệu: Full Backup (Sao lưu toàn bộ) vs Incremental Backup (Sao lưu tăng dần) & Quy tắc 3-2-1', practice: 'Lựa chọn giải pháp Backup tối ưu thời gian và dung lượng' },
      { buoi: 'Buổi 6', module: 'Sở hữu Trí tuệ Nâng cao', topic: 'Phân biệt Bản quyền (Copyright ©), Thương hiệu (Trademark ™/®), Bằng sáng chế (Patent) & Sử dụng hợp lý (Fair Use)', practice: 'Giải quyết các tình huống pháp lý về tài sản trí tuệ số' },
      { buoi: 'Buổi 7-8', module: 'Quản trị Tài liệu Nhóm', topic: 'Theo dõi thay đổi (Track Changes: Accept/Reject), Lịch sử phiên bản (Version History) & Xóa Metadata (Document Inspector)', practice: 'Rà soát tài liệu bằng Track Changes và xóa thông tin ẩn Metadata' },
      { buoi: 'Buổi 9-10', module: 'Phân tích Dữ liệu & Thi thử', topic: 'Phân tích dữ liệu nâng cao (Hàm điều kiện IF/SUMIF/COUNTIF, PivotTable) & Thi thử chuẩn Certiport IC3 GS6 Level 3', practice: 'Thi thử Đề chuẩn Certiport IC3 GS6 Level 3 (Đạt ≥ 700/1000)' },
    ],
  },
};

const CoursesPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRoadmap, setActiveRoadmap] = useState('spark');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await courseService.getCourses();
        setCourses(res.courses || res.data?.courses || res.data || []);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const currentPlan = SYLLABUS_ROADMAPS[activeRoadmap];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Chương trình Đào tạo & Khóa học Tin học Quốc tế IC3</h1>
        <p className={styles.subtitle}>
          Lộ trình bài giảng chuẩn hóa theo từng buổi học dành cho Trung tâm Đào tạo Tin học Quốc tế: IC3 Spark (Tiểu học) và IC3 GS6 (Level 1, Level 2, Level 3)
        </p>
      </div>

      <CourseList
        courses={courses}
        loading={loading}
        onCourseClick={(course) => navigate(`/courses/${course._id}`)}
      />

      {/* Detailed Session-by-Session Training Center Syllabus Table */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: 'clamp(16px, 3vw, 28px)',
          boxShadow: 'var(--card-shadow)',
          marginTop: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge-tag badge-gs6" style={{ marginBottom: '8px' }}>
              <FaCalendarAlt style={{ marginRight: '6px' }} /> KHUNG PHÂN PHỐI CHƯƠNG TRÌNH GIẢNG DẠY TẠI TRUNG TÂM
            </span>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>
              Đề xuất Phân bổ Số Buổi Học & Nội dung Chi tiết Từng Buổi
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '4px' }}>
              Mỗi buổi học tiêu chuẩn tại trung tâm kéo dài <strong>90 - 120 phút (2 tiết)</strong>: 45 phút Lý thuyết & Minh họa + 45 phút Thực hành máy & Làm bài trắc nghiệm LMS.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { key: 'spark', label: 'IC3 Spark (12 Buổi)' },
              { key: 'gs6_l1', label: 'IC3 GS6 Level 1 (12 Buổi)' },
              { key: 'gs6_l2', label: 'IC3 GS6 Level 2 (10 Buổi)' },
              { key: 'gs6_l3', label: 'IC3 GS6 Level 3 (10 Buổi)' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveRoadmap(tab.key)}
                style={{
                  padding: '8px 15px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  border: '1px solid var(--border-color)',
                  background: activeRoadmap === tab.key ? 'var(--accent-primary)' : 'var(--bg-card-alt)',
                  color: activeRoadmap === tab.key ? '#ffffff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            background: 'var(--bg-card-alt)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <strong style={{ color: 'var(--accent-primary)', fontSize: '0.95rem' }}>{currentPlan.title}</strong>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FaClock /> {currentPlan.duration}
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-card-alt)', borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '12px 14px', width: '95px', color: 'var(--text-primary)' }}>BUỔI HỌC</th>
                <th style={{ padding: '12px 14px', width: '210px', color: 'var(--text-primary)' }}>CHUYÊN ĐỀ / HỌC PHẦN</th>
                <th style={{ padding: '12px 14px', color: 'var(--text-primary)' }}>NỘI DUNG LÝ THUYẾT TRỌNG TÂM</th>
                <th style={{ padding: '12px 14px', width: '290px', color: 'var(--text-primary)' }}>THỰC HÀNH & KIỂM TRA TRÊN WEB</th>
              </tr>
            </thead>
            <tbody>
              {currentPlan.sessions.map((s, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--accent-primary)' }}>{s.buoi}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--text-primary)' }}>{s.module}</td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s.topic}</td>
                  <td style={{ padding: '12px 14px', color: 'var(--accent-green)', fontSize: '0.85rem', fontWeight: 500 }}>
                    <FaCheckCircle style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                    {s.practice}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
