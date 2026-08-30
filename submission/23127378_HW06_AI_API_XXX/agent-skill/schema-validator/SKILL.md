---
name: "schema-validator"
description: "Tạo test case kiểm tra định dạng dữ liệu (JSON Schema Draft 2020-12), HTTP Status Contract và RFC 7807 Error Envelope."
---

# Schema Validator

## 1. Nền tảng Kiến thức Cốt lõi (Domain Knowledge)

Kỹ năng này sinh ra các kịch bản kiểm thử hợp đồng (Contract Testing) dựa trên chuẩn JSON Schema (Draft 2020-12) và đặc tả giao thức HTTP RESTful, nhằm đảm bảo Client và Server giao tiếp đúng cấu trúc, không thiếu dữ liệu và không rò rỉ dữ liệu nhạy cảm.

### 1.1. Chuẩn kiểm tra JSON Schema (Draft 2020-12)
Mọi JSON Response trả về phải được đối chiếu chặt chẽ với Schema kỳ vọng:
- **Type Validation**: Kiểm tra đúng kiểu `string`, `number`, `integer`, `boolean`, `array`, `object`, `null`. Không chấp nhận ép kiểu ngầm định (VD: `"1"` không phải là `integer`).
- **Format Validation**: Ràng buộc chuỗi theo chuẩn `date-time` (ISO 8601), `email`, `uri`, `uuid`.
- **Required Properties**: Đảm bảo tất cả các trường bắt buộc (required keys) đều xuất hiện.
- **Strict Contract (`additionalProperties: false`)**: Đảm bảo KHÔNG có bất kỳ trường lạ nào (unknown/extra properties) được trả về so với tài liệu thiết kế. Điều này giúp ngăn chặn lỗi rò rỉ dữ liệu nội bộ.
- **Constraints**: 
  - *String*: `minLength`, `maxLength`, `pattern` (Regex).
  - *Number*: `minimum`, `maximum`, `exclusiveMinimum`.
  - *Array*: `minItems`, `maxItems`, `uniqueItems`.

### 1.2. Chuẩn HTTP Status Code & Error Envelope (RFC 7807)
- **Status Code Conformance**:
  - `200 OK`, `201 Created` (Thành công)
  - `400 Bad Request` (Dữ liệu sai định dạng)
  - `401 Unauthorized` (Lỗi xác thực)
  - `403 Forbidden` (Lỗi phân quyền)
  - `404 Not Found` (Không tìm thấy tài nguyên)
  - `409 Conflict` (Lỗi logic, trùng lặp trạng thái)
  - `422 Unprocessable Entity` (Schema đúng nhưng logic nghiệp vụ sai)
  - ❌ **`500 Internal Server Error`**: Tuyệt đối không được phép xảy ra. API tốt phải bắt (catch) mọi ngoại lệ và trả về 4xx/503.
- **Error Envelope Contract (RFC 7807)**:
  - Thông báo lỗi phải nhất quán. Cấu trúc chuẩn thường là `{ "error": string }` hoặc `{ "message": string, "code": number, "details": array }`.
  - Không được chứa Java/Python/Nodejs Stack Traces.
  - Thông báo lỗi phải che giấu thông tin DB bên dưới.

### 1.3. Headers Contract & Security Headers
- `Content-Type`: Bắt buộc là `application/json; charset=utf-8` khi trả về JSON. Từ chối `text/html` khi báo lỗi.
- Security Headers: Kiểm tra `X-Content-Type-Options: nosniff`.
- Data Leakage: Kiểm tra các header làm lộ framework/server backend như `X-Powered-By`, `Server`.

---

## 2. Cấu hình Ngữ cảnh Hệ thống (SUT Context Bindings)
*Tiêm các tham số ngữ cảnh cụ thể của dự án vào prompt trước khi gọi kỹ năng.*

- **Base URL & Headers**: (VD: `http://localhost:3000`, `X-Student-Id`)
- **JSON Schema Definitions**: Cung cấp hoặc trích xuất mô hình dữ liệu chuẩn của dự án (VD: cấu trúc đối tượng `User`, `Order`, cấu trúc báo lỗi thống nhất).

---

## 3. Định dạng Kết quả Đầu ra (Output Format)
Tạo bảng Markdown chứa các test case schema validation.
- Mã ID Test Case: `TC-SCH-001`, `TC-SCH-002`,...
- **Tên test case (Name)** PHẢI được viết bằng tiếng Anh.

| TC ID | Name | Expected Schema Constraint (JSON Schema / RFC) | Target Verification | Expected Status |
|---|---|---|---|---|
| TC-SCH-001 | Verify exact response schema structure | All required fields present, matching `type` and `format` | Response Body Structure | 200 / 201 |
| TC-SCH-002 | No additional properties (No data leak) | `additionalProperties: false`, no hidden fields returned | Response Object | 200 OK |
| TC-SCH-003 | Error response envelope consistency | Matches error schema `{ error: string }`, no stack trace | HTTP 400 Error Body | 400 Bad Request |
| TC-SCH-004 | Response Content-Type validation | `Content-Type` is exactly `application/json` | Response Headers | 200 / 4xx |
| TC-SCH-005 | Security headers validation | Missing `X-Powered-By`, presence of `X-Content-Type-Options` | Response Headers | Any |
| TC-SCH-006 | Strict type matching (No type coercion) | Integers are `number`, not `string` (e.g. `1` not `"1"`) | Field level matching | 200 OK |
