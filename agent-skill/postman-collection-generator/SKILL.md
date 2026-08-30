---
name: "postman-collection-generator"
description: "Sinh file Postman Collection v2.1.0, kịch bản tự động hóa (Chai.js, Ajv), thiết lập Newman CLI và CI/CD GitHub Actions."
---

# Postman & Newman Orchestrator (Collection Generator)

## 1. Nền tảng Kiến thức Cốt lõi (Domain Knowledge)

Kỹ năng này đóng vai trò kỹ sư Automation Test chuyên sâu, chuyển đổi thiết kế kiểm thử thành mã thực thi tự động trên Postman Platform và Newman CLI.

### 1.1. Kiến trúc Postman Collection v2.1.0 & Variable Scoping
- **Global & Environment Variables**: Cấu hình URL hệ thống (`{{base_url}}`), định danh/keys cố định (`{{client_id}}`).
- **Collection Variables**: Biến dùng chung cho toàn bộ suite nhưng sinh ra theo thời gian thực (VD: `{{admin_token}}`, `{{user_token}}` được lưu sau khi login).
- **Local Variables & Data Variables**: Dữ liệu chạy từ file JSON/CSV trong Collection Runner (`{{iterationData}}`).

### 1.2. Pre-request Scripts & Tự động hóa chuẩn bị dữ liệu (Setup)
- **Auto Auth**: Viết mã script gửi request `pm.sendRequest` đến endpoint đăng nhập để lấy token trước khi chạy request chính, tự động lưu vào biến môi trường.
- **Dynamic Fuzzing**: Tự động sinh dữ liệu chống trùng lặp bằng API Postman (`pm.variables.replaceIn('{{$guid}}')`, `{{$timestamp}}`, `{{$randomEmail}}`).
- **Header Injection**: Tự động chèn các Security Headers hoặc Headers bắt buộc (ví dụ: `X-Student-Id`) vào toàn bộ request bằng Script cấp Collection.

### 1.3. Test Scripts & Thư viện Assertions (Chai.js & Ajv)
Chai.js (TDD/BDD Assertions):
```javascript
// HTTP Status
pm.test("Trạng thái là 200 OK", () => pm.response.to.have.status(200));

// Response Time
pm.test("Phản hồi nhanh dưới 500ms", () => pm.expect(pm.response.responseTime).to.be.below(500));

// Body assertions
var json = pm.response.json();
pm.test("ID trả về là kiểu số", () => pm.expect(json.id).to.be.a('number'));
pm.test("Cấu trúc báo lỗi hợp lệ", () => pm.expect(json).to.have.property('error'));
```
Schema Validation (Sử dụng thư viện `Ajv` hoặc `tv4` có sẵn trong Postman):
```javascript
const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true});
const validate = ajv.compile(schema);
pm.test("Response Schema is valid", () => pm.expect(validate(pm.response.json())).to.be.true);
```

### 1.4. Thiết lập Newman CLI & Báo cáo HTML (Orchestration)
Kỹ năng cung cấp chuẩn lệnh chạy Newman để tích hợp vào bất kỳ dự án nào:
```bash
newman run collection.json \
  -e environment.json \
  -d data.json \
  --reporters cli,htmlextra,json,junit \
  --reporter-htmlextra-export ./reports/TestReport.html \
  --reporter-htmlextra-title "API Automation Report" \
  --delay-request 100 \
  --bail
```
- Sử dụng package `newman-reporter-htmlextra` để sinh báo cáo giao diện đẹp, phục vụ kiểm toán.
- `--delay-request 100`: Tránh lỗi Rate Limiting.
- `--bail`: Tuỳ chọn dừng ngay khi có 1 test fail.

### 1.5. CI/CD Pipeline (GitHub Actions)
Tự động hóa toàn bộ trên CI/CD, thiết lập file YAML (VD: `.github/workflows/api-test.yml`):
- Checkout code.
- Cài đặt Node.js và `newman`, `newman-reporter-htmlextra`.
- Start Backend/Database (hoặc chạy DB reset script).
- Chạy Newman CLI.
- Upload file báo cáo HTML (`actions/upload-artifact`).

---

## 2. Cấu hình Ngữ cảnh Hệ thống (SUT Context Bindings)
*Tiêm các tham số ngữ cảnh cụ thể của dự án vào prompt trước khi gọi kỹ năng.*

- **Biến môi trường cần có**: (VD: `base_url`, `student_id`).
- **Logic Auth**: Mô tả cách lấy token (endpoint login, body email/pass).
- **Yêu cầu Báo cáo**: Tên thư mục lưu HTML report, file cấu hình CI/CD cần gen.

---

## 3. Định dạng Kết quả Đầu ra (Output Format)

Kỹ năng này chịu trách nhiệm sinh ra **Mã nguồn (Source Code)** hoặc file định dạng sau:

1. **`collection.json`**: Cấu trúc Postman Collection v2.1 với đầy đủ Pre-request Scripts (Auto Auth, Auto Inject Header) và Test Scripts (Chai.js, Schema validation). Cấu trúc thư mục chia theo 4 chiến lược kiểm thử.
2. **`environment.json`**: Chứa `base_url` và các biến dùng chung.
3. **`data.json` / `data.csv` (Tuỳ chọn)**: Dữ liệu cho Data-Driven Testing.
4. **`run_tests.sh` / `.github/workflows/api-test.yml`**: Mã bash hoặc file cấu hình CI/CD chuẩn Newman CLI với `htmlextra`.

*Lưu ý*: Output có thể là đoạn mã Python (`generate_postman.py`) để tự động sinh file JSON tĩnh nhằm duy trì tính chính xác cú pháp, hoặc chuỗi JSON nguyên bản nếu prompt đủ ngắn.
