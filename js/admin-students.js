/* =============================================
   admin-students.js — CRUD học viên
   Dùng cho: admin/students.html
   Phụ thuộc: admin-shared.js
   ============================================= */

(function () {
  'use strict';

  if (!AdminShared.guardSession()) return;
  AdminShared.bindSidebar();
  AdminShared.bindLogout();

  const STORAGE_KEY = 'qsac_admin_students';
  const SEED = [
    { id: 's1', name: 'Nguyễn Văn A',    email: 'nguyenvana@gmail.com', phone: '0901234567', joinedAt: '2026-01-15', coursesCount: 3, status: 'active' },
    { id: 's2', name: 'Lê Thị Hoa',      email: 'lethihoa@gmail.com',   phone: '0912345678', joinedAt: '2026-02-10', coursesCount: 2, status: 'active' },
    { id: 's3', name: 'Phạm Quang Đạt',  email: 'pqdat@gmail.com',      phone: '0923456789', joinedAt: '2026-03-05', coursesCount: 1, status: 'active' },
    { id: 's4', name: 'Trần Bích Ngọc',  email: 'tbngoc@gmail.com',     phone: '0934567890', joinedAt: '2026-03-22', coursesCount: 4, status: 'active' },
    { id: 's5', name: 'Vũ Minh Hoàng',   email: 'vmhoang@gmail.com',    phone: '0945678901', joinedAt: '2026-04-01', coursesCount: 2, status: 'locked' },
    { id: 's6', name: 'Đỗ Hải Anh',      email: 'dhanh@gmail.com',      phone: '0956789012', joinedAt: '2026-04-18', coursesCount: 1, status: 'active' },
    { id: 's7', name: 'Hoàng Mai Linh',  email: 'hmlinh@gmail.com',     phone: '0967890123', joinedAt: '2026-05-02', coursesCount: 5, status: 'active' },
    { id: 's8', name: 'Bùi Thanh Tùng',  email: 'bttung@gmail.com',     phone: '0978901234', joinedAt: '2026-05-20', coursesCount: 0, status: 'active' },
  ];

  const tbody = document.getElementById('dataBody');
  const empty = document.getElementById('emptyState');
  const countEl = document.getElementById('rowCount');
  const searchEl = document.getElementById('searchInput');
  const filterSt = document.getElementById('filterStatus');
  const form = document.getElementById('dataForm');
  const formTitle = document.getElementById('formTitle');
  // View modal refs
  const viewBody = document.getElementById('viewBody');
  const viewLockBtn = document.getElementById('viewLockBtn');
  const viewLockLabel = document.getElementById('viewLockLabel');
  const viewEditBtn = document.getElementById('viewEditBtn');

  let data = AdminShared.loadData(STORAGE_KEY, SEED);
  let editingId = null;
  let viewingId = null;

  function render() {
    const q = (searchEl.value || '').trim().toLowerCase();
    const st = filterSt.value;
    const filtered = data.filter(function (r) {
      if (st && r.status !== st) return false;
      if (q && !((r.name + ' ' + r.email + ' ' + r.phone).toLowerCase().includes(q))) return false;
      return true;
    });
    countEl.textContent = filtered.length + ' học viên';

    if (!filtered.length) { tbody.innerHTML = ''; empty.hidden = false; return; }
    empty.hidden = true;

    const esc = AdminShared.escapeHtml;
    tbody.innerHTML = filtered.map(function (r) {
      const pill = r.status === 'active'
        ? '<span class="adm-pill ok">Hoạt động</span>'
        : '<span class="adm-pill cancel">Đã khoá</span>';
      return '' +
        '<tr>' +
        '  <td><b>' + esc(r.name) + '</b></td>' +
        '  <td>' + esc(r.email) + '</td>' +
        '  <td>' + esc(r.phone) + '</td>' +
        '  <td>' + esc(r.joinedAt) + '</td>' +
        '  <td>' + (r.coursesCount || 0) + '</td>' +
        '  <td>' + pill + '</td>' +
        '  <td>' +
        '    <div class="adm-row-actions">' +
        '      <button class="adm-icon-btn" data-view="' + r.id + '" title="Xem"><i class="fa-solid fa-eye"></i></button>' +
        '      <button class="adm-icon-btn" data-edit="' + r.id + '" title="Sửa"><i class="fa-solid fa-pen"></i></button>' +
        '      <button class="adm-icon-btn danger" data-del="' + r.id + '" title="Xoá"><i class="fa-solid fa-trash"></i></button>' +
        '    </div>' +
        '  </td>' +
        '</tr>';
    }).join('');
  }

  function openCreate() {
    editingId = null;
    formTitle.textContent = 'Thêm học viên';
    form.reset();
    clearErrors();
    // Mặc định ngày tham gia = hôm nay
    form.elements.joinedAt.value = new Date().toISOString().slice(0, 10);
    AdminShared.openModal('formModal');
  }
  function openEdit(id) {
    const r = data.find(function (x) { return x.id === id; });
    if (!r) return;
    editingId = id;
    formTitle.textContent = 'Sửa học viên';
    clearErrors();
    Object.keys(r).forEach(function (k) {
      const f = form.elements[k]; if (f) f.value = r[k];
    });
    AdminShared.openModal('formModal');
  }

  // ── Modal Xem: render hồ sơ + cập nhật nút Khoá/Mở khoá theo trạng thái ──
  function openView(id) {
    const r = data.find(function (x) { return x.id === id; });
    if (!r) return;
    viewingId = id;
    const esc = AdminShared.escapeHtml;
    const initial = esc((r.name || '?').charAt(0).toUpperCase());
    const pill = r.status === 'active'
      ? '<span class="adm-pill ok">Hoạt động</span>'
      : '<span class="adm-pill cancel">Đã khoá</span>';
    // Layout đơn giản: head (avatar + tên + status) + dl info grid
    viewBody.innerHTML =
      '<div style="display:flex;gap:14px;align-items:center;margin-bottom:18px">' +
      '  <span style="width:56px;height:56px;border-radius:50%;background:var(--adm-primary,#075fe2);color:#fff;display:grid;place-items:center;font-weight:700;font-size:22px">' + initial + '</span>' +
      '  <div>' +
      '    <h3 style="margin:0 0 6px;font-size:18px">' + esc(r.name) + '</h3>' +
      '    ' + pill +
      '  </div>' +
      '</div>' +
      '<dl style="display:grid;grid-template-columns:1fr 1fr;gap:12px 18px;margin:0">' +
      '  <div><dt style="font-size:12px;color:var(--adm-muted,#64748b);margin-bottom:2px">Email</dt><dd style="margin:0;font-weight:600">' + esc(r.email) + '</dd></div>' +
      '  <div><dt style="font-size:12px;color:var(--adm-muted,#64748b);margin-bottom:2px">Điện thoại</dt><dd style="margin:0;font-weight:600">' + esc(r.phone) + '</dd></div>' +
      '  <div><dt style="font-size:12px;color:var(--adm-muted,#64748b);margin-bottom:2px">Ngày tham gia</dt><dd style="margin:0;font-weight:600">' + esc(r.joinedAt || '—') + '</dd></div>' +
      '  <div><dt style="font-size:12px;color:var(--adm-muted,#64748b);margin-bottom:2px">Khoá đã học</dt><dd style="margin:0;font-weight:600">' + (r.coursesCount || 0) + '</dd></div>' +
      '</dl>';
    updateLockBtn(r.status);
    AdminShared.openModal('viewModal');
  }

  // Đổi nhãn + style nút lock theo status: active → "Khoá tài khoản" (đỏ); locked → "Mở khoá" (xanh)
  function updateLockBtn(status) {
    if (status === 'locked') {
      viewLockBtn.className = 'adm-btn-primary';
      viewLockBtn.querySelector('i').className = 'fa-solid fa-lock-open';
      viewLockLabel.textContent = 'Mở khoá';
    } else {
      viewLockBtn.className = 'adm-btn-primary danger';
      viewLockBtn.querySelector('i').className = 'fa-solid fa-lock';
      viewLockLabel.textContent = 'Khoá tài khoản';
    }
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
      email: (fd.get('email') || '').toString().trim(),
      phone: (fd.get('phone') || '').toString().trim(),
      joinedAt: fd.get('joinedAt') || '',
      coursesCount: Number(fd.get('coursesCount')) || 0,
      status: fd.get('status') || 'active',
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
    // Regex email cơ bản — đủ cho client validate, server vẫn check kỹ
    if (!obj.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(obj.email)) setErr('email', 'Email không hợp lệ');
    if (!obj.phone || !/^[0-9+\-\s]{8,15}$/.test(obj.phone)) setErr('phone', 'Số điện thoại không hợp lệ');
    if (!obj.joinedAt) setErr('joinedAt', 'Chọn ngày tham gia');
    return ok ? obj : null;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const obj = validate();
    if (!obj) return;
    if (editingId) {
      const idx = data.findIndex(function (x) { return x.id === editingId; });
      if (idx >= 0) data[idx] = Object.assign({}, data[idx], obj);
      AdminShared.toast('Đã cập nhật học viên');
    } else {
      data.unshift(Object.assign({ id: AdminShared.uid() }, obj));
      AdminShared.toast('Đã thêm học viên mới');
    }
    AdminShared.saveData(STORAGE_KEY, data);
    AdminShared.closeModal('formModal');
    render();
  });

  document.getElementById('btnAdd').addEventListener('click', openCreate);

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
        title: 'Xoá học viên',
        message: 'Xoá học viên "' + (row ? row.name : '') + '"?',
        okText: 'Xoá', okClass: 'danger',
        onOk: function () {
          data = data.filter(function (x) { return x.id !== id; });
          AdminShared.saveData(STORAGE_KEY, data);
          render();
          AdminShared.toast('Đã xoá học viên', 'warn');
        }
      });
    }
  });

  // Sửa hồ sơ từ modal Xem → đóng view, mở edit
  viewEditBtn.addEventListener('click', function () {
    if (!viewingId) return;
    AdminShared.closeModal('viewModal');
    openEdit(viewingId);
  });

  // Khoá / Mở khoá tài khoản từ modal Xem
  // Confirm trước khi khoá (hành động ảnh hưởng quyền truy cập của HV)
  viewLockBtn.addEventListener('click', function () {
    if (!viewingId) return;
    const idx = data.findIndex(function (x) { return x.id === viewingId; });
    if (idx < 0) return;
    const cur = data[idx];
    const willLock = cur.status !== 'locked';
    AdminShared.confirmDialog({
      title: willLock ? 'Khoá tài khoản học viên' : 'Mở khoá tài khoản học viên',
      message: willLock
        ? 'Khoá tài khoản "' + cur.name + '"? Học viên sẽ không thể truy cập khoá học cho tới khi được mở khoá.'
        : 'Mở khoá tài khoản "' + cur.name + '"? Học viên sẽ truy cập trở lại bình thường.',
      okText: willLock ? 'Khoá' : 'Mở khoá',
      okClass: willLock ? 'danger' : '',
      onOk: function () {
        data[idx].status = willLock ? 'locked' : 'active';
        AdminShared.saveData(STORAGE_KEY, data);
        updateLockBtn(data[idx].status);
        // Đồng bộ pill trạng thái ngay trong modal đang mở
        const pillEl = viewBody.querySelector('.adm-pill');
        if (pillEl) {
          pillEl.className = 'adm-pill ' + (willLock ? 'cancel' : 'ok');
          pillEl.textContent = willLock ? 'Đã khoá' : 'Hoạt động';
        }
        render();
        AdminShared.toast(willLock ? 'Đã khoá tài khoản' : 'Đã mở khoá tài khoản', willLock ? 'warn' : 'ok');
      }
    });
  });

  let t;
  searchEl.addEventListener('input', function () { clearTimeout(t); t = setTimeout(render, 150); });
  filterSt.addEventListener('change', render);

  render();
})();
