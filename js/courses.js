/* =============================================
   courses.js — Trang danh sách khoá học (pages/courses.html)
   Phụ thuộc: public-data.js (PublicData)
   Render toàn bộ khoá active từ PublicData, bind filter/search/save/sort.
   ============================================= */

function showToast(msg) {
  let t = document.getElementById('_toast');
  if (!t) {
    t = document.createElement('div');
    t.id = '_toast';
    t.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(16px);background:#1e293b;color:#fff;padding:10px 24px;border-radius:50px;font-size:13px;font-weight:600;opacity:0;transition:all .25s;z-index:9999;pointer-events:none;white-space:nowrap;';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  t.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateX(-50%) translateY(16px)';
  }, 2200);
}

document.addEventListener('DOMContentLoaded', () => {

  const grid = document.getElementById('cardsGrid');
  if (!grid) return;

  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const stars = (r) => {
    const n = Math.max(0, Math.min(5, Math.floor(r || 0)));
    return '★'.repeat(n) + '☆'.repeat(5 - n);
  };

  // ── Render cards ──
  function renderCards() {
    const courses = PublicData.getCourses();
    if (!courses.length) {
      grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#64748b;padding:32px">Chưa có khoá học nào.</p>';
      return;
    }
    grid.innerHTML = courses.map((c) => {
      const tagLabel = PublicData.categoryLabel(c.category).toUpperCase();
      const tagCls = PublicData.categoryTagClass(c.category);
      const studentsTxt = c.students ? `${Number(c.students).toLocaleString('vi-VN')}` : '0';
      const ratingTxt = (c.rating || 4.8).toFixed(1);
      const oldInline = c.oldPrice
        ? ` <span class="old-inline">${PublicData.formatMoney(c.oldPrice)}</span>`
        : '';
      const img = c.image || `https://picsum.photos/seed/${esc(c.id)}/400/220`;
      return `
        <article class="course" data-category="${esc(c.category)}" data-id="${esc(c.id)}">
          <div class="thumb">
            <img src="${esc(img)}" alt="${esc(c.name)}" loading="lazy">
            <span class="tag ${tagCls}">${tagLabel}</span>
            <button class="save-btn" aria-label="Lưu"><i class="fa-regular fa-heart"></i></button>
            <button class="play-btn" aria-label="Xem thử"><i class="fa-solid fa-play"></i></button>
          </div>
          <div class="course-body">
            <h3>${esc(c.name)}</h3>
            <div class="meta"><i class="fa-solid fa-user-tie"></i> ${esc(c.teacher)}</div>
            <div class="meta"><i class="fa-solid fa-clock"></i> ${c.duration} tuần · <i class="fa-solid fa-book-open"></i> ${c.lessons} bài học</div>
            <div class="rating"><span class="stars">${stars(c.rating)}</span><span>${ratingTxt} (${studentsTxt})</span></div>
            <div class="cprice">${PublicData.formatMoney(c.price)}${oldInline}</div>
            <div class="course-actions">
              <button class="try-btn">Học thử</button>
              <a class="detail-btn" href="course-detail.html?id=${esc(c.id)}">Xem chi tiết</a>
            </div>
          </div>
        </article>`;
    }).join('');

    bindCardActions();
  }

  // Bind các handler trên card sau mỗi lần render
  function bindCardActions() {
    const cards = grid.querySelectorAll('.course');

    // Save / heart toggle
    cards.forEach((card) => {
      const saveBtn = card.querySelector('.save-btn');
      if (saveBtn) saveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const icon = saveBtn.querySelector('i');
        const saved = icon.classList.contains('fa-solid');
        icon.classList.toggle('fa-regular', saved);
        icon.classList.toggle('fa-solid', !saved);
        saveBtn.style.color = saved ? '' : '#f43f5e';
        showToast(saved ? 'Đã bỏ lưu khoá học' : 'Đã lưu khoá học ♡');
      });

      // Học thử → tới course-detail theo id thật
      const tryBtn = card.querySelector('.try-btn');
      if (tryBtn) tryBtn.addEventListener('click', () => {
        window.location.href = `course-detail.html?id=${card.dataset.id}`;
      });
    });
  }

  renderCards();
  const cards = () => grid.querySelectorAll('.course');

  // ── FILTER CHIPS ──
  const chips = document.querySelectorAll('.filters .chip');
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      const filter = chip.dataset.filter;
      cards().forEach((card) => {
        card.style.display = (filter === 'all' || card.dataset.category === filter) ? '' : 'none';
      });
    });
  });

  // ── SEARCH ──
  const searchInput = document.querySelector('.filter-search input');
  searchInput?.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase().trim();
    cards().forEach((card) => {
      const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
      const teacher = card.querySelector('.meta')?.textContent.toLowerCase() || '';
      card.style.display = (title + ' ' + teacher).includes(q) ? '' : 'none';
    });
    // Reset filter chips về "Tất cả" để tránh xung đột với filter category
    chips.forEach((c) => c.classList.remove('active'));
    chips[0]?.classList.add('active');
  });

  // ── PATH CARDS ──
  document.querySelectorAll('.path-card').forEach((card) => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => { window.location.href = 'learning-path.html'; });
  });

  // ── HERO: HỌC NGAY ──
  document.querySelector('.btn-primary')?.addEventListener('click', () => {
    grid.scrollIntoView({ behavior: 'smooth' });
  });

  // ── HERO: XEM LỘ TRÌNH ──
  document.querySelector('.btn-outline')?.addEventListener('click', () => {
    window.location.href = 'learning-path.html';
  });

  // ── SORT BTN: re-render với thứ tự được chọn ──
  const sortBtn = document.querySelector('.sort-btn');
  const sortOptions = [
    { label: 'Mới nhất',          fn: (a, b) => 0 },
    { label: 'Phổ biến nhất',     fn: (a, b) => (b.students || 0) - (a.students || 0) },
    { label: 'Giá thấp nhất',     fn: (a, b) => (a.price || 0)    - (b.price || 0) },
    { label: 'Đánh giá cao nhất', fn: (a, b) => (b.rating || 0)   - (a.rating || 0) },
  ];
  let sortIdx = 0;
  sortBtn?.addEventListener('click', () => {
    sortIdx = (sortIdx + 1) % sortOptions.length;
    const opt = sortOptions[sortIdx];
    sortBtn.innerHTML = `Sắp xếp: ${opt.label} <i class="fa-solid fa-chevron-down"></i>`;
    // Re-render đã sort
    const sorted = PublicData.getCourses().slice().sort(opt.fn);
    // Ghi tạm sorted vào localStorage cache? — không cần, chỉ cần đổi DOM
    // Ở đây dùng lại renderCards nhưng truyền sẵn data → đơn giản hơn:
    grid.innerHTML = '';
    // Inline render nhanh: tận dụng PublicData
    sorted.forEach((c) => {
      const tagLabel = PublicData.categoryLabel(c.category).toUpperCase();
      const tagCls = PublicData.categoryTagClass(c.category);
      const studentsTxt = c.students ? `${Number(c.students).toLocaleString('vi-VN')}` : '0';
      const ratingTxt = (c.rating || 4.8).toFixed(1);
      const oldInline = c.oldPrice ? ` <span class="old-inline">${PublicData.formatMoney(c.oldPrice)}</span>` : '';
      const img = c.image || `https://picsum.photos/seed/${esc(c.id)}/400/220`;
      grid.insertAdjacentHTML('beforeend', `
        <article class="course" data-category="${esc(c.category)}" data-id="${esc(c.id)}">
          <div class="thumb">
            <img src="${esc(img)}" alt="${esc(c.name)}" loading="lazy">
            <span class="tag ${tagCls}">${tagLabel}</span>
            <button class="save-btn" aria-label="Lưu"><i class="fa-regular fa-heart"></i></button>
            <button class="play-btn" aria-label="Xem thử"><i class="fa-solid fa-play"></i></button>
          </div>
          <div class="course-body">
            <h3>${esc(c.name)}</h3>
            <div class="meta"><i class="fa-solid fa-user-tie"></i> ${esc(c.teacher)}</div>
            <div class="meta"><i class="fa-solid fa-clock"></i> ${c.duration} tuần · <i class="fa-solid fa-book-open"></i> ${c.lessons} bài học</div>
            <div class="rating"><span class="stars">${stars(c.rating)}</span><span>${ratingTxt} (${studentsTxt})</span></div>
            <div class="cprice">${PublicData.formatMoney(c.price)}${oldInline}</div>
            <div class="course-actions">
              <button class="try-btn">Học thử</button>
              <a class="detail-btn" href="course-detail.html?id=${esc(c.id)}">Xem chi tiết</a>
            </div>
          </div>
        </article>`);
    });
    bindCardActions();
    showToast(`Sắp xếp: ${opt.label}`);
  });
});
