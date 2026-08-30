---
name: "domain-partition-tester"
description: "Tạo test case áp dụng phương pháp Phân hoạch Tương đương (EP) và Phân tích Giá trị Biên (BVA) chuẩn ISTQB cho mọi API."
---

# Domain Partition Tester

## 1. Nền tảng Kiến thức Cốt lõi (Domain Knowledge)

Kỹ năng này sử dụng chuẩn kiểm thử phần mềm ISTQB (Equivalence Partitioning & Boundary Value Analysis) để sinh ra bộ test case chi tiết.

### 1.1. Phân tích Giá trị Biên (Boundary Value Analysis - BVA)
Áp dụng cho các trường có tính thứ tự (số học, độ dài chuỗi, ngày tháng).
- **2-value BVA (Khuyến nghị chuẩn ISTQB)**: Kiểm thử tại chính giá trị biên và giá trị sát biên gần nhất nằm ngoài miền hợp lệ. (Ví dụ: Miền hợp lệ $1 \le x \le 10 \implies$ Biên: $0, 1, 10, 11$).
- **3-value BVA**: Kiểm thử tại giá trị biên, sát dưới và sát trên. (Ví dụ: $0, 1, 2$ và $9, 10, 11$).
- **Robustness Testing (Kiểm thử độ bền)**: Ngoài việc test happy path, bắt buộc test các trường hợp cực đại/cực tiểu (Overflow, Underflow, Rất dài).

### 1.2. Danh mục Phân hoạch Tương đương theo Kiểu Dữ liệu (Type Catalogs)

**1. Chuỗi ký tự (String)**
- *Độ dài*: Rỗng (`""`), 1 ký tự, N-1, N (chiều dài tối đa hợp lệ), N+1 (vượt quá), siêu dài ($> 10^4$ ký tự).
- *Khoảng trắng*: Chuỗi chỉ toàn khoảng trắng (`"   "`), ký tự tab (`\t`), newline (`\n`), null byte (`\0`).
- *Định dạng*: Chữ hoa/thường, ký tự đặc biệt (!@#$%^&*), Unicode/Emoji (🚀, Tiếng Việt có dấu).
- *Quy tắc miền cụ thể*:
  - **Email**: Thiếu `@`, 2 dấu `@`, khoảng trắng đầu/cuối, thiếu tên miền (.com).
  - **Mật khẩu**: Vi phạm từng quy tắc độ phức tạp (thiếu số, thiếu chữ hoa, quá ngắn).

**2. Số học (Number / Integer / Float)**
- *Trị số*: Số âm (`-1`), Số không (`0`), Số dương (`1`).
- *Biên kỹ thuật*: MAX_SAFE_INTEGER, Max INT32 (`2147483647`), Min INT32.
- *Định dạng*: Dấu phẩy động (`0.01`, `99.99`), Ký hiệu khoa học (`1e6`), Coercion từ chuỗi (`"123"`).

**3. Mảng (Array / List)**
- *Kích thước*: Mảng rỗng `[]`, mảng 1 phần tử `[x]`, max items `N`, vượt max items `N+1`.
- *Phần tử*: Chứa `null`, chứa dữ liệu sai kiểu, phần tử trùng lặp (Duplicate items).

**4. Khác (Object, Boolean, Date)**
- *Object*: Thiếu trường required, thừa trường lạ (unknown fields), Object rỗng `{}`, Null.
- *Boolean*: `true`, `false`, ép kiểu (`"true"`, `"false"`, `1`, `0`, `null`).
- *Date (ISO 8601)*: Giờ UTC, offset timezone, năm nhuận (`2024-02-29`), biên quá khứ/tương lai xa.

### 1.3. Kỹ thuật Combinatorial Testing (All-Pairs)
Thay vì tổ hợp toàn bộ các trường hợp lỗi (tốn thời gian), áp dụng chiến lược:
- **Positive Testing**: Mọi trường dữ liệu hợp lệ + trộn lẫn giá trị biên hợp lệ.
- **Negative Testing**: Mỗi test case chỉ chứa **MỘT** trường dữ liệu không hợp lệ, các trường khác giữ ở trạng thái hợp lệ lý tưởng. Đảm bảo cô lập lỗi (Fault Isolation).

---

## 2. Cấu hình Ngữ cảnh Hệ thống (SUT Context Bindings)
*Tiêm các tham số ngữ cảnh cụ thể của dự án vào prompt trước khi gọi kỹ năng.*

- **Base URL**: (VD: `http://localhost:3000`)
- **Required Headers**: (VD: `X-Student-Id`)
- **Default Test Accounts**: (VD: `admin@eshop.com` / `test@eshop.com`)

---

## 3. Định dạng Kết quả Đầu ra (Output Format)
Tạo bảng Markdown chứa các test case bao phủ toàn bộ danh mục trên.
- Mã ID Test Case: `TC-DOM-001`, `TC-DOM-002`,...
- **Tên test case (Name)** PHẢI được viết bằng tiếng Anh.

| TC ID | Name | Precondition | Input Data (Payload/Params) | Expected Status | Expected Response | Category |
|---|---|---|---|---|---|---|
| TC-DOM-001 | Valid input at min boundaries | ... | ... | 200 OK / 201 Created | ... | BVA |
| TC-DOM-002 | Invalid empty string for Name | ... | `name: ""` | 400 Bad Request | Lỗi validation | EP - String |
| TC-DOM-003 | Invalid negative price | ... | `price: -100` | 400 Bad Request | Lỗi giá tiền | BVA - Number |
| TC-DOM-004 | Array contains duplicate items | ... | `items: [1, 1]` | 400 / 409 | Lỗi trùng lặp | EP - Array |
