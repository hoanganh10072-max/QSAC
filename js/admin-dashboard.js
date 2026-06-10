/* =============================================
   admin-dashboard.js — Logic trang Tổng quan
   Dùng cho: admin/dashboard.html
   Phụ thuộc: admin-shared.js (AdminShared)
   Luồng: guard session → sidebar active → bind logout
   Phần stats và bảng đơn hàng hiện đang là dữ liệu tĩnh trong HTML,
   để tránh khớp cứng với khi reset localStorage. Khi cần realtime
   theo các page CRUD khác, đọc từ localStorage và render lại tại đây.
   ============================================= */

(function () {
  'use strict';

  if (!AdminShared.guardSession()) return; // chưa login → đã redirect
  AdminShared.bindSidebar();
  AdminShared.bindLogout('logoutBtn');
})();
