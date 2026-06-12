/* learning-path.js — Tương tác trang lộ trình học

   Dữ liệu (LP_CATEGORIES, LP_PATH_DETAILS, LP_LEVEL_LABEL) ở js/learning-data.js
   — file này phải load TRƯỚC learning-path.js.

   Cấu trúc trang:
   - 3 section dọc theo cấp: Cơ bản / Trung cấp / Nâng cao
   - Mỗi section là grid card render từ data (1 nền tảng × 1 cấp = 1 card)
   - Filter 2 chiều: tab cấp độ (.lp-tab) + sidebar danh mục (.lp-cat)
   - Click "Xem chi tiết" → path-detail.html?cat=&level= (cùng folder pages/)
*/

document.addEventListener('DOMContentLoaded', () => {

  const LEVELS = ['basic', 'intermediate', 'advanced'];

  /** Escape HTML phòng XSS khi nguồn data sau này từ admin/API */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, c =>
      ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }

  /** Trả về tổng giờ của 1 mảng khóa (parse "5h" → 5) */
  function totalHours(courses) {
    return courses.reduce((sum, c) => sum + (parseInt(c.d, 10) || 0), 0);
  }

  /** Render 1 card lộ trình (nền tảng × cấp) thành HTML string.
      Nút "Xem chi tiết" là <a> dẫn sang path-detail.html với query params. */
  function buildCard(cat, levelKey, courses) {
    const total = courses.length;
    const hours = totalHours(courses);
    const levelLabel = LP_LEVEL_LABEL[levelKey];
    const lis = courses.map(c =>
      `<li><b>${esc(c.t)}</b><em>${esc(c.d)}</em></li>`
    ).join('');
    const detailHref = `path-detail.html?cat=${encodeURIComponent(cat.key)}&level=${encodeURIComponent(levelKey)}`;

    return `
      <div class="lp-card lp-${cat.theme}" data-cat="${cat.key}">
        <div class="lp-icon lp-icon-${cat.theme}">
          <i class="${cat.iconType} ${cat.icon}"></i>
        </div>
        <span class="lp-tag lp-tag-${cat.theme}">${levelLabel}</span>
        <button class="lp-bookmark" aria-label="Lưu lộ trình">
          <i class="fa-regular fa-heart"></i>
        </button>
        <h2>${esc(cat.name)} — ${levelLabel}</h2>
        <p>${esc(cat.desc)}</p>
        <ul class="lp-course-list">${lis}</ul>
        <div class="lp-meta">
          <span><i class="fa-solid fa-book"></i> ${total} khóa học</span>
          <span><i class="fa-regular fa-clock"></i> ~${hours} giờ học</span>
        </div>
        <div class="lp-bottom">
          <span class="lp-faces"><em data-c="1">A</em><em data-c="2">B</em><em data-c="3">C</em><em data-c="4">D</em></span>
          <a class="lp-btn lp-btn-${cat.theme}" href="${detailHref}">Xem chi tiết</a>
        </div>
      </div>`;
  }

  /** Render toàn bộ 3 section grid từ data */
  function renderSections() {
    LEVELS.forEach(level => {
      const grid = document.getElementById('lpGrid-' + level);
      if (!grid) return;
      const html = LP_CATEGORIES.map(cat => {
        const courses = (LP_PATH_DETAILS[cat.key] || {})[level] || [];
        if (courses.length === 0) return ''; // bỏ qua nền tảng không có cấp đó
        return buildCard(cat, level, courses);
      }).join('');
      grid.innerHTML = html;
    });
  }

  /* State filter — 2 chiều */
  let currentCat   = 'all';
  let currentLevel = 'all';

  /**
   * applyFilter — 2 chiều:
   * - currentLevel: ẩn cả section không khớp cấp
   * - currentCat: lọc card trong các section còn lại theo data-cat
   * Section còn cấp được chọn nhưng không card nào (vì cat filter) cũng bị ẩn.
   */
  function applyFilter() {
    let totalVisible = 0;
    document.querySelectorAll('.lp-section').forEach(section => {
      const sectionLevel = (section.className.match(/lp-section-(\w+)/) || [])[1];
      const levelOk = currentLevel === 'all' || sectionLevel === currentLevel;

      if (!levelOk) {
        section.style.display = 'none';
        return;
      }

      let visibleInSection = 0;
      section.querySelectorAll('.lp-card').forEach(card => {
        const show = currentCat === 'all' || card.dataset.cat === currentCat;
        card.style.display = show ? '' : 'none';
        if (show) visibleInSection++;
      });
      section.style.display = visibleInSection > 0 ? '' : 'none';
      totalVisible += visibleInSection;
    });
    const empty = document.getElementById('lpEmpty');
    if (empty) empty.hidden = totalVisible > 0;
  }

  /** Bind event cho .lp-bookmark sau khi render xong */
  function bindBookmarks() {
    document.querySelectorAll('.lp-bookmark').forEach(btn => {
      btn.addEventListener('click', () => {
        const icon = btn.querySelector('i');
        icon.classList.toggle('fa-regular');
        icon.classList.toggle('fa-solid');
        btn.style.color = icon.classList.contains('fa-solid') ? '#e11d48' : '';
      });
    });
  }

  /* ── LEVEL TABS ── */
  document.querySelectorAll('.lp-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.lp-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentLevel = tab.dataset.level || 'all';
      applyFilter();
    });
  });

  /* ── CATEGORY SIDEBAR ── */
  document.querySelectorAll('.lp-cat').forEach(cat => {
    cat.addEventListener('click', () => {
      document.querySelectorAll('.lp-cat').forEach(c => c.classList.remove('active'));
      cat.classList.add('active');
      currentCat = cat.dataset.cat || 'all';
      applyFilter();
    });
  });

  /* Khởi tạo */
  renderSections();
  bindBookmarks();
  applyFilter();
});
