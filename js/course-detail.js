/* course-detail.js — Tương tác trang chi tiết khóa học */

/* Dữ liệu mẫu cho 8 khóa học — mở rộng khi có backend */
const COURSES = {
  1: {
    title: 'Nhập môn Thương mại điện tử cho người mới',
    desc: 'Khóa học giúp bạn nắm vững kiến thức nền tảng và từng bước xây dựng lộ trình kinh doanh TMĐT hiệu quả.',
    teacher: 'GV. Trần Thị Hà', teacherInitial: 'H',
    level: 'CƠ BẢN', levelLabel: 'Cơ bản',
    meta: '◷ 6 tuần · 📖 24 bài học · ♧ 1.240 học viên',
    score: '4.8', reviews: '(1.240 đánh giá) · 🛡 Chứng chỉ Bộ Công Thương',
    price: '1.500.000đ', oldPrice: '2.000.000đ', discount: '-25%',
    duration: '6 tuần', lessons: '24 bài',
    learns: [
      { ico: '🛒', text: 'Nắm vững kiến thức nền tảng về TMĐT' },
      { ico: '🏪', text: 'Hiểu cách vận hành các sàn TMĐT lớn' },
      { ico: '📈', text: 'Xây dựng và tối ưu gian hàng hiệu quả' },
      { ico: '📣', text: 'Áp dụng chiến lược marketing cơ bản' },
    ],
    intro: 'Khóa học "Nhập môn Thương mại điện tử cho người mới" được thiết kế cho những ai mới bắt đầu tìm hiểu hoặc muốn kinh doanh online bài bản. Bạn sẽ được hướng dẫn từ A–Z: tư duy, chọn sản phẩm, tạo gian hàng, đăng sản phẩm, đến các bước chăm sóc khách hàng và tối ưu doanh thu.',
  },
  2: {
    title: 'Bán hàng chuyên nghiệp trên Shopee & Lazada',
    desc: 'Nắm vững kỹ thuật tối ưu gian hàng, chạy quảng cáo và tăng doanh thu bền vững trên các sàn TMĐT lớn.',
    teacher: 'GV. Lê Văn Bình', teacherInitial: 'B',
    level: 'NÂNG CAO', levelLabel: 'Nâng cao',
    meta: '◷ 8 tuần · 📖 32 bài học · ♧ 890 học viên',
    score: '4.9', reviews: '(890 đánh giá) · 🛡 Chứng chỉ Bộ Công Thương',
    price: '2.800.000đ', oldPrice: '3.500.000đ', discount: '-20%',
    duration: '8 tuần', lessons: '32 bài',
    learns: [
      { ico: '🏆', text: 'Tối ưu gian hàng Shopee & Lazada chuyên nghiệp' },
      { ico: '📊', text: 'Chạy quảng cáo Shopee Ads hiệu quả' },
      { ico: '💬', text: 'Chăm sóc khách hàng và xử lý đánh giá' },
      { ico: '📦', text: 'Quản lý đơn hàng và vận hành trơn tru' },
    ],
    intro: 'Khóa học "Bán hàng chuyên nghiệp trên Shopee & Lazada" trang bị cho bạn toàn bộ kỹ năng thực chiến: từ dựng gian hàng chuẩn SEO, thiết kế ảnh sản phẩm thu hút, đến chiến lược chạy Flash Sale và quản lý hiệu suất bán hàng bằng dữ liệu.',
  },
  3: {
    title: 'Marketing số & SEO cho sàn thương mại điện tử',
    desc: 'Học cách tăng traffic tự nhiên, tối ưu SEO listing và triển khai quảng cáo hiệu quả trên các sàn TMĐT.',
    teacher: 'GV. Phạm Minh Tuấn', teacherInitial: 'T',
    level: 'MARKETING SỐ', levelLabel: 'Marketing số',
    meta: '◷ 7 tuần · 📖 28 bài học · ♧ 654 học viên',
    score: '4.7', reviews: '(654 đánh giá) · 🛡 Chứng chỉ Bộ Công Thương',
    price: '2.200.000đ', oldPrice: '2.800.000đ', discount: '-21%',
    duration: '7 tuần', lessons: '28 bài',
    learns: [
      { ico: '🔍', text: 'Tối ưu SEO listing sản phẩm trên sàn TMĐT' },
      { ico: '📱', text: 'Triển khai quảng cáo mạng xã hội hiệu quả' },
      { ico: '📊', text: 'Phân tích traffic và chuyển đổi khách hàng' },
      { ico: '✍️', text: 'Sản xuất nội dung marketing thu hút' },
    ],
    intro: 'Khóa học "Marketing số & SEO cho sàn TMĐT" giúp bạn hiểu sâu thuật toán xếp hạng sản phẩm, cách viết mô tả chuẩn SEO, và xây dựng phễu marketing từ mạng xã hội đến trang sản phẩm. Phù hợp với chủ shop muốn tăng doanh thu mà không phụ thuộc hoàn toàn vào quảng cáo trả phí.',
  },
  4: {
    title: 'Pháp lý TMĐT & Hợp đồng thương mại điện tử',
    desc: 'Hiểu đúng và đầy đủ các quy định pháp lý về kinh doanh online, hợp đồng điện tử và bảo vệ người tiêu dùng.',
    teacher: 'GV. Nguyễn Thu Hương', teacherInitial: 'H',
    level: 'PHÁP LÝ', levelLabel: 'Pháp lý',
    meta: '◷ 5 tuần · 📖 20 bài học · ♧ 312 học viên',
    score: '4.8', reviews: '(312 đánh giá) · 🛡 Chứng chỉ Bộ Công Thương',
    price: '1.800.000đ', oldPrice: '', discount: '',
    duration: '5 tuần', lessons: '20 bài',
    learns: [
      { ico: '⚖️', text: 'Nắm vững Luật Giao dịch điện tử và TMĐT' },
      { ico: '📝', text: 'Soạn thảo và ký hợp đồng điện tử đúng luật' },
      { ico: '🛡️', text: 'Bảo vệ quyền lợi người tiêu dùng online' },
      { ico: '🧾', text: 'Khai báo thuế và hóa đơn kinh doanh online' },
    ],
    intro: 'Khóa học "Pháp lý TMĐT & Hợp đồng thương mại điện tử" cung cấp nền tảng pháp lý vững chắc cho cá nhân và doanh nghiệp kinh doanh online. Bạn sẽ hiểu rõ các nghĩa vụ pháp lý, cách xây dựng chính sách bán hàng hợp lệ, xử lý tranh chấp và tuân thủ quy định của Bộ Công Thương.',
  },
  5: {
    title: 'Vận hành sàn TMĐT chuyên nghiệp từ A–Z',
    desc: 'Xây dựng quy trình vận hành chuẩn cho gian hàng TMĐT: từ quản lý đơn hàng đến chăm sóc khách hàng và tối ưu hiệu suất.',
    teacher: 'GV. Đỗ Quang Huy', teacherInitial: 'H',
    level: 'VẬN HÀNH', levelLabel: 'Vận hành',
    meta: '◷ 9 tuần · 📖 36 bài học · ♧ 478 học viên',
    score: '4.9', reviews: '(478 đánh giá) · 🛡 Chứng chỉ Bộ Công Thương',
    price: '3.500.000đ', oldPrice: '4.200.000đ', discount: '-17%',
    duration: '9 tuần', lessons: '36 bài',
    learns: [
      { ico: '📋', text: 'Xây dựng quy trình xử lý đơn hàng chuẩn' },
      { ico: '🎧', text: 'Chăm sóc khách hàng và xử lý khiếu nại hiệu quả' },
      { ico: '📉', text: 'Phân tích KPI và tối ưu hiệu suất gian hàng' },
      { ico: '🤝', text: 'Quản lý nhà cung cấp và chuỗi cung ứng' },
    ],
    intro: 'Khóa học "Vận hành sàn TMĐT chuyên nghiệp từ A–Z" dành cho chủ shop muốn xây dựng hệ thống vận hành bài bản, giảm thiểu sai sót và mở rộng quy mô kinh doanh. Bạn sẽ học cách thiết lập SOP, quản lý nhân sự bán hàng, đọc dashboard và ra quyết định dựa trên dữ liệu.',
  },
  6: {
    title: 'Quản lý kho hàng & Logistics TMĐT hiệu quả',
    desc: 'Kiểm soát hàng tồn kho, tối ưu chi phí vận chuyển và chọn đúng đối tác logistics cho gian hàng online của bạn.',
    teacher: 'GV. Trần Đức Long', teacherInitial: 'L',
    level: 'CƠ BẢN', levelLabel: 'Cơ bản',
    meta: '◷ 6 tuần · 📖 24 bài học · ♧ 521 học viên',
    score: '4.6', reviews: '(521 đánh giá) · 🛡 Chứng chỉ Bộ Công Thương',
    price: '1.600.000đ', oldPrice: '', discount: '',
    duration: '6 tuần', lessons: '24 bài',
    learns: [
      { ico: '📦', text: 'Quản lý tồn kho và cảnh báo hết hàng tự động' },
      { ico: '🚚', text: 'Chọn đối tác giao vận phù hợp chi phí & tốc độ' },
      { ico: '🗃️', text: 'Tổ chức kho hàng khoa học, tiết kiệm diện tích' },
      { ico: '💰', text: 'Tính toán và tối ưu chi phí logistics' },
    ],
    intro: 'Khóa học "Quản lý kho hàng & Logistics TMĐT hiệu quả" giúp bạn kiểm soát toàn bộ vòng đời sản phẩm từ khi nhập hàng đến khi giao tới tay khách. Bạn sẽ học cách sắp xếp kho thông minh, dùng phần mềm quản lý tồn kho đơn giản và lựa chọn đơn vị vận chuyển tối ưu cho từng loại sản phẩm.',
  },
  7: {
    title: 'Xây dựng thương hiệu cá nhân & doanh nghiệp online',
    desc: 'Tạo dựng hình ảnh thương hiệu nhất quán và uy tín trên các nền tảng online, từ mạng xã hội đến sàn TMĐT.',
    teacher: 'GV. Vũ Thị Mai', teacherInitial: 'M',
    level: 'NÂNG CAO', levelLabel: 'Nâng cao',
    meta: '◷ 8 tuần · 📖 30 bài học · ♧ 389 học viên',
    score: '4.8', reviews: '(389 đánh giá) · 🛡 Chứng chỉ Bộ Công Thương',
    price: '2.500.000đ', oldPrice: '3.200.000đ', discount: '-22%',
    duration: '8 tuần', lessons: '30 bài',
    learns: [
      { ico: '🎨', text: 'Xây dựng bộ nhận diện thương hiệu đồng bộ' },
      { ico: '📸', text: 'Sản xuất nội dung hình ảnh/video chuyên nghiệp' },
      { ico: '🌐', text: 'Phát triển cộng đồng và tăng độ nhận diện online' },
      { ico: '⭐', text: 'Xây dựng uy tín và quản lý danh tiếng online' },
    ],
    intro: 'Khóa học "Xây dựng thương hiệu cá nhân & doanh nghiệp online" dành cho chủ kinh doanh, freelancer và doanh nghiệp nhỏ muốn tạo chỗ đứng vững chắc trên thị trường online. Bạn sẽ học cách định vị thương hiệu, xây dựng bộ nhận diện, kể câu chuyện thương hiệu và duy trì hình ảnh nhất quán trên mọi kênh.',
  },
  8: {
    title: 'Phân tích dữ liệu & Báo cáo kinh doanh TMĐT',
    desc: 'Đọc hiểu các chỉ số kinh doanh quan trọng, xây dựng dashboard báo cáo và ra quyết định dựa trên dữ liệu thực tế.',
    teacher: 'GV. Ngô Thành Nam', teacherInitial: 'N',
    level: 'NÂNG CAO', levelLabel: 'Nâng cao',
    meta: '◷ 7 tuần · 📖 28 bài học · ♧ 267 học viên',
    score: '4.9', reviews: '(267 đánh giá) · 🛡 Chứng chỉ Bộ Công Thương',
    price: '2.900.000đ', oldPrice: '', discount: '',
    duration: '7 tuần', lessons: '28 bài',
    learns: [
      { ico: '📊', text: 'Đọc và phân tích báo cáo analytics sàn TMĐT' },
      { ico: '🔬', text: 'Thực hiện A/B testing để tăng chuyển đổi' },
      { ico: '📉', text: 'Dự đoán xu hướng và tối ưu chiến lược kinh doanh' },
      { ico: '🖥️', text: 'Xây dựng dashboard báo cáo kinh doanh trực quan' },
    ],
    intro: 'Khóa học "Phân tích dữ liệu & Báo cáo kinh doanh TMĐT" trang bị tư duy data-driven cho người bán hàng online. Bạn sẽ học cách đọc các chỉ số như CTR, conversion rate, ROAS, xây dựng báo cáo tự động bằng Google Sheets/Excel và đưa ra quyết định kinh doanh dựa trên bằng chứng thay vì cảm tính.',
  },
};

