/* path-detail.js — Render trang chi tiết 1 lộ trình.
   Đọc URL params:
   - ?cat=  (key trong LP_CATEGORIES, vd. shopee/lazada/...)
   - ?level= (basic/intermediate/advanced)

   Dữ liệu lấy từ LP_CATEGORIES, LP_PATH_DETAILS, LP_LEVEL_LABEL (js/learning-data.js).
*/

document.addEventListener('DOMContentLoaded', () => {

  const params = new URLSearchParams(location.search);
  const catKey   = params.get('cat');
  const levelKey = params.get('level');

  // Tìm category & courses; nếu URL sai → hiện thông báo lỗi nhẹ
  const category = LP_CATEGORIES.find(c => c.key === catKey);
  const courses  = (LP_PATH_DETAILS[catKey] || {})[levelKey] || null;

  if (!category || !courses) {
    renderError();
    return;
  }

  renderHero(category, levelKey, courses);
  renderCourses(category, levelKey, courses);
  renderRelated(category, levelKey);
  bindActions();


  /* ---------- HELPERS ---------- */

  function esc(s) {
    return String(s).replace(/[&<>"']/g, c =>
      ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }

  function totalHours(arr) {
    return arr.reduce((s, c) => s + (parseInt(c.d, 10) || 0), 0);
  }

  /** Suy giá khóa theo thời lượng — tạm tính 100k/giờ + base 100k.
      Khi gắn backend sẽ đổi sang giá thực từ admin/API. */
  function priceFor(d) {
    const h = parseInt(d, 10) || 0;
    return (h + 1) * 100000;
  }

  /** Format giá VNĐ kiểu Việt: 600.000đ */
  function fmtPrice(amount) {
    return amount.toLocaleString('vi-VN') + 'đ';
  }

  /** Tổng giá của cả lộ trình (dùng cho hero để khách thấy giá gộp) */
  function totalPrice(arr) {
    return arr.reduce((s, c) => s + priceFor(c.d), 0);
  }


  /* ---------- HERO ---------- */

  function renderHero(cat, level, list) {
    const levelLabel = LP_LEVEL_LABEL[level];
    document.title = `${cat.name} — ${levelLabel} | QSAC`;

    // Theme màu theo nền tảng (lp-{theme}) + cấp độ (pd-lv-{level})
    const hero = document.getElementById('pdHero');
    hero.classList.add('pd-theme-' + cat.theme, 'pd-lv-' + level);

    const icon = document.getElementById('pdIcon');
    icon.className = `${cat.iconType} ${cat.icon}`;

    document.getElementById('pdLevelTag').textContent = levelLabel;
    document.getElementById('pdTitle').textContent    = `${cat.name} — ${levelLabel}`;
    document.getElementById('pdDesc').textContent     = cat.desc;
    document.getElementById('pdTotal').textContent    = list.length;
    document.getElementById('pdHours').textContent    = totalHours(list);
    document.getElementById('pdLevel').textContent    = levelLabel;
  }


  /* ---------- COURSE LIST ---------- */

  function renderCourses(cat, level, list) {
    const wrap = document.getElementById('pdCourses');
    wrap.innerHTML = list.map((c, idx) => {
      const price = priceFor(c.d);
      // Mỗi card có ID lộ trình + tên khóa để register.html biết khóa cần mua
      const buyHref = `register.html?course=${encodeURIComponent(c.t)}&price=${price}`;
      return `
        <article class="pd-course pd-theme-${cat.theme}">
          <div class="pd-course-num">${String(idx + 1).padStart(2, '0')}</div>
          <div class="pd-course-body">
            <h3>${esc(c.t)}</h3>
            ${c.note ? `<p>${esc(c.note)}</p>` : ''}
            <div class="pd-course-meta">
              <span><i class="fa-regular fa-clock"></i> ${esc(c.d)}</span>
              <span><i class="fa-solid fa-signal"></i> ${LP_LEVEL_LABEL[level]}</span>
              <span><i class="fa-solid fa-circle-check"></i> Có chứng chỉ</span>
            </div>
          </div>
          <a class="pd-course-buy" href="${buyHref}">
            <span class="pd-course-price">${fmtPrice(price)}</span>
            <span class="pd-course-action"><i class="fa-solid fa-cart-shopping"></i> Mua khóa</span>
          </a>
        </article>
      `;
    }).join('');
  }


  /* ---------- RELATED PATHS ---------- */

  /** Hiện các lộ trình liên quan: các cấp còn lại của cùng nền tảng
      + 2 lộ trình cùng cấp của nền tảng khác (nếu có). */
  function renderRelated(cat, level) {
    const items = [];

    // 1. Các cấp khác của cùng nền tảng
    ['basic', 'intermediate', 'advanced'].forEach(lv => {
      if (lv === level) return;
      const courses = (LP_PATH_DETAILS[cat.key] || {})[lv] || [];
      if (courses.length === 0) return;
      items.push({ cat, level: lv, courses });
    });

    // 2. 2 nền tảng khác cùng cấp
    let added = 0;
    for (const other of LP_CATEGORIES) {
      if (added >= 2) break;
      if (other.key === cat.key) continue;
      const courses = (LP_PATH_DETAILS[other.key] || {})[level] || [];
      if (courses.length === 0) continue;
      items.push({ cat: other, level, courses });
      added++;
    }

    if (items.length === 0) return;

    const wrap = document.getElementById('pdRelatedWrap');
    const grid = document.getElementById('pdRelated');
    wrap.hidden = false;

    grid.innerHTML = items.map(it => {
      const lvLabel = LP_LEVEL_LABEL[it.level];
      const href = `path-detail.html?cat=${encodeURIComponent(it.cat.key)}&level=${encodeURIComponent(it.level)}`;
      return `
        <a class="pd-rel-card pd-theme-${it.cat.theme}" href="${href}">
          <div class="pd-rel-icon"><i class="${it.cat.iconType} ${it.cat.icon}"></i></div>
          <div class="pd-rel-body">
            <span class="pd-rel-tag">${lvLabel}</span>
            <b>${esc(it.cat.name)} — ${lvLabel}</b>
            <span class="pd-rel-meta">
              <i class="fa-solid fa-book"></i> ${it.courses.length} khóa
              · ~${totalHours(it.courses)} giờ
            </span>
          </div>
          <i class="fa-solid fa-chevron-right pd-rel-arrow"></i>
        </a>`;
    }).join('');
  }


  /* ---------- ACTIONS ---------- */

  function bindActions() {
    const save = document.getElementById('pdSave');
    if (save) {
      save.addEventListener('click', () => {
        const icon = save.querySelector('i');
        icon.classList.toggle('fa-regular');
        icon.classList.toggle('fa-solid');
        save.style.color = icon.classList.contains('fa-solid') ? '#e11d48' : '';
      });
    }
    const enroll = document.getElementById('pdEnroll');
    if (enroll) {
      enroll.addEventListener('click', () => {
        // Demo: chuyển tới trang đăng ký (course đầu tiên của lộ trình)
        location.href = 'register.html?path=' + encodeURIComponent(catKey + '-' + levelKey);
      });
    }
  }


  /* ---------- ERROR ---------- */

  function renderError() {
    document.getElementById('pdTitle').textContent = 'Không tìm thấy lộ trình';
    document.getElementById('pdDesc').textContent  =
      'Đường dẫn không hợp lệ. Vui lòng quay lại danh sách lộ trình.';
    document.getElementById('pdLevelTag').textContent = 'Lỗi';
    const courses = document.getElementById('pdCourses');
    if (courses) courses.innerHTML = '';
    const cta = document.querySelector('.pd-cta');
    if (cta) cta.style.display = 'none';
  }
});
