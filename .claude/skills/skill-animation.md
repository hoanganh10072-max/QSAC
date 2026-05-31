# skill-animation.md — Kỹ năng animation/effect

## Khi nào dùng skill này
Task liên quan tới: transition, keyframe animation, hover effect, scroll reveal, loading spinner, skeleton screen, fade in/out, slide, bounce.

## Quy tắc animation

- Ưu tiên CSS animation/transition hơn JS animation.
- Dùng JS animation chỉ khi cần logic phức tạp (scroll position, sequence).
- Luôn dùng `transform` và `opacity` để animate — không animate `width`, `height`, `top`, `left` vì tốn performance.
- Thêm `will-change: transform` chỉ khi thực sự cần thiết (không lạm dụng).
- Tôn trọng `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Thời lượng chuẩn

| Loại | Duration |
|------|----------|
| Micro (hover, focus) | 150ms – 200ms |
| UI transition (modal, dropdown) | 200ms – 300ms |
| Page transition | 300ms – 500ms |
| Decorative (hero, scroll reveal) | 500ms – 800ms |

## Template CSS animation thường dùng

```css
/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
.fade-in {
  animation: fadeIn 0.4s ease forwards;
}

/* Spinner */
@keyframes spin {
  to { transform: rotate(360deg); }
}
.spinner {
  width: 24px; height: 24px;
  border: 3px solid #e5e7eb;
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
```

## Checklist animation

- [ ] Duration hợp lý — không quá nhanh (< 100ms) hoặc quá chậm (> 1s) trừ khi intentional.
- [ ] Easing phù hợp (`ease`, `ease-in-out`, `cubic-bezier`).
- [ ] Không animate layout properties (`width`, `height`, `margin`, `padding`).
- [ ] Có fallback khi `prefers-reduced-motion`.
- [ ] Animation không che khuất nội dung quan trọng.
