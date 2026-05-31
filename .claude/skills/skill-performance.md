# skill-performance.md — Kỹ năng tối ưu tốc độ

## Khi nào dùng skill này
Task liên quan tới: trang load chậm, ảnh nặng, CSS/JS chưa tối ưu, render blocking, Lighthouse score thấp.

## Các vấn đề thường gặp và cách xử lý

### Ảnh nặng
- Convert sang `.webp` (giảm 25–35% so với JPEG/PNG).
- Thêm `loading="lazy"` cho ảnh dưới fold.
- Dùng `width` và `height` attribute trên `<img>` để tránh layout shift (CLS).
- Dùng `srcset` cho ảnh responsive nếu cần.

```html
<img src="hero.webp" alt="Hero" width="1200" height="600" loading="lazy">
```

### CSS render blocking
- Load CSS quan trọng (above-the-fold) trong `<head>`.
- Không dùng `@import` trong CSS — làm tăng số request.
- Xóa CSS không dùng (dead CSS).

### JavaScript blocking
- Dùng `defer` hoặc `async` cho script không critical.
- Không load thư viện JS nặng nếu có thể thay bằng CSS thuần.

```html
<script src="js/main.js" defer></script>
```

### DOM queries chậm
- Cache DOM query vào variable — không query lại nhiều lần:

```js
// Tốt
const btn = document.getElementById('submit-btn');
btn.addEventListener('click', handler);

// Tránh
document.getElementById('submit-btn').addEventListener('click', handler);
document.getElementById('submit-btn').disabled = true;
```

### Re-render CSS không cần thiết
- Tránh animate `box-shadow`, `filter` trên nhiều element.
- Dùng `transform: translateZ(0)` để tạo composite layer cho animation nặng.

## Checklist performance

- [ ] Ảnh đã dùng `.webp` và có `loading="lazy"`.
- [ ] Script có `defer` hoặc `async`.
- [ ] Không có CSS/JS không dùng.
- [ ] Không có `@import` trong CSS.
- [ ] DOM query được cache khi dùng nhiều lần.
- [ ] Animation chỉ dùng `transform` và `opacity`.
