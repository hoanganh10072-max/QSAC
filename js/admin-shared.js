/* =============================================
   admin-shared.js — Utility chung cho toàn khu vực admin
   Expose qua biến global `AdminShared`.
   Bắt buộc load TRƯỚC các file admin-<entity>.js của từng trang.

   Cung cấp:
   - guardSession(): chặn vào trang nếu chưa login
   - bindLogout(btnId): bind nút logout chung
   - bindSidebar(): set active state theo file đang mở
   - loadData(key, seed) / saveData(key, data): wrapper localStorage có try/catch
   - openModal(id) / closeModal(id): modal helper
   - confirmDialog(opts): confirm động (thay window.confirm)
   - toast(msg, type): notification góc phải
   - escapeHtml(str): tránh XSS khi render tay
   - formatMoney(num): format tiền VND
   - uid(): sinh id ngắn cho record mới
   ============================================= */

window.AdminShared = (function () {
  'use strict';

  const SESSION_KEY = 'qsac_admin_session';
  const LOGIN_URL = 'index.html';

  // ── 1. Session guard ──
  function readSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const s = JSON.parse(raw);
      if (!s || !s.expiresAt || s.expiresAt <= Date.now()) return null;
      return s;
    } catch (e) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
  }

  function guardSession() {
    const s = readSession();
    if (!s) {
      window.location.replace(LOGIN_URL);
      return null;
    }
    // Render user info nếu element tồn tại
    const nameEl = document.getElementById('admName');
    const avatarEl = document.getElementById('admAvatar');
    if (nameEl) nameEl.textContent = s.user.charAt(0).toUpperCase() + s.user.slice(1);
    if (avatarEl) avatarEl.textContent = s.user.charAt(0).toUpperCase();

    // Re-check khi user quay lại tab
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible' && !readSession()) {
        window.location.replace(LOGIN_URL);
      }
    });
    return s;
  }

  // ── 2. Logout ──
  function bindLogout(btnId) {
    const btn = document.getElementById(btnId || 'logoutBtn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      confirmDialog({
        title: 'Đăng xuất',
        message: 'Bạn chắc chắn muốn đăng xuất khỏi trang quản trị?',
        okText: 'Đăng xuất',
        okClass: 'danger',
        onOk: function () {
          try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
          window.location.href = LOGIN_URL;
        }
      });
    });
  }

  // ── 3. Sidebar active state — tự nhận theo file đang mở ──
  function bindSidebar() {
    const items = document.querySelectorAll('.adm-nav-item');
    const here = window.location.pathname.split('/').pop() || 'dashboard.html';
    items.forEach(function (item) {
      const href = item.getAttribute('href');
      if (!href || href === '#') return;
      if (href === here) {
        items.forEach(function (n) { n.classList.remove('active'); });
        item.classList.add('active');
      }
    });
  }

  // ── 4. localStorage wrapper ──
  function loadData(key, seed) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) { /* fall through to seed */ }
    // Lần đầu vào trang → seed dữ liệu mẫu + lưu lại
    if (Array.isArray(seed) && seed.length) {
      try { localStorage.setItem(key, JSON.stringify(seed)); } catch (e) {}
      return seed.slice();
    }
    return [];
  }

  function saveData(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      toast('Không lưu được dữ liệu (localStorage đầy?)', 'error');
      return false;
    }
  }

  // ── 5. Modal helpers ──
  function openModal(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Focus ô input đầu tiên cho tiện nhập
    const firstInput = el.querySelector('input, select, textarea');
    if (firstInput) setTimeout(function () { firstInput.focus(); }, 50);
  }

  function closeModal(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Bind đóng modal khi click backdrop hoặc nút .adm-modal-close
  document.addEventListener('click', function (e) {
    const closer = e.target.closest('[data-close-modal]');
    if (closer) {
      const id = closer.dataset.closeModal;
      if (id) closeModal(id);
      return;
    }
    if (e.target.classList && e.target.classList.contains('adm-modal')) {
      e.target.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // ESC đóng modal đang mở
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      const open = document.querySelector('.adm-modal.open');
      if (open) {
        open.classList.remove('open');
        document.body.style.overflow = '';
      }
    }
  });

  // ── 6. Confirm dialog động (thay window.confirm) ──
  function confirmDialog(opts) {
    opts = opts || {};
    let dlg = document.getElementById('admConfirmDlg');
    if (!dlg) {
      dlg = document.createElement('div');
      dlg.id = 'admConfirmDlg';
      dlg.className = 'adm-modal';
      dlg.innerHTML =
        '<div class="adm-modal-card sm">' +
        '  <h3 class="adm-modal-title"></h3>' +
        '  <p class="adm-modal-msg"></p>' +
        '  <div class="adm-modal-actions">' +
        '    <button type="button" class="adm-btn-ghost" data-confirm-cancel>Huỷ</button>' +
        '    <button type="button" class="adm-btn-primary" data-confirm-ok>Đồng ý</button>' +
        '  </div>' +
        '</div>';
      document.body.appendChild(dlg);
    }
    dlg.querySelector('.adm-modal-title').textContent = opts.title || 'Xác nhận';
    dlg.querySelector('.adm-modal-msg').textContent = opts.message || '';
    const okBtn = dlg.querySelector('[data-confirm-ok]');
    okBtn.textContent = opts.okText || 'Đồng ý';
    okBtn.className = 'adm-btn-primary' + (opts.okClass === 'danger' ? ' danger' : '');

    // Reset event bằng cách clone (tránh listener cũ chạy lại)
    const newOk = okBtn.cloneNode(true);
    okBtn.parentNode.replaceChild(newOk, okBtn);
    newOk.addEventListener('click', function () {
      dlg.classList.remove('open');
      document.body.style.overflow = '';
      if (typeof opts.onOk === 'function') opts.onOk();
    });

    const cancel = dlg.querySelector('[data-confirm-cancel]');
    cancel.onclick = function () {
      dlg.classList.remove('open');
      document.body.style.overflow = '';
    };

    dlg.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  // ── 7. Toast notification (góc phải, tự ẩn 3s) ──
  function toast(msg, type) {
    let host = document.getElementById('admToastHost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'admToastHost';
      host.className = 'adm-toast-host';
      document.body.appendChild(host);
    }
    const t = document.createElement('div');
    t.className = 'adm-toast ' + (type || 'ok');
    const icon = type === 'error' ? 'fa-circle-xmark'
               : type === 'warn'  ? 'fa-triangle-exclamation'
               : 'fa-circle-check';
    t.innerHTML = '<i class="fa-solid ' + icon + '"></i><span></span>';
    t.querySelector('span').textContent = msg;
    host.appendChild(t);
    setTimeout(function () { t.classList.add('show'); }, 10);
    setTimeout(function () {
      t.classList.remove('show');
      setTimeout(function () { t.remove(); }, 300);
    }, 3000);
  }

  // ── 8. Tiện ích ──
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatMoney(n) {
    const num = Number(n) || 0;
    return num.toLocaleString('vi-VN') + 'đ';
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  // Expose
  return {
    guardSession: guardSession,
    bindLogout: bindLogout,
    bindSidebar: bindSidebar,
    loadData: loadData,
    saveData: saveData,
    openModal: openModal,
    closeModal: closeModal,
    confirmDialog: confirmDialog,
    toast: toast,
    escapeHtml: escapeHtml,
    formatMoney: formatMoney,
    uid: uid,
  };
})();
