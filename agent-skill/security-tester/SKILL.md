---
name: "security-tester"
description: "Tạo test case bảo mật dựa trên OWASP API Security Top 10 (2023) và yêu cầu bảo mật tùy chỉnh (Custom Security Rules)."
---

# Security Tester

## 1. Nền tảng Kiến thức Cốt lõi (Domain Knowledge)

Kỹ năng này sinh ra các kịch bản kiểm thử thâm nhập (Penetration Testing / Security Testing) tự động cho API, phủ lấp toàn diện lỗ hổng theo chuẩn **OWASP API Security Top 10 (2023)**.

### 1.1. Ma trận Lỗ hổng OWASP API 2023 & Phương pháp Kiểm thử

| OWASP 2023 Code | Tên Lỗ Hổng | Hướng dẫn Kiểm thử (Attack Vectors) |
|---|---|---|
| **API1:2023** | Broken Object Level Authorization (BOLA / IDOR) | Thay đổi ID trong URL/Body (`/users/1` $\to$ `/users/2`) để truy cập dữ liệu của user khác. Dùng ID ngẫu nhiên, UUID thay vì Sequential ID. |
| **API2:2023** | Broken Authentication | Test JWT: Token hết hạn, chữ ký sai, thuật toán `alg: none`, payload bị giả mạo. Brute-force OTP/Password. Gửi token trống, null. |
| **API3:2023** | Broken Object Property Level Auth (Mass Assignment) | Gửi thêm các trường ẩn vào payload khi tạo/sửa: `{"role":"admin"}`, `{"is_admin":true}`, `{"balance":999999}`. Kiểm tra lỗi lộ lọt hash mật khẩu. |
| **API4:2023** | Unrestricted Resource Consumption | Pagination payload quá lớn (`limit=1000000`). Gửi chuỗi Regex phức tạp gây ReDoS. File upload quá cỡ. Gọi API nhạy cảm liên tục (Rate limiting). |
| **API5:2023** | Broken Function Level Authorization (BFLA) | User thường gọi endpoint `/api/admin/*`. Đổi HTTP Method từ `GET` sang `POST`/`PUT`/`DELETE` trên cùng URL xem có bypass phân quyền không. |
| **API6:2023** | Unrestricted Access to Sensitive Business Flows | Tái sử dụng mã giảm giá. Gọi API thanh toán / đặt hàng song song để tạo điều kiện Race Condition (Double Spending). |
| **API7:2023** | Server-Side Request Forgery (SSRF) | Truyền URL nội bộ (`http://127.0.0.1:8080`, `http://169.254.169.254/latest/meta-data`) vào các trường như `imageUrl`, `webhook`. |
| **API8:2023** | Security Misconfiguration | Kiểm tra Response Header có thiếu `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`. API có trả về Stack Trace khi lỗi 500 không. |
| **API9:2023** | Improper Inventory Management | Thử gọi các phiên bản API cũ (`/v1/` thay vì `/v2/`). Gọi các debug/shadow endpoints nếu đoán được. |

### 1.2. Thư viện Tải trọng Tấn công (Attack Payloads Catalog)
- **SQL Injection (SQLi)**: `' OR 1=1 --`, `' UNION SELECT null, null --`, `" OR ""="`, `1; DROP TABLE users`. Đưa vào email, search query, id.
- **Cross-Site Scripting (XSS)**: `<script>alert(1)</script>`, `<img src=x onerror=alert(1)>`, `javascript:alert(1)`. Đưa vào tên, mô tả.
- **Command Injection**: `$(whoami)`, `` `id` ``, `| ls -la`, `; cat /etc/passwd`. Đưa vào các trường xử lý file/ảnh.
- **Auth Bypasses**: Bearer token là `'null'`, `'undefined'`, `''`.

---

## 2. Cấu hình Ngữ cảnh Hệ thống (SUT Context Bindings)
*Tiêm các tham số ngữ cảnh cụ thể của dự án vào prompt trước khi gọi kỹ năng.*

- **Base URL & Headers**: (VD: `http://localhost:3000`, `X-Student-Id`)
- **Tài khoản test (Tokens)**: Cần chuẩn bị `Admin Token`, `User Token`, `Expired Token`, `Invalid Token`, `Another User Token`.
- **Yêu cầu bảo mật tùy chỉnh (Custom SEC Rules)**: (VD: Dự án yêu cầu cụ thể SEC-01 đến SEC-07, cần ánh xạ các SEC này vào OWASP ở trên).

---

## 3. Định dạng Kết quả Đầu ra (Output Format)
Tạo bảng Markdown chứa các test case bao phủ toàn bộ danh mục bảo mật.
- Mã ID Test Case: `TC-SEC-001`, `TC-SEC-002`,...
- **Tên test case (Name)** PHẢI được viết bằng tiếng Anh.

| TC ID | Name | OWASP/Custom SEC | Attack Payload / Action | Expected Secure Behavior (HTTP Status) | Vulnerability Appearance (Dấu hiệu lỗi) |
|---|---|---|---|---|---|
| TC-SEC-001 | Missing JWT token in header | API2 (SEC-02) | Bỏ Header `Authorization` | 401 Unauthorized | 200 OK (Truy cập trái phép) |
| TC-SEC-002 | SQLi in product search | SQLi (SEC-05) | `?q=1' OR 1=1--` | 400 Bad Request / Empty | Trả về toàn bộ data hoặc lỗi SQL 500 |
| TC-SEC-003 | IDOR access to another user's order | API1 (IDOR) | Token User A, gọi API với ID của User B | 403 / 404 | 200 OK (Xem được đơn của người khác) |
| TC-SEC-004 | Role Escalation via Mass Assignment | API3 (SEC-06) | Thêm `{"role":"admin"}` vào body Update Profile | 200 OK nhưng `role` không đổi, hoặc 400 | Lên quyền Admin thành công |
| TC-SEC-005 | XSS payload in description | API8 (SEC-04) | `<script>alert(1)</script>` | 400 Bad Request, hoặc tự động escape HTML | Lưu nguyên bản mã HTML độc hại |
