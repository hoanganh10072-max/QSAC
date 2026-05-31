/* schedule.js — Trang lịch khai giảng */

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

  // ── FILTER CHIPS ──
  const chips = document.querySelectorAll('.sched-chips .chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  // ── HEART / LƯU ──
  document.querySelectorAll('.sched-heart').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const icon = btn.querySelector('i');
      const isSaved = icon.classList.contains('fa-solid');
      icon.classList.toggle('fa-regular', isSaved);
      icon.classList.toggle('fa-solid', !isSaved);
      btn.style.color = isSaved ? '' : '#f43f5e';
      showToast(isSaved ? 'Đã bỏ lưu lịch học' : 'Đã lưu lịch học ♡');
    });
  });

  // ── ĐĂNG KÝ NGAY ──
  document.querySelectorAll('.reg-btn').forEach((btn, i) => {
    btn.addEventListener('click', () => {
      window.location.href = `register.html?id=${i + 1}`;
    });
  });

  // ── PLAY BUTTON ──
  document.querySelectorAll('.sched-play').forEach((btn, i) => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      window.location.href = `course-detail.html?id=${i + 1}`;
    });
  });

  // ── SF-INPUT (SEARCH/DATE) ──
  document.querySelectorAll('.sf-input').forEach(el => {
    el.style.cursor = 'text';
    el.addEventListener('click', () => {
      showToast('Tính năng tìm kiếm sẽ sớm ra mắt!');
    });
  });

  // ── SF-SELECT (SORT/FILTER) ──
  document.querySelectorAll('.sf-select').forEach(sel => {
    sel.style.cursor = 'pointer';
    sel.addEventListener('click', () => {
      showToast('Bộ lọc sẽ sớm ra mắt!');
    });
  });

});
