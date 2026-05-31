/* learning-path.js — Tương tác trang lộ trình học */

document.addEventListener('DOMContentLoaded', () => {

  // ── LEVEL TABS ──
  const tabs = document.querySelectorAll('.lp-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  // ── CATEGORY SIDEBAR ──
  const cats = document.querySelectorAll('.lp-cat');
  cats.forEach(cat => {
    cat.addEventListener('click', () => {
      cats.forEach(c => c.classList.remove('active'));
      cat.classList.add('active');
    });
  });

  // ── BOOKMARK TOGGLE ──
  document.querySelectorAll('.lp-bookmark').forEach(btn => {
    btn.addEventListener('click', () => {
      const icon = btn.querySelector('i');
      icon.classList.toggle('fa-regular');
      icon.classList.toggle('fa-solid');
      btn.style.color = icon.classList.contains('fa-solid') ? '#e11d48' : '';
    });
  });

});
