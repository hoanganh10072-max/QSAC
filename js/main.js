/* =============================================
   main.js — Trang chủ index.html
   Phụ thuộc: public-data.js (PublicData)
   Render 8 khoá học từ PublicData, bind filter chips và click → course-detail.
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  const grid = document.getElementById('cardsGrid');
  if (!grid) return;

  // ── Render cards ──
  // Lấy tối đa 8 khoá active để khớp layout 4 cột × 2 hàng
  const courses = PublicData.getCourses().slice(0, 8);

  // Map category → label hoa cho tag, dựa trên PublicData.categoryLabel
  const tagLabel = (cat) => PublicData.categoryLabel(cat).toUpperCase();

  // Sinh số sao đơn giản từ rating (làm tròn xuống)
  const stars = (r) => {
    const n = Math.max(0, Math.min(5, Math.floor(r || 0)));
    return '★'.repeat(n) + '☆'.repeat(5 - n);
  };

  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  grid.innerHTML = courses.map((c) => {
    const tagCls = PublicData.categoryTagClass(c.category);
    const priceVariant = PublicData.priceVariantClass(c.category);
    const btnVariant = PublicData.btnVariantClass(c.category);
    const studentsTxt = c.students ? ` (${Number(c.students).toLocaleString('vi-VN')} học viên)` : '';
    const ratingTxt = (c.rating || 4.8).toFixed(1);
    const oldPriceBlock = c.oldPrice ? `<div class="old">${PublicData.formatMoney(c.oldPrice)}</div>` : '';
    const img = c.image || `https://picsum.photos/seed/${esc(c.id)}/400/240`;
    return `
      <article class="course" data-category="${esc(c.category)}">
        <div class="thumb">
          <img src="${esc(img)}" alt="${esc(c.name)}" loading="lazy">
          <span class="tag ${tagCls}">${tagLabel(c.category)}</span>
        </div>
        <div class="course-body">
          <h3>${esc(c.name)}</h3>
          <div class="meta">
            <i class="fa-regular fa-circle-user"></i>
            ${esc(c.teacher)} · ${c.duration} tuần · ${c.lessons} bài
          </div>
          <div class="rating">
            <span class="stars">${stars(c.rating)}</span>
            <span>${ratingTxt}${studentsTxt}</span>
          </div>
          ${oldPriceBlock}
          <div class="price-row">
            <div class="price ${priceVariant}">${PublicData.formatMoney(c.price)}</div>
            <a class="detail ${btnVariant}" href="pages/course-detail.html?id=${esc(c.id)}">
              Chi tiết <i class="fa-solid fa-chevron-right"></i>
            </a>
          </div>
        </div>
      </article>`;
  }).join('');

  // ── FILTER CHIPS ──
  const chips = document.querySelectorAll('.chip');
  const cards = grid.querySelectorAll('.course');
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      const filter = chip.dataset.filter;
      cards.forEach((card) => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.style.display = show ? '' : 'none';
      });
    });
  });
});
