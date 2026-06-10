/* =============================================
   admin-login.js — Xử lý đăng nhập trang quản trị
   Dùng cho: admin/index.html
   Luồng: select DOM → bind submit → validate → check credential
          → lưu session localStorage → redirect dashboard.html
   Lưu ý: Credential demo hardcode chỉ cho prototype.
          Khi gắn backend thật, thay phần checkCredentials() bằng fetch().
   ============================================= */

(function () {
  'use strict';

  // ── Credential demo — sẽ thay bằng API auth thật ──
  const DEMO_USER = 'admin';
  const DEFAULT_PASS = 'qsac@2026';

  // Key localStorage chung với admin-dashboard.js để guard session
  const SESSION_KEY = 'qsac_admin_session';
  // Mật khẩu hiện tại có thể đã được đổi qua trang Cài đặt
  const PWD_KEY = 'qsac_admin_password';

  // ── DOM refs (chỉ query 1 lần) ──
  const form = document.getElementById('loginForm');
  const userInput = document.getElementById('username');
  const passInput = document.getElementById('password');
  const rememberInput = document.getElementById('remember');
  const submitBtn = document.getElementById('loginBtn');
  const errorBox = document.getElementById('loginError');
  const errorMsg = errorBox.querySelector('.adm-alert-msg');
  const toggleBtn = document.getElementById('togglePwd');

  // ── Toggle hiện/ẩn mật khẩu ──
  toggleBtn.addEventListener('click', function () {
    const isPwd = passInput.type === 'password';
    passInput.type = isPwd ? 'text' : 'password';
    toggleBtn.innerHTML = isPwd
      ? '<i class="fa-regular fa-eye-slash"></i>'
      : '<i class="fa-regular fa-eye"></i>';
    toggleBtn.setAttribute('aria-label', isPwd ? 'Ẩn mật khẩu' : 'Hiện mật khẩu');
  });

  // ── Helper hiển thị/ẩn alert lỗi ──
  function showError(msg) {
    errorMsg.textContent = msg;
    errorBox.hidden = false;
  }
  function clearError() {
    errorBox.hidden = true;
    errorMsg.textContent = '';
  }

  // Người dùng gõ lại → tự ẩn alert để không gây nhiễu
  [userInput, passInput].forEach(function (el) {
    el.addEventListener('input', clearError);
  });

  // ── Check credential — tách hàm để dễ thay bằng API sau ──
  function checkCredentials(username, password) {
    let currentPass = DEFAULT_PASS;
    try {
      const stored = localStorage.getItem(PWD_KEY);
      if (stored) currentPass = stored;
    } catch (e) { /* fall back to default */ }
    return username === DEMO_USER && password === currentPass;
  }

  // ── Lưu session vào localStorage có try/catch theo rule 17 ──
  function saveSession(username, remember) {
    try {
      const session = {
        user: username,
        loginAt: Date.now(),
        // Remember = 7 ngày, không = 8 giờ
        expiresAt: Date.now() + (remember ? 7 * 24 : 8) * 60 * 60 * 1000,
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return true;
    } catch (e) {
      return false;
    }
  }

  // ── Submit handler ──
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearError();

    const username = userInput.value.trim();
    const password = passInput.value;

    // Validate cơ bản — không tin chỉ vào required của HTML (rule 12)
    if (!username || !password) {
      showError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
      (username ? passInput : userInput).focus();
      return;
    }

    // Disable nút + state loading (rule 13: button có trạng thái disabled)
    submitBtn.disabled = true;
    submitBtn.querySelector('.adm-btn-text').textContent = 'Đang kiểm tra...';

    // setTimeout giả lập độ trễ API — tăng UX, dễ thay bằng fetch sau
    setTimeout(function () {
      if (!checkCredentials(username, password)) {
        showError('Tên đăng nhập hoặc mật khẩu không đúng.');
        submitBtn.disabled = false;
        submitBtn.querySelector('.adm-btn-text').textContent = 'Đăng nhập';
        passInput.focus();
        passInput.select();
        return;
      }

      const saved = saveSession(username, rememberInput.checked);
      if (!saved) {
        showError('Không lưu được phiên đăng nhập. Vui lòng bật localStorage.');
        submitBtn.disabled = false;
        submitBtn.querySelector('.adm-btn-text').textContent = 'Đăng nhập';
        return;
      }

      // Chuyển sang dashboard sau khi lưu session thành công
      window.location.href = 'dashboard.html';
    }, 400);
  });

  // Trang login luôn hiển thị form, không auto-redirect kể cả khi session còn hạn.
  // Dọn session lỗi format để tránh kẹt khi submit lại.
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) JSON.parse(raw);
  } catch (e) {
    try { localStorage.removeItem(SESSION_KEY); } catch (_) { /* ignore */ }
  }
})();
