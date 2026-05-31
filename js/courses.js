/* courses.js — Trang danh sách khóa học */

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

  // ── GÁN CATEGORY CHO TỪNG CARD ──
  const categoryMap = ['shopee','lazada','tiktok','livestream','marketing','basic','advanced','marketing'];
  const courses = document.querySelectorAll('.cards .course');
  courses.forEach((card, i) => { card.dataset.category = categoryMap[i] || 'basic'; });

  // ── FILTER CHIPS ──
  const chips = document.querySelectorAll('.filters .chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const filter = chip.dataset.filter;
      courses.forEach(card => {
        card.style.display = (filter === 'all' || card.dataset.category === filter) ? '' : 'none';
      });
    });
  });

  // ── SEARCH ──
  const searchInput = document.querySelector('.filter-search input');
  searchInput?.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase();
    courses.forEach(card => {
      const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
      card.style.display = title.includes(q) ? '' : 'none';
    });
    // Reset chips active
    chips.forEach(c => c.classList.remove('active'));
    chips[0]?.classList.add('active');
  });

  // ── SAVE / HEART TOGGLE ──
  document.querySelectorAll('.save-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const icon = btn.querySelector('i');
      const isSaved = icon.classList.contains('fa-solid');
      icon.classList.toggle('fa-regular', isSaved);
      icon.classList.toggle('fa-solid', !isSaved);
      btn.style.color = isSaved ? '' : '#f43f5e';
      showToast(isSaved ? 'Đã bỏ lưu khóa học' : 'Đã lưu khóa học ♡');
    });
  });

  // ── HỌC THỬ ──
  document.querySelectorAll('.try-btn').forEach((btn, i) => {
    btn.addEventListener('click', () => {
      window.location.href = `course-detail.html?id=${i + 1}`;
    });
  });

  // ── PATH CARDS ──
  document.querySelectorAll('.path-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      window.location.href = 'learning-path.html';
    });
  });

  // ── HERO: HỌC NGAY ──
  document.querySelector('.btn-primary')?.addEventListener('click', () => {
    document.querySelector('.cards')?.scrollIntoView({ behavior: 'smooth' });
  });

  // ── HERO: XEM LỘ TRÌNH ──
  document.querySelector('.btn-outline')?.addEventListener('click', () => {
    window.location.href = 'learning-path.html';
  });

  // ── SORT BTN ──
  const sortBtn = document.querySelector('.sort-btn');
  const sortOptions = ['Mới nhất', 'Phổ biến nhất', 'Giá thấp nhất', 'Đánh giá cao nhất'];
  let sortIdx = 0;
  sortBtn?.addEventListener('click', () => {
    sortIdx = (sortIdx + 1) % sortOptions.length;
    sortBtn.innerHTML = `Sắp xếp: ${sortOptions[sortIdx]} <i class="fa-solid fa-chevron-down"></i>`;
    showToast(`Sắp xếp: ${sortOptions[sortIdx]}`);
  });

});
