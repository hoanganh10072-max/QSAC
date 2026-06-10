/* =============================================
   course-detail.js — Trang chi tiết khoá học
   Phụ thuộc: public-data.js (PublicData)
   Luồng: đọc id từ URL → PublicData.getCourse → merge với enrichment ENRICH
          → render. Khoá mới của admin không có enrichment sẽ dùng fallback.
   ============================================= */

/* Enrichment cố định cho 8 khoá seed gốc (intro, learns…)
   Admin chưa quản lý các trường này, nên để hardcode kèm theo id của seed.
   Khi admin thêm khoá mới (id sinh động) sẽ rơi vào nhánh DEFAULT bên dưới. */
const ENRICH = {
  c1: {
    learns: [
      { ico: '🛒', text: 'Nắm vững kiến thức nền tảng về TMĐT' },
      { ico: '🏪', text: 'Hiểu cách vận hành các sàn TMĐT lớn' },
      { ico: '📈', text: 'Xây dựng và tối ưu gian hàng hiệu quả' },
      { ico: '📣', text: 'Áp dụng chiến lược marketing cơ bản' },
    ],
    intro: 'Khoá học "Nhập môn Thương mại điện tử cho người mới" được thiết kế cho những ai mới bắt đầu tìm hiểu hoặc muốn kinh doanh online bài bản. Bạn sẽ được hướng dẫn từ A–Z: tư duy, chọn sản phẩm, tạo gian hàng, đăng sản phẩm, đến các bước chăm sóc khách hàng và tối ưu doanh thu.',
  },
  c2: {
    learns: [
      { ico: '🏆', text: 'Tối ưu gian hàng Shopee & Lazada chuyên nghiệp' },
      { ico: '📊', text: 'Chạy quảng cáo Shopee Ads hiệu quả' },
      { ico: '💬', text: 'Chăm sóc khách hàng và xử lý đánh giá' },
      { ico: '📦', text: 'Quản lý đơn hàng và vận hành trơn tru' },
    ],
    intro: 'Khoá học "Bán hàng chuyên nghiệp trên Shopee & Lazada" trang bị cho bạn toàn bộ kỹ năng thực chiến: từ dựng gian hàng chuẩn SEO, thiết kế ảnh sản phẩm thu hút, đến chiến lược chạy Flash Sale và quản lý hiệu suất bán hàng bằng dữ liệu.',
  },
  c3: {
    learns: [
      { ico: '🔍', text: 'Tối ưu SEO listing sản phẩm trên sàn TMĐT' },
      { ico: '📱', text: 'Triển khai quảng cáo mạng xã hội hiệu quả' },
      { ico: '📊', text: 'Phân tích traffic và chuyển đổi khách hàng' },
      { ico: '✍️', text: 'Sản xuất nội dung marketing thu hút' },
    ],
    intro: 'Khoá học "Marketing số & SEO cho sàn TMĐT" giúp bạn hiểu sâu thuật toán xếp hạng sản phẩm, cách viết mô tả chuẩn SEO, và xây dựng phễu marketing từ mạng xã hội đến trang sản phẩm.',
  },
  c4: {
    learns: [
      { ico: '⚖️', text: 'Nắm vững Luật Giao dịch điện tử và TMĐT' },
      { ico: '📝', text: 'Soạn thảo và ký hợp đồng điện tử đúng luật' },
      { ico: '🛡️', text: 'Bảo vệ quyền lợi người tiêu dùng online' },
      { ico: '🧾', text: 'Khai báo thuế và hoá đơn kinh doanh online' },
    ],
    intro: 'Khoá học "Pháp lý TMĐT & Hợp đồng thương mại điện tử" cung cấp nền tảng pháp lý vững chắc cho cá nhân và doanh nghiệp kinh doanh online.',
  },
  c5: {
    learns: [
      { ico: '📋', text: 'Xây dựng quy trình xử lý đơn hàng chuẩn' },
      { ico: '🎧', text: 'Chăm sóc khách hàng và xử lý khiếu nại hiệu quả' },
      { ico: '📉', text: 'Phân tích KPI và tối ưu hiệu suất gian hàng' },
      { ico: '🤝', text: 'Quản lý nhà cung cấp và chuỗi cung ứng' },
    ],
    intro: 'Khoá học "Vận hành sàn TMĐT chuyên nghiệp từ A–Z" dành cho chủ shop muốn xây dựng hệ thống vận hành bài bản, giảm thiểu sai sót và mở rộng quy mô kinh doanh.',
  },
  c6: {
    learns: [
      { ico: '📦', text: 'Quản lý tồn kho và cảnh báo hết hàng tự động' },
      { ico: '🚚', text: 'Chọn đối tác giao vận phù hợp chi phí & tốc độ' },
      { ico: '🗃️', text: 'Tổ chức kho hàng khoa học, tiết kiệm diện tích' },
      { ico: '💰', text: 'Tính toán và tối ưu chi phí logistics' },
    ],
    intro: 'Khoá học "Quản lý kho hàng & Logistics TMĐT hiệu quả" giúp bạn kiểm soát toàn bộ vòng đời sản phẩm từ khi nhập hàng đến khi giao tới tay khách.',
  },
  c7: {
    learns: [
      { ico: '🎨', text: 'Xây dựng bộ nhận diện thương hiệu đồng bộ' },
      { ico: '📸', text: 'Sản xuất nội dung hình ảnh/video chuyên nghiệp' },
      { ico: '🌐', text: 'Phát triển cộng đồng và tăng độ nhận diện online' },
      { ico: '⭐', text: 'Xây dựng uy tín và quản lý danh tiếng online' },
    ],
    intro: 'Khoá học "Xây dựng thương hiệu cá nhân & doanh nghiệp online" dành cho chủ kinh doanh, freelancer và doanh nghiệp nhỏ muốn tạo chỗ đứng vững chắc trên thị trường online.',
  },
  c8: {
    learns: [
      { ico: '📊', text: 'Đọc và phân tích báo cáo analytics sàn TMĐT' },
      { ico: '🔬', text: 'Thực hiện A/B testing để tăng chuyển đổi' },
      { ico: '📉', text: 'Dự đoán xu hướng và tối ưu chiến lược kinh doanh' },
      { ico: '🖥️', text: 'Xây dựng dashboard báo cáo kinh doanh trực quan' },
    ],
    intro: 'Khoá học "Phân tích dữ liệu & Báo cáo kinh doanh TMĐT" trang bị tư duy data-driven cho người bán hàng online.',
  },
};

