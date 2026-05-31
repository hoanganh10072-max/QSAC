# rules.md

## 1. VAI TRÒ
File này là luật bắt buộc cho Claude khi viết, sửa, debug, tối ưu và quản lý code HTML/CSS/JavaScript.
Claude phải tuân thủ file này sau khi đọc `.claude/claude.md`.

## 2. LUẬT KHỞI ĐỘNG
Khi nhận bất kỳ prompt nào, Claude phải đọc theo thứ tự:
1. `.claude/claude.md`
2. `.claude/rules.md`
3. `.claude/codebase-map.md`
4. Skill liên quan trong `.claude/skills/`
5. File code liên quan trực tiếp tới task
Không được sửa code trước khi đọc đủ các file trên.

## 3. LUẬT CẤU TRÚC THƯ MỤC
Claude bắt buộc viết code theo cấu trúc dự án đã định nghĩa trong `.claude/claude.md`.

Cấu trúc chuẩn:

```text
project/
│
├── .claude/
│   ├── claude.md
│   ├── rules.md
│   ├── codebase-map.md
│   └── skills/
│       ├── skill-html-css-js.md
│       ├── skill-ui-fix.md
│       ├── skill-form.md
│       ├── skill-responsive.md
│       ├── skill-animation.md
│       ├── skill-performance.md
│       ├── skill-debug.md
│       └── skill-git.md
│
├── index.html
├── css/
├── js/
├── assets/
└── pages/
```

Quy tắc đặt file:
- File HTML chính đặt ở `index.html`.
- Trang phụ đặt trong `pages/`.
- File CSS đặt trong `css/`.
- File JavaScript đặt trong `js/`.
- Ảnh, icon, logo, font, media đặt trong `assets/`.
- File hướng dẫn Claude đặt trong `.claude/`.
- Skill của Claude đặt trong `.claude/skills/`.

Không được tự ý tạo thư mục mới ngoài cấu trúc này nếu chưa có lý do rõ ràng.
Nếu cần thêm thư mục mới, Claude phải báo lý do trước.

## 4. LUẬT ĐỌC CODEBASE
Không đọc toàn bộ dự án nếu không cần.
Không quét 1000 file một cách mù quáng.
Phải dùng `.claude/codebase-map.md` để tìm đúng file cần đọc.
Chỉ mở rộng sang file khác khi có bằng chứng liên quan.
Không sửa file ngoài phạm vi prompt nếu chưa chứng minh ảnh hưởng.

## 5. LUẬT GIỚI HẠN DÒNG CODE
Mỗi file code Claude tạo mới hoặc chỉnh sửa lớn không được vượt quá 300 dòng.
Nếu có nguy cơ vượt 300 dòng, phải tách thành file/module khác.
Một file chỉ nên có một nhiệm vụ chính.
Không nhồi HTML, CSS và JavaScript lớn vào cùng một file nếu dự án đã tách cấu trúc.
Không tạo file dài khó đọc, khó sửa, khó test.

## 6. LUẬT CHÚ THÍCH CODE
Code Claude viết phải có chú thích cho dòng hoặc khối xử lý quan trọng.
Chú thích phải giải thích mục đích, lý do hoặc tác động của code.
Không comment lại điều hiển nhiên.
HTML section lớn phải có comment đánh dấu khu vực.
CSS block quan trọng phải có comment mô tả vai trò.
JavaScript function quan trọng phải có comment mô tả input, output và tác dụng.
Ví dụ sai: `count++ // tăng count`.
Ví dụ đúng: `count++ // Giới hạn số lần retry để tránh vòng lặp vô hạn`.

## 7. LUẬT PHẠM VI SỬA
Chỉ sửa đúng phần được yêu cầu.
Không refactor toàn dự án nếu prompt chỉ yêu cầu sửa lỗi nhỏ.
Không đổi UI ngoài phạm vi nếu không được yêu cầu.
Không đổi tên file, class, id, function nếu không cần thiết.
Không xoá code cũ khi chưa hiểu tác dụng.
Không tạo thêm thư viện hoặc dependency nếu không thật sự cần.

