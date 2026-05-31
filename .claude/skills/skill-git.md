# skill-git.md — Kỹ năng Git

## Khi nào dùng skill này
Task liên quan tới: commit, push, pull, branch, merge, rebase, kiểm tra diff, xem lịch sử, resolve conflict.

## Luật Git bắt buộc (từ claude.md)

- **Không commit** nếu người dùng chưa yêu cầu.
- **Không push** nếu người dùng chưa yêu cầu.
- **Không dùng `git add .`** khi chưa kiểm tra file thay đổi.
- Trước commit phải kiểm tra `git diff` và báo cáo file đã thay đổi.
- Không dùng `--no-verify` để bỏ qua hook trừ khi được yêu cầu rõ ràng.
- Không force push lên `main`/`master`.

## Quy trình commit chuẩn

```bash
# 1. Kiểm tra file thay đổi
git status

# 2. Xem nội dung thay đổi
git diff

# 3. Stage file cụ thể (không dùng git add .)
git add css/home.css js/main.js

# 4. Commit với message rõ ràng
git commit -m "fix: sửa layout vỡ trên mobile trang chủ"
```

## Commit message convention

Format: `<type>: <mô tả ngắn gọn>`

| Type | Dùng khi |
|------|----------|
| `feat` | Thêm tính năng mới |
| `fix` | Sửa bug |
| `style` | Sửa CSS/UI không ảnh hưởng logic |
| `refactor` | Tái cấu trúc code không thêm tính năng |
| `docs` | Cập nhật tài liệu |
| `chore` | Cập nhật config, dependency |

## Quy trình làm việc với branch

```bash
# Tạo branch mới từ main
git checkout -b feature/ten-tinh-nang

# Làm việc → commit → push
git push -u origin feature/ten-tinh-nang

# Merge vào main (sau khi review)
git checkout main
git merge feature/ten-tinh-nang --no-ff
```

## Kiểm tra trước khi commit

- [ ] `git status` không có file không mong muốn.
- [ ] `git diff` đã xem xét tất cả thay đổi.
- [ ] Không commit file `.env`, secret, credential.
- [ ] Không commit file build/dist nếu có `.gitignore`.
- [ ] Commit message rõ ràng, đúng format.
