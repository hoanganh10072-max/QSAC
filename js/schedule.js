/* =============================================
   schedule.js — Trang lịch khai giảng
   Phụ thuộc: public-data.js (PublicData)
   Luồng: PublicData.getSchedule() → render rows → bind events → init calendar
   Filter: state.level (chip) + state.date (calendar) — applyFilters() gộp 2 nguồn
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
const pad2 = n => (n < 10 ? '0' : '') + n;

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

  // ── STATE + BANNER + APPLY FILTERS ──
  // State gộp 2 nguồn filter: level chip + ngày calendar
  let cal = null;
  const state = { level: 'all', date: null }; // date: {day, month, year} | null

  const filterInfo = document.createElement('div');
  filterInfo.className = 'sched-date-filter-info';
  filterInfo.style.display = 'none';
  listEl.parentNode.insertBefore(filterInfo, listEl);

  function applyFilters() {
    let visible = 0;
    listEl.querySelectorAll('.sched-row').forEach(row => {
      const okLevel = state.level === 'all' || row.dataset.level === state.level;
      let okDate = true;
      if (state.date) {
        const txt = row.querySelector('.sched-date b')?.textContent || '';
        const m = txt.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
        okDate = !!m && +m[1] === state.date.day && +m[2] === state.date.month && +m[3] === state.date.year;
      }
      const show = okLevel && okDate;
      row.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    // Banner thông báo lọc theo ngày
    if (state.date) {
      const ds = pad2(state.date.day) + '/' + pad2(state.date.month) + '/' + state.date.year;
      filterInfo.innerHTML =
        '<span><i class="fa-regular fa-calendar"></i> Đang lọc theo ngày <b>' + ds + '</b> · ' + visible + ' khoá học</span>' +
        '<button class="sched-clear-date">Xoá lọc <i class="fa-solid fa-xmark"></i></button>';
      filterInfo.style.display = '';
    } else {
      filterInfo.innerHTML = '';
      filterInfo.style.display = 'none';
    }

    // Empty state nội dòng khi không có row nào match
    let emptyEl = listEl.querySelector('.sched-empty');
    if (visible === 0 && schedules.length) {
      if (!emptyEl) {
        emptyEl = document.createElement('p');
        emptyEl.className = 'sched-empty';
        emptyEl.style.cssText = 'text-align:center;padding:30px;color:#64748b;font-size:13px;margin:0;';
        listEl.appendChild(emptyEl);
      }
      emptyEl.textContent = state.date
        ? 'Không có khoá học nào khai giảng vào ngày đã chọn.'
        : 'Không có khoá học khớp bộ lọc.';
      emptyEl.style.display = '';
    } else if (emptyEl) {
      emptyEl.style.display = 'none';
    }
  }

  // Xoá lọc ngày từ banner
  filterInfo.addEventListener('click', e => {
    if (!e.target.closest('.sched-clear-date')) return;
    state.date = null;
    if (cal) cal.rerender();
    applyFilters();
  });

  // ── FILTER CHIPS (theo data-filter level) ──
  const chips = document.querySelectorAll('.sched-chips .chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.level = chip.dataset.filter || 'all';
      applyFilters();
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

  // ── ĐĂNG KÝ NGAY → register.html ──
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

  // ── MINI CALENDAR ──
  // Click ngày có khai giảng → set state.date → applyFilters lọc list bên trái.
  // Click lại đúng ngày đang chọn → bỏ lọc.
  cal = initCalendar({
    getSelectedDate: () => state.date,
    onDayClick: (date) => {
      const same = state.date
        && state.date.day === date.day
        && state.date.month === date.month
        && state.date.year === date.year;
      state.date = same ? null : date;
      applyFilters();
    }
  });
});

/* Render mini calendar bên sidebar.
   opts.getSelectedDate() → trả {day,month,year}|null để mark class .selected
   opts.onDayClick(date)  → gọi khi click ngày có khai giảng
   Trả {rerender} để parent có thể yêu cầu vẽ lại (vd: khi clear filter) */
function initCalendar(opts) {
  opts = opts || {};
  const monthLabel = document.getElementById('calMonthLabel');
  const daysWrap   = document.getElementById('calDays');
  const navBtns    = document.querySelectorAll('.cal-nav');
  if (!monthLabel || !daysWrap || navBtns.length !== 2) return null;

  // Thu thập events từ DOM rows
  const events = [];
  document.querySelectorAll('.sched-row').forEach(row => {
    const txt = row.querySelector('.sched-date b')?.textContent || '';
    const m = txt.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (m) events.push({ day: +m[1], month: +m[2], year: +m[3] });
  });

  const init = events[0]
    ? new Date(events[0].year, events[0].month - 1, 1)
    : new Date();
  let viewY = init.getFullYear();
  let viewM = init.getMonth() + 1;

  const now = new Date();
  const tD = now.getDate(), tM = now.getMonth() + 1, tY = now.getFullYear();
  const p2 = n => (n < 10 ? '0' : '') + n;

  function render() {
    monthLabel.textContent = `Tháng ${p2(viewM)}/${viewY}`;
    const firstDay = new Date(viewY, viewM - 1, 1);
    const daysInMonth = new Date(viewY, viewM, 0).getDate();
    let offset = firstDay.getDay() - 1;
    if (offset < 0) offset = 6;

    const evSet = new Set();
    events.forEach(e => { if (e.year === viewY && e.month === viewM) evSet.add(e.day); });
    const sel = opts.getSelectedDate ? opts.getSelectedDate() : null;

    let html = '';
    for (let i = 0; i < offset; i++) html += '<span class="empty"></span>';
    for (let d = 1; d <= daysInMonth; d++) {
      const cls = [];
      if (evSet.has(d)) cls.push('ev');
      if (d === tD && viewM === tM && viewY === tY) cls.push('today');
      if (sel && sel.day === d && sel.month === viewM && sel.year === viewY) cls.push('selected');
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

  daysWrap.addEventListener('click', e => {
    const cell = e.target.closest('span.ev');
    if (!cell) return;
    const day = +cell.dataset.day;
    if (opts.onDayClick) opts.onDayClick({ day, month: viewM, year: viewY });
    render();
  });

  render();
  return { rerender: render };
}