## 8. LUẬT KHI TẠO FILE MỚI
Chỉ tạo file mới khi cần tách code, tránh vượt 300 dòng hoặc cần module rõ ràng.
Khi tạo file mới phải cập nhật `.claude/codebase-map.md`.
Mục cập nhật phải ghi rõ:
- Tên file mới.
- Vị trí file.
- Tác dụng của file.
- File liên quan tới trang/module nào.
- Khi nào Claude cần đọc file này.
Không tạo file rác, file thử nghiệm, file backup hoặc file tạm trong project.

## 9. LUẬT HTML
HTML phải đúng cấu trúc semantic.
Luôn có `<!doctype html>`, `html`, `head`, `body`.
Luôn có meta viewport cho responsive.
Mỗi trang chỉ nên có một `h1` chính.
Dùng `header`, `main`, `section`, `article`, `footer` khi phù hợp.
Button dùng cho hành động, link dùng cho điều hướng.
Input phải có `label` hoặc `aria-label`.
Ảnh quan trọng phải có `alt` rõ nghĩa.
Không viết inline style dài trong HTML.
Không viết JavaScript dài trực tiếp trong HTML.

## 10. LUẬT CSS
CSS phải có cấu trúc rõ: base → layout → components → states → responsive → animation.
Class phải đặt tên rõ nghĩa theo chức năng hoặc khu vực giao diện.
Không lạm dụng `!important`; nếu bắt buộc dùng phải comment lý do.
Không lặp style nhiều lần nếu có thể tách class dùng lại.
Không dùng width cố định gây vỡ layout trên mobile.
Ưu tiên flex, grid, max-width, clamp khi phù hợp.
Animation nên ưu tiên transform và opacity để mượt hơn.

## 11. LUẬT JAVASCRIPT
JavaScript phải rõ luồng: select DOM → bind event → validate → xử lý → update UI.
Không viết function quá dài hoặc làm nhiều việc cùng lúc.
Không query DOM lặp lại nhiều lần nếu có thể lưu biến.
Không tạo event listener trùng lặp.
Không dùng biến global bừa bãi.
Không dùng `eval`.
Không dùng `catch` rỗng.
Nếu dùng localStorage/sessionStorage phải parse an toàn bằng try/catch.

## 12. LUẬT FORM
Form phải validate trước khi submit.
Trường bắt buộc phải có thông báo lỗi rõ ràng.
Không xoá dữ liệu người dùng nhập khi submit lỗi.
Button submit phải có loading hoặc disabled nếu xử lý lâu.
Lỗi nên hiển thị gần trường liên quan.
Không chỉ validate bằng HTML; logic JavaScript cũng phải kiểm tra.

## 13. LUẬT UI / UX
Mỗi màn hình cần kiểm tra trạng thái bình thường, loading, error, empty nếu có dữ liệu động.
Button phải có hover, focus, disabled khi phù hợp.
Modal, menu, dropdown phải có cách đóng rõ ràng.
Không làm hiệu ứng quá nặng gây khó dùng.
Không hy sinh readability để làm giao diện chỉ đẹp hơn.
Màu chữ và nền phải đủ tương phản.
Kích thước chữ, khoảng cách và nút bấm phải phù hợp mobile.

## 14. LUẬT RESPONSIVE
Phải kiểm tra mobile, tablet và desktop nếu giao diện liên quan.
Không để trang tràn ngang màn hình.
Không để chữ, ảnh, button, form bị đè nhau.
Không dùng font quá nhỏ trên mobile.
Media query phải có breakpoint rõ ràng.
Layout phức tạp nên dùng flex hoặc grid.

## 15. LUẬT ASSET
Ảnh, icon, logo, font phải đặt đúng thư mục assets hoặc thư mục đã quy định.
Tên file asset phải rõ nghĩa.
Không dùng ảnh quá nặng nếu có thể tối ưu.
Không tự ý bóp méo logo hoặc brand asset.
Không dùng link ảnh ngoài nếu dự án cần chạy local/offline.

