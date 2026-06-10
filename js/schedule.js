/* =============================================
   schedule.js — Trang lịch khai giảng
   Phụ thuộc: public-data.js (PublicData)
   Luồng: PublicData.getSchedule() → render rows → bind events → init calendar
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

// Mapping label badge schedule → class CSS + text
const LABEL_CLASS = { hot: 'sl-hot', best: 'sl-best', new: 'sl-new' };
const LABEL_TEXT  = { hot: 'HOT', best: 'BESTSELLER', new: 'NEW' };

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const fmtMoney = (n) => Number(n || 0).toLocaleString('vi-VN') + 'đ';

document.addEventListener('DOMContentLoaded', () => {

  const listEl = document.getElementById('schedList');
  if (!listEl) return;

  const schedules = PublicData.getSchedule();

  // ── Render danh sách sched-row ──
  if (!schedules.length) {
    listEl.innerHTML = '<p style="text-align:center;padding:40px;color:#64748b">Chưa có lịch khai giảng nào sắp tới.</p>';
  } else {
    listEl.innerHTML = schedules.map(renderRow).join('');
  }

  function renderRow(s) {
    const labelBadge = s.label && LABEL_CLASS[s.label]
      ? '<span class="sched-label ' + LABEL_CLASS[s.label] + '">' + (LABEL_TEXT[s.label] || s.labelText) + '</span>'
      : '';
    const oldPriceTag = s.oldPrice ? '<del>' + fmtMoney(s.oldPrice) + '</del>' : '';
    const img = s.image || ('https://picsum.photos/seed/' + s.id + '/130/70');
    return '' +
      '<div class="sched-row" data-level="' + esc(s.level) + '" data-id="' + esc(s.id) + '">' +
      '  <div class="sched-thumb">' +
      '    <img src="' + esc(img) + '" alt="' + esc(s.name) + '">' +
      '    ' + labelBadge +
      '    <button class="sched-play"><i class="fa-solid fa-play"></i></button>' +
      '  </div>' +
      '  <div class="sched-info">' +
      '    <h3>' + esc(s.name) + '</h3>' +
      '    <div class="smeta"><i class="fa-regular fa-circle-user"></i> ' + esc(s.teacher) + '</div>' +
      '    <div class="smeta"><i class="fa-solid fa-book-open"></i> ' + (s.lessons || 0) + ' bài · ' +
      '<i class="fa-regular fa-clock"></i> ' + (s.duration || 0) + ' tuần · ' + esc(s.levelLabel) + '</div>' +
      '  </div>' +
      '  <div class="sched-date">' +
      '    <b><i class="fa-regular fa-calendar"></i> ' + esc(s.dateFmt) + '</b>' +
      '    <span>' + esc(s.dayLabel) + ', ' + esc(s.timeStart) + ' – ' + esc(s.timeEnd) + '</span>' +
      '    <em><i class="fa-solid fa-circle"></i> Còn ' + (s.seatsLeft || 0) + ' chỗ</em>' +
      '  </div>' +
      '  <div class="sched-price">' +
      '    ' + oldPriceTag +
      '    <b>' + fmtMoney(s.price) + '</b>' +
      '    <button class="reg-btn">Đăng ký ngay</button>' +
      '  </div>' +
      '  <button class="sched-heart" aria-label="Lưu"><i class="fa-regular fa-heart"></i></button>' +
      '</div>';
  }

  // ── FILTER CHIPS (theo data-filter level) ──
  const chips = document.querySelectorAll('.sched-chips .chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const f = chip.dataset.filter || 'all';
      listEl.querySelectorAll('.sched-row').forEach(row => {
        row.style.display = (f === 'all' || row.dataset.level === f) ? '' : 'none';
      });
    });
  });

  // ── HEART / LƯU ──
  listEl.querySelectorAll('.sched-heart').forEach(btn => {
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

  // ── ĐĂNG KÝ NGAY → register.html (register page chưa nhận sch-id) ──
  listEl.querySelectorAll('.reg-btn').forEach(btn => {
    btn.addEventListener('click', () => { window.location.href = 'register.html'; });
  });

  // ── PLAY: video xem trước chưa có → toast ──
  listEl.querySelectorAll('.sched-play').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      showToast('Video xem trước đang được cập nhật');
    });
  });

  // ── SF-INPUT / SF-SELECT (placeholder chưa làm) ──
  document.querySelectorAll('.sf-input').forEach(el => {
    el.style.cursor = 'text';
    el.addEventListener('click', () => showToast('Tính năng tìm kiếm sẽ sớm ra mắt!'));
  });
  document.querySelectorAll('.sf-select').forEach(sel => {
    sel.style.cursor = 'pointer';
    sel.addEventListener('click', () => showToast('Bộ lọc sẽ sớm ra mắt!'));
  });

  // ── MINI CALENDAR (đọc events từ rows đã render) ──
  initCalendar();
});

/* Render mini calendar bên sidebar:
   - Đọc event từ các .sched-row (cột ngày khai giảng dạng DD/MM/YYYY)
   - Cho phép chuyển tháng bằng nút ‹ ›
   - Click ngày có khai giảng → scroll + flash row tương ứng */
