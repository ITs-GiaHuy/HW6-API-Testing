# HW06 — API Testing Report

## Mục lục
1. [Thông tin sinh viên](#thông-tin-sinh-viên)
2. [1. API Selection](#1-api-selection)
3. [2. Pipeline per API](#2-pipeline-per-api)
   - [2.1 API 1: Login (FR-02)](#21-api-1-login-fr-02)
   - [2.2 API 2: Orders (FR-10/11)](#22-api-2-orders-fr-1011)
   - [2.3 API 3: Import Products (FR-16)](#23-api-3-import-products-fr-16)
4. [3. Postman Features Used](#3-postman-features-used)
5. [4. Agent Skill Design](#4-agent-skill-design)
6. [5. References](#5-references)

## Thông tin sinh viên
- **Họ tên:** Nguyễn Gia Huy
- **MSSV:** 23127378
- **Lớp:** 23KTPM2
- **Môn:** Kiểm thử phần mềm

## 1. API Selection
Dưới đây là 3 API (được phân vào 3 Pool) đã được chọn để thực hiện kiểm thử:
- **Pool A**: `POST /api/login` (FR-02: Đăng nhập & Khóa tài khoản)
- **Pool B**: Orders API — `GET /api/my-orders`, `GET /api/orders/:id`, `PUT /api/orders/:id/cancel`, `GET /api/admin/orders`, `PUT /api/admin/orders/:id/status` (FR-10: Order State Machine, FR-11: Order History)
- **Pool C**: `POST /api/admin/import-products` (FR-16: Import Sản phẩm từ CSV/JSON)

## 2. Pipeline per API

Đối với mỗi API, quy trình kiểm thử (pipeline) được thực hiện qua các bước: Generate (Tạo test case bằng AI), Audit (Đánh giá), Extend (Mở rộng) và Execute (Thực thi & Phân tích lỗi).

### 2.1 API 1: Login (FR-02)

#### 2.1.1 Generate with AI (Step 1)
Quá trình tạo test case bằng AI được thực hiện theo từng bước, bao phủ 4 danh mục chính nhằm đảm bảo tính toàn diện:
- **Domain Partitions**: Kiểm tra định dạng email, tính hợp lệ của mật khẩu, các giá trị biên (boundary values).
- **State Transitions**: Kiểm tra trạng thái khóa tài khoản (lockout) sau nhiều lần đăng nhập thất bại.
- **Security**: Kiểm tra các lỗ hổng bảo mật như SQL injection, XSS, các lỗi giao thức (protocol attacks).
- **Schema Validation**: Xác thực cấu trúc JSON trả về.

**Tổng cộng:** 45 test case được AI sinh ra.

Chi tiết phân bổ test case của API Login theo danh mục:
- **Domain-Positive**: 3 (TC-LGN-001 đến 003)
- **Domain-Email**: 9 (TC-LGN-004 đến 012) — rỗng, thiếu @, thiếu domain, hai dấu @, chứa khoảng trắng, chứa SQL trong email, ký tự đặc biệt, độ dài 255, ký tự unicode.
- **Domain-Password**: 5 (TC-LGN-013 đến 017) — rỗng, 1 ký tự, tối đa độ dài, email đúng nhưng sai mật khẩu, chứa khoảng trắng.
- **Domain-Missing/Type**: 8 (TC-LGN-018 đến 025) — thiếu email, thiếu mật khẩu, thiếu cả hai, không có body, email là số, password là số, password là boolean, email là mảng.
- **Domain-Boundary**: 2 (TC-LGN-026 đến 027)
- **Security-Injection**: 5 (TC-LGN-028 đến 032) — SQLi trong email, SQLi trong password, SQLi UNION SELECT, XSS trong email, NoSQL injection.
- **Security-Protocol**: 6 (TC-LGN-033 đến 038) — thiếu content-type, sai content-type, method GET không cho phép, PUT không cho phép, DELETE không cho phép, body là raw string.
- **State-Lockout**: 5 (TC-LGN-039 đến 043) — thất bại lần 1, thất bại lần 2 (bug), đăng nhập khi đang bị khóa, nhập đúng mật khẩu khi bị khóa, account isolation (sự cô lập tài khoản).
- **Schema**: 2 (TC-LGN-044 đến 045) — schema khi thành công, schema khi có lỗi.

#### 2.1.2 Audit (Step 2)
Toàn bộ 45 test case đã được đánh giá thủ công (review). Mỗi test case được gắn nhãn VALID, INVALID hoặc INCOMPLETE:
- **Hầu hết các test case**: VALID.
- **TC-LGN-003 (case insensitivity)**: Nhãn VALID nhưng ĐƯỢC GHI CHÚ rằng backend có thể không hỗ trợ tính không phân biệt chữ hoa/thường đối với email.
- **Các test case Lockout**: VALID nhưng nhận thấy đặc tả yêu cầu khóa sau 3 lần thất bại, trong khi hành vi thực tế có thể khác.

*Lưu ý: Bảng audit chi tiết (FULL audit table) được lưu trữ trong file `test_cases.csv`.*

#### 2.1.3 Extend (Step 3)
Hơn 5 test case (cụ thể là các test case cuối từ 41 đến 45) đã được bổ sung/mở rộng thủ công (human-added) bởi sinh viên:
- **TC-LGN-041 đến TC-LGN-045**: Là những bản mở rộng tập trung vào các trường hợp biên của lockout và xác thực schema mà AI ban đầu đã bỏ sót.

**Nguyên nhân AI bỏ sót các trường hợp này:**
- AI thường có xu hướng sinh ra các test case độc lập (isolated), dẫn đến thiếu sót các luồng công việc gồm nhiều bước (ví dụ: lockout đòi hỏi một chuỗi các lần thất bại liên tiếp).
- AI không kiểm tra tính cô lập tài khoản (account isolation) trong quá trình lockout (ví dụ: việc khóa tài khoản user A không được ảnh hưởng đến user B).
- Việc xác thực schema để tìm lỗi rò rỉ mật khẩu trong phản hồi chưa được AI chú trọng triệt để ở đầu ra ban đầu.

#### 2.1.4 Execute (Step 4)
Kiểm thử được thực thi bằng Newman kết hợp với htmlextra reporter để tạo báo cáo trực quan.
- **Command:** `npx newman run eshop_collection_login.json -e eshop_environment.json -d login_test_data.json`
- **Total requests:** 46, **Failed requests:** 0
- **Total assertions:** 147, **Failed assertions:** 62
- **Đánh giá chung:** Rất nhiều trường hợp assertion thất bại thực chất là CÁC LỖI THỰC SỰ (ACTUAL BUGS) trong SUT, do hành vi mong đợi khác biệt so với việc cài đặt thực tế.
- Header `X-Student-Id: 23127378` được tự động thêm vào thông qua pre-request script.
- **Report:** Xem chi tiết trong file `LoginReport.html`.

#### 2.1.5 Bugs Found (Step 5)
Các lỗi (bugs) phát hiện được từ API Login:
1. **BUG-LGN-01**: Lộ mật khẩu trong phản hồi đăng nhập — Phản hồi login chứa trường `password` trong đối tượng user (vi phạm SEC-01). Xảy ra ở các iterations 0, 1, 42, 43.
2. **BUG-LGN-02**: Thiếu kiểm tra tính hợp lệ định dạng email — Server trả về `401` thay vì `400` cùng với thông báo lỗi phù hợp cho các email không hợp lệ. Ảnh hưởng các iterations 3-11, 17-18, 21-22, 24, 30-31.
3. **BUG-LGN-03**: Không validate password bị rỗng/thiếu — Server trả về `401` thay vì `400`. Iterations 12-14.
4. **BUG-LGN-04**: Content-Type không được validate — Không trả về mã lỗi `415 Unsupported Media Type` khi Content-Type sai. Iterations 33-34.
5. **BUG-LGN-05**: HTTP method sai không bị từ chối đúng cách — Trả về `404` thay vì `405 Method Not Allowed`. Iterations 35-37.
6. **BUG-LGN-06**: Khóa tài khoản (lockout) sau 2 lần thất bại thay vì 3 — Spec yêu cầu 3 lần, nhưng hệ thống lại khóa sau 2 lần.

### 2.2 API 2: Orders (FR-10/11)

#### 2.2.1 Generate with AI (Step 1)
Tương tự như API Login, bộ test cho Orders được sinh ra gồm 45 test case.

Phân bổ test case của API Orders theo danh mục:
- **Domain-Positive**: 5 (TC-ORD-001 đến 005)
- **Domain-Negative**: 6 (TC-ORD-006 đến 011)
- **State Transition**: 17 (TC-ORD-012 đến 028) — toàn bộ vòng đời, chuyển đổi trạng thái không hợp lệ, trạng thái kết thúc (terminal states), tính lũy đẳng (idempotent).
- **Security**: 8 (TC-ORD-029 đến 036)
- **Domain**: 4 (TC-ORD-037 đến 040)
- **Schema Validation**: 5 (TC-ORD-041 đến 045)

#### 2.2.2 Audit (Step 2)
Tất cả 45 test case đã được đánh giá tính hợp lệ và lưu vào file `test_cases.csv`. Các test case cover tốt logic phức tạp của Order State Machine.

#### 2.2.3 Extend (Step 3)
Một số test case mở rộng tập trung vào kiểm tra Role-Based Access Control (RBAC) và sự cố ý phá vỡ Terminal State của đơn hàng, những thứ AI thường coi là "bất khả thi" ở mức spec.

#### 2.2.4 Execute (Step 4)
- Chạy thông qua Newman kết hợp DDT.
- **Total requests:** 283, **Failed requests:** 0, **Total assertions:** 90, **Failed assertions:** 6.

#### 2.2.5 Bugs Found (Step 5)
Các lỗi phát hiện được:
1. **BUG-ORD-01**: Vi phạm Terminal state — Backend cho phép chuyển đổi từ trạng thái `canceled` sang các trạng thái khác (TC-ORD-024). Vi phạm FR-10.
2. **BUG-ORD-02**: Không yêu cầu xác thực (auth) khi xem chi tiết order — End-point `GET /api/orders/:id` hoạt động mà không cần token xác thực (TC-ORD-031). Bất kỳ ai cũng có thể xem đơn hàng. Vi phạm SEC-02.
3. **BUG-ORD-03**: Thiếu kiểm tra quyền sở hữu (IDOR) — User có thể xem đơn hàng của user khác (TC-ORD-032). Vi phạm FR-11.
4. **BUG-ORD-04**: Không kiểm tra quyền admin trên các admin endpoints — Token của regular user vẫn có thể truy cập `GET /api/admin/orders` (TC-ORD-034) và `PUT /api/admin/orders/:id/status` (TC-ORD-035). Vi phạm SEC-03.
5. **BUG-ORD-05**: Lỗi trạng thái lũy đẳng — Xác nhận một đơn hàng đã được "confirmed" trả về mã `200` thay vì báo lỗi (TC-ORD-026).

### 2.3 API 3: Import Products (FR-16)

#### 2.3.1 Generate with AI (Step 1)
Quá trình sinh test case tương tự, tổng cộng 45 test case.

Phân bổ test case của API Import Products theo danh mục:
- **Domain-Positive**: 4 (TC-IMP-001 đến 004)
- **Domain-Name Validation**: 7 (TC-IMP-005 đến 011)
- **Domain-Price Validation**: 8 (TC-IMP-012 đến 019)
- **Domain-Array/Body Validation**: 8 (TC-IMP-020 đến 027)
- **Domain-Category**: 3 (TC-IMP-028 đến 030)
- **State Transition - Rollback**: 4 (TC-IMP-031 đến 034)
- **Security**: 6 (TC-IMP-035 đến 040)
- **Schema & Additional**: 5 (TC-IMP-041 đến 045)

#### 2.3.2 Audit (Step 2)
Toàn bộ 45 test cases được review. (Chi tiết trong file `test_cases.csv`).

#### 2.3.3 Extend (Step 3)
Bổ sung thêm các trường hợp kiểm tra Rollback (Atomic transaction) khi batch insert có một phần tử lỗi, một chi tiết AI ban đầu sinh chưa đủ chặt chẽ.

#### 2.3.4 Execute (Step 4)
Chạy bằng Newman và file data tương ứng. Các trường hợp schema test và boundary test phát hiện ra nhiều lỗ hổng backend.

#### 2.3.5 Bugs Found (Step 5)
Các lỗi phát hiện được:
1. **BUG-IMP-01**: Thiếu validation cho Name — Chấp nhận name rỗng, null hoặc chứa khoảng trắng (TC-IMP-005, 006, 007) và trả về `200`.
2. **BUG-IMP-02**: Thiếu validation độ dài Name — Chấp nhận tên có độ dài > 255 ký tự (TC-IMP-009).
3. **BUG-IMP-03**: Thiếu validation cho Price — Chấp nhận giá trị 0, âm, chuỗi, null hoặc thiếu giá (TC-IMP-012, 013, 016, 017, 019). Vi phạm FR-15 (giá phải là số dương).
4. **BUG-IMP-04**: Không có atomic rollback — Một batch chứa cả dòng hợp lệ và không hợp lệ dẫn đến việc import bị nửa vời (partial import) (TC-IMP-031). Vi phạm yêu cầu all-or-nothing của FR-16.
5. **BUG-IMP-05**: Thiếu kiểm tra quyền admin — Regular user vẫn có thể thực hiện import sản phẩm (TC-IMP-036). Vi phạm SEC-03, FR-12.
6. **BUG-IMP-06**: Không validate category_id — Chấp nhận các category ID không hợp lệ, null, dạng chuỗi, hoặc làm sập (crash) server (TC-IMP-028, 029, 030).
7. **BUG-IMP-07**: Server crash khi mảng chứa null — Server trả về `500` khi mảng sản phẩm truyền vào chứa phần tử null (TC-IMP-024).

## 3. Postman Features Used

Các tính năng của Postman đã được ứng dụng trong quá trình làm bài:

| # | Feature | Usage |
|---|---------|-------|
| 1 | **Collections** | Chia làm 3 collections riêng biệt cho 3 APIs |
| 2 | **Environment Variables** | Lưu trữ cấu hình `base_url`, `student_id`, `user_token`, `admin_token` |
| 3 | **Collection Variables** | Lưu trữ trạng thái tạm thời như `setup_done`, `order_id`, v.v. |
| 4 | **Pre-request Scripts** | Thêm header `X-Student-Id`, thiết lập authentication, seeding DB |
| 5 | **Test Scripts (Chai.js)** | Assertions kiểm tra Status code, JSON schema, và dữ liệu response body |
| 6 | **Data-Driven Testing** (Runner) | Dùng 3 file JSON để thực hiện iterations trong Data-Driven Testing (DDT) |
| 7 | **Folder Organization** | Tổ chức test nhóm theo category/workflow |
| 8 | **Request Chaining** | Tự động lấy token từ response login để gán và dùng cho các requests tiếp theo |
| 9 | **Dynamic Variables** | Dùng `pm.environment.set()` để lưu trữ token ở runtime |
| 10 | **Newman CLI** | Công cụ chạy test tự động trên terminal/CI |
| 11 | **htmlextra Reporter** | Tạo các bản báo cáo trực quan, đầy đủ chi tiết bằng HTML |
| 12 | **Conditional Execution** | Dùng `pm.execution.skipRequest()` để quản lý luồng khởi tạo (setup) linh hoạt |

## 4. Agent Skill Design
(Tham khảo chi tiết tại `agent-skill/design.md`)
- **4-module pipeline**: API Spec Parser → Test Strategy Planner → Test Case Generator → Test Case Validator.
- **Implemented as 7 reusable Agent Skills**: Cài đặt thành 7 module kỹ năng tác tử (Agent Skills) có khả năng tái sử dụng.
- **Pseudocode provided in Python**: Có mã giả minh hoạ thiết kế được viết bằng ngôn ngữ Python.
- **Mermaid diagrams**: Dùng Mermaid để vẽ các sơ đồ kiến trúc và workflow một cách trực quan.

## 5. References
- ISTQB Foundation Level Syllabus
- OWASP API Security Top 10
- EShop SUT: https://github.com/ttbhanh/eshop-sut
- GitHub Repository: `[TODO: ĐIỀN LINK GITHUB CỦA BẠN]`
