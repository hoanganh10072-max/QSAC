# codebase-map.md — Bản đồ file dự án

> Cập nhật file này mỗi khi tạo file mới hoặc xóa file.
> Claude dùng file này để tìm đúng file cần đọc/sửa mà không phải quét toàn bộ dự án.

---

## Trang chính

| File | Vai trò | CSS liên quan | JS liên quan |
|------|---------|--------------|--------------|
| `index.html` | Trang chủ — topbar, hero, filters, 8 course cards, benefits | `css/global.css`, `css/home.css` | `js/main.js` |

---

## Admin (khu vực quản trị, URL kiểu cũ `/admin/`)

| File | Vai trò | CSS liên quan | JS liên quan |
|------|---------|--------------|--------------|
| `admin/index.html` | Trang login admin — form username/password, toggle hiện mật khẩu, alert lỗi, link demo credential | `css/global.css`, `css/admin.css` | `js/admin-login.js` |
| `admin/dashboard.html` | Dashboard tổng quan — sidebar 7 mục, topbar, 4 stats cards, bảng đơn hàng, top khoá học | `css/global.css`, `css/admin.css`, `css/admin-crud.css` | `js/admin-shared.js`, `js/admin-dashboard.js` |
| `admin/courses.html` | CRUD khoá học — search/filter danh mục+trạng thái, table có thumbnail, modal form 13 trường: thông tin khoá (ảnh, tên, danh mục, GV, giá, tuần, bài, trạng thái) + **khai giảng tùy chọn** (startDate, timeStart, timeEnd, seatsLeft, label HOT/BEST/NEW) | `css/global.css`, `css/admin.css`, `css/admin-crud.css` | `js/admin-shared.js`, `js/admin-courses.js` |
| `admin/students.html` | CRUD học viên — search/filter trạng thái, table có 3 nút (xem/sửa/xoá), modal Xem hiển thị hồ sơ + nút Khoá/Mở khoá tài khoản | `css/global.css`, `css/admin.css`, `css/admin-crud.css` | `js/admin-shared.js`, `js/admin-students.js` |
| `admin/orders.html` | CRUD đơn hàng — search/filter trạng thái+phương thức, sinh mã `#QSxxxxx` tự động | `css/global.css`, `css/admin.css`, `css/admin-crud.css` | `js/admin-shared.js`, `js/admin-orders.js` |
| `admin/teachers.html` | CRUD giảng viên — search/filter chuyên môn, table có rating | `css/global.css`, `css/admin.css`, `css/admin-crud.css` | `js/admin-shared.js`, `js/admin-teachers.js` |
| `admin/certificates.html` | CRUD chứng chỉ — search/filter cấp độ (red/green/gold) + trạng thái, sinh mã `QSAC-YYYY-NNNN` | `css/global.css`, `css/admin.css`, `css/admin-crud.css` | `js/admin-shared.js`, `js/admin-certificates.js` |
| `admin/settings.html` | Cài đặt — form cấu hình website, đổi mật khẩu admin, CRUD tài khoản admin, export/import/reset dữ liệu | `css/global.css`, `css/admin.css`, `css/admin-crud.css` | `js/admin-shared.js`, `js/admin-settings.js` |

> Khu vực admin không có link công khai từ giao diện public — chỉ truy cập qua URL trực tiếp `/admin/`. Session lưu ở `localStorage` key `qsac_admin_session` với expiresAt (8h / 7 ngày nếu "Ghi nhớ"). Credential mặc định: `admin` / `qsac@2026` — có thể đổi qua trang Cài đặt (lưu ở `qsac_admin_password`). Thay bằng API auth thật khi gắn backend.

### Storage keys (localStorage)
| Key | Nội dung | File quản lý |
|-----|----------|--------------|
| `qsac_admin_session` | Session login `{user, loginAt, expiresAt}` | login + shared (guard) |
| `qsac_admin_password` | Mật khẩu admin đã đổi (fallback về `qsac@2026`) | settings (đổi) + login (đọc) |
| `qsac_admin_courses` | Mảng khoá học (gồm cả thông tin khai giảng: startDate/timeStart/timeEnd/seatsLeft/label) | admin-courses |
| `qsac_admin_students` | Mảng học viên | admin-students |
| `qsac_admin_orders` | Mảng đơn hàng | admin-orders |
| `qsac_admin_teachers` | Mảng giảng viên | admin-teachers |
| `qsac_admin_certificates` | Mảng chứng chỉ | admin-certificates |
| `qsac_admin_users` | Mảng tài khoản admin | admin-settings |
| `qsac_admin_config` | Object cấu hình website | admin-settings |