## 16. LUẬT API / DATA NẾU CÓ
Không gọi API rải rác nhiều nơi nếu có thể tách function riêng.
Request phải xử lý loading, success và error.
Không tin dữ liệu API luôn đúng format.
Phải kiểm tra null/undefined trước khi render.
Không hiển thị lỗi kỹ thuật thô cho người dùng cuối.
Không log token hoặc dữ liệu nhạy cảm.

## 17. LUẬT LOCALSTORAGE
Chỉ lưu dữ liệu cần thiết.
Không lưu password, token nhạy cảm nếu không được yêu cầu rõ.
Khi đọc JSON phải có try/catch.
Phải có fallback nếu dữ liệu lỗi hoặc rỗng.
Không để localStorage quyết định quyền truy cập quan trọng nếu không có backend xác thực.

## 18. LUẬT PERFORMANCE
Không nhúng CSS/JS thừa.
Không dùng thư viện nặng cho việc đơn giản.
Không thao tác DOM liên tục trong vòng lặp lớn nếu có thể gom lại.
Không tạo animation nặng trên nhiều phần tử cùng lúc.
Không dùng ảnh gốc quá lớn cho thumbnail.
Script nên đặt cuối body hoặc dùng defer khi phù hợp.

## 19. LUẬT ACCESSIBILITY
Ảnh quan trọng cần alt.
Input cần label hoặc aria-label.
Button phải focus được bằng bàn phím.
Không bỏ outline focus nếu không thay bằng focus style khác.
Màu sắc không được là cách duy nhất để truyền thông tin lỗi/thành công.
Modal nên có nút đóng rõ ràng.

## 20. LUẬT DEBUG
Trang trắng: kiểm tra console, đường dẫn file, script load order, syntax error.
CSS không ăn: kiểm tra link CSS, selector, class name, specificity, cache.
Click không chạy: kiểm tra selector, event listener, script load order, console error.
Layout vỡ: kiểm tra HTML structure, box model, flex/grid, width, overflow, media query.
Dữ liệu không hiện: kiểm tra data source, DOM query, render function, localStorage/API.
Responsive lỗi: kiểm tra breakpoint, fixed width, image size, container overflow.

## 21. LUẬT TEST THỦ CÔNG
Sau khi sửa phải kiểm tra trên trình duyệt nếu có thể.
Phải mở DevTools để kiểm tra console.
Phải kiểm tra click, hover, form, modal, menu nếu có liên quan.
Phải kiểm tra mobile/tablet/desktop nếu sửa giao diện.
Nếu không test được, phải báo rõ lý do.
Không nói đã test nếu chưa test thật.

## 22. LUẬT GIT / COMMIT / PUSH
Không commit nếu người dùng chưa yêu cầu rõ.
Không push nếu người dùng chưa yêu cầu rõ.
Không merge, rebase, reset, revert nếu người dùng chưa yêu cầu rõ.
Không force push trừ khi người dùng yêu cầu trực tiếp và đã cảnh báo rủi ro.
Không dùng `git add .` khi chưa kiểm tra file thay đổi.
Trước commit phải kiểm tra `git status` và `git diff` nếu có quyền terminal.
Commit message phải ngắn gọn và đúng nội dung sửa.
Không đưa file tạm, cache, log, ảnh thừa, build artifact vào commit.
Nếu push lỗi, không tự ý dùng lệnh nguy hiểm; phải báo lỗi và xin hướng xử lý.

## 23. LUẬT BÁO CÁO
Sau mỗi nhiệm vụ phải báo cáo ngắn gọn:
- Đã đọc file nào.
- Đã sửa file nào.
- Đã sửa gì.
- Nguyên nhân lỗi là gì nếu là bug.
- Đã kiểm tra gì.
- Còn rủi ro gì không.
Không báo hoàn thành nếu còn lỗi chưa xử lý.
Không nói chắc chắn khi chưa có bằng chứng.

## 24. GHI NHỚ
`claude.md` là bộ điều phối.
`rules.md` là luật bắt buộc.
`codebase-map.md` là bản đồ file.
`skills/` là kỹ năng theo task.
Source code thực tế là sự thật cuối cùng.
Claude phải viết code ngắn, rõ, có chú thích, dễ sửa, dễ tách và dễ kiểm tra.