function initCalendar() {
  const monthLabel = document.getElementById('calMonthLabel') || document.querySelector('.cal-month-nav span');
  const daysWrap   = document.getElementById('calDays') || document.querySelector('.cal-days');
  const navBtns    = document.querySelectorAll('.cal-nav');
  if (!monthLabel || !daysWrap || navBtns.length !== 2) return;

  // Thu thập events từ DOM rows — mỗi event giữ tham chiếu row để scroll/flash
  const events = [];
  document.querySelectorAll('.sched-row').forEach(row => {
    const txt = row.querySelector('.sched-date b')?.textContent || '';
    const m = txt.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (m) events.push({ day: +m[1], month: +m[2], year: +m[3], row });
  });

  // Tháng khởi đầu = tháng của event đầu (nếu có), fallback hôm nay
  const init = events[0]
    ? new Date(events[0].year, events[0].month - 1, 1)
    : new Date();
  let viewY = init.getFullYear();
  let viewM = init.getMonth() + 1; // 1-12

  // Tham chiếu ngày hôm nay để gắn class .today nếu trùng tháng đang xem
  const now = new Date();
  const tD = now.getDate(), tM = now.getMonth() + 1, tY = now.getFullYear();
  const pad2 = n => (n < 10 ? '0' : '') + n;

  function render() {
    monthLabel.textContent = `Tháng ${pad2(viewM)}/${viewY}`;
    const firstDay = new Date(viewY, viewM - 1, 1);
    const daysInMonth = new Date(viewY, viewM, 0).getDate();
    // Lưới bắt đầu T2; getDay(): 0=CN..6=T7 → chuyển 1..7 → 0..6 với offset
    let offset = firstDay.getDay() - 1;
    if (offset < 0) offset = 6;

    // Map ngày-có-khai-giảng của tháng đang xem
    const evMap = {};
    events.forEach(e => {
      if (e.year === viewY && e.month === viewM) evMap[e.day] = e;
    });

    let html = '';
    for (let i = 0; i < offset; i++) html += '<span class="empty"></span>';
    for (let d = 1; d <= daysInMonth; d++) {
      const cls = [];
      if (evMap[d]) cls.push('ev');
      if (d === tD && viewM === tM && viewY === tY) cls.push('today');
      html += `<span class="${cls.join(' ')}" data-day="${d}">${d}</span>`;
    }
    daysWrap.innerHTML = html;
  }

  navBtns[0].addEventListener('click', () => {
    viewM--;
    if (viewM < 1) { viewM = 12; viewY--; }
    render();
  });
  navBtns[1].addEventListener('click', () => {
    viewM++;
    if (viewM > 12) { viewM = 1; viewY++; }
    render();
  });

  // Click ngày có .ev → scroll + flash row tương ứng
  daysWrap.addEventListener('click', e => {
    const cell = e.target.closest('span.ev');
    if (!cell) return;
    const day = +cell.dataset.day;
    const ev = events.find(x => x.day === day && x.month === viewM && x.year === viewY);
    if (!ev) return;
    ev.row.scrollIntoView({ behavior: 'smooth', block: 'center' });
    ev.row.classList.add('sched-row-flash');
    setTimeout(() => ev.row.classList.remove('sched-row-flash'), 1400);
  });

  render();
}
