/* teachers.js — Trang giảng viên */

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

  // ── YÊU THÍCH (TC-FAV) ──
  document.querySelectorAll('.tc-fav').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const icon = btn.querySelector('i');
      const isSaved = icon.classList.contains('fa-solid');
      icon.classList.toggle('fa-regular', isSaved);
      icon.classList.toggle('fa-solid', !isSaved);
      btn.style.color = isSaved ? '' : '#f43f5e';
      showToast(isSaved ? 'Đã bỏ yêu thích' : 'Đã thêm vào yêu thích ♡');
    });
  });

  // ── XEM CHI TIẾT GIẢNG VIÊN ──
  document.querySelectorAll('.tc-btn').forEach((btn, i) => {
    btn.addEventListener('click', () => {
      window.location.href = `course-detail.html?id=${i + 1}`;
    });
  });

  // ── ỨNG TUYỂN GIẢNG VIÊN ──
  document.querySelector('.tv-apply button')?.addEventListener('click', () => {
    showToast('Chức năng ứng tuyển sẽ sớm ra mắt!');
  });

  // ── XEM TẤT CẢ GIẢNG VIÊN (SIDEBAR) ──
  document.querySelector('.tv-all-btn')?.addEventListener('click', () => {
    document.querySelector('.tv-cards')?.scrollIntoView({ behavior: 'smooth' });
  });

  // ── YÊU THÍCH SIDEBAR ──
  document.querySelectorAll('.tv-fav-item').forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      const name = item.querySelector('b')?.textContent || '';
      showToast(`Xem giảng viên: ${name}`);
    });
  });

  // ── SEARCH ──
  document.querySelector('.tv-search')?.addEventListener('click', () => {
    showToast('Tính năng tìm kiếm giảng viên sẽ sớm ra mắt!');
  });

  // ── SELECT DROPDOWNS ──
  document.querySelectorAll('.tv-select').forEach(sel => {
    sel.style.cursor = 'pointer';
    sel.addEventListener('click', () => {
      showToast('Bộ lọc sẽ sớm ra mắt!');
    });
  });

});
