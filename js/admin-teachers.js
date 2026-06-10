/* =============================================
   admin-teachers.js — CRUD giảng viên + sort + pagination + view detail
   Dùng cho: admin/teachers.html
   Phụ thuộc: admin-shared.js (AdminShared)
   Tính năng:
   - CRUD: thêm/sửa/xoá, validate
   - Lọc theo chuyên môn + trạng thái + search
   - Sort theo tên/rating/số khoá (click header)
   - Phân trang 10 dòng/trang
   - View modal hiển thị hồ sơ chi tiết + danh sách khoá học liên kết
     (đếm từ qsac_admin_courses theo so khớp tên giảng viên)
   ============================================= */

(function () {
  'use strict';

  if (!AdminShared.guardSession()) return;
  AdminShared.bindSidebar();
  AdminShared.bindLogout();

  const STORAGE_KEY = 'qsac_admin_teachers';
  const COURSES_KEY = 'qsac_admin_courses';
  const PAGE_SIZE = 10;

  // Seed dữ liệu mẫu — đã bổ sung avatar/experience/status/joinedAt/bio
  const SEED = [
    { id: 't1', name: 'Trần Thị Hà',      title: 'ThS. TMĐT',         expertise: 'basic',      email: 'tranha@qsac.vn',  phone: '0901111222', experience: 8,  rating: 4.8, status: 'active',   joinedAt: '2022-03-15', avatar: '', bio: 'Giảng viên cơ hữu, chuyên đào tạo TMĐT cho người mới bắt đầu.' },
    { id: 't2', name: 'Lê Văn Bình',      title: 'Chuyên gia Shopee', expertise: 'advanced',   email: 'levbinh@qsac.vn', phone: '0902222333', experience: 6,  rating: 4.9, status: 'active',   joinedAt: '2022-06-01', avatar: '', bio: 'Hơn 6 năm kinh nghiệm vận hành shop top trên Shopee.' },
    { id: 't3', name: 'Phạm Minh Tuấn',   title: 'PhD. Marketing số', expertise: 'marketing',  email: 'pmtuan@qsac.vn',  phone: '0903333444', experience: 10, rating: 4.7, status: 'active',   joinedAt: '2021-09-10', avatar: '', bio: 'Tiến sĩ Marketing, từng tư vấn cho nhiều thương hiệu lớn.' },
    { id: 't4', name: 'Nguyễn Thu Hương', title: 'Luật sư TMĐT',      expertise: 'legal',      email: 'nthuong@qsac.vn', phone: '0904444555', experience: 12, rating: 4.8, status: 'active',   joinedAt: '2021-05-20', avatar: '', bio: 'Luật sư chuyên trách hợp đồng TMĐT và pháp lý số.' },
    { id: 't5', name: 'Đỗ Quang Huy',     title: 'CEO sàn TMĐT',      expertise: 'operations', email: 'dqhuy@qsac.vn',   phone: '0905555666', experience: 9,  rating: 4.9, status: 'active',   joinedAt: '2022-01-08', avatar: '', bio: 'Founder một sàn TMĐT khu vực, chia sẻ kinh nghiệm vận hành.' },
    { id: 't6', name: 'Trần Đức Long',    title: 'Quản lý Logistics', expertise: 'basic',      email: 'tdlong@qsac.vn',  phone: '0906666777', experience: 7,  rating: 4.6, status: 'inactive', joinedAt: '2023-02-14', avatar: '', bio: 'Chuyên gia logistics, từng làm chuỗi cung ứng cho 3 sàn lớn.' },
    { id: 't7', name: 'Vũ Thị Mai',       title: 'Brand Strategist',  expertise: 'advanced',   email: 'vtmai@qsac.vn',   phone: '0907777888', experience: 8,  rating: 4.8, status: 'active',   joinedAt: '2022-11-05', avatar: '', bio: 'Xây dựng và phát triển thương hiệu online cho doanh nghiệp SME.' },
    { id: 't8', name: 'Ngô Thành Nam',    title: 'Data Analyst',      expertise: 'data',       email: 'ntnam@qsac.vn',   phone: '0908888999', experience: 5,  rating: 4.9, status: 'pending',  joinedAt: '2025-04-22', avatar: '', bio: 'Phân tích dữ liệu kinh doanh TMĐT, chuyên BI và dashboard.' },
  ];

  const EXP_LABELS = {
    basic: 'TMĐT cơ bản', advanced: 'Bán hàng nâng cao', marketing: 'Marketing số',
    legal: 'Pháp lý', operations: 'Vận hành', data: 'Phân tích dữ liệu',
  };
  const STATUS_LABELS = { active: 'Đang hợp tác', inactive: 'Tạm nghỉ', pending: 'Chờ duyệt' };
  const STATUS_CLASS  = { active: 'ok',           inactive: 'mute',     pending: 'warn' };

  // ── DOM refs (query 1 lần) ──
  const tbody = document.getElementById('dataBody');
  const empty = document.getElementById('emptyState');
  const countEl = document.getElementById('rowCount');
  const searchEl = document.getElementById('searchInput');
  const filterExp = document.getElementById('filterExpertise');
  const filterSt = document.getElementById('filterStatus');
  const form = document.getElementById('dataForm');
  const formTitle = document.getElementById('formTitle');
  const pager = document.getElementById('pager');
  const pgPrev = document.getElementById('pgPrev');
  const pgNext = document.getElementById('pgNext');
  const pgNums = document.getElementById('pgNums');
  const pgInfo = document.getElementById('pgInfo');
  const viewBody = document.getElementById('viewBody');
  const viewEditBtn = document.getElementById('viewEditBtn');

  let data = AdminShared.loadData(STORAGE_KEY, SEED);
  let editingId = null;
  let viewingId = null;
  let sortKey = 'name';   // name | rating | coursesCount
  let sortDir = 'asc';    // asc | desc
  let page = 1;

  // ── Liên kết với khoá học: đếm số khoá GV đang phụ trách ──
  // Logic: course.teacher là chuỗi (vd "GV. Trần Thị Hà"); so khớp khi chứa tên GV.
  function getCoursesByTeacher(teacherName) {
    const courses = AdminShared.loadData(COURSES_KEY, []);
    if (!teacherName || !courses.length) return [];
    const needle = teacherName.toLowerCase();
    return courses.filter(function (c) {
      return (c.teacher || '').toLowerCase().includes(needle);
    });
  }

  // Đếm courses cho 1 GV (đọc cache để render bảng không phải scan nhiều lần)
  let coursesCache = null;
  function rebuildCoursesCache() {
    const courses = AdminShared.loadData(COURSES_KEY, []);
    coursesCache = {};
    data.forEach(function (t) {
      const n = (t.name || '').toLowerCase();
      coursesCache[t.id] = courses.filter(function (c) {
        return (c.teacher || '').toLowerCase().includes(n);
      });
    });
  }
  function coursesCount(t) {
    if (!coursesCache) rebuildCoursesCache();
    return (coursesCache[t.id] || []).length;
  }

  // ── Lọc + sort + paginate ──
  function applyFilter() {
    const q = (searchEl.value || '').trim().toLowerCase();
    const exp = filterExp.value;
    const st = filterSt.value;
    return data.filter(function (r) {
      if (exp && r.expertise !== exp) return false;
      if (st && r.status !== st) return false;
      if (q && !((r.name + ' ' + r.title + ' ' + r.email).toLowerCase().includes(q))) return false;
      return true;
    });
  }
  function applySort(rows) {
    const dir = sortDir === 'asc' ? 1 : -1;
    return rows.slice().sort(function (a, b) {
      let va, vb;
      if (sortKey === 'coursesCount') { va = coursesCount(a); vb = coursesCount(b); }
      else if (sortKey === 'rating')  { va = Number(a.rating) || 0; vb = Number(b.rating) || 0; }
      else                            { va = (a.name || '').toLowerCase(); vb = (b.name || '').toLowerCase(); }
      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return 0;
    });
  }

  // ── Render bảng + pager ──
  function render() {
    rebuildCoursesCache();
    const filtered = applySort(applyFilter());
    countEl.textContent = filtered.length + ' giảng viên';

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    if (page > totalPages) page = totalPages;
    const start = (page - 1) * PAGE_SIZE;
    const slice = filtered.slice(start, start + PAGE_SIZE);

    if (!filtered.length) { tbody.innerHTML = ''; empty.hidden = false; renderPager(0, 1); return; }
    empty.hidden = true;

    const esc = AdminShared.escapeHtml;
    tbody.innerHTML = slice.map(function (r) {
      const cls = STATUS_CLASS[r.status] || 'mute';
      const label = STATUS_LABELS[r.status] || 'Chưa rõ';
      const cnt = coursesCount(r);
      // Avatar: nếu có URL → ảnh + fallback chữ cái ẩn; ảnh lỗi → onerror lộ fallback
      const initial = esc((r.name || '?').charAt(0).toUpperCase());
      const avatar = r.avatar
        ? '<img class="tv-avatar" src="' + esc(r.avatar) + '" alt="" loading="lazy" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'grid\'" />' +
          '<span class="tv-avatar tv-avatar-fb" style="display:none">' + initial + '</span>'
        : '<span class="tv-avatar tv-avatar-fb">' + initial + '</span>';
      return '' +
        '<tr>' +
        '  <td>' + avatar + '</td>' +
        '  <td><b>' + esc(r.name) + '</b><br><small style="color:var(--adm-muted)">' + (Number(r.experience) || 0) + ' năm KN</small></td>' +
        '  <td>' + esc(r.title) + '</td>' +
        '  <td><small>' + esc(r.email) + '<br>' + esc(r.phone) + '</small></td>' +
        '  <td>' + esc(EXP_LABELS[r.expertise] || r.expertise) + '</td>' +
        '  <td><b>' + cnt + '</b></td>' +
        '  <td><b style="color:var(--adm-warn)">★ ' + (r.rating || 0) + '</b></td>' +
        '  <td><span class="adm-pill ' + cls + '">' + label + '</span></td>' +
        '  <td>' +
        '    <div class="adm-row-actions">' +
        '      <button class="adm-icon-btn" data-view="' + r.id + '" title="Xem"><i class="fa-solid fa-eye"></i></button>' +
        '      <button class="adm-icon-btn" data-edit="' + r.id + '" title="Sửa"><i class="fa-solid fa-pen"></i></button>' +
        '      <button class="adm-icon-btn danger" data-del="' + r.id + '" title="Xoá"><i class="fa-solid fa-trash"></i></button>' +
        '    </div>' +
        '  </td>' +
        '</tr>';
    }).join('');

    renderPager(filtered.length, totalPages);
    renderSortIcons();
  }

  // Render nút trang + info "x-y / total"
  function renderPager(total, totalPages) {
    if (total <= PAGE_SIZE) { pager.hidden = true; return; }
    pager.hidden = false;
    // Tối đa 5 nút số quanh trang hiện tại
    const nums = [];
    const win = 2;
    let from = Math.max(1, page - win);
    let to = Math.min(totalPages, page + win);
    if (from > 1) nums.push(1, from > 2 ? '…' : null);
    for (let i = from; i <= to; i++) nums.push(i);
    if (to < totalPages) nums.push(to < totalPages - 1 ? '…' : null, totalPages);
    pgNums.innerHTML = nums.filter(Boolean).map(function (n) {
      if (n === '…') return '<span class="tv-pg-dots">…</span>';
      return '<button class="tv-pg-num' + (n === page ? ' active' : '') + '" data-pg="' + n + '">' + n + '</button>';
    }).join('');
    pgPrev.disabled = page <= 1;
    pgNext.disabled = page >= totalPages;
    const start = (page - 1) * PAGE_SIZE + 1;
    const end = Math.min(total, page * PAGE_SIZE);
    pgInfo.textContent = start + '–' + end + ' / ' + total;
  }

  // Đổi icon sort theo state hiện tại
  function renderSortIcons() {
    document.querySelectorAll('.tv-sortable').forEach(function (th) {
      const key = th.dataset.sort;
      const ico = th.querySelector('.tv-sort-ico');
      if (!ico) return;
      ico.className = 'fa-solid tv-sort-ico ' + (
        key === sortKey ? (sortDir === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : 'fa-sort'
      );
      th.classList.toggle('active', key === sortKey);
    });
  }

  // ── Form mở thêm / sửa ──
  function openCreate() {
    editingId = null;
    formTitle.textContent = 'Thêm giảng viên';
    form.reset();
    clearErrors();
    form.elements.rating.value = '4.8';
    form.elements.status.value = 'active';
    form.elements.joinedAt.value = new Date().toISOString().slice(0, 10);
    AdminShared.openModal('formModal');
  }
  function openEdit(id) {
    const r = data.find(function (x) { return x.id === id; });
    if (!r) return;
    editingId = id;
    formTitle.textContent = 'Sửa giảng viên';
    clearErrors();
    Object.keys(r).forEach(function (k) {
      const f = form.elements[k]; if (f) f.value = r[k] == null ? '' : r[k];
    });
    AdminShared.openModal('formModal');
  }
  function clearErrors() {
    form.querySelectorAll('.err').forEach(function (e) { e.textContent = ''; });
    form.querySelectorAll('.invalid').forEach(function (e) { e.classList.remove('invalid'); });
  }

  function validate() {
    clearErrors();
    const fd = new FormData(form);
    const obj = {
      name: (fd.get('name') || '').toString().trim(),
      title: (fd.get('title') || '').toString().trim(),
      expertise: fd.get('expertise') || '',
      email: (fd.get('email') || '').toString().trim(),
      phone: (fd.get('phone') || '').toString().trim(),
      experience: Number(fd.get('experience')) || 0,
      status: fd.get('status') || 'active',
      joinedAt: (fd.get('joinedAt') || '').toString(),
      rating: Number(fd.get('rating')) || 0,
      avatar: (fd.get('avatar') || '').toString().trim(),
      bio: (fd.get('bio') || '').toString().trim(),
    };
    let ok = true;
    const setErr = function (name, msg) {
      const errEl = form.querySelector('[data-err="' + name + '"]');
      const inp = form.elements[name];
      if (errEl) errEl.textContent = msg;
      if (inp) inp.classList.add('invalid');
      ok = false;
    };
    if (!obj.name) setErr('name', 'Nhập họ tên');
    if (!obj.title) setErr('title', 'Nhập chức danh');
    if (!obj.expertise) setErr('expertise', 'Chọn chuyên môn');
    if (!obj.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(obj.email)) setErr('email', 'Email không hợp lệ');
    if (!obj.phone || !/^[0-9+\-\s]{8,15}$/.test(obj.phone)) setErr('phone', 'Số điện thoại không hợp lệ');
    return ok ? obj : null;
  }

  // ── View modal: render chi tiết + danh sách khoá học liên kết ──
  function openView(id) {
    const r = data.find(function (x) { return x.id === id; });
    if (!r) return;
    viewingId = id;
    const esc = AdminShared.escapeHtml;
    const courses = getCoursesByTeacher(r.name);
    const cls = STATUS_CLASS[r.status] || 'mute';
    const label = STATUS_LABELS[r.status] || 'Chưa rõ';
    const avatar = r.avatar
      ? '<img src="' + esc(r.avatar) + '" alt="" class="tv-view-ava" />'
      : '<span class="tv-view-ava tv-avatar-fb">' + esc((r.name || '?').charAt(0).toUpperCase()) + '</span>';
    const coursesHtml = courses.length
      ? courses.map(function (c) {
          return '<li><b>' + esc(c.name) + '</b>' +
            ' <small style="color:var(--adm-muted)">— ' + AdminShared.formatMoney(c.price) +
            ' · ' + (c.lessons || 0) + ' bài</small></li>';
        }).join('')
      : '<li class="tv-view-empty">Chưa có khoá học nào gán cho giảng viên này.</li>';

    viewBody.innerHTML =
      '<div class="tv-view-head">' +
      '  ' + avatar +
      '  <div>' +
      '    <h3>' + esc(r.name) + '</h3>' +
      '    <p>' + esc(r.title) + '</p>' +
      '    <span class="adm-pill ' + cls + '">' + label + '</span>' +
      '  </div>' +
      '</div>' +
      '<dl class="tv-view-grid">' +
      '  <div><dt>Chuyên môn</dt><dd>' + esc(EXP_LABELS[r.expertise] || r.expertise) + '</dd></div>' +
      '  <div><dt>Email</dt><dd>' + esc(r.email) + '</dd></div>' +
      '  <div><dt>Điện thoại</dt><dd>' + esc(r.phone) + '</dd></div>' +
      '  <div><dt>Kinh nghiệm</dt><dd>' + (r.experience || 0) + ' năm</dd></div>' +
      '  <div><dt>Rating</dt><dd>★ ' + (r.rating || 0) + '</dd></div>' +
      '  <div><dt>Ngày tham gia</dt><dd>' + esc(r.joinedAt || '—') + '</dd></div>' +
      '</dl>' +
      (r.bio ? '<div class="tv-view-bio"><h4>Giới thiệu</h4><p>' + esc(r.bio) + '</p></div>' : '') +
      '<div class="tv-view-courses"><h4>Khoá học phụ trách (' + courses.length + ')</h4><ul>' + coursesHtml + '</ul></div>';

    AdminShared.openModal('viewModal');
  }

  // ── Bind events ──
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const obj = validate();
    if (!obj) return;
    if (editingId) {
      const idx = data.findIndex(function (x) { return x.id === editingId; });
      if (idx >= 0) data[idx] = Object.assign({}, data[idx], obj);
      AdminShared.toast('Đã cập nhật giảng viên');
    } else {
      data.unshift(Object.assign({ id: AdminShared.uid() }, obj));
      AdminShared.toast('Đã thêm giảng viên mới');
    }
    AdminShared.saveData(STORAGE_KEY, data);
    AdminShared.closeModal('formModal');
    render();
  });

  document.getElementById('btnAdd').addEventListener('click', openCreate);

  // Click vào nút trong row
  tbody.addEventListener('click', function (e) {
    const viewBtn = e.target.closest('[data-view]');
    if (viewBtn) { openView(viewBtn.dataset.view); return; }
    const editBtn = e.target.closest('[data-edit]');
    if (editBtn) { openEdit(editBtn.dataset.edit); return; }
    const delBtn = e.target.closest('[data-del]');
    if (delBtn) {
      const id = delBtn.dataset.del;
      const row = data.find(function (x) { return x.id === id; });
      AdminShared.confirmDialog({
        title: 'Xoá giảng viên',
        message: 'Xoá giảng viên ' + (row ? row.name : '') + '?',
        okText: 'Xoá', okClass: 'danger',
        onOk: function () {
          data = data.filter(function (x) { return x.id !== id; });
          AdminShared.saveData(STORAGE_KEY, data);
          render();
          AdminShared.toast('Đã xoá giảng viên', 'warn');
        }
      });
    }
  });

  // Sort header: click đổi chiều nếu cùng cột, đổi cột nếu khác
  document.querySelectorAll('.tv-sortable').forEach(function (th) {
    th.addEventListener('click', function () {
      const key = th.dataset.sort;
      if (sortKey === key) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
      else { sortKey = key; sortDir = 'asc'; }
      page = 1;
      render();
    });
  });

  // Pagination buttons
  pgPrev.addEventListener('click', function () { if (page > 1) { page--; render(); } });
  pgNext.addEventListener('click', function () { page++; render(); });
  pgNums.addEventListener('click', function (e) {
    const b = e.target.closest('[data-pg]');
    if (!b) return;
    page = Number(b.dataset.pg) || 1;
    render();
  });

  // Sửa hồ sơ từ view modal
  viewEditBtn.addEventListener('click', function () {
    if (!viewingId) return;
    AdminShared.closeModal('viewModal');
    openEdit(viewingId);
  });

  // Search/filter: reset về trang 1 khi đổi bộ lọc
  let t;
  searchEl.addEventListener('input', function () {
    clearTimeout(t); t = setTimeout(function () { page = 1; render(); }, 150);
  });
  filterExp.addEventListener('change', function () { page = 1; render(); });
  filterSt.addEventListener('change', function () { page = 1; render(); });

  render();
})();