---

## Pages

| File | Vai trò | CSS liên quan | JS liên quan |
|------|---------|--------------|--------------|
| `pages/courses.html` | Danh sách khóa học — hero, filters, 8 cards, lộ trình đề xuất | `css/global.css`, `css/home.css`, `css/courses.css` | `js/main.js` |
| `pages/learning-path.html` | Lộ trình học — hero minh họa bước học, sidebar danh mục, 6 path cards, footer chứng chỉ | `css/global.css`, `css/home.css`, `css/learning-path.css` | `js/learning-path.js` |
| `pages/schedule.html` | Lịch khai giảng — layout 2 cột, danh sách render động từ `#schedList`, sidebar calendar tương tác render JS từ events thực tế của tháng đang xem | `css/global.css`, `css/home.css`, `css/schedule.css` | `js/public-data.js`, `js/schedule.js` |
| `pages/course-detail.html` | Chi tiết khóa học — video preview, tabs, sidebar giá | `css/global.css`, `css/home.css`, `css/course-detail.css` | `js/course-detail.js` |
| `pages/teachers.html` | Giảng viên — hero banner, thống kê, filter bar, danh sách GV render động từ `#teacherCards`, sidebar CTA + top 4 yêu thích render động `#teacherFavList` | `css/global.css`, `css/home.css`, `css/teachers.css` | `js/public-data.js`, `js/teachers.js` |
| `pages/certificates.html` | Chứng chỉ — hero 3 cột (intro + level cards + assoc panel), danh sách chứng chỉ render động từ `#certRows`, vi phạm & tín nhiệm | `css/global.css`, `css/home.css`, `css/certificates.css` | `js/public-data.js`, `js/certificates.js` |
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
| `css/admin.css` | Tokens admin, login card, dashboard layout (sidebar tối + main), topbar admin, stats cards (4 variants), table, rank list, responsive | Tất cả trang admin |
| `css/admin-crud.css` | Page head, toolbar, button variants, row actions, modal + form 2 cột, toast, confirm dialog, empty state, settings grid | Tất cả trang CRUD admin |

---

## JavaScript

