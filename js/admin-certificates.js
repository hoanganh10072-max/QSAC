/* =============================================
   admin-certificates.js — CRUD chứng chỉ
   Dùng cho: admin/certificates.html
   ============================================= */

(function () {
  'use strict';

  if (!AdminShared.guardSession()) return;
  AdminShared.bindSidebar();
  AdminShared.bindLogout();

  const STORAGE_KEY = 'qsac_admin_certificates';
  const SEED = [
    { id: 'k1', code: 'QSAC-2026-0001', student: 'Nguyễn Văn A',   course: 'Nhập môn TMĐT',           level: 'red',   issuedAt: '2026-03-15', status: 'valid' },
    { id: 'k2', code: 'QSAC-2026-0002', student: 'Lê Thị Hoa',     course: 'Shopee & Lazada',         level: 'green', issuedAt: '2026-04-02', status: 'valid' },
    { id: 'k3', code: 'QSAC-2026-0003', student: 'Phạm Quang',     course: 'Marketing số & SEO',      level: 'green', issuedAt: '2026-04-20', status: 'valid' },
    { id: 'k4', code: 'QSAC-2026-0004', student: 'Trần Bích Ngọc', course: 'Vận hành sàn TMĐT A–Z',    level: 'gold',  issuedAt: '2026-05-10', status: 'valid' },
    { id: 'k5', code: 'QSAC-2026-0005', student: 'Vũ Minh',        course: 'Phân tích dữ liệu TMĐT',  level: 'gold',  issuedAt: '2026-05-18', status: 'revoked' },
    { id: 'k6', code: 'QSAC-2026-0006', student: 'Đỗ Hải Anh',     course: 'Pháp lý TMĐT',            level: 'red',   issuedAt: '2026-05-28', status: 'valid' },
  ];

  const LEVEL_LABELS = { red: 'Đồng (Cơ bản)', green: 'Bạc (Trung cấp)', gold: 'Vàng (Chuyên sâu)' };
  const LEVEL_COLORS = { red: '#dc2626', green: '#16a34a', gold: '#d97706' };

  const tbody = document.getElementById('dataBody');
  const empty = document.getElementById('emptyState');
  const countEl = document.getElementById('rowCount');
  const searchEl = document.getElementById('searchInput');
  const filterLv = document.getElementById('filterLevel');
  const filterSt = document.getElementById('filterStatus');
  const form = document.getElementById('dataForm');
  const formTitle = document.getElementById('formTitle');

  let data = AdminShared.loadData(STORAGE_KEY, SEED);
  let editingId = null;

  function render() {
    const q = (searchEl.value || '').trim().toLowerCase();
    const lv = filterLv.value;
    const st = filterSt.value;
    const filtered = data.filter(function (r) {
      if (lv && r.level !== lv) return false;
      if (st && r.status !== st) return false;
      if (q && !((r.code + ' ' + r.student + ' ' + r.course).toLowerCase().includes(q))) return false;
      return true;
    });
    countEl.textContent = filtered.length + ' chứng chỉ';

    if (!filtered.length) { tbody.innerHTML = ''; empty.hidden = false; return; }
    empty.hidden = true;

    const esc = AdminShared.escapeHtml;
    tbody.innerHTML = filtered.map(function (r) {
      const pill = r.status === 'valid'
        ? '<span class="adm-pill ok">Hiệu lực</span>'
        : '<span class="adm-pill cancel">Đã thu hồi</span>';
      const color = LEVEL_COLORS[r.level] || '#64748b';
      return '' +
        '<tr>' +
        '  <td><b>' + esc(r.code) + '</b></td>' +
        '  <td>' + esc(r.student) + '</td>' +
        '  <td>' + esc(r.course) + '</td>' +
        '  <td><span style="color:' + color + ';font-weight:700">● ' + esc(LEVEL_LABELS[r.level] || r.level) + '</span></td>' +
        '  <td>' + esc(r.issuedAt) + '</td>' +
        '  <td>' + pill + '</td>' +
        '  <td>' +
        '    <div class="adm-row-actions">' +
        '      <button class="adm-icon-btn" data-edit="' + r.id + '"><i class="fa-solid fa-pen"></i></button>' +
        '      <button class="adm-icon-btn danger" data-del="' + r.id + '"><i class="fa-solid fa-trash"></i></button>' +
        '    </div>' +
        '  </td>' +
        '</tr>';
    }).join('');
  }

  // Sinh mã chứng chỉ tự động theo năm
  function nextCode() {
    const year = new Date().getFullYear();
    const prefix = 'QSAC-' + year + '-';
    const nums = data
      .filter(function (r) { return (r.code || '').indexOf(prefix) === 0; })
      .map(function (r) {
        const m = r.code.match(/-(\d+)$/);
        return m ? parseInt(m[1], 10) : 0;
      });
    const next = (nums.length ? Math.max.apply(null, nums) : 0) + 1;
    return prefix + String(next).padStart(4, '0');
  }

  function openCreate() {
    editingId = null;
    formTitle.textContent = 'Cấp chứng chỉ';
    form.reset();
    clearErrors();
    form.elements.code.value = nextCode();
    form.elements.issuedAt.value = new Date().toISOString().slice(0, 10);
    AdminShared.openModal('formModal');
  }
  function openEdit(id) {
    const r = data.find(function (x) { return x.id === id; });
    if (!r) return;
    editingId = id;
    formTitle.textContent = 'Sửa chứng chỉ';
    clearErrors();
    Object.keys(r).forEach(function (k) {
      const f = form.elements[k]; if (f) f.value = r[k];
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
      code: (fd.get('code') || '').toString().trim(),
      student: (fd.get('student') || '').toString().trim(),
      course: (fd.get('course') || '').toString().trim(),
      level: fd.get('level') || 'red',
      issuedAt: fd.get('issuedAt') || '',
      status: fd.get('status') || 'valid',
    };
    let ok = true;
    const setErr = function (name, msg) {
      const errEl = form.querySelector('[data-err="' + name + '"]');
      const inp = form.elements[name];
      if (errEl) errEl.textContent = msg;
      if (inp) inp.classList.add('invalid');
      ok = false;
    };
    if (!obj.code) setErr('code', 'Nhập mã chứng chỉ');
    const dup = data.find(function (x) { return x.code === obj.code && x.id !== editingId; });
    if (dup) setErr('code', 'Mã chứng chỉ đã tồn tại');
    if (!obj.student) setErr('student', 'Nhập tên học viên');
    if (!obj.course) setErr('course', 'Nhập tên khoá học');
    if (!obj.issuedAt) setErr('issuedAt', 'Chọn ngày cấp');
    return ok ? obj : null;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const obj = validate();
    if (!obj) return;
    if (editingId) {
      const idx = data.findIndex(function (x) { return x.id === editingId; });
      if (idx >= 0) data[idx] = Object.assign({}, data[idx], obj);
      AdminShared.toast('Đã cập nhật chứng chỉ');
    } else {
      data.unshift(Object.assign({ id: AdminShared.uid() }, obj));
      AdminShared.toast('Đã cấp chứng chỉ mới');
    }
    AdminShared.saveData(STORAGE_KEY, data);
    AdminShared.closeModal('formModal');
    render();
  });

  document.getElementById('btnAdd').addEventListener('click', openCreate);

  tbody.addEventListener('click', function (e) {
    const editBtn = e.target.closest('[data-edit]');
    if (editBtn) { openEdit(editBtn.dataset.edit); return; }
    const delBtn = e.target.closest('[data-del]');
    if (delBtn) {
      const id = delBtn.dataset.del;
      const row = data.find(function (x) { return x.id === id; });
      AdminShared.confirmDialog({
        title: 'Xoá chứng chỉ',
        message: 'Xoá chứng chỉ ' + (row ? row.code : '') + '?',
        okText: 'Xoá', okClass: 'danger',
        onOk: function () {
          data = data.filter(function (x) { return x.id !== id; });
          AdminShared.saveData(STORAGE_KEY, data);
          render();
          AdminShared.toast('Đã xoá chứng chỉ', 'warn');
        }
      });
    }
  });

  let t;
  searchEl.addEventListener('input', function () { clearTimeout(t); t = setTimeout(render, 150); });
  filterLv.addEventListener('change', render);
  filterSt.addEventListener('change', render);

  render();
})();