document.addEventListener('DOMContentLoaded', () => {

  // ── LOAD DỮ LIỆU KHÓA HỌC ──
  // Đọc id từ URL query string để hiển thị đúng khóa học
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id')) || 1;
  const course = COURSES[id] || COURSES[1];

  document.getElementById('detail-title').textContent     = course.title;
  document.getElementById('crumb-title').textContent      = course.title;
  document.getElementById('detail-desc').textContent      = course.desc;
  document.getElementById('detail-teacher').textContent   = course.teacher;
  document.getElementById('detail-level').textContent     = course.level;
  document.getElementById('detail-meta').textContent      = course.meta;
  document.getElementById('detail-score').textContent     = course.score;
  document.getElementById('detail-reviews').textContent   = course.reviews;
  document.getElementById('detail-price').textContent     = course.price;
  document.getElementById('detail-level-badge').textContent = course.levelLabel;
  document.getElementById('detail-duration').textContent  = course.duration;
  document.getElementById('detail-lessons').textContent   = course.lessons;
  document.getElementById('detail-teacher-ava').textContent = course.teacherInitial;
  document.title = `QSAC - ${course.title}`;

  // Ẩn phần giá gốc nếu không có giảm giá
  const priceOldRow = document.querySelector('.price-old-row');
  if (course.oldPrice) {
    document.getElementById('detail-old-price').textContent = course.oldPrice;
    document.getElementById('detail-discount').textContent  = course.discount;
  } else {
    priceOldRow.style.display = 'none';
  }

  // ── RENDER LEARN GRID ──
  const learnGrid = document.querySelector('.learn-grid');
  learnGrid.innerHTML = course.learns.map(item =>
    `<div class="learn-item"><div class="learn-ico">${item.ico}</div>${item.text}</div>`
  ).join('');

  // Cập nhật đoạn giới thiệu khóa học
  document.querySelector('.intro-block p').textContent = course.intro;

  // ── TAB SWITCHING ──
  const tabs   = document.querySelectorAll('.dtab');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.add('hidden'));
      tab.classList.add('active');
      const panel = document.getElementById(`panel-${tab.dataset.tab}`);
      if (panel) panel.classList.remove('hidden');
    });
  });

  // Navigate to register page with current course id
  document.querySelector('.btn-enroll').addEventListener('click', () => {
    window.location.href = `register.html?id=${id}`;
  });

});
