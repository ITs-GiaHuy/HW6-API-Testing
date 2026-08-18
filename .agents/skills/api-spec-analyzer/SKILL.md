---
name: "api-spec-analyzer"
description: "Phân tích đặc tả API, trích xuất cấu trúc dữ liệu, phân loại kiến trúc và suy luận các quy tắc nghiệp vụ ngầm định (Implicit Business Rules)."
---

# API Spec Analyzer

## 1. Mục tiêu và Vai trò
Kỹ năng này đóng vai trò là **Module 1** trong pipeline tạo test case tự động cho hệ thống API.
Nhiệm vụ chính:
1. Đọc và trích xuất đặc tả từ tài liệu API (OpenAPI/Swagger, Markdown, SRS).
2. Phân loại cấu trúc API theo chuẩn RFC (Idempotency, HTTP Methods) và Taxonomy của Parameter.
3. Chủ động áp dụng các mẫu hình tiêu chuẩn ngành để suy luận các quy tắc nghiệp vụ ngầm định (Implicit Business Rules) mà tài liệu thường không ghi rõ hoặc bỏ sót.
4. Xuất ra định dạng đặc tả trung gian (Normalized IR) làm đầu vào chuẩn xác cho các module sinh test case (Domain Partition, State Transition, Security, Schema Validation).

---

## 2. Nền tảng Kiến thức Cốt lõi (Domain Knowledge)

### 2.1. Phân loại API theo RFC 9110 & Kiến trúc
- **Idempotency (Tính lũy đẳng)**: 
  - `GET`, `PUT`, `DELETE`, `HEAD`, `OPTIONS`: Gọi nhiều lần liên tiếp không làm thay đổi trạng thái sau lần thành công đầu tiên.
  - `POST`, `PATCH`: Có thể làm thay đổi trạng thái hoặc sinh tài nguyên mới liên tục.
- **Architectural Styles**:
  - *CRUD/Resource-oriented*: Các thao tác cơ bản trên tài nguyên (tạo, đọc, sửa, xóa).
  - *Domain-driven/Stateful*: Kích hoạt máy trạng thái, thực hiện giao dịch (checkout, cancel, approve).

### 2.2. Phân tích Tham số (Parameter Taxonomy)
- **Path Variables**: Nằm trong URL, định danh tài nguyên (thường bắt buộc).
- **Query Parameters**: Bộ lọc, phân trang, tìm kiếm (thường không bắt buộc).
- **Header Parameters**: Authentication, Content-Type, custom trace ID.
- **Request Body Fields**: Dữ liệu gửi lên (thường là JSON, form-data).

### 2.3. Các Mẫu hình Quy tắc Nghiệp vụ Ngầm định (Implicit Rules)
Khi tài liệu không ghi rõ, luôn áp dụng các nguyên tắc sau làm tiêu chuẩn kiểm thử:

1. **Xác thực & Định danh**:
   - Tự động trim khoảng trắng 2 đầu đối với email/username.
   - Các chức năng lấy lại mật khẩu/kiểm tra tồn tại tài khoản **không được** trả về thông báo khác biệt làm lộ danh sách user.
   - Token không hợp lệ, hết hạn, thiếu chữ ký phải bị chặn (Mã `401 Unauthorized`).
2. **Tính toán & Giao dịch**:
   - *Tính toán phía Server*: Mọi tổng tiền, thuế, giảm giá, tồn kho phải do server tính toán lại. Không tin tưởng giá gửi từ client.
   - *Biên số học*: Số lượng là số nguyên $\ge 1$; Giá tiền $\ge 0$. Chặn số âm, thập phân sai quy định.
3. **Toàn vẹn Dữ liệu & Sở hữu**:
   - *IDOR Prevention*: Hành động thao tác trên mã định danh phải xác minh người gọi là chủ sở hữu hoặc quản trị viên.
   - *Tạo mới trùng lặp*: Tạo tài nguyên trùng khóa duy nhất (email, username, category name) phải trả về lỗi `409 Conflict` hoặc `400 Bad Request`.
4. **Giao thức & Trạng thái**:
   - Từ chối Content-Type không hợp lệ với `415 Unsupported Media Type`.
   - Các trường lạ (unknown fields) gửi thêm vào payload không được làm sập server (`500 Server Error`).
   - Mọi lỗi phải tuân thủ định dạng thống nhất (chứa trường `error` hoặc tuân thủ RFC 7807), không rò rỉ mã nguồn.

---

## 3. Cấu hình Ngữ cảnh Hệ thống (SUT Context Bindings)
*Khi thực thi, yêu cầu tiêm (inject) các tham số ngữ cảnh cụ thể của dự án (System Under Test).*

Ví dụ cấu hình tham chiếu:
- **Base URL**: Yêu cầu người dùng cung cấp (VD: `http://localhost:3000`).
- **Headers bắt buộc**: Các header tuỳ chỉnh của dự án (VD: `X-Student-Id`).
- **Phân quyền (Roles)**: Cấu hình tài khoản test (VD: Admin, User, Guest).

---

## 4. Định dạng Kết quả Đầu ra (Normalized API Spec IR)
Khi phân tích mỗi endpoint, **bắt buộc** xuất ra cấu trúc Markdown/JSON chuẩn hóa sau đây để truyền cho các bước thiết kế test case tiếp theo:

### Endpoint: [METHOD] [URL]
- **Tên chức năng**: [Mô tả]
- **Cấp độ phân quyền**: [Public | User Role | Admin Role]
- **Headers yêu cầu**: [Danh sách headers]
- **Kiến trúc**: [Idempotent | Non-idempotent] - [CRUD | Stateful]

#### 1. Contract Dữ liệu (Request Parameters)
| Tên trường | Vị trí (Path/Query/Body/Header) | Kiểu dữ liệu | Bắt buộc (Y/N) | Ràng buộc (Format/Min/Max/Regex) |
|---|---|---|---|---|
| ... | ... | ... | ... | ... |

#### 2. Đặc tả Phản hồi (Expected Responses)
| HTTP Status | Trường hợp áp dụng | Dữ liệu mẫu kỳ vọng |
|---|---|---|
| 200/201 | Thành công | ... |
| 400 | Lỗi input hoặc nghiệp vụ | ... |
| 401 / 403 | Xác thực & Phân quyền | ... |
| 404 / 409 | Tài nguyên / Trùng lặp | ... |

#### 3. Quy tắc Nghiệp vụ (Explicit & Implicit)
- [Explicit] Quy tắc 1 (từ spec): ...
- [Implicit] Quy tắc 2 (suy luận theo mẫu hình): ...

#### 4. Phân tích Tính trạng thái (State Machine Lifecycle) - Nếu có
- Trạng thái hiện tại: ...
- Trạng thái hợp lệ tiếp theo: ...
- Vai trò được phép chuyển trạng thái: ...

#### 5. Nhận diện Bảo mật (Security Vectors)
- Các field nhạy cảm cần test Injection (XSS, SQLi): ...
- Nguy cơ BOLA/IDOR (các ID param): ...
- Nguy cơ Mass Assignment (các trường ẩn có thể bị update): ...
