# skill-html-css-js.md — Kỹ năng HTML/CSS/JS tổng quát

## Khi nào dùng skill này
Task yêu cầu sửa/tạo HTML, CSS, JS mà không thuộc rõ ràng skill chuyên biệt nào.

## Quy trình xử lý

1. Xác định file cần sửa qua `codebase-map.md`.
2. Đọc HTML → xác định cấu trúc section, class, id liên quan.
3. Đọc CSS liên quan → hiểu style hiện tại.
4. Đọc JS liên quan → hiểu logic hiện tại.
5. Sửa đúng phạm vi — không đụng phần khác.
6. Kiểm tra: không lỗi console, layout không vỡ, event chạy đúng.

## Checklist trước khi submit

- [ ] HTML valid, đúng semantic.
- [ ] CSS không có selector thừa, không `!important` tùy tiện.
- [ ] JS không có `var`, không `console.log` thừa.
- [ ] Không thêm file mới không cần thiết.
- [ ] `codebase-map.md` đã cập nhật nếu tạo file mới.

## Lỗi thường gặp

- Class/id HTML không khớp với CSS selector → kiểm tra lại tên.
- JS chạy trước DOM ready → bọc trong `DOMContentLoaded` hoặc dùng `defer`.
- CSS bị override bởi specificity cao hơn → tăng specificity hoặc kiểm tra thứ tự import.
