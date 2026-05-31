# skill-ui-fix.md — Kỹ năng sửa giao diện

## Khi nào dùng skill này
Task liên quan tới: layout vỡ, màu sắc sai, khoảng cách lệch, font sai, element bị ẩn/hiển thị sai, z-index chồng lấp, overflow ẩn nội dung.

## Quy trình xử lý

1. Xác định element bị lỗi UI (tên section, class, id từ prompt).
2. Tìm file HTML chứa element đó qua `codebase-map.md`.
3. Tìm CSS file style cho element đó.
4. Đọc CSS rule liên quan — xác định nguyên nhân gốc.
5. Sửa CSS — không dùng `!important` trừ khi cần thiết.
6. Kiểm tra kết quả trên tất cả breakpoint nếu liên quan responsive.

## Checklist kiểm tra UI

- [ ] Layout không bị vỡ ở desktop (min 1024px).
- [ ] Không overflow ngang ẩn nội dung.
- [ ] Màu sắc dùng CSS variable — không hardcode.
- [ ] Font size, line-height, spacing hợp lý.
- [ ] z-index không conflict giữa các layer.
- [ ] Hover/focus state hiển thị đúng.

## Nguyên nhân UI lỗi thường gặp

| Triệu chứng | Nguyên nhân thường gặp |
|------------|----------------------|
| Layout vỡ | `width: 100%` + `padding` không dùng `box-sizing: border-box` |
| Overflow ngang | Phần tử con rộng hơn container, thiếu `overflow: hidden` |
| Element bị ẩn | `display: none`, `visibility: hidden`, `opacity: 0`, `z-index` thấp hơn overlay |
| Màu sai | Override bởi specificity cao hơn, hoặc CSS variable bị ghi đè |
| Spacing lệch | `margin collapse` giữa block elements |
