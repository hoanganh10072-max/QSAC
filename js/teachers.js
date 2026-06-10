/* =============================================
   teachers.js — Trang giảng viên
   Phụ thuộc: public-data.js (PublicData)
   Render `.tv-cards` và sidebar `Giảng viên được yêu thích` từ admin data,
   rồi bind các interaction (favourite, click chi tiết, search, filter).
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

// Escape an toàn cho HTML render tay
const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// Số học viên format kiểu "18.230"
const fmtNum = (n) => Number(n || 0).toLocaleString('vi-VN');

document.addEventListener('DOMContentLoaded', () => {

  const cardsEl = document.getElementById('teacherCards');
  const favEl = document.getElementById('teacherFavList');
  if (!cardsEl) return;

  // ── Lấy danh sách GV đang hợp tác từ admin (qua PublicData) ──
  const teachers = PublicData.getTeachers();

  // ── Render 1 card giảng viên ──
  // ratingCount xấp xỉ = students/10 (khớp với UI bản cũ)
  function renderCard(t) {
    const ratingCount = Math.round((t.students || 0) / 10);
    const cardCls = 'tc-card' + (t.female ? ' female' : '');
    const coverCls = 'tc-cover' + (t.color ? ' ' + t.color : '');
    const badgeCls = 'tc-badge' + (t.badge && t.badge.type ? ' ' + t.badge.type : '');
    const badgeText = (t.badge && t.badge.text) || 'Mới';
    const btnCls = 'tc-btn' + (t.color ? ' ' + t.color : '');
    // bio ngắn (cắt còn ~80 ký tự) để 2 dòng đẹp như HTML gốc
    const bioShort = t.bio && t.bio.length > 80 ? t.bio.slice(0, 80) + '…' : (t.bio || '');
    return '' +
      '<article class="' + cardCls + '" data-id="' + esc(t.id) + '">' +
      '  <div class="' + coverCls + '">' +
      '    <span class="' + badgeCls + '">' + esc(badgeText) + '</span>' +
      '    <button class="tc-fav" aria-label="Yêu thích"><i class="fa-regular fa-heart"></i></button>' +
      '    <img class="tc-head" src="' + esc(t.avatar) + '" alt="' + esc(t.displayName) + '" loading="lazy">' +
      '  </div>' +
      '  <div class="tc-body">' +
      '    <h4>' + esc(t.displayName) + ' <span class="tc-verified">●</span></h4>' +
      '    <p>' + esc(t.title) + '<br>' + esc(bioShort) + '</p>' +
      '    <div class="tc-meta">' +
      '      <span><i class="fa-solid fa-book-open"></i> ' + (t.coursesCount || 0) + ' Khóa học</span>' +
      '      <span><i class="fa-solid fa-users"></i> ' + fmtNum(t.students) + ' Học viên</span>' +
      '    </div>' +
      '    <div class="tc-rating"><span class="tc-star">★</span> ' + (t.rating || 0) +
      ' (' + fmtNum(ratingCount) + ' đánh giá)</div>' +
      '    <button class="' + btnCls + '">Xem chi tiết</button>' +
      '  </div>' +
      '</article>';
  }

  // ── Render danh sách giảng viên ──
  if (!teachers.length) {
    cardsEl.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#64748b;padding:40px">Chưa có giảng viên nào.</p>';
  } else {
    cardsEl.innerHTML = teachers.map(renderCard).join('');
  }

  // ── Render top 4 yêu thích (sort theo rating desc, fallback theo students) ──
  if (favEl) {
    const top = teachers.slice()
      .sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.students || 0) - (a.students || 0))
      .slice(0, 4);
    favEl.innerHTML = top.map((t) => {
      const ratingCount = Math.round((t.students || 0) / 10);
      return '' +
        '<div class="tv-fav-item" data-id="' + esc(t.id) + '">' +
        '  <img class="tv-fav-thumb" src="' + esc(t.avatar) + '" alt="' + esc(t.displayName) + '">' +
        '  <div>' +
        '    <b>' + esc(t.displayName) + '</b>' +
        '    <p>' + esc(t.title) + '</p>' +
        '    <span><span class="tc-star">★</span> ' + (t.rating || 0) + ' (' + fmtNum(ratingCount) + ')</span>' +
        '  </div>' +
        '  <em>' + (t.coursesCount || 0) + ' Khóa học</em>' +
        '</div>';
    }).join('');
  }

  // ── Bind events SAU khi đã render xong DOM ──

  // Yêu thích (toggle icon đặc/rỗng + đổi màu)
  cardsEl.querySelectorAll('.tc-fav').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const icon = btn.querySelector('i');
      const isSaved = icon.classList.contains('fa-solid');
      icon.classList.toggle('fa-regular', isSaved);
      icon.classList.toggle('fa-solid', !isSaved);
      btn.style.color = isSaved ? '' : '#f43f5e';
      showToast(isSaved ? 'Đã bỏ yêu thích' : 'Đã thêm vào yêu thích ♡');
    });
  });

  // Click "Xem chi tiết" → sang trang khoá học (để xem khoá GV phụ trách)
  cardsEl.querySelectorAll('.tc-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      window.location.href = 'courses.html';
    });
  });

  // Click favourite item sidebar → toast tên GV
  if (favEl) {
    favEl.querySelectorAll('.tv-fav-item').forEach((item) => {
      item.style.cursor = 'pointer';
      item.addEventListener('click', () => {
        const name = item.querySelector('b')?.textContent || '';
        showToast(`Xem giảng viên: ${name}`);
      });
    });
  }

  // CTA ứng tuyển
  document.querySelector('.tv-apply button')?.addEventListener('click', () => {
    showToast('Chức năng ứng tuyển sẽ sớm ra mắt!');
  });

  // Scroll xuống danh sách
  document.querySelector('.tv-all-btn')?.addEventListener('click', () => {
    cardsEl.scrollIntoView({ behavior: 'smooth' });
  });

  // Search/select placeholder (UX chưa làm)
  document.querySelector('.tv-search')?.addEventListener('click', () => {
    showToast('Tính năng tìm kiếm giảng viên sẽ sớm ra mắt!');
  });
  document.querySelectorAll('.tv-select').forEach((sel) => {
    sel.style.cursor = 'pointer';
    sel.addEventListener('click', () => {
      showToast('Bộ lọc sẽ sớm ra mắt!');
    });
  });

});
