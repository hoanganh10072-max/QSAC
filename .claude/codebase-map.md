# codebase-map.md — Bản đồ file dự án

> Cập nhật file này mỗi khi tạo file mới hoặc xóa file.
> Claude dùng file này để tìm đúng file cần đọc/sửa mà không phải quét toàn bộ dự án.

---

## Trang chính

| File | Vai trò | CSS liên quan | JS liên quan |
|------|---------|--------------|--------------|
| `index.html` | Trang chủ — topbar, hero, filters, 8 course cards, benefits | `css/global.css`, `css/home.css` | `js/main.js` |

---

## Pages

| File | Vai trò | CSS liên quan | JS liên quan |
|------|---------|--------------|--------------|
| `pages/courses.html` | Danh sách khóa học — hero, filters, 8 cards, lộ trình đề xuất | `css/global.css`, `css/home.css`, `css/courses.css` | `js/main.js` |
| `pages/learning-path.html` | Lộ trình học — hero minh họa bước học, sidebar danh mục, 6 path cards, footer chứng chỉ | `css/global.css`, `css/home.css`, `css/learning-path.css` | `js/learning-path.js` |
| `pages/schedule.html` | Lịch khai giảng — layout 2 cột, danh sách hàng ngang, sidebar (calendar, promo, why) | `css/global.css`, `css/home.css`, `css/schedule.css` | `js/main.js` |
| `pages/course-detail.html` | Chi tiết khóa học — video preview, tabs, sidebar giá | `css/global.css`, `css/home.css`, `css/course-detail.css` | `js/course-detail.js` |
| `pages/teachers.html` | Giảng viên — hero banner, thống kê, filter bar, 8 teacher cards, sidebar CTA + yêu thích | `css/global.css`, `css/home.css`, `css/teachers.css` | _(không có)_ |
| `pages/certificates.html` | Chứng chỉ — hero 3 cột (intro + level cards + assoc panel), danh sách chứng chỉ, vi phạm & tín nhiệm | `css/global.css`, `css/home.css`, `css/certificates.css` | `js/main.js` |
| `pages/register.html` | Đăng ký học — hero nhỏ, grid 2 cột (form 3 section + sidebar tóm tắt đơn hàng & hỗ trợ) | `css/global.css`, `css/home.css`, `css/register.css` | `js/register.js` |
| `pages/support.html` | Hỗ trợ — hero search, 4 kênh liên hệ, form gửi yêu cầu, FAQ accordion 4 tab, sidebar (status/quick-links/community) | `css/global.css`, `css/home.css`, `css/support.css` | `js/support.js` |
| `pages/payment.html` | Thanh toán QR — gradient hero, QR code CSS, đếm ngược 15 phút, mã CK, sidebar lưu ý & hỗ trợ | `css/global.css`, `css/home.css`, `css/payment.css` | `js/payment.js` |

---

## CSS

| File | Vai trò | Dùng cho trang |
|------|---------|----------------|
| `css/global.css` | Reset, body, `.app` wrapper | Tất cả trang |
| `css/home.css` | Topbar, hero, filters, cards, benefits, responsive | `index.html`, `pages/course-detail.html` |
| `css/courses.css` | CTA buttons, badge, filter-search, save/play/LIVE overlays, course-actions, paths section | `pages/courses.html` |
| `css/schedule.css` | Layout 2 cột, sched-row (thumb/info/date/price/heart), mini calendar, promo card, why card | `pages/schedule.html` |
| `css/course-detail.css` | Video preview, tabs, learn-grid, sidebar (giá, info, share) | `pages/course-detail.html` |
| `css/learning-path.css` | Hero art (lp-curve/dot/cap/step), main 2-col layout, sidebar, filters, 6 path cards, footer bar | `pages/learning-path.html` |
| `css/teachers.css` | Hero banner (.tv-hero), numbers card, filter bar, teacher card (.tc-card), sidebar (apply + fav) | `pages/teachers.html` |
| `css/certificates.css` | Hero 3-col, level cards (red/green/gold seal), assoc panel, cert-row grid, violations panel | `pages/certificates.html` |
| `css/register.css` | Hero nhỏ, course-preview grid, form-grid 3-col, pay-grid, bank-info, summary card, help card | `pages/register.html` |
| `css/support.css` | Hero search, sp-channels 4-col, form gửi yêu cầu, FAQ accordion, sidebar (status/quick/community) | `pages/support.html` |
| `css/payment.css` | Gradient wrap, QR box + finder CSS, countdown timer, transfer-code row, note & support side cards | `pages/payment.html` |

---

## JavaScript

| File | Vai trò | Dùng cho trang |
|------|---------|----------------|
| `js/main.js` | Filter chip active, navigate sang course-detail | `index.html` |
| `js/course-detail.js` | Load dữ liệu khóa học từ URL param, tab switching, nút đăng ký → register.html | `pages/course-detail.html` |
| `js/register.js` | Load dữ liệu khóa học từ URL param, populate form, payment method switching, nút CK → payment.html | `pages/register.html` |
| `js/payment.js` | Render QR grid, đếm ngược 15 phút, sinh mã CK động, copy clipboard | `pages/payment.html` |
| `js/support.js` | FAQ accordion open/close, category tab switching | `pages/support.html` |

---

## Assets

| Thư mục | Chứa gì |
|---------|---------|
| `assets/images/` | Ảnh nội dung, banner, thumbnail _(chưa có)_ |
| `assets/icons/` | Icon SVG/PNG _(chưa có)_ |
| `assets/fonts/` | Font tự host _(chưa có — đang dùng Google Fonts)_ |

---

## Sections trong index.html

| Section | Class chính | File CSS | Ghi chú |
|---------|------------|---------|---------|
| Topbar | `.topbar`, `.nav`, `.user` | `home.css` | Nav ẩn trên mobile |
| Hero banner | `.hero`, `.hero-art`, `.stats` | `home.css` | Minh họa trang trí `aria-hidden` |
| Filter chips | `.filters`, `.chip` | `home.css` | JS active state trong `main.js` |
| Course cards | `.cards`, `.course`, `.thumb` | `home.css` | 4 cột desktop → 3 → 2 → 1; ảnh dùng `picsum.photos`; tag variants: `.tag-basic/advanced/marketing/legal/operations` |
| Benefits | `.benefits`, `.benefit` | `home.css` | 4 cột desktop, 1 cột mobile |

---

## Ghi chú cập nhật

- **2026-05-30**: Khởi tạo dự án. Tách từ file mẫu HTML đơn → `index.html` + `css/global.css` + `css/home.css` + `js/main.js`.
- **2026-05-30**: Thêm trang chi tiết khóa học → `pages/course-detail.html` + `css/course-detail.css` + `js/course-detail.js`. Cập nhật `js/main.js` để navigate từ card.
- **2026-05-30**: Mở rộng cards grid thành 8 khóa học, dùng ảnh thực từ picsum.photos, lưới 4 cột responsive.
- **2026-05-30**: Tạo `pages/courses.html` + `css/courses.css`. Nav "Khóa học" trên index.html trỏ tới courses.html.
- **2026-05-30**: Tạo `pages/teachers.html` + `css/teachers.css`. Cập nhật nav "Giảng viên" trên index.html, courses.html, schedule.html, course-detail.html.
