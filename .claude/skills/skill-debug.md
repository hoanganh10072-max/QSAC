# skill-debug.md — Kỹ năng debug lỗi

## Khi nào dùng skill này
Task liên quan tới: lỗi console, element không hiển thị, event không chạy, data không load, JS throw error, CSS không apply.

## Quy trình debug

1. Đọc lỗi console → lấy file name + line number.
2. Tìm file đó qua `codebase-map.md`.
3. Đọc đoạn code liên quan.
4. Xác định nguyên nhân gốc — không sửa triệu chứng.
5. Sửa đúng nguyên nhân.
6. Xác nhận lỗi console đã hết.

## Phân loại lỗi thường gặp

### JavaScript errors

| Lỗi | Nguyên nhân thường gặp |
|-----|----------------------|
| `Cannot read properties of null` | Query selector trả về null — element chưa tồn tại trong DOM |
| `ReferenceError: X is not defined` | Biến/function chưa khai báo hoặc scope sai |
| `TypeError: X is not a function` | Gọi method sai tên, hoặc biến không phải function |
| `Uncaught SyntaxError` | Cú pháp JS sai — thiếu ngoặc, dấu phẩy, v.v. |
| `Failed to fetch` | API endpoint sai, CORS, hoặc mạng lỗi |

### CSS không apply

| Triệu chứng | Kiểm tra |
|------------|----------|
| Style không thấy | Selector có đúng không? File CSS đã được link chưa? |
| Style bị override | Specificity — dùng DevTools để xem rule nào thắng |
| Pseudo-class không chạy | Cú pháp `:hover`, `:focus` đúng chưa? |

### HTML/DOM

| Triệu chứng | Kiểm tra |
|------------|----------|
| Element không hiện | `display: none`? `visibility: hidden`? `opacity: 0`? `height: 0`? |
| Click không phản hồi | `pointer-events: none`? Element bị element khác che (`z-index`)? |
| Form không submit | `type="submit"` đúng chưa? Có `e.preventDefault()` bị thiếu không? |

## Công cụ debug

- **DevTools > Console**: xem lỗi JS.
- **DevTools > Elements**: kiểm tra DOM, class, style computed.
- **DevTools > Network**: kiểm tra request thất bại.
- **DevTools > Sources > Breakpoints**: debug JS từng dòng.

## Lưu ý

- Xóa tất cả `console.log` debug tạm thời trước khi hoàn thành task.
- Không sửa bằng cách comment out code lỗi — phải hiểu và sửa đúng.
