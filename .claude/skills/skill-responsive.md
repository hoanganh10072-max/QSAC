# skill-responsive.md — Kỹ năng responsive (mobile/tablet/desktop)

## Khi nào dùng skill này
Task liên quan tới: layout vỡ trên mobile, font quá nhỏ/lớn, khoảng cách sai theo màn hình, menu mobile, ảnh không co giãn đúng.

## Breakpoint chuẩn của dự án

```css
/* Mobile first */
/* Default styles: mobile (< 768px) */

/* Tablet */
@media (min-width: 768px) { }

/* Desktop */
@media (min-width: 1024px) { }

/* Wide screen */
@media (min-width: 1280px) { }
```

## Quy trình xử lý

1. Xác định breakpoint bị lỗi (mobile / tablet / desktop).
2. Tìm CSS file liên quan qua `codebase-map.md`.
3. Tìm `@media` query liên quan trong file CSS.
4. Sửa đúng breakpoint — không làm vỡ breakpoint khác.
5. Kiểm tra lại tất cả breakpoint sau khi sửa.

## Checklist responsive

- [ ] `<meta name="viewport">` có trong `<head>`.
- [ ] Không có `width` cứng px cho container chính — dùng `max-width` + `width: 100%`.
- [ ] Ảnh dùng `max-width: 100%; height: auto`.
- [ ] Font size đủ lớn trên mobile (tối thiểu 14px body text).
- [ ] Touch target tối thiểu 44×44px (button, link).
- [ ] Không overflow ngang trên mobile.
- [ ] Navigation mobile hoạt động đúng (hamburger menu nếu có).

## Lỗi responsive thường gặp

| Triệu chứng | Nguyên nhân |
|------------|-------------|
| Overflow ngang mobile | Element con có `width` cứng vượt viewport |
| Font quá nhỏ | Không có `@media` điều chỉnh font cho mobile |
| Button quá nhỏ | Thiếu `padding` đủ cho touch target |
| Grid/flex không wrap | Thiếu `flex-wrap: wrap` hoặc `grid-template-columns` không đổi theo breakpoint |
