/* =============================================
   admin-settings.js — Cài đặt hệ thống
   Dùng cho: admin/settings.html
   Gồm: form cấu hình website, đổi mật khẩu (demo), CRUD tài khoản admin,
        xuất/nhập/khôi phục dữ liệu localStorage.
   ============================================= */

(function () {
  'use strict';

  if (!AdminShared.guardSession()) return;
  AdminShared.bindSidebar();
  AdminShared.bindLogout();

  // ── Storage keys dùng cho riêng trang này + danh sách key chung để export ──
  const CONFIG_KEY = 'qsac_admin_config';
  const USERS_KEY = 'qsac_admin_users';
  const PWD_KEY = 'qsac_admin_password'; // mật khẩu admin chính (chỉ demo)
  const ALL_DATA_KEYS = [
    'qsac_admin_courses',
    'qsac_admin_students',
    'qsac_admin_orders',
    'qsac_admin_teachers',
    'qsac_admin_certificates',
    CONFIG_KEY,
    USERS_KEY,
  ];

  const DEFAULT_CONFIG = {
    siteName: 'QSAC - Đào tạo TMĐT',
    email: 'lienhe@qsac.vn',
    hotline: '1900xxxx',
    address: '',
    intro: 'Chương trình bồi dưỡng chính thức cho cá nhân, doanh nghiệp và hộ kinh doanh trên các sàn TMĐT lớn.',
  };

  const SEED_USERS = [
    { id: 'u1', username: 'admin',    fullName: 'Quản trị viên gốc', email: 'admin@qsac.vn',    role: 'admin',   status: 'active' },
    { id: 'u2', username: 'editor1',  fullName: 'Trần Văn Biên',     email: 'editor1@qsac.vn',  role: 'editor',  status: 'active' },
    { id: 'u3', username: 'support1', fullName: 'Lê Thị Hỗ Trợ',     email: 'support1@qsac.vn', role: 'support', status: 'active' },
  ];

  const ROLE_LABELS = { admin: 'Quản trị viên', editor: 'Biên tập viên', support: 'Hỗ trợ' };

  /* ====== 1. CONFIG WEBSITE ====== */
  const configForm = document.getElementById('configForm');
  function loadConfig() {
    try {
      const raw = localStorage.getItem(CONFIG_KEY);
      if (raw) return Object.assign({}, DEFAULT_CONFIG, JSON.parse(raw));
    } catch (e) {}
    return Object.assign({}, DEFAULT_CONFIG);
  }
  function fillConfigForm() {
    const cfg = loadConfig();
    Object.keys(cfg).forEach(function (k) {
      const el = configForm.elements[k];
      if (el) el.value = cfg[k];
    });
  }
  configForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const fd = new FormData(configForm);
    const cfg = {
      siteName: (fd.get('siteName') || '').toString().trim(),
      email: (fd.get('email') || '').toString().trim(),
      hotline: (fd.get('hotline') || '').toString().trim(),
      address: (fd.get('address') || '').toString().trim(),
      intro: (fd.get('intro') || '').toString().trim(),
    };
    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
      AdminShared.toast('Đã lưu cấu hình website');
    } catch (err) {
      AdminShared.toast('Không lưu được cấu hình', 'error');
    }
  });
  fillConfigForm();

  /* ====== 2. ĐỔI MẬT KHẨU (DEMO) ====== */
  const pwdForm = document.getElementById('pwdForm');
  pwdForm.addEventListener('submit', function (e) {
    e.preventDefault();
    pwdForm.querySelectorAll('.err').forEach(function (el) { el.textContent = ''; });
    pwdForm.querySelectorAll('.invalid').forEach(function (el) { el.classList.remove('invalid'); });

    const fd = new FormData(pwdForm);
    const oldPwd = (fd.get('oldPwd') || '').toString();
    const newPwd = (fd.get('newPwd') || '').toString();
    const cf = (fd.get('confirmPwd') || '').toString();

    const setErr = function (name, msg) {
      const el = pwdForm.querySelector('[data-err="' + name + '"]');
      const inp = pwdForm.elements[name];
      if (el) el.textContent = msg;
      if (inp) inp.classList.add('invalid');
    };

    // Mật khẩu hiện tại lưu ở localStorage, mặc định = "qsac@2026" (khớp login)
    const currentPwd = localStorage.getItem(PWD_KEY) || 'qsac@2026';
    if (oldPwd !== currentPwd) { setErr('oldPwd', 'Mật khẩu hiện tại không đúng'); return; }
    if (newPwd.length < 6) { setErr('newPwd', 'Mật khẩu mới tối thiểu 6 ký tự'); return; }
    if (newPwd !== cf) { setErr('confirmPwd', 'Xác nhận mật khẩu không khớp'); return; }

    try {
      localStorage.setItem(PWD_KEY, newPwd);
      pwdForm.reset();
      AdminShared.toast('Đã đổi mật khẩu');
    } catch (err) {
      AdminShared.toast('Không đổi được mật khẩu', 'error');
    }
  });

  /* ====== 3. CRUD TÀI KHOẢN ADMIN ====== */
  const tbody = document.getElementById('dataBody');
  const empty = document.getElementById('emptyState');
  const userForm = document.getElementById('userForm');
  const formTitle = document.getElementById('formTitle');

  let users = AdminShared.loadData(USERS_KEY, SEED_USERS);
  let editingId = null;

  function renderUsers() {
    if (!users.length) { tbody.innerHTML = ''; empty.hidden = false; return; }
    empty.hidden = true;
    const esc = AdminShared.escapeHtml;
    tbody.innerHTML = users.map(function (r) {
      const pill = r.status === 'active'
        ? '<span class="adm-pill ok">Hoạt động</span>'
        : '<span class="adm-pill cancel">Đã khoá</span>';
      const isRoot = r.username === 'admin';
      const delBtn = isRoot
        ? '<button class="adm-icon-btn" disabled title="Không thể xoá tài khoản gốc" style="opacity:.4;cursor:not-allowed"><i class="fa-solid fa-trash"></i></button>'
        : '<button class="adm-icon-btn danger" data-del="' + r.id + '"><i class="fa-solid fa-trash"></i></button>';
      return '' +
        '<tr>' +
        '  <td><b>' + esc(r.username) + '</b>' + (isRoot ? ' <span class="adm-pill ok" style="font-size:9px">GỐC</span>' : '') + '</td>' +
        '  <td>' + esc(r.fullName) + '</td>' +
        '  <td>' + esc(r.email) + '</td>' +
        '  <td>' + esc(ROLE_LABELS[r.role] || r.role) + '</td>' +
        '  <td>' + pill + '</td>' +
        '  <td>' +
        '    <div class="adm-row-actions">' +
        '      <button class="adm-icon-btn" data-edit="' + r.id + '"><i class="fa-solid fa-pen"></i></button>' +
        delBtn +
        '    </div>' +
        '  </td>' +
        '</tr>';
    }).join('');
  }

  function openCreate() {
    editingId = null;
    formTitle.textContent = 'Thêm tài khoản';
    userForm.reset();
    clearUserErrors();
    AdminShared.openModal('formModal');
  }
  function openEdit(id) {
    const r = users.find(function (x) { return x.id === id; });
    if (!r) return;
    editingId = id;
    formTitle.textContent = 'Sửa tài khoản';
    clearUserErrors();
    Object.keys(r).forEach(function (k) {
      const f = userForm.elements[k]; if (f) f.value = r[k];
    });
    AdminShared.openModal('formModal');
  }
  function clearUserErrors() {
    userForm.querySelectorAll('.err').forEach(function (e) { e.textContent = ''; });
    userForm.querySelectorAll('.invalid').forEach(function (e) { e.classList.remove('invalid'); });
  }

  userForm.addEventListener('submit', function (e) {
    e.preventDefault();
    clearUserErrors();
    const fd = new FormData(userForm);
    const obj = {
      username: (fd.get('username') || '').toString().trim(),
      fullName: (fd.get('fullName') || '').toString().trim(),
      email: (fd.get('email') || '').toString().trim(),
      role: fd.get('role') || 'editor',
      status: fd.get('status') || 'active',
    };
    let ok = true;
    const setErr = function (name, msg) {
      const errEl = userForm.querySelector('[data-err="' + name + '"]');
      const inp = userForm.elements[name];
      if (errEl) errEl.textContent = msg;
      if (inp) inp.classList.add('invalid');
      ok = false;
    };
    if (!obj.username || !/^[a-zA-Z0-9_.-]{3,}$/.test(obj.username)) setErr('username', 'Username 3+ ký tự, không khoảng trắng');
    const dup = users.find(function (x) { return x.username === obj.username && x.id !== editingId; });
    if (dup) setErr('username', 'Tên đăng nhập đã tồn tại');
    if (!obj.fullName) setErr('fullName', 'Nhập họ tên');
    if (!obj.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(obj.email)) setErr('email', 'Email không hợp lệ');
    if (!ok) return;

    if (editingId) {
      const idx = users.findIndex(function (x) { return x.id === editingId; });
      if (idx >= 0) users[idx] = Object.assign({}, users[idx], obj);
      AdminShared.toast('Đã cập nhật tài khoản');
    } else {
      users.unshift(Object.assign({ id: AdminShared.uid() }, obj));
      AdminShared.toast('Đã thêm tài khoản mới');
    }
    AdminShared.saveData(USERS_KEY, users);
    AdminShared.closeModal('formModal');
    renderUsers();
  });

  document.getElementById('btnAdd').addEventListener('click', openCreate);

  tbody.addEventListener('click', function (e) {
    const editBtn = e.target.closest('[data-edit]');
    if (editBtn) { openEdit(editBtn.dataset.edit); return; }
    const delBtn = e.target.closest('[data-del]');
    if (delBtn) {
      const id = delBtn.dataset.del;
      const row = users.find(function (x) { return x.id === id; });
      if (row && row.username === 'admin') {
        AdminShared.toast('Không thể xoá tài khoản gốc', 'error');
        return;
      }
      AdminShared.confirmDialog({
        title: 'Xoá tài khoản',
        message: 'Xoá tài khoản ' + (row ? row.username : '') + '?',
        okText: 'Xoá', okClass: 'danger',
        onOk: function () {
          users = users.filter(function (x) { return x.id !== id; });
          AdminShared.saveData(USERS_KEY, users);
          renderUsers();
          AdminShared.toast('Đã xoá tài khoản', 'warn');
        }
      });
    }
  });
  renderUsers();

  /* ====== 4. EXPORT / IMPORT / RESET ====== */
  document.getElementById('btnExport').addEventListener('click', function () {
    const dump = {};
    ALL_DATA_KEYS.forEach(function (k) {
      try { const raw = localStorage.getItem(k); if (raw) dump[k] = JSON.parse(raw); } catch (e) {}
    });
    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qsac-admin-backup-' + new Date().toISOString().slice(0, 10) + '.json';
    a.click();
    URL.revokeObjectURL(url);
    AdminShared.toast('Đã xuất dữ liệu');
  });

  document.getElementById('importFile').addEventListener('change', function (e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function () {
      try {
        const obj = JSON.parse(reader.result);
        if (!obj || typeof obj !== 'object') throw new Error('invalid');
        AdminShared.confirmDialog({
          title: 'Nhập dữ liệu',
          message: 'Ghi đè dữ liệu hiện tại bằng file đã chọn?',
          okText: 'Nhập', okClass: 'danger',
          onOk: function () {
            Object.keys(obj).forEach(function (k) {
              if (ALL_DATA_KEYS.indexOf(k) >= 0) {
                try { localStorage.setItem(k, JSON.stringify(obj[k])); } catch (er) {}
              }
            });
            AdminShared.toast('Đã nhập dữ liệu, đang tải lại...');
            setTimeout(function () { window.location.reload(); }, 800);
          }
        });
      } catch (err) {
        AdminShared.toast('File không hợp lệ', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // cho phép chọn lại cùng file
  });

  document.getElementById('btnResetData').addEventListener('click', function () {
    AdminShared.confirmDialog({
      title: 'Khôi phục dữ liệu mẫu',
      message: 'Toàn bộ dữ liệu đã chỉnh sẽ bị xoá và thay bằng dữ liệu seed mặc định. Tiếp tục?',
      okText: 'Khôi phục', okClass: 'danger',
      onOk: function () {
        ALL_DATA_KEYS.forEach(function (k) {
          try { localStorage.removeItem(k); } catch (e) {}
        });
        try { localStorage.removeItem(PWD_KEY); } catch (e) {}
        AdminShared.toast('Đã khôi phục, đang tải lại...');
        setTimeout(function () { window.location.reload(); }, 800);
      }
    });
  });
})();
