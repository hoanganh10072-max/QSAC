/* register.js — Trang đăng ký học */

const COURSES = {
  1: {
    title: 'Nhập môn Thương mại điện tử cho người mới',
    teacher: 'GV. Trần Thị Hà', level: 'Cơ bản',
    lessons: 24, weeks: 6, students: 1240, score: 4.8,
    price: 1500000, oldPrice: 2000000, discount: 25,
    gradient: 'linear-gradient(135deg,#1047c7 0%,#0538a8 100%)',
  },
  2: {
    title: 'Bán hàng chuyên nghiệp trên Shopee & Lazada',
    teacher: 'GV. Lê Văn Bình', level: 'Nâng cao',
    lessons: 32, weeks: 8, students: 890, score: 4.9,
    price: 2800000, oldPrice: 3500000, discount: 20,
    gradient: 'linear-gradient(135deg,#0035bc 0%,#071b7a 100%)',
  },
  3: {
    title: 'Marketing số & SEO cho sàn thương mại điện tử',
    teacher: 'GV. Phạm Minh Tuấn', level: 'Marketing số',
    lessons: 28, weeks: 7, students: 654, score: 4.7,
    price: 2200000, oldPrice: 2800000, discount: 21,
    gradient: 'linear-gradient(135deg,#6b21a8 0%,#4c1d95 100%)',
  },
  4: {
    title: 'Pháp lý TMĐT & Hợp đồng thương mại điện tử',
    teacher: 'GV. Nguyễn Thu Hương', level: 'Pháp lý',
    lessons: 20, weeks: 5, students: 312, score: 4.8,
    price: 1800000, oldPrice: 0, discount: 0,
    gradient: 'linear-gradient(135deg,#c2410c 0%,#9a3412 100%)',
  },
  5: {
    title: 'Vận hành sàn TMĐT chuyên nghiệp từ A–Z',
    teacher: 'GV. Đỗ Quang Huy', level: 'Vận hành',
    lessons: 36, weeks: 9, students: 478, score: 4.9,
    price: 3500000, oldPrice: 4200000, discount: 17,
    gradient: 'linear-gradient(135deg,#047857 0%,#065f46 100%)',
  },
  6: {
    title: 'Quản lý kho hàng & Logistics TMĐT hiệu quả',
    teacher: 'GV. Trần Đức Long', level: 'Cơ bản',
    lessons: 24, weeks: 6, students: 521, score: 4.6,
    price: 1600000, oldPrice: 0, discount: 0,
    gradient: 'linear-gradient(135deg,#1e3a8a 0%,#1e40af 100%)',
  },
  7: {
    title: 'Xây dựng thương hiệu cá nhân & doanh nghiệp online',
    teacher: 'GV. Vũ Thị Mai', level: 'Nâng cao',
    lessons: 30, weeks: 8, students: 389, score: 4.8,
    price: 2500000, oldPrice: 3200000, discount: 22,
    gradient: 'linear-gradient(135deg,#7c3aed 0%,#5b21b6 100%)',
  },
  8: {
    title: 'Phân tích dữ liệu & Báo cáo kinh doanh TMĐT',
    teacher: 'GV. Ngô Thành Nam', level: 'Nâng cao',
    lessons: 28, weeks: 7, students: 267, score: 4.9,
    price: 2900000, oldPrice: 0, discount: 0,
    gradient: 'linear-gradient(135deg,#0369a1 0%,#075985 100%)',
  },
};

function fmt(n) {
  return n.toLocaleString('vi-VN') + 'đ';
}

document.addEventListener('DOMContentLoaded', () => {
  const id = parseInt(new URLSearchParams(window.location.search).get('id')) || 1;
  const c = COURSES[id] || COURSES[1];

  // Populate text fields
  document.querySelectorAll('.js-title').forEach(el => el.textContent = c.title);
  document.querySelectorAll('.js-teacher').forEach(el => el.textContent = c.teacher);
  document.querySelectorAll('.js-level').forEach(el => el.textContent = c.level);
  document.querySelector('.js-lessons').textContent = c.lessons + ' bài học';
  document.querySelector('.js-weeks').textContent = c.weeks + ' tuần';
  document.querySelector('.js-score').textContent = c.score;
  document.querySelector('.js-students').textContent = '(' + c.students.toLocaleString('vi-VN') + ' học viên)';
  document.querySelectorAll('.js-price').forEach(el => el.textContent = fmt(c.price));
  document.querySelector('.js-price-sum').textContent = fmt(c.price);

  // Apply course gradient to thumbnails
  document.querySelectorAll('.reg-thumb').forEach(el => el.style.background = c.gradient);

  // Show/hide discount elements
  const hasDiscount = c.oldPrice > 0;
  document.querySelectorAll('.js-has-discount').forEach(el => {
    el.style.display = hasDiscount ? '' : 'none';
  });
  if (hasDiscount) {
    document.querySelectorAll('.js-old-price').forEach(el => el.textContent = fmt(c.oldPrice));
    document.querySelectorAll('.js-original').forEach(el => el.textContent = fmt(c.oldPrice));
    document.querySelector('.js-discount-pct').textContent = 'Giảm ' + c.discount + '%';
    document.querySelector('.js-discount-amt').textContent = '–' + fmt(c.oldPrice - c.price);
  }

  document.title = 'QSAC - Đăng ký: ' + c.title;

  // Payment method switching
  const bankInfo = document.querySelector('.bank-info');
  document.querySelectorAll('.pay-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.pay-opt').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      bankInfo.style.display = opt.dataset.method === 'bank' ? '' : 'none';
    });
  });

  // Back button
  document.querySelector('.btn-back').addEventListener('click', () => history.back());

  // Continue to payment QR page
  document.querySelector('.btn-continue').addEventListener('click', () => {
    window.location.href = `payment.html?id=${id}`;
  });
});