// Default enrichment cho khoá mới (admin tạo) chưa có ENRICH
const DEFAULT_ENRICH = {
  learns: [
    { ico: '🎯', text: 'Mục tiêu rõ ràng theo từng module' },
    { ico: '📚', text: 'Tài liệu thực hành đi kèm mỗi bài' },
    { ico: '🤝', text: 'Hỗ trợ 1-1 từ giảng viên trong khoá' },
    { ico: '🛡️', text: 'Chứng chỉ hoàn thành sau khoá học' },
  ],
  intro: 'Nội dung chi tiết khoá học đang được cập nhật. Vui lòng liên hệ tư vấn viên để biết thêm thông tin về chương trình đào tạo.',
};

document.addEventListener('DOMContentLoaded', () => {

  // ── Đọc id từ URL ──
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  // Lấy khoá từ PublicData (đọc từ localStorage admin)
  let course = id ? PublicData.getCourse(id) : null;

  // Fallback: nếu không có id hoặc id không tồn tại → khoá đầu tiên
  if (!course) {
    const all = PublicData.getCourses();
    course = all[0] || null;
  }

  if (!course) {
    // Không có khoá nào trong hệ thống — báo cho người dùng
    document.querySelector('main').innerHTML =
      '<div style="text-align:center;padding:60px 20px"><h2>Chưa có khoá học</h2><p>Vui lòng liên hệ quản trị viên để được hỗ trợ.</p><a href="../index.html">Về trang chủ</a></div>';
    return;
  }

  // ── Merge enrichment ──
  const enrich = ENRICH[course.id] || DEFAULT_ENRICH;

  // Tính các trường hiển thị
  const levelLabel = PublicData.categoryLabel(course.category);
  const level = levelLabel.toUpperCase();
  const meta = `🕒 ${course.duration} tuần · 📖 ${course.lessons} bài học · 👥 ${(course.students || 0).toLocaleString('vi-VN')} học viên`;
  const reviews = `(${(course.students || 0).toLocaleString('vi-VN')} đánh giá) · 🛡 Chứng chỉ Bộ Công Thương`;
  const teacherInitial = (course.teacher || '?').replace(/^GV\.\s*/, '').trim().charAt(0).toUpperCase() || '?';

  // ── Cập nhật DOM ──
  document.getElementById('detail-title').textContent     = course.name;
  const crumb = document.getElementById('crumb-title');
  if (crumb) crumb.textContent = course.name;
  document.getElementById('detail-desc').textContent      = `Khoá ${levelLabel} - ${course.lessons} bài học do ${course.teacher} hướng dẫn.`;
  document.getElementById('detail-teacher').textContent   = course.teacher;
  document.getElementById('detail-level').textContent     = level;
  document.getElementById('detail-meta').textContent      = meta;
  document.getElementById('detail-score').textContent     = (course.rating || 4.8).toFixed(1);
  document.getElementById('detail-reviews').textContent   = reviews;
  document.getElementById('detail-price').textContent     = PublicData.formatMoney(course.price);
  document.getElementById('detail-level-badge').textContent = levelLabel;
  document.getElementById('detail-duration').textContent  = course.duration + ' tuần';
  document.getElementById('detail-lessons').textContent   = course.lessons + ' bài';
  document.getElementById('detail-teacher-ava').textContent = teacherInitial;
  document.title = `QSAC - ${course.name}`;

  // Giá gốc + discount: tính từ oldPrice nếu có
  const priceOldRow = document.querySelector('.price-old-row');
  if (course.oldPrice && course.oldPrice > course.price) {
    const discount = Math.round((1 - course.price / course.oldPrice) * 100);
    document.getElementById('detail-old-price').textContent = PublicData.formatMoney(course.oldPrice);
    document.getElementById('detail-discount').textContent  = `-${discount}%`;
  } else if (priceOldRow) {
    priceOldRow.style.display = 'none';
  }

  // Render learn grid
  const learnGrid = document.querySelector('.learn-grid');
  if (learnGrid) {
    learnGrid.innerHTML = enrich.learns.map((item) =>
      `<div class="learn-item"><div class="learn-ico">${item.ico}</div>${item.text}</div>`
    ).join('');
  }

  // Cập nhật đoạn giới thiệu khoá học
  const introP = document.querySelector('.intro-block p');
  if (introP) introP.textContent = enrich.intro;

  // ── TAB SWITCHING ──
  const tabs   = document.querySelectorAll('.dtab');
  const panels = document.querySelectorAll('.tab-panel');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      panels.forEach((p) => p.classList.add('hidden'));
      tab.classList.add('active');
      const panel = document.getElementById(`panel-${tab.dataset.tab}`);
      if (panel) panel.classList.remove('hidden');
    });
  });

  // Nút đăng ký → register.html với id thật
  const enrollBtn = document.querySelector('.btn-enroll');
  if (enrollBtn) enrollBtn.addEventListener('click', () => {
    window.location.href = `register.html?id=${encodeURIComponent(course.id)}`;
  });
});
