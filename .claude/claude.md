# claude.md

## 1. VAI TRÒ
File này là file điều phối chính cho Claude trong dự án HTML/CSS/JavaScript.
Claude phải đọc file này đầu tiên trước khi phân tích, sửa code, tạo file, debug hoặc tối ưu.

## 2. CẤU TRÚC DỰ ÁN BẮT BUỘC
Claude phải viết code theo đúng cấu trúc sau:

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

Vai trò thư mục:
- `index.html` là trang chính.
- `pages/` chứa các trang HTML phụ.
- `css/` chứa toàn bộ CSS.
- `js/` chứa toàn bộ JavaScript.
- `assets/` chứa ảnh, icon, logo, font, media.
- `.claude/` chứa toàn bộ luật, bản đồ và skill cho Claude.

Claude không được tự ý tạo cấu trúc thư mục khác nếu chưa được yêu cầu.

## 3. NGUYÊN TẮC KHỞI ĐỘNG
Khi nhận bất kỳ prompt nào, Claude phải làm đúng thứ tự:
1. Đọc `.claude/claude.md`.
2. Đọc `.claude/rules.md`.
3. Đọc `.claude/codebase-map.md`.
4. Xác định task thuộc skill nào trong `.claude/skills/`.
5. Đọc đúng skill liên quan.
6. Tìm file cần sửa theo `codebase-map.md`.
7. Chỉ đọc file liên quan trực tiếp.
8. Sửa đúng phạm vi yêu cầu.
9. Kiểm tra giao diện, console, responsive nếu liên quan.
10. Báo cáo kết quả ngắn gọn.

## 4. CẤU TRÚC .CLAUDE
`.claude/claude.md` → bản đồ điều phối Claude.
`.claude/rules.md` → luật bắt buộc khi viết/sửa code.
`.claude/codebase-map.md` → mục lục file dự án, dùng để tìm đúng file cần sửa.
`.claude/skills/` → hướng dẫn chuyên môn theo từng loại task.

## 5. MỤC TIÊU CỦA CLAUDE.MD
Giúp Claude biết:
- Dự án dùng công nghệ gì.
- Cấu trúc thư mục bắt buộc là gì.
- File nào làm nhiệm vụ gì.
- Task hiện tại cần đọc file nào.
- Cần dùng skill nào.
- Không phải đọc toàn bộ codebase.
- Không sửa lan ngoài phạm vi.
- Viết code đúng luật trong `rules.md`.

## 6. LOẠI DỰ ÁN
Dự án mặc định là HTML/CSS/JavaScript thuần.
Stack chính:
- HTML5 cho cấu trúc.
- CSS3 cho giao diện, layout, responsive, animation.
- JavaScript cho tương tác, DOM, form, localStorage, API nếu có.
- Assets cho ảnh, icon, logo, font, media.

## 7. CHIẾN LƯỢC ĐỌC CODEBASE
Không đọc toàn bộ dự án nếu không cần.
Không quét 1000 file một cách mù quáng.
Claude phải dựa vào `.claude/codebase-map.md` để xác định file liên quan.
Chỉ mở rộng phạm vi khi có bằng chứng như:
- File được link/import trực tiếp.
- File chứa class, id, function liên quan.
- Lỗi console chỉ tới file đó.
- Task yêu cầu rõ phải sửa file đó.
- File đó ảnh hưởng trực tiếp tới UI hoặc logic đang sửa.

## 8. BẢN ĐỒ LUỒNG HTML/CSS/JS
Luồng trang cơ bản:
HTML structure → CSS layout → JavaScript event → DOM update → UI result.

Luồng tương tác:
User action → Event listener → Handler → Validate → Update data/state → Update DOM/CSS class → Result.

Luồng debug UI:
HTML section → class/id → CSS rule → responsive breakpoint → browser result.

## 9. CÁCH CHỌN SKILL
Task sửa HTML/CSS/JS chung → đọc `skill-html-css-js.md`.
Task sửa giao diện → đọc `skill-ui-fix.md`.
Task sửa form/input/submit → đọc `skill-form.md`.
Task sửa mobile/tablet/desktop → đọc `skill-responsive.md`.
Task sửa animation/effect → đọc `skill-animation.md`.
Task tối ưu tốc độ → đọc `skill-performance.md`.
Task debug lỗi → đọc `skill-debug.md`.
Task commit/push/git → đọc `skill-git.md`.
Nếu chưa có skill phù hợp, Claude phải báo thiếu skill và đề xuất tạo skill mới.

## 10. QUY TẮC TÌM FILE CẦN SỬA
Luôn tìm file theo thứ tự:
1. Tên trang trong prompt.
2. Tên chức năng trong prompt.
3. Class/id trong HTML.
4. Function/event trong JavaScript.
5. File CSS đang style cho khu vực đó.
6. File asset nếu liên quan ảnh/logo/icon.
7. File được ghi trong lỗi console.

## 11. QUY TẮC KHI THÊM FILE MỚI
Khi Claude tạo file mới, bắt buộc phải cập nhật `.claude/codebase-map.md`.
Phải ghi rõ:
- Tên file mới.
- Vị trí file.
- File dùng để làm gì.
- File liên quan tới trang/module nào.
- Khi nào cần đọc file đó.
Không tạo file mới nếu có thể sửa gọn trong file hiện tại mà không vượt luật.

## 12. QUY TẮC PHẠM VI SỬA
Chỉ sửa file liên quan trực tiếp tới prompt.
Không refactor toàn dự án nếu prompt chỉ yêu cầu sửa một lỗi nhỏ.
Không đổi cấu trúc thư mục nếu chưa được yêu cầu.
Không đổi tên file/class/function nếu không cần thiết.
Không làm thay đổi UI/logic ngoài phần được yêu cầu.

## 13. QUY TẮC CODE CỐT LÕI
Mỗi file code Claude tạo mới hoặc chỉnh sửa lớn không được vượt quá 300 dòng.
Nếu có nguy cơ vượt 300 dòng, phải tách file/module khác.
Code phải có chú thích giải thích khối xử lý quan trọng.
Không comment lại điều hiển nhiên.
Luôn ưu tiên code rõ ràng, dễ đọc, dễ sửa, dễ kiểm tra.

## 14. QUY TẮC KIỂM TRA
Sau khi sửa HTML/CSS/JS phải kiểm tra:
- Không lỗi console liên quan.
- Layout không vỡ.
- Click/event chạy đúng.
- Form validate đúng nếu có.
- Responsive ổn trên mobile/tablet/desktop nếu liên quan.
- Không tạo file thừa hoặc code thừa.

## 15. QUY TẮC GIT
Không commit nếu người dùng chưa yêu cầu.
Không push nếu người dùng chưa yêu cầu.
Không dùng `git add .` khi chưa kiểm tra file thay đổi.
Trước khi commit/push phải kiểm tra diff và báo file đã thay đổi.
Mọi luật Git chi tiết nằm trong `.claude/rules.md` và `skill-git.md`.

## 16. BÁO CÁO KẾT QUẢ
Sau khi làm xong, báo cáo ngắn gọn:
- Đã đọc file nào.
- Đã sửa file nào.
- Đã sửa gì.
- Đã kiểm tra gì.
- Có rủi ro còn lại không.
Không nói hoàn thành nếu chưa kiểm tra.
Không nói đã test nếu chưa test.

## 17. GHI NHỚ
`claude.md` là bộ điều phối.
`rules.md` là luật.
`codebase-map.md` là bản đồ file.
`skills/` là kỹ năng theo task.
Source code thực tế là sự thật cuối cùng.
