/* =============================================
   admin-orders.js — CRUD đơn hàng
   Dùng cho: admin/orders.html
   ============================================= */

(function () {
  'use strict';

  if (!AdminShared.guardSession()) return;
  AdminShared.bindSidebar();
  AdminShared.bindLogout();

  const STORAGE_KEY = 'qsac_admin_orders';
  const SEED = [
    { id: 'o1', code: '#QS10428', student: 'Nguyễn V.A',   course: 'Marketing số & SEO',           amount: 2200000, method: 'bank', createdAt: '2026-06-09', status: 'paid' },
    { id: 'o2', code: '#QS10427', student: 'Lê Thị Hoa',   course: 'Vận hành sàn TMĐT A–Z',         amount: 3500000, method: 'bank', createdAt: '2026-06-09', status: 'pending' },
    { id: 'o3', code: '#QS10426', student: 'Phạm Quang',   course: 'Nhập môn TMĐT',                amount: 1500000, method: 'momo', createdAt: '2026-06-08', status: 'paid' },
    { id: 'o4', code: '#QS10425', student: 'Trần Bích',    course: 'Pháp lý TMĐT',                 amount: 1800000, method: 'card', createdAt: '2026-06-08', status: 'cancelled' },
    { id: 'o5', code: '#QS10424', student: 'Vũ Minh',      course: 'Shopee & Lazada',              amount: 2800000, method: 'bank', createdAt: '2026-06-07', status: 'paid' },
    { id: 'o6', code: '#QS10423', student: 'Đỗ Hải Anh',   course: 'Logistics TMĐT',               amount: 1600000, method: 'momo', createdAt: '2026-06-07', status: 'paid' },
    { id: 'o7', code: '#QS10422', student: 'Hoàng M.Linh', course: 'Phân tích dữ liệu TMĐT',       amount: 2900000, method: 'bank', createdAt: '2026-06-06', status: 'pending' },
  ];

  const METHOD_LABELS = { bank: 'Chuyển khoản', card: 'Thẻ tín dụng', momo: 'MoMo', cash: 'Tiền mặt' };

  const tbody = document.getElementById('dataBody');
  const empty = document.getElementById('emptyState');
  const countEl = document.getElementById('rowCount');
  const searchEl = document.getElementById('searchInput');
  const filterSt = document.getElementById('filterStatus');
  const filterMethod = document.getElementById('filterMethod');
  const form = document.getElementById('dataForm');
  const formTitle = document.getElementById('formTitle');

  let data = AdminShared.loadData(STORAGE_KEY, SEED);
  let editingId = null;

  function render() {
    const q = (searchEl.value || '').trim().toLowerCase();
    const st = filterSt.value;
    const md = filterMethod.value;
    const filtered = data.filter(function (r) {
      if (st && r.status !== st) return false;
      if (md && r.method !== md) return false;
      if (q && !((r.code + ' ' + r.student + ' ' + r.course).toLowerCase().includes(q))) return false;
      return true;
    });
    countEl.textContent = filtered.length + ' đơn';

    if (!filtered.length) { tbody.innerHTML = ''; empty.hidden = false; return; }
    empty.hidden = true;

    const esc = AdminShared.escapeHtml;
    tbody.innerHTML = filtered.map(function (r) {
      const pill =
        r.status === 'paid'      ? '<span class="adm-pill ok">Đã thanh toán</span>' :
        r.status === 'pending'   ? '<span class="adm-pill warn">Chờ thanh toán</span>' :
                                   '<span class="adm-pill cancel">Đã huỷ</span>';
      return '' +
        '<tr>' +
        '  <td><b>' + esc(r.code) + '</b></td>' +
        '  <td>' + esc(r.student) + '</td>' +
        '  <td>' + esc(r.course) + '</td>' +
        '  <td>' + AdminShared.formatMoney(r.amount) + '</td>' +
        '  <td>' + esc(METHOD_LABELS[r.method] || r.method) + '</td>' +
        '  <td>' + esc(r.createdAt) + '</td>' +
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

  // Sinh mã đơn tự động dạng #QSxxxxx tăng theo số lớn nhất hiện có
  function nextCode() {
    const nums = data.map(function (r) {
      const m = (r.code || '').match(/(\d+)$/);
      return m ? parseInt(m[1], 10) : 0;
    });
    const max = nums.length ? Math.max.apply(null, nums) : 10400;
    return '#QS' + (max + 1);
  }

  function openCreate() {
    editingId = null;
    formTitle.textContent = 'Thêm đơn hàng';
    form.reset();
    clearErrors();
    form.elements.code.value = nextCode();
    form.elements.createdAt.value = new Date().toISOString().slice(0, 10);
    AdminShared.openModal('formModal');
  }
  function openEdit(id) {
    const r = data.find(function (x) { return x.id === id; });
    if (!r) return;
    editingId = id;
    formTitle.textContent = 'Sửa đơn hàng';
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
      amount: Number(fd.get('amount')),
      method: fd.get('method') || 'bank',
      createdAt: fd.get('createdAt') || '',
      status: fd.get('status') || 'pending',
    };
    let ok = true;
    const setErr = function (name, msg) {
      const errEl = form.querySelector('[data-err="' + name + '"]');
      const inp = form.elements[name];
      if (errEl) errEl.textContent = msg;
      if (inp) inp.classList.add('invalid');
      ok = false;
    };
    if (!obj.code) setErr('code', 'Nhập mã đơn');
    // Mã đơn không được trùng (trừ khi đang sửa chính nó)
    const dup = data.find(function (x) { return x.code === obj.code && x.id !== editingId; });
    if (dup) setErr('code', 'Mã đơn đã tồn tại');
    if (!obj.student) setErr('student', 'Nhập tên học viên');
    if (!obj.course) setErr('course', 'Nhập tên khoá học');
    if (!(obj.amount >= 0)) setErr('amount', 'Số tiền phải ≥ 0');
    if (!obj.createdAt) setErr('createdAt', 'Chọn ngày tạo');
    return ok ? obj : null;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const obj = validate();
    if (!obj) return;
    if (editingId) {
      const idx = data.findIndex(function (x) { return x.id === editingId; });
      if (idx >= 0) data[idx] = Object.assign({}, data[idx], obj);
      AdminShared.toast('Đã cập nhật đơn hàng');
    } else {
      data.unshift(Object.assign({ id: AdminShared.uid() }, obj));
      AdminShared.toast('Đã tạo đơn hàng mới');
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
        title: 'Xoá đơn hàng',
        message: 'Xoá đơn ' + (row ? row.code : '') + '?',
        okText: 'Xoá', okClass: 'danger',
        onOk: function () {
          data = data.filter(function (x) { return x.id !== id; });
          AdminShared.saveData(STORAGE_KEY, data);
          render();
          AdminShared.toast('Đã xoá đơn hàng', 'warn');
        }
      });
    }
  });

  let t;
  searchEl.addEventListener('input', function () { clearTimeout(t); t = setTimeout(render, 150); });
  filterSt.addEventListener('change', render);
  filterMethod.addEventListener('change', render);

  render();
})();
