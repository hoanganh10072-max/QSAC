/* =============================================
   admin-guard.js — Chặn truy cập trang admin khi chưa đăng nhập
   Dùng cho: mọi trang trong admin/ TRỪ index.html (login)
   Cách dùng: nhúng SYNC trong <head> NGAY SAU <title>:
     <script src="../js/admin-guard.js"></script>
   Lý do load sync (không defer): phải redirect TRƯỚC khi body render
   để tránh flash-of-unauthorized-content (nháy nội dung admin rồi mới chuyển).
   ============================================= */

(function () {
  'use strict';

  const SESSION_KEY = 'qsac_admin_session';
  const LOGIN_URL = 'index.html';

  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) {
      window.location.replace(LOGIN_URL);
      return;
    }
    const s = JSON.parse(raw);
    if (!s || !s.expiresAt || s.expiresAt <= Date.now()) {
      // Session hết hạn hoặc format sai → xoá rồi redirect
      try { localStorage.removeItem(SESSION_KEY); } catch (e) { /* ignore */ }
      window.location.replace(LOGIN_URL);
    }
  } catch (e) {
    // localStorage lỗi (private mode, full,...) → vẫn chặn để an toàn
    window.location.replace(LOGIN_URL);
  }
})();
