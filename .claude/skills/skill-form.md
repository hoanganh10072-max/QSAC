# skill-form.md — Kỹ năng xử lý form/input/submit

## Khi nào dùng skill này
Task liên quan tới: form HTML, input validation, submit handler, hiển thị lỗi, reset form, gửi dữ liệu qua fetch/API.

## Quy trình xử lý

1. Xác định form cần sửa (id/class từ prompt hoặc HTML).
2. Đọc HTML form — liệt kê các input, type, name, required.
3. Đọc JS handler — xác định logic validate và submit hiện tại.
4. Sửa đúng phần được yêu cầu.
5. Kiểm tra: validate đúng, submit đúng, error message hiển thị, form reset sau submit nếu cần.

## Cấu trúc form chuẩn

```html
<form id="contact-form" novalidate>
  <div class="form-group">
    <label for="email">Email</label>
    <input type="email" id="email" name="email" required>
    <span class="form-error" aria-live="polite"></span>
  </div>
  <button type="submit" class="btn-submit">Gửi</button>
</form>
```

## Validation chuẩn (JS)

```js
function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function showError(inputEl, message) {
  const errorEl = inputEl.closest('.form-group').querySelector('.form-error');
  errorEl.textContent = message;
  inputEl.classList.add('is-invalid');
}

function clearError(inputEl) {
  const errorEl = inputEl.closest('.form-group').querySelector('.form-error');
  errorEl.textContent = '';
  inputEl.classList.remove('is-invalid');
}
```

## Checklist form

- [ ] Mỗi input có `label` liên kết qua `for`/`id`.
- [ ] Validate phía client trước khi submit.
- [ ] Hiển thị error message rõ ràng gần input lỗi.
- [ ] Disable nút submit khi đang gửi (tránh double submit).
- [ ] Reset form sau submit thành công nếu cần.
- [ ] Xử lý lỗi network/API bằng `try/catch`.