| File | Vai trò | Dùng cho trang |
|------|---------|----------------|
| `js/public-data.js` | **Cầu nối admin ↔ public — bắt buộc load trước main/courses/course-detail/teachers/certificates/schedule.** Đọc 3 key localStorage: `qsac_admin_courses`, `qsac_admin_teachers`, `qsac_admin_certificates`. Fallback SEED đồng bộ admin. API: `getCourses({onlyActive})`, `getCourse(id)`, `getTeachers({onlyActive})` (merge UI defaults), `getCertificateRecords({onlyValid})`, `getSchedule({onlyActive})` (**lọc course có startDate, không còn key riêng** — enrich dayLabel/dateFmt/labelText/levelLabel, sort theo ngày gần nhất), helpers UI `formatMoney`/`categoryLabel`/`categoryTagClass`/`priceVariantClass`/`btnVariantClass` | Mọi trang public cần dữ liệu admin |
| `js/teachers.js` | Render danh sách GV + top 4 yêu thích từ PublicData.getTeachers(), bind favourite toggle, click "Xem chi tiết" → courses.html, search/filter placeholder | `pages/teachers.html` |
| `js/certificates.js` | Render danh sách chứng chỉ từ PublicData.getCertificateRecords() (tự sinh expiry = issuedAt + 2 năm, score theo level), bind tabs filter (red/green/gold), view/more buttons | `pages/certificates.html` |
| `js/main.js` | Render 8 card đầu của trang chủ từ PublicData (tag màu, giá, "Chi tiết" tới ?id=admin_id), bind filter chips | `index.html` |
| `js/course-detail.js` | Đọc id từ URL → PublicData.getCourse → merge với ENRICH (learns/intro cho 8 khoá seed); khoá mới của admin dùng DEFAULT_ENRICH; tính discount từ oldPrice, render đầy đủ các field, tab switching, nút đăng ký | `pages/course-detail.html` |
| `js/register.js` | Load dữ liệu khóa học từ URL param, populate form, payment method switching, nút CK → payment.html | `pages/register.html` |
| `js/payment.js` | Render QR grid, đếm ngược 15 phút, sinh mã CK động, copy clipboard | `pages/payment.html` |
| `js/support.js` | FAQ accordion open/close, category tab switching | `pages/support.html` |
| `js/schedule.js` | Render danh sách lịch khai giảng từ `PublicData.getSchedule()` vào `#schedList`, filter chips theo `data-filter` level, heart/save (toast), play/register navigate. **Mini calendar:** đọc events từ `.sched-row .sched-date b` đã render (regex DD/MM/YYYY), render theo tháng đang xem, nav ‹›, click ngày có khai giảng → `scrollIntoView` + flash row 1.4s, gắn class `.today` nếu trùng ngày hiện tại | `pages/schedule.html` |
| `js/admin-login.js` | Validate form login, check credential (đọc password từ `qsac_admin_password` hoặc fallback `qsac@2026`), lưu session, toggle hiện mật khẩu, auto-redirect nếu đã login | `admin/index.html` |
| `js/admin-guard.js` | **Bắt buộc nhúng SYNC trong `<head>` (không defer) ở mọi trang admin trừ login.** Đọc `qsac_admin_session`, hết hạn hoặc thiếu → `location.replace('index.html')`. Chạy trước khi body render → tránh flash-of-unauthorized-content. Try/catch toàn bộ; lỗi localStorage cũng chặn để an toàn. | dashboard, courses, students, orders, teachers, certificates, settings |
| `js/admin-shared.js` | **Bắt buộc load đầu tiên ở mọi trang admin.** Expose `AdminShared`: guardSession (chạy runtime để bắt session hết hạn giữa chừng + render avatar), bindLogout, bindSidebar (active theo URL), loadData/saveData (localStorage có try/catch), openModal/closeModal, confirmDialog động, toast, escapeHtml, formatMoney, uid | Tất cả trang admin |
| `js/admin-dashboard.js` | Init nhẹ: guard + sidebar + logout (stats là HTML tĩnh, chưa đọc realtime) | `admin/dashboard.html` |
| `js/admin-courses.js` | CRUD khoá học: seed 8 khoá khớp public (c1..c5 có khai giảng, c6..c8 không), image picker (URL hoặc base64 via FileReader, cảnh báo > 500KB), validate trường khoá học + nhánh khai giảng (nếu nhập startDate → bắt buộc timeStart/timeEnd, end > start), mã sinh bằng `uid()` | `admin/courses.html` |
| `js/admin-students.js` | CRUD học viên: seed 8 hv, 3 nút thao tác (xem/sửa/xoá), modal Xem render hồ sơ + nút Khoá/Mở khoá tài khoản (toggle status active↔locked có confirm), validate email + phone regex | `admin/students.html` |
| `js/admin-orders.js` | CRUD đơn hàng: seed 7 đơn, sinh mã `#QSxxxxx` tự tăng, check trùng mã | `admin/orders.html` |
| `js/admin-teachers.js` | CRUD giảng viên: seed 8 gv, rating slider 0-5 | `admin/teachers.html` |
| `js/admin-certificates.js` | CRUD chứng chỉ: seed 6 chứng chỉ, sinh mã `QSAC-YYYY-NNNN`, level red/green/gold | `admin/certificates.html` |
| `js/admin-settings.js` | Form config website + đổi mật khẩu + CRUD tài khoản admin (tài khoản gốc `admin` không cho xoá) + export/import/reset JSON | `admin/settings.html` |

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
- **2026-06-10**: Thêm khu vực admin `/admin/` (folder top-level mới, ngoài cấu trúc chuẩn — lý do: dùng URL kiểu cũ `localhost/admin/`). Gồm `admin/index.html` (login), `admin/dashboard.html` (shell), `css/admin.css`, `js/admin-login.js`, `js/admin-dashboard.js`. Không có link công khai từ giao diện public.
- **2026-06-10**: Mở rộng admin thành full CRUD cho 6 mục sidebar. Thêm `admin/{courses,students,orders,teachers,certificates,settings}.html`, `js/admin-{shared,courses,students,orders,teachers,certificates,settings}.js`, `css/admin-crud.css`. Refactor `admin-dashboard.js` dùng `AdminShared`. Mỗi trang có search + filter + modal form + confirm dialog + toast, dữ liệu seed mock và lưu localStorage. Trang settings có CRUD tài khoản admin + đổi mật khẩu + export/import/reset toàn bộ data.
- **2026-06-10**: Bổ sung trường ảnh cho khoá học. Form admin/courses.html có image picker (preview 120×80, paste URL ngoài hoặc upload file → base64). Table có cột thumbnail 48×32. Seed cập nhật với URL picsum.photos khớp index.html public. Style mới: `.adm-img-picker`, `.adm-thumb` trong `css/admin-crud.css`.
- **2026-06-10**: Đồng bộ admin ↔ public cho **giảng viên** và **chứng chỉ**. Mở rộng `js/public-data.js` thêm `getTeachers()` (merge UI defaults: màu cover/badge/avatar/students count, đếm coursesCount từ `qsac_admin_courses` theo tên GV) và `getCertificateRecords()` (tự sinh expiry = issuedAt + 2 năm, score theo level). Refactor `pages/teachers.html` + `js/teachers.js` để render 8 card từ PublicData (thay HTML hardcode); sidebar top 4 yêu thích cũng render động. Refactor `pages/certificates.html` + `js/certificates.js` để render `.cert-row` từ admin, tabs lọc theo `data-level`. Từ giờ admin sửa/thêm/xoá GV hoặc chứng chỉ là trang user cập nhật ngay.
- **2026-06-10**: Fix bug `public-data.js:readList()` — phân biệt "chưa có key" (fallback seed) với "admin xoá hết" (raw `"[]"` → trả `[]`). Trước fix, xoá hết khoá học/GV/cert thì trang user vẫn hiển thị 8 seed mặc định.
- **2026-06-10**: Tăng cường chặn truy cập admin. Tạo `js/admin-guard.js` chạy SYNC trong `<head>` của 7 trang admin (dashboard, courses, students, orders, teachers, certificates, settings) — redirect về `index.html` trước khi body render nếu thiếu/hết hạn session. Tránh flash-of-content khi `admin-shared.js` defer chạy chậm hơn.
- **2026-06-10**: Bỏ auto-redirect ở `js/admin-login.js` — vào `/admin/` luôn hiện form login dù session còn hạn. Chỉ giữ dọn session lỗi format trong try/catch.
- **2026-06-10**: Bổ sung modal Xem ở `admin/students.html` — 3 nút thao tác (xem/sửa/xoá); modal Xem hiển thị hồ sơ + nút Khoá/Mở khoá tài khoản (toggle status active↔locked, confirm trước, đồng bộ pill ngay trong modal). Guard `admin-guard.js` đã có sẵn.
- **2026-06-10**: Thêm module **Lịch khai giảng**. Tạo `admin/schedule.html` + `js/admin-schedule.js` (CRUD đầy đủ: 14 trường, seed 5 lịch khớp data public cũ, validate giờ kết thúc > bắt đầu). Mở rộng `js/public-data.js` thêm `getSchedule()` (enrich `dayLabel` thứ-trong-tuần, `dateFmt` DD/MM/YYYY, `labelText` HOT/BEST/NEW, sort theo ngày). Refactor `pages/schedule.html` (bỏ 5 sched-row hardcode → `#schedList`, đổi chips filter theo `data-filter` level) + `js/schedule.js` (render rows từ PublicData rồi mới gọi `initCalendar`). Thêm nav "Lịch khai giảng" vào sidebar 7 trang admin còn lại. Key `qsac_admin_schedule` được thêm vào `ALL_DATA_KEYS` để export/import/reset.
- **2026-06-10**: **Gộp khai giảng vào khoá học.** Xoá `admin/schedule.html` + `js/admin-schedule.js`, gỡ nav "Lịch khai giảng" khỏi 7 trang admin, gỡ `qsac_admin_schedule` khỏi `ALL_DATA_KEYS`. Thêm 5 trường vào form `admin/courses.html` (startDate/timeStart/timeEnd/seatsLeft/label) và seed admin-courses (c1..c5 có khai giảng). `PublicData.getSchedule()` đổi nguồn: đọc `qsac_admin_courses` rồi lọc `c.startDate` thay vì key riêng — shape kết quả không đổi nên `js/schedule.js` không cần refactor. Validate khoá học: nếu nhập startDate thì bắt buộc timeStart/timeEnd, giờ kết thúc > giờ bắt đầu.
