# 🐛 Bug Report — HW06: API Testing

| Thông tin | Chi tiết |
|-----------|----------|
| **Sinh viên** | Nguyễn Gia Huy — 23127378 |
| **Lớp** | 23KTPM2 |
| **Môn** | Kiểm thử phần mềm |
| **Ngày báo cáo** | 29/08/2026 |
| **GitHub Repository** | [ITs-GiaHuy/HW6-API-Testing](https://github.com/ITs-GiaHuy/HW6-API-Testing) |
| **GitHub Issues** | [https://github.com/ITs-GiaHuy/HW6-API-Testing/issues](https://github.com/ITs-GiaHuy/HW6-API-Testing/issues) |

---

## Mục lục

- [API 1: Login (FR-02)](#api-1-login-fr-02)
- [API 2: Orders (FR-10/11)](#api-2-orders-fr-1011)
- [API 3: Import Products (FR-16)](#api-3-import-products-fr-16)
- [Summary](#summary)

---

## API 1: Login (FR-02)

### BUG-LGN-01: Password exposed in login response

| Field | Detail |
|-------|--------|
| **Bug ID** | BUG-LGN-01 |
| **GitHub Issue** | [#1](https://github.com/ITs-GiaHuy/HW6-API-Testing/issues/1) |
| **Severity** | 🔴 **Critical** |
| **API Endpoint** | `POST /api/login` |
| **Related Requirement** | SEC-01 — Password không được lộ trong response |

**Steps to Reproduce:**

1. Gửi request `POST /api/login` với body:
   ```json
   {
     "email": "test@eshop.com",
     "password": "Test1234!"
   }
   ```
2. Kiểm tra response body.

**Expected Result:**
Response trả về token và user object **KHÔNG** chứa trường `password`. Theo SEC-01, mật khẩu không bao giờ được hiển thị trong bất kỳ response nào.

**Actual Result:**
Response user object **chứa trường `password`**, lộ thông tin nhạy cảm của người dùng.

**Related Test Cases:** TC-LGN-001, TC-LGN-002, TC-LGN-044, TC-LGN-045

**Evidence:** Newman LoginReport — iterations 0, 1, 42, 43

> 📸 Screenshot: Issue [#1](https://github.com/ITs-GiaHuy/HW6-API-Testing/issues/1) — `bug_lgn_01_password_exposed.png`

---

### BUG-LGN-02: No input validation for email format

| Field | Detail |
|-------|--------|
| **Bug ID** | BUG-LGN-02 |
| **GitHub Issue** | [#2](https://github.com/ITs-GiaHuy/HW6-API-Testing/issues/2) |
| **Severity** | 🟡 **Medium** |
| **API Endpoint** | `POST /api/login` |
| **Related Requirement** | FR-02 — Validate input |

**Steps to Reproduce:**

1. Gửi request `POST /api/login` với email không hợp lệ, ví dụ:
   - `"email": "notanemail"`
   - `"email": ""`
   - `"email": "missing-at-sign.com"`
2. Quan sát response status code và message.

**Expected Result:**
Server trả về `400 Bad Request` kèm thông báo lỗi mô tả cụ thể (ví dụ: "Invalid email format").

**Actual Result:**
Server trả về `401 Unauthorized` với message chung chung `"Invalid email or password"` cho **TẤT CẢ** các input không hợp lệ, không phân biệt lỗi validation và lỗi xác thực.

**Related Test Cases:** TC-LGN-004 → TC-LGN-012, TC-LGN-018, TC-LGN-021, TC-LGN-022, TC-LGN-024, TC-LGN-030, TC-LGN-031

**Evidence:** Newman LoginReport — iterations 3–11, 17–18, 21–22, 24, 30–31

> 📸 Screenshot: Issue [#2](https://github.com/ITs-GiaHuy/HW6-API-Testing/issues/2) — `bug_lgn_02_no_email_validation.png`

---

### BUG-LGN-03: No input validation for empty/missing password

| Field | Detail |
|-------|--------|
| **Bug ID** | BUG-LGN-03 |
| **GitHub Issue** | [#3](https://github.com/ITs-GiaHuy/HW6-API-Testing/issues/3) |
| **Severity** | 🟡 **Medium** |
| **API Endpoint** | `POST /api/login` |
| **Related Requirement** | FR-02 — Validate input |

**Steps to Reproduce:**

1. Gửi request `POST /api/login` với:
   - `"password": ""` (empty string)
   - Body không chứa trường `password`
   - `"password"` với giá trị quá dài (> giới hạn cho phép)
2. Quan sát response.

**Expected Result:**
Server trả về `400 Bad Request` với thông báo cụ thể, ví dụ: `"Password cannot be empty"` hoặc `"Password too long"`.

**Actual Result:**
Server trả về `401 Unauthorized` với message chung chung `"Invalid email or password"`.

**Related Test Cases:** TC-LGN-013, TC-LGN-014, TC-LGN-015

**Evidence:** Newman LoginReport — iterations 12–14

> 📸 Screenshot: Issue [#3](https://github.com/ITs-GiaHuy/HW6-API-Testing/issues/3) — `bug_lgn_03_no_password_validation.png`

---

### BUG-LGN-04: Content-Type not validated

| Field | Detail |
|-------|--------|
| **Bug ID** | BUG-LGN-04 |
| **GitHub Issue** | [#4](https://github.com/ITs-GiaHuy/HW6-API-Testing/issues/4) |
| **Severity** | 🟢 **Low** |
| **API Endpoint** | `POST /api/login` |
| **Related Requirement** | — |

**Steps to Reproduce:**

1. Gửi request `POST /api/login` với header `Content-Type: text/plain` (hoặc không có header Content-Type).
2. Quan sát response status code.

**Expected Result:**
Server trả về `415 Unsupported Media Type`.

**Actual Result:**
Server trả về `401 Unauthorized` hoặc `500 Internal Server Error` thay vì từ chối đúng loại media type.

**Related Test Cases:** TC-LGN-033, TC-LGN-034

**Evidence:** Newman LoginReport — iterations 33–34

> 📸 Screenshot: Issue [#4](https://github.com/ITs-GiaHuy/HW6-API-Testing/issues/4) — `bug_lgn_04_content_type.png`

---

### BUG-LGN-05: HTTP methods not properly rejected

| Field | Detail |
|-------|--------|
| **Bug ID** | BUG-LGN-05 |
| **GitHub Issue** | [#5](https://github.com/ITs-GiaHuy/HW6-API-Testing/issues/5) |
| **Severity** | 🟢 **Low** |
| **API Endpoint** | `/api/login` |
| **Related Requirement** | — |

**Steps to Reproduce:**

1. Gửi request `GET /api/login`.
2. Gửi request `PUT /api/login`.
3. Gửi request `DELETE /api/login`.
4. Quan sát response status code.

**Expected Result:**
Server trả về `405 Method Not Allowed` cho các HTTP method không được hỗ trợ.

**Actual Result:**
Server trả về `404 Not Found`.

**Related Test Cases:** TC-LGN-035, TC-LGN-036, TC-LGN-037

**Evidence:** Newman LoginReport — iterations 35–37

> 📸 Screenshot: Issue [#5](https://github.com/ITs-GiaHuy/HW6-API-Testing/issues/5) — `bug_lgn_05_http_methods.png`

---

## API 2: Orders (FR-10/11)

### BUG-ORD-01: Terminal state violation — canceled order can be transitioned

| Field | Detail |
|-------|--------|
| **Bug ID** | BUG-ORD-01 |
| **GitHub Issue** | [#6](https://github.com/ITs-GiaHuy/HW6-API-Testing/issues/6) |
| **Severity** | 🔴 **Critical** |
| **API Endpoint** | `PUT /api/admin/orders/:id/status` |
| **Related Requirement** | FR-10 — Canceled is terminal state |

**Steps to Reproduce:**

1. Tạo một đơn hàng mới (`POST /api/orders`).
2. Hủy đơn hàng (`PUT /api/orders/:id/cancel`).
3. Dùng admin token gửi `PUT /api/admin/orders/:id/status` với body:
   ```json
   {
     "status": "delivered"
   }
   ```
4. Quan sát response.

**Expected Result:**
Server trả về `400 Bad Request` với message `"Cannot transition from canceled"`. Trạng thái `canceled` là trạng thái kết thúc (terminal state), không được phép chuyển sang trạng thái khác.

**Actual Result:**
Server trả về `200 OK` và đơn hàng được chuyển sang trạng thái `delivered` — vi phạm quy tắc terminal state.

**Related Test Cases:** TC-ORD-024

**Evidence:** Newman OrdersReport — iteration 23 (PUT Admin Update Status)

> 📸 Screenshot: Issue [#6](https://github.com/ITs-GiaHuy/HW6-API-Testing/issues/6) — `bug_ord_01_terminal_state.png`

---

### BUG-ORD-02: Idempotent status transition accepted

| Field | Detail |
|-------|--------|
| **Bug ID** | BUG-ORD-02 |
| **GitHub Issue** | [#7](https://github.com/ITs-GiaHuy/HW6-API-Testing/issues/7) |
| **Severity** | 🟡 **Medium** |
| **API Endpoint** | `PUT /api/admin/orders/:id/status` & `PUT /api/orders/:id/cancel` |
| **Related Requirement** | FR-10 — State machine rules |

**Steps to Reproduce:**

1. Tạo đơn hàng và hủy nó.
2. Gửi lại request hủy đơn hàng lần nữa (`PUT /api/orders/:id/cancel`) hoặc cập nhật status thành `delivered` từ trạng thái `canceled`.
3. Quan sát response.

**Expected Result:**
Server trả về `400 Bad Request` vì đơn hàng đã ở trạng thái terminal.

**Actual Result:**
Server trả về `200 OK`, chấp nhận transition không hợp lệ.

**Related Test Cases:** TC-ORD-026

**Evidence:** Newman OrdersReport — iterations 23–24

> 📸 Screenshot: Issue [#7](https://github.com/ITs-GiaHuy/HW6-API-Testing/issues/7) — `bug_ord_02_idempotent.png`

---

### BUG-ORD-03: No authentication on order detail

| Field | Detail |
|-------|--------|
| **Bug ID** | BUG-ORD-03 |
| **GitHub Issue** | [#8](https://github.com/ITs-GiaHuy/HW6-API-Testing/issues/8) |
| **Severity** | 🔴 **Critical** |
| **API Endpoint** | `GET /api/orders/:id` |
| **Related Requirement** | SEC-02 — JWT required for all protected endpoints |

**Steps to Reproduce:**

1. Gửi request `GET /api/orders/:id` **KHÔNG** kèm header `Authorization`.
2. Quan sát response.

**Expected Result:**
Server trả về `401 Unauthorized`.

**Actual Result:**
Server trả về `200 OK` kèm **toàn bộ thông tin đơn hàng** — bất kỳ ai cũng có thể xem chi tiết đơn hàng mà không cần đăng nhập.

**Related Test Cases:** TC-ORD-031

**Evidence:** Newman OrdersReport — iteration 30

> 📸 Screenshot: Issue [#8](https://github.com/ITs-GiaHuy/HW6-API-Testing/issues/8) — `bug_ord_03_no_auth.png`

---

### BUG-ORD-04: No ownership check (IDOR vulnerability)

| Field | Detail |
|-------|--------|
| **Bug ID** | BUG-ORD-04 |
| **GitHub Issue** | [#9](https://github.com/ITs-GiaHuy/HW6-API-Testing/issues/9) |
| **Severity** | 🔴 **Critical** |
| **API Endpoint** | `GET /api/orders/:id` |
| **Related Requirement** | FR-11 — User chỉ xem được đơn hàng của mình |

**Steps to Reproduce:**

1. Đăng nhập với User A, tạo đơn hàng, ghi nhận `order_id`.
2. Đăng nhập với User B.
3. Dùng token của User B gửi `GET /api/orders/:order_id` (order của User A).
4. Quan sát response.

**Expected Result:**
Server trả về `403 Forbidden` vì User B không phải chủ đơn hàng.

**Actual Result:**
Server trả về `200 OK` kèm **toàn bộ thông tin đơn hàng của User A** — lỗ hổng IDOR (Insecure Direct Object Reference).

**Related Test Cases:** TC-ORD-032

**Evidence:** Newman OrdersReport — iteration 31

> 📸 Screenshot: Issue [#9](https://github.com/ITs-GiaHuy/HW6-API-Testing/issues/9) — `bug_ord_04_idor.png`

---

### BUG-ORD-05: No admin role check on admin endpoints

| Field | Detail |
|-------|--------|
| **Bug ID** | BUG-ORD-05 |
| **GitHub Issue** | [#10](https://github.com/ITs-GiaHuy/HW6-API-Testing/issues/10) |
| **Severity** | 🔴 **Critical** |
| **API Endpoint** | `GET /api/admin/orders`, `PUT /api/admin/orders/:id/status` |
| **Related Requirement** | SEC-03, FR-12 — Admin-only access control |

**Steps to Reproduce:**

1. Đăng nhập với tài khoản **regular user** (không phải admin).
2. Gửi `GET /api/admin/orders` với token của regular user.
3. Gửi `PUT /api/admin/orders/:id/status` với token của regular user.
4. Quan sát response.

**Expected Result:**
Server trả về `403 Forbidden` cho cả hai request vì user không có quyền admin.

**Actual Result:**
Server trả về `200 OK` — regular user có thể truy cập và thao tác trên các endpoint chỉ dành cho admin.

**Related Test Cases:** TC-ORD-034, TC-ORD-035

**Evidence:** Newman OrdersReport — iterations 33–34

> 📸 Screenshot: Issue [#10](https://github.com/ITs-GiaHuy/HW6-API-Testing/issues/10) — `bug_ord_05_no_admin_check.png`

---

## API 3: Import Products (FR-16)

### BUG-IMP-01: No name validation on import

| Field | Detail |
|-------|--------|
| **Bug ID** | BUG-IMP-01 |
| **GitHub Issue** | [#11](https://github.com/ITs-GiaHuy/HW6-API-Testing/issues/11) |
| **Severity** | 🔴 **High** |
| **API Endpoint** | `POST /api/admin/import-products` |
| **Related Requirement** | FR-16 — Name không được rỗng |

**Steps to Reproduce:**

1. Gửi `POST /api/admin/import-products` với admin token và body:
   ```json
   {
     "products": [
       { "name": "", "price": 100, "category_id": 1 },
       { "name": null, "price": 100, "category_id": 1 },
       { "name": "   ", "price": 100, "category_id": 1 }
     ]
   }
   ```
2. Quan sát response.

**Expected Result:**
Server trả về `400 Bad Request` với thông báo validation error cho tên sản phẩm.

**Actual Result:**
Server trả về `200 OK` và sản phẩm được import thành công với tên rỗng/null/whitespace.

**Related Test Cases:** TC-IMP-005, TC-IMP-006, TC-IMP-007

**Evidence:** Newman ImportReport — iterations 4–6

> 📸 Screenshot: Issue [#11](https://github.com/ITs-GiaHuy/HW6-API-Testing/issues/11) — `bug_imp_01_no_name_validation.png`

---

### BUG-IMP-02: No name length validation

| Field | Detail |
|-------|--------|
| **Bug ID** | BUG-IMP-02 |
| **GitHub Issue** | [#12](https://github.com/ITs-GiaHuy/HW6-API-Testing/issues/12) |
| **Severity** | 🟡 **Medium** |
| **API Endpoint** | `POST /api/admin/import-products` |
| **Related Requirement** | FR-15 — Tên sản phẩm tối đa 255 ký tự |

**Steps to Reproduce:**

1. Gửi `POST /api/admin/import-products` với product có `name` dài hơn 255 ký tự.
2. Quan sát response.

**Expected Result:**
Server trả về `400 Bad Request` với thông báo lỗi chiều dài tên vượt quá giới hạn.

**Actual Result:**
Server trả về `200 OK`, sản phẩm được import với tên quá dài.

**Related Test Cases:** TC-IMP-009

**Evidence:** Newman ImportReport — iteration 8

> 📸 Screenshot: Issue [#12](https://github.com/ITs-GiaHuy/HW6-API-Testing/issues/12) — `bug_imp_02_name_length.png`

---

### BUG-IMP-03: No price validation on import

| Field | Detail |
|-------|--------|
| **Bug ID** | BUG-IMP-03 |
| **GitHub Issue** | [#13](https://github.com/ITs-GiaHuy/HW6-API-Testing/issues/13) |
| **Severity** | 🔴 **Critical** |
| **API Endpoint** | `POST /api/admin/import-products` |
| **Related Requirement** | FR-15 (giá phải > 0), FR-16 (validation trước khi import) |

**Steps to Reproduce:**

1. Gửi `POST /api/admin/import-products` với các giá trị price không hợp lệ:
   ```json
   { "price": 0 }
   { "price": -1 }
   { "price": "abc" }
   { "price": null }
   ```
   Hoặc thiếu trường `price` hoàn toàn.
2. Quan sát response.

**Expected Result:**
Server trả về `400 Bad Request` với thông báo validation error cho giá sản phẩm.

**Actual Result:**
Server trả về `200 OK`, sản phẩm được import với giá không hợp lệ (0, âm, chuỗi, null).

**Related Test Cases:** TC-IMP-012, TC-IMP-013, TC-IMP-016, TC-IMP-017, TC-IMP-019

**Evidence:** Newman ImportReport — iterations 11–12, 15–16, 18

> 📸 Screenshot: Issue [#13](https://github.com/ITs-GiaHuy/HW6-API-Testing/issues/13) — `bug_imp_03_no_price_validation.png`

---

### BUG-IMP-04: No atomic rollback on batch import

| Field | Detail |
|-------|--------|
| **Bug ID** | BUG-IMP-04 |
| **GitHub Issue** | [#14](https://github.com/ITs-GiaHuy/HW6-API-Testing/issues/14) |
| **Severity** | 🔴 **Critical** |
| **API Endpoint** | `POST /api/admin/import-products` |
| **Related Requirement** | FR-16 — All-or-nothing atomic transaction |

**Steps to Reproduce:**

1. Gửi `POST /api/admin/import-products` với batch chứa cả sản phẩm hợp lệ và không hợp lệ:
   ```json
   {
     "products": [
       { "name": "Valid Product", "price": 100, "category_id": 1 },
       { "name": "", "price": -1, "category_id": 999 }
     ]
   }
   ```
2. Kiểm tra database sau khi request hoàn tất.

**Expected Result:**
Toàn bộ batch bị từ chối (rollback), **không có sản phẩm nào** được insert vào database. Đây là yêu cầu all-or-nothing.

**Actual Result:**
Các sản phẩm hợp lệ được insert, các sản phẩm không hợp lệ bị bỏ qua → **partial import** — vi phạm tính atomic.

**Related Test Cases:** TC-IMP-031

**Evidence:** Newman ImportReport — iteration 30

> 📸 Screenshot: Issue [#14](https://github.com/ITs-GiaHuy/HW6-API-Testing/issues/14) — `bug_imp_04_no_rollback.png`

---

### BUG-IMP-05: No admin role check on import endpoint

| Field | Detail |
|-------|--------|
| **Bug ID** | BUG-IMP-05 |
| **GitHub Issue** | [#15](https://github.com/ITs-GiaHuy/HW6-API-Testing/issues/15) |
| **Severity** | 🔴 **Critical** |
| **API Endpoint** | `POST /api/admin/import-products` |
| **Related Requirement** | SEC-03, FR-12 — Admin-only access |

**Steps to Reproduce:**

1. Đăng nhập với tài khoản **regular user** (không phải admin).
2. Gửi `POST /api/admin/import-products` với token của regular user và body chứa danh sách products hợp lệ.
3. Quan sát response.

**Expected Result:**
Server trả về `403 Forbidden`.

**Actual Result:**
Server trả về `200 OK`, sản phẩm được import thành công — regular user có thể import products.

**Related Test Cases:** TC-IMP-036

**Evidence:** Newman ImportReport — iteration 35

> 📸 Screenshot: Issue [#15](https://github.com/ITs-GiaHuy/HW6-API-Testing/issues/15) — `bug_imp_05_no_admin_check.png`

---

### BUG-IMP-06: No category_id validation

| Field | Detail |
|-------|--------|
| **Bug ID** | BUG-IMP-06 |
| **GitHub Issue** | [#16](https://github.com/ITs-GiaHuy/HW6-API-Testing/issues/16) |
| **Severity** | 🔴 **High** |
| **API Endpoint** | `POST /api/admin/import-products` |
| **Related Requirement** | FR-16 — Validation trước khi import |

**Steps to Reproduce:**

1. Gửi `POST /api/admin/import-products` với các giá trị `category_id` không hợp lệ:
   - `category_id` không tồn tại (ví dụ: `99999`)
   - `category_id: null`
   - `category_id: "abc"` (string thay vì number)
2. Quan sát response.

**Expected Result:**
Server trả về `400 Bad Request` với thông báo lỗi validation cho `category_id`.

**Actual Result:**
Server trả về `200 OK` hoặc **bị crash** (500 Internal Server Error) tùy theo giá trị đầu vào.

**Related Test Cases:** TC-IMP-028, TC-IMP-029, TC-IMP-030

**Evidence:** Newman ImportReport — iterations 27–29

> 📸 Screenshot: Issue [#16](https://github.com/ITs-GiaHuy/HW6-API-Testing/issues/16) — `bug_imp_06_category_id.png`

---

### BUG-IMP-07: Server crash on null array element

| Field | Detail |
|-------|--------|
| **Bug ID** | BUG-IMP-07 |
| **GitHub Issue** | [#17](https://github.com/ITs-GiaHuy/HW6-API-Testing/issues/17) |
| **Severity** | 🔴 **High** |
| **API Endpoint** | `POST /api/admin/import-products` |
| **Related Requirement** | FR-16 — Validation trước khi import |

**Steps to Reproduce:**

1. Gửi `POST /api/admin/import-products` với body:
   ```json
   {
     "products": [null]
   }
   ```
2. Quan sát response.

**Expected Result:**
Server trả về `400 Bad Request` với thông báo validation error.

**Actual Result:**
Server trả về `500 Internal Server Error` kèm **HTML error page** — server bị crash khi xử lý phần tử `null` trong mảng.

**Related Test Cases:** TC-IMP-024

**Evidence:** Newman ImportReport — iteration 23

> 📸 Screenshot: Issue [#17](https://github.com/ITs-GiaHuy/HW6-API-Testing/issues/17) — `bug_imp_07_server_crash.png`

---

## Summary

### Thống kê bug theo API và mức độ nghiêm trọng

| API | 🔴 Critical | 🔴 High | 🟡 Medium | 🟢 Low | **Total** |
|-----|:-----------:|:-------:|:---------:|:------:|:---------:|
| Login (FR-02) | 1 | 0 | 2 | 2 | **5** |
| Orders (FR-10/11) | 4 | 0 | 1 | 0 | **5** |
| Import Products (FR-16) | 3 | 3 | 1 | 0 | **7** |
| **Total** | **8** | **3** | **4** | **2** | **17** |

### Phân loại bug theo nhóm vấn đề

| Nhóm vấn đề | Số lượng | Bug IDs |
|-------------|:--------:|---------|
| **Security — Authentication/Authorization** | 5 | BUG-LGN-01, BUG-ORD-03, BUG-ORD-04, BUG-ORD-05, BUG-IMP-05 |
| **Input Validation** | 8 | BUG-LGN-02, BUG-LGN-03, BUG-IMP-01, BUG-IMP-02, BUG-IMP-03, BUG-IMP-06, BUG-IMP-07, BUG-LGN-04 |
| **Business Logic** | 3 | BUG-ORD-01, BUG-ORD-02, BUG-IMP-04 |
| **HTTP Compliance** | 1 | BUG-LGN-05 |

> [!WARNING]
> Có **8 bug Critical** và **3 bug High** — phần lớn liên quan đến **bảo mật** (lộ password, thiếu authentication, thiếu authorization, IDOR) và **thiếu input validation**. Các lỗi này cần được khắc phục **ngay lập tức** trước khi đưa API vào production.

> [!NOTE]
> Tất cả bugs đã được report trên GitHub Issues page.
> Link: [https://github.com/ITs-GiaHuy/HW6-API-Testing/issues](https://github.com/ITs-GiaHuy/HW6-API-Testing/issues)
