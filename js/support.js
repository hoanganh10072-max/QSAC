/* support.js — Trang hỗ trợ */

document.addEventListener('DOMContentLoaded', () => {

  // ── FAQ accordion ──
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Đóng tất cả trong cùng list
      item.closest('.faq-list').querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // ── FAQ category tabs ──
  document.querySelectorAll('.faq-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.faq-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.faq-list').forEach(l => l.classList.add('hidden'));
      tab.classList.add('active');
      const list = document.getElementById(`faq-${tab.dataset.cat}`);
      if (list) list.classList.remove('hidden');
    });
  });

});
