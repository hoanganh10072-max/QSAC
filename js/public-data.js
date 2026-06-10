/* =============================================
   public-data.js — Cầu nối dữ liệu admin ↔ trang user
   Đọc các key localStorage do admin-*.js lưu:
     - qsac_admin_courses        (admin-courses.js — gồm cả thông tin khai giảng)
     - qsac_admin_teachers       (admin-teachers.js)
     - qsac_admin_certificates   (admin-certificates.js)
   Nếu localStorage trống dùng SEED bên dưới (KHỚP với SEED admin).

   Expose qua biến global `PublicData`. Load TRƯỚC main.js / courses.js /
   course-detail.js / teachers.js / certificates.js / schedule.js / register.js.

   API chính:
   - getCourses({ onlyActive = true })            → Array
   - getCourse(id)                                → Object | null
   - getTeachers({ onlyActive = true })           → Array
   - getCertificateRecords({ onlyValid = true })  → Array
   - getSchedule({ onlyActive = true })           → Array (lọc course có startDate, enrich dayLabel/dateFmt/labelText/levelLabel, sort theo ngày gần nhất)
   - formatMoney(n) / categoryLabel(k) / categoryTagClass(k)
   - priceVariantClass(category) / btnVariantClass(category)
   ============================================= */

window.PublicData = (function () {
  'use strict';

  const COURSES_KEY = 'qsac_admin_courses';
  const TEACHERS_KEY = 'qsac_admin_teachers';
  const CERTS_KEY = 'qsac_admin_certificates';

  // ── SEED COURSES (đồng bộ admin-courses.js) ──
  // Trường khai giảng (startDate/timeStart/timeEnd/seatsLeft/label) là tùy chọn.
  // Khoá KHÔNG có startDate sẽ không xuất hiện ở trang lịch khai giảng.
  const PIC = function (s) { return 'https://picsum.photos/seed/' + s + '/400/240'; };
  const SEED_COURSES = [
    { id: 'c1', name: 'Nhập môn Thương mại điện tử cho người mới', category: 'basic',      teacher: 'GV. Trần Thị Hà',     price: 1500000, duration: 6, lessons: 24, status: 'active', image: PIC('tmdt-intro'),         rating: 4.8, students: 1240, startDate: '2026-06-06', timeStart: '20:00', timeEnd: '22:00', seatsLeft: 35, label: 'hot',  oldPrice: 2000000 },
    { id: 'c2', name: 'Bán hàng chuyên nghiệp trên Shopee & Lazada', category: 'advanced',  teacher: 'GV. Lê Văn Bình',     price: 2800000, duration: 8, lessons: 32, status: 'active', image: PIC('shopee-course'),      rating: 4.9, students: 890,  oldPrice: 3500000, startDate: '2026-06-10', timeStart: '19:30', timeEnd: '21:30', seatsLeft: 28, label: 'best' },
    { id: 'c3', name: 'Marketing số & SEO cho sàn TMĐT',             category: 'marketing', teacher: 'GV. Phạm Minh Tuấn',  price: 2200000, duration: 7, lessons: 28, status: 'active', image: PIC('digital-marketing'), rating: 4.7, students: 654,  oldPrice: 2800000, startDate: '2026-06-21', timeStart: '20:00', timeEnd: '22:00', seatsLeft: 20, label: ''   },
    { id: 'c4', name: 'Pháp lý TMĐT & Hợp đồng thương mại điện tử',  category: 'legal',     teacher: 'GV. Nguyễn Thu Hương',price: 1800000, duration: 5, lessons: 20, status: 'active', image: PIC('law-ecommerce'),     rating: 4.8, students: 312,                  startDate: '2026-06-25', timeStart: '19:00', timeEnd: '21:00', seatsLeft: 25, label: 'new' },
    { id: 'c5', name: 'Vận hành sàn TMĐT chuyên nghiệp từ A–Z',      category: 'operations',teacher: 'GV. Đỗ Quang Huy',    price: 3500000, duration: 9, lessons: 36, status: 'active', image: PIC('ecommerce-ops'),     rating: 4.9, students: 478,  oldPrice: 4200000, startDate: '2026-07-02', timeStart: '20:00', timeEnd: '22:00', seatsLeft: 30, label: ''   },
    { id: 'c6', name: 'Quản lý kho hàng & Logistics TMĐT hiệu quả',  category: 'basic',     teacher: 'GV. Trần Đức Long',   price: 1600000, duration: 6, lessons: 24, status: 'active', image: PIC('logistics-store'),   rating: 4.6, students: 521 },
    { id: 'c7', name: 'Xây dựng thương hiệu online cá nhân & DN',   category: 'advanced',  teacher: 'GV. Vũ Thị Mai',      price: 2500000, duration: 8, lessons: 30, status: 'active', image: PIC('brand-online'),      rating: 4.8, students: 389,  oldPrice: 3200000 },
    { id: 'c8', name: 'Phân tích dữ liệu & Báo cáo kinh doanh TMĐT', category: 'advanced', teacher: 'GV. Ngô Thành Nam',  price: 2900000, duration: 7, lessons: 28, status: 'active', image: PIC('data-analytics'),    rating: 4.9, students: 267 },
  ];

  // ── SEED TEACHERS (đồng bộ admin-teachers.js) ──
  const SEED_TEACHERS = [
    { id: 't1', name: 'Trần Thị Hà',      title: 'ThS. TMĐT',         expertise: 'basic',      experience: 8,  rating: 4.8, status: 'active',   avatar: '', bio: 'Giảng viên cơ hữu, chuyên đào tạo TMĐT cho người mới bắt đầu.' },
    { id: 't2', name: 'Lê Văn Bình',      title: 'Chuyên gia Shopee', expertise: 'advanced',   experience: 6,  rating: 4.9, status: 'active',   avatar: '', bio: 'Hơn 6 năm kinh nghiệm vận hành shop top trên Shopee.' },
    { id: 't3', name: 'Phạm Minh Tuấn',   title: 'PhD. Marketing số', expertise: 'marketing',  experience: 10, rating: 4.7, status: 'active',   avatar: '', bio: 'Tiến sĩ Marketing, từng tư vấn cho nhiều thương hiệu lớn.' },
    { id: 't4', name: 'Nguyễn Thu Hương', title: 'Luật sư TMĐT',      expertise: 'legal',      experience: 12, rating: 4.8, status: 'active',   avatar: '', bio: 'Luật sư chuyên trách hợp đồng TMĐT và pháp lý số.' },
    { id: 't5', name: 'Đỗ Quang Huy',     title: 'CEO sàn TMĐT',      expertise: 'operations', experience: 9,  rating: 4.9, status: 'active',   avatar: '', bio: 'Founder một sàn TMĐT khu vực, chia sẻ kinh nghiệm vận hành.' },
    { id: 't6', name: 'Trần Đức Long',    title: 'Quản lý Logistics', expertise: 'basic',      experience: 7,  rating: 4.6, status: 'inactive', avatar: '', bio: 'Chuyên gia logistics, từng làm chuỗi cung ứng cho 3 sàn lớn.' },
    { id: 't7', name: 'Vũ Thị Mai',       title: 'Brand Strategist',  expertise: 'advanced',   experience: 8,  rating: 4.8, status: 'active',   avatar: '', bio: 'Xây dựng và phát triển thương hiệu online cho doanh nghiệp SME.' },
    { id: 't8', name: 'Ngô Thành Nam',    title: 'Data Analyst',      expertise: 'data',       experience: 5,  rating: 4.9, status: 'active',   avatar: '', bio: 'Phân tích dữ liệu kinh doanh TMĐT, chuyên BI và dashboard.' },
  ];

  // UI defaults cho teacher cards (color/badge/avatar default) — khớp HTML cũ
  const TEACHER_UI = {
    t1: { color: 'orange', female: true,  badge: { type: 'red',  text: 'Bán chạy' },   students: 18230, avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    t2: { color: '',       female: false, badge: { type: '',     text: 'Nổi bật' },    students: 12540, avatar: 'https://randomuser.me/api/portraits/men/32.jpg'   },
    t3: { color: 'purple', female: false, badge: { type: '',     text: 'Nổi bật' },    students: 6540,  avatar: 'https://randomuser.me/api/portraits/men/52.jpg'   },
    t4: { color: 'teal',   female: true,  badge: { type: 'gray', text: 'Mới' },        students: 3120,  avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
    t5: { color: 'blue',   female: false, badge: { type: '',     text: 'Nổi bật' },    students: 4780,  avatar: 'https://randomuser.me/api/portraits/men/41.jpg'   },
    t6: { color: '',       female: false, badge: { type: 'red',  text: 'Thực chiến' }, students: 5210,  avatar: 'https://randomuser.me/api/portraits/men/67.jpg'   },
    t7: { color: 'rose',   female: true,  badge: { type: '',     text: 'Nổi bật' },    students: 3890,  avatar: 'https://randomuser.me/api/portraits/women/26.jpg' },
    t8: { color: 'teal',   female: false, badge: { type: 'gray', text: 'Mới' },        students: 2670,  avatar: 'https://randomuser.me/api/portraits/men/83.jpg'   },
  };

  // ── SEED CERTIFICATES (đồng bộ admin-certificates.js) ──
  const SEED_CERTS = [
    { id: 'k1', code: 'QSAC-2026-0001', student: 'Nguyễn Văn A',   course: 'Nhập môn TMĐT',           level: 'red',   issuedAt: '2026-03-15', status: 'valid' },
    { id: 'k2', code: 'QSAC-2026-0002', student: 'Lê Thị Hoa',     course: 'Shopee & Lazada',         level: 'green', issuedAt: '2026-04-02', status: 'valid' },
    { id: 'k3', code: 'QSAC-2026-0003', student: 'Phạm Quang',     course: 'Marketing số & SEO',      level: 'green', issuedAt: '2026-04-20', status: 'valid' },
    { id: 'k4', code: 'QSAC-2026-0004', student: 'Trần Bích Ngọc', course: 'Vận hành sàn TMĐT A–Z',    level: 'gold',  issuedAt: '2026-05-10', status: 'valid' },
    { id: 'k5', code: 'QSAC-2026-0005', student: 'Vũ Minh',        course: 'Phân tích dữ liệu TMĐT',  level: 'gold',  issuedAt: '2026-05-18', status: 'revoked' },
    { id: 'k6', code: 'QSAC-2026-0006', student: 'Đỗ Hải Anh',     course: 'Pháp lý TMĐT',            level: 'red',   issuedAt: '2026-05-28', status: 'valid' },
  ];

  // ── Mapping nhãn ──
  const CAT_LABELS = { basic: 'Cơ bản', advanced: 'Nâng cao', marketing: 'Marketing số', legal: 'Pháp lý', operations: 'Vận hành' };
  const CAT_TAG_CLASS = { basic: 'tag-basic', advanced: 'tag-advanced', marketing: 'tag-marketing', legal: 'tag-legal', operations: 'tag-operations' };
  const PRICE_VARIANT = { basic: '', advanced: 'green-price', marketing: 'purple-price', legal: 'orange-price', operations: 'teal-price' };
  const BTN_VARIANT   = { basic: '', advanced: 'green-btn',   marketing: 'purple-btn',   legal: 'orange-btn',   operations: 'teal-btn'   };
  const EXP_LABELS    = { basic: 'TMĐT cơ bản', advanced: 'Bán hàng nâng cao', marketing: 'Marketing số', legal: 'Pháp lý', operations: 'Vận hành', data: 'Phân tích dữ liệu' };
  // Tên thứ trong tuần (getDay: 0=CN..6=T7) + nhãn label cho schedule
  const WEEKDAY_VI = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  const SCHEDULE_LABEL_TEXT = { hot: 'HOT', best: 'BESTSELLER', new: 'NEW' };

  // ── Helper đọc localStorage có try/catch + fallback seed ──
  // QUAN TRỌNG: phân biệt "chưa có key" (null → fallback seed) với
  // "có key nhưng admin xoá hết" (raw = "[]" → trả [] để user thấy rỗng).
  function readList(key, seed) {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) { /* fallback */ }
    return seed.slice();
  }

  // ── COURSES API ──
  function getCourses(opts) {
    opts = opts || {};
    const onlyActive = opts.onlyActive !== false;
    let list = readList(COURSES_KEY, SEED_COURSES);
    // Merge các trường UI (rating/students/oldPrice) từ SEED nếu admin record thiếu
    list = list.map(function (r) {
      const seed = SEED_COURSES.find(function (s) { return s.id === r.id; }) || {};
      return Object.assign({}, seed, r);
    });
    if (onlyActive) list = list.filter(function (r) { return r.status !== 'draft'; });
    return list;
  }
  function getCourse(id) {
    return getCourses({ onlyActive: false }).find(function (r) { return String(r.id) === String(id); }) || null;
  }

  // ── TEACHERS API ──
  function getTeachers(opts) {
    opts = opts || {};
    const onlyActive = opts.onlyActive !== false;
    let list = readList(TEACHERS_KEY, SEED_TEACHERS);
    const courses = readList(COURSES_KEY, SEED_COURSES);

    list = list.map(function (t) {
      const ui = TEACHER_UI[t.id] || { color: '', female: false, badge: { type: '', text: 'Mới' }, students: 0, avatar: '' };
      const needle = (t.name || '').toLowerCase();
      const coursesCount = needle ? courses.filter(function (c) {
        return (c.teacher || '').toLowerCase().includes(needle);
      }).length : 0;
      const displayName = /^GV\.?\s/i.test(t.name) ? t.name : ('GV. ' + (t.name || ''));
      const avatar = t.avatar || ui.avatar || ('https://picsum.photos/seed/' + t.id + '/200/200');
      return Object.assign({}, t, ui, {
        displayName: displayName,
        avatar: avatar,
        coursesCount: coursesCount,
        expertiseLabel: EXP_LABELS[t.expertise] || t.expertise || '',
      });
    });
    if (onlyActive) list = list.filter(function (t) { return t.status === 'active'; });
    return list;
  }

  // ── CERTIFICATES API ──
  function getCertificateRecords(opts) {
    opts = opts || {};
    const onlyValid = opts.onlyValid !== false;
    let list = readList(CERTS_KEY, SEED_CERTS);
    if (onlyValid) list = list.filter(function (r) { return r.status === 'valid'; });
    return list;
  }

  // ── SCHEDULE API ──
  // Trả về các khoá có lịch khai giảng (startDate khác rỗng), enrich các trường
  // dayLabel ("Thứ 7"), dateFmt ("06/06/2026"), labelText ("HOT"), levelLabel,
  // và sort theo ngày khai giảng gần nhất → xa.
  function getSchedule(opts) {
    opts = opts || {};
    const onlyActive = opts.onlyActive !== false;
    let list = getCourses({ onlyActive: false }).filter(function (c) { return !!c.startDate; });
    if (onlyActive) list = list.filter(function (c) { return c.status !== 'draft'; });
    list = list.map(function (c) {
      const d = new Date(c.startDate);
      const validDate = !isNaN(d.getTime());
      const dayLabel = validDate ? WEEKDAY_VI[d.getDay()] : '';
      const dateFmt = validDate
        ? String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear()
        : (c.startDate || '');
      // Trả về object gọn cho schedule.js (map field course → field schedule cũ)
      return Object.assign({}, c, {
        date: c.startDate,
        level: c.category,
        dayLabel: dayLabel,
        dateFmt: dateFmt,
        labelText: SCHEDULE_LABEL_TEXT[c.label] || '',
        levelLabel: CAT_LABELS[c.category] || c.category || '',
        _sortKey: validDate ? d.getTime() : Number.MAX_SAFE_INTEGER,
      });
    });
    list.sort(function (a, b) { return a._sortKey - b._sortKey; });
    return list;
  }

  // ── Helpers UI ──
  function formatMoney(n) { return (Number(n) || 0).toLocaleString('vi-VN') + 'đ'; }
  function categoryLabel(k) { return CAT_LABELS[k] || k; }
  function categoryTagClass(k) { return CAT_TAG_CLASS[k] || 'tag-basic'; }
  function priceVariantClass(k) { return PRICE_VARIANT[k] || ''; }
  function btnVariantClass(k) { return BTN_VARIANT[k] || ''; }

  return {
    getCourses: getCourses,
    getCourse: getCourse,
    getTeachers: getTeachers,
    getCertificateRecords: getCertificateRecords,
    getSchedule: getSchedule,
    formatMoney: formatMoney,
    categoryLabel: categoryLabel,
    categoryTagClass: categoryTagClass,
    priceVariantClass: priceVariantClass,
    btnVariantClass: btnVariantClass,
  };
})();
