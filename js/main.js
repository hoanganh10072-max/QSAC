/* main.js — Logic tương tác trang chủ */

document.addEventListener('DOMContentLoaded', () => {

  // ── FILTER CHIPS ──
  const chips = document.querySelectorAll('.chip');
  const courses = document.querySelectorAll('.course');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const filter = chip.dataset.filter;
      courses.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.style.display = show ? '' : 'none';
      });
    });
  });

  // ── NAVIGATE TO DETAIL ──
  // Click "Chi tiết" trên card → mở trang chi tiết với id tương ứng
  document.querySelectorAll('.detail').forEach((btn, index) => {
    btn.addEventListener('click', () => {
      window.location.href = `pages/course-detail.html?id=${index + 1}`;
    });
  });

});
