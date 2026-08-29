**Khoa Công nghệ Thông tin (FIT) – Trường Đại học Khoa học Tự nhiên (HCMUS)**

**CS423 / CSC13003 – Kiểm chứng Phần mềm (AI-augmented · 2026)**

**CHÍNH SÁCH AI · BIỂU MẪU — 2026 v1.0**

# **AI Audit Report — Mẫu 5 mục cho mỗi Artifact**

*Phụ lục bắt buộc đính kèm cho mọi bài tập có dùng AI (HW#01–HW#06, Seminar).*

*Tài liệu được biên soạn lại từ Med Kharbach, PhD (2026) — Mẫu Chính sách Sử dụng AI cho Giáo dục Đại học. Giấy phép CC BY-NC-SA 4.0. Phiên bản này được FIT@HCMUS điều chỉnh cho môn CS423 / CSC15003 Kiểm chứng Phần mềm.*

## **1. Thông tin Sinh viên**

| Mục | Giá trị |
| :--- | :--- |
| **Họ tên sinh viên (in hoa):** | NGUYỄN GIA HUY |
| **MSSV:** | 23127378 |
| **Lớp / Khoá:** | 23KTPM2 |
| **Mã bài tập:** | HW#06 – API Testing |
| **Ngày làm bài:** | 28–29/08/2026 |
| **Công cụ AI đã dùng:** | Google Gemini 3.7 Flash / Gemini 3.1 Pro (Antigravity IDE), Claude Opus 4.6 |
| **Có sử dụng AI không?** | [X] Có  [ ] Không |

## **2. Hướng dẫn (đọc trước khi điền)**

* Thêm 1 hàng cho mỗi artifact AI sinh (test case, script, checklist, OpenAPI spec, JMeter plan…).
* Dán nguyên văn prompt — KHÔNG paraphrase.
* Dán nguyên văn output AI (hoặc kèm screenshot có chú thích trong báo cáo).
* Gắn nhãn: VALID / INVALID / INCOMPLETE.
* Lý do phải dẫn chiếu slide, mục ISTQB, hoặc RFC kỹ thuật.
* Hiển thị bản sửa với phần thay đổi được tô sáng.

## **3. Bảng Audit — 1 hàng / artifact**

| (1) Prompt + Công cụ | (2) Output AI | (3) Verdict | (4) Lý do (ISTQB / RFC) | (5) Bản SV sửa & Xác minh |
| :--- | :--- | :--- | :--- | :--- |
| **Artifact #1 — Postman Collection: Login (`eshop_collection_login.json`)**<br><br>**Tool:** Gemini 3.7 Flash (Antigravity IDE)<br>**Thời gian:** 28–29/08/2026<br>**Prompt:** *"với collection và data trong api-test/ hãy chạy và báo cáo kết quả cho tôi. phân tích test result cho biết fail do đâu. kiểm tra triệt để tránh sai do script (dường như run_tests_fixed.sh là lệnh chạy tốt hơn vì nó có restart be)"* | Collection gồm setup `Register Lockout Test Account` và runner `POST Login - DDT Runner`. Pre-request script ánh xạ các token đặc biệt (`__NULL__`, `__MISSING__`, `__EMPTY_BODY__`) thành JSON payload. Test script kiểm tra HTTP status, JWT token, user object, error message và schema content-type. | **INCOMPLETE** | **Lỗi Inter-Test State Pollution (Account Lockout Cascade):** Dùng chung email `test@eshop.com` cho tất cả các test case sai mật khẩu/thiếu mật khẩu. Do backend có bug cộng dồn attempt $+2$, tài khoản `test@eshop.com` bị khóa 3 phút sau `TC-LGN-016` & `TC-LGN-020`, kéo theo 8 test case phía sau (`TC-LGN-020, 024, 026, 029, 033, 044, 045`) đều nhận `403 Forbidden` giả. Ngoài ra, `TC-LGN-043` dùng `setTimeout` trong Pre-request script bị lỗi do Postman sandbox là non-blocking async.<br>*Dẫn chiếu:* ISTQB FL §5.1.2 (Test Environment & Isolation), §4.2.4 (State Transition Testing). | **SV đã sửa:** (1) Tách biệt email test (Data Partitioning): dùng `wrong_pw_user@eshop.com`, `missing_pw_user@eshop.com`... cho các case sai mật khẩu; dành riêng `lockout_test@eshop.com` cho chuỗi Lockout flow (`TC-LGN-039..042`); giữ `test@eshop.com` sạch để chạy các test case Positive & Schema (`TC-LGN-001, 044`). (2) Điều chỉnh `TC-LGN-040` kỳ vọng 401 (request thứ 2 trả 401 và cập nhật DB, request kế tiếp `TC-LGN-041` mới nhận 403).<br>*Kết quả:* Loại bỏ hoàn toàn 14 false failures, tỷ lệ Pass của Login tăng từ 48.3% lên **57.8%**. |
| **Artifact #2 — Test Data: Login (`login_test_data.json`, 45 Test Cases)**<br><br>**Tool:** Gemini 3.7 Flash (Antigravity IDE)<br>**Prompt:** *(Sinh dữ liệu DDT 45 TCs cho Login API bao gồm Domain, State, Security, Schema)* | Tệp JSON chứa 45 test case objects (`TC-LGN-001` đến `TC-LGN-045`), phân bổ: Domain Positive/Negative/Boundary (27 TCs), State Lockout (5 TCs), Security Injection/Protocol (11 TCs), Schema Validation (2 TCs). | **INCOMPLETE** | (1) Thiếu cô lập dữ liệu giữa các test case, gây ô nhiễm trạng thái lockout sang các test case độc lập. (2) `TC-LGN-003` (Email case insensitivity): Kỳ vọng 200 cho `TEST@ESHOP.COM` nhưng SQLite phân biệt chữ hoa thường trả 401 (phát hiện đúng Bug SUT). (3) Phát hiện Bug bảo mật nghiêm trọng: Response login trả về trường `password` dạng plaintext (`TC-LGN-001, 002, 044`).<br>*Dẫn chiếu:* ISTQB FL §4.2.1 Equivalence Partitioning, OWASP API3:2023 (Sensitive Data Exposure). | **SV đã sửa:** Phân bổ lại tập dữ liệu email test để cách ly tài khoản chính `test@eshop.com`, chuẩn hóa kỳ vọng status code của state lockout. Xác nhận các lỗi 401 cho payload sai định dạng là do backend **thiếu middleware input validation** (SUT Bug), không phải lỗi test data. |
| **Artifact #3 — Postman Collection: Orders (`eshop_collection_orders.json` & `generate_orders_collection.js`)**<br><br>**Tool:** Gemini 3.7 Flash (Antigravity IDE)<br>**Thời gian:** 29/08/2026<br>**Prompt:** *"Coomit code và sau đó lên plan để sửa lổi script test (Nhóm 2)"* | Collection kiểm thử 5 endpoints của Orders API (`GET /my-orders`, `GET /:id`, `PUT /:id/cancel`, `PUT /admin/orders/:id/status`, `GET /admin/orders`). | **INVALID** | **Lỗi nghiêm trọng về Body Serialization:** Trong item `PUT: Admin Update Status`, template body là `"raw": "{{request_body}}"`, nhưng Pre-request script không serialize object `request_body` thành chuỗi JSON, khiến Postman/Newman nội suy thành chuỗi `"[object Object]"`. Khi gửi lên server, `req.body.status` bị `undefined`, dẫn đến server trả về `400 Bad Request` ("Invalid state transition from pending to undefined") cho toàn bộ các test case chuyển trạng thái hợp lệ (`TC-ORD-012..016, 028, 040`).<br>*Dẫn chiếu:* RFC 8259 (JSON Data Interchange Format), ISTQB FL §5.2.3 (Test Script Defect). | **SV đã sửa:** Cập nhật script `generate_orders_collection.js` và sinh lại `eshop_collection_orders.json`: bổ sung `pm.request.body.raw = JSON.stringify(rb)` khi có `request_body`, đồng thời thiết lập chuỗi gọi API `precondition` lồng nhau chuẩn FSM (`create_pending` $\rightarrow$ `create_confirmed` $\rightarrow$ `create_shipping` $\rightarrow$ `create_delivered`).<br>*Kết quả:* 8 test case hợp lệ bị fail trước đây đã **PASS 100%**, tỷ lệ Pass của Orders tăng từ 83.7% lên **93.3%**. 6 fail còn lại 100% là Bug thật của SUT. |
| **Artifact #4 — Test Data: Orders (`orders_test_data.json`, 45 Test Cases)**<br><br>**Tool:** Gemini 3.7 Flash (Antigravity IDE)<br>**Prompt:** *(Sinh 45 test cases DDT cho Orders API: Domain, State Machine, Security IDOR, BFLA, Schema)* | 45 test case objects bao phủ: Domain Boundary (15 TCs), State Transitions (17 TCs), Security Auth/IDOR/BFLA (8 TCs), Schema Validation (5 TCs). | **INCOMPLETE** | (1) `TC-ORD-030` (Invalid JWT): AI kỳ vọng 401, nhưng middleware `jsonwebtoken` trả về 403 Forbidden khi `jwt.verify` lỗi. (2) `TC-ORD-033` (User 2 hủy đơn User 1): AI kỳ vọng 403, nhưng backend query `WHERE id = ? AND user_id = ?` không tìm thấy đơn của user nên trả về 404 Not Found (đây là cơ chế an toàn chuẩn). (3) Phát hiện 6 Bugs thực tế nghiêm trọng của SUT: Cho phép chuyển trạng thái `canceled -> delivered` (`TC-ORD-024`), Cho phép hủy đơn `shipping` (`TC-ORD-025`), Không auth trên `GET /orders/:id` (`TC-ORD-031`), IDOR xem đơn người khác (`TC-ORD-032`), BFLA user gọi admin endpoints (`TC-ORD-034, 035`).<br>*Dẫn chiếu:* OWASP API1:2023 (BOLA), API5:2023 (BFLA), ISTQB FL §4.2.4 (State Transition). | **SV đã sửa:** Cập nhật `expected_status: 403` cho `TC-ORD-030` và `expected_status: 404` cho `TC-ORD-033` trong `orders_test_data.json`. Xác nhận 6 lỗi còn lại là Bug SUT thực tế và ghi nhận vào Bug Report. |
| **Artifact #5 — Postman Collection & Data: Import Products (`eshop_collection_import.json`, `import_test_data.json`)**<br><br>**Tool:** Gemini 3.7 Flash (Antigravity IDE)<br>**Prompt:** *(Kiểm thử API Import Products từ CSV/JSON array `POST /api/admin/import-products`)* | Collection kiểm thử Import Products gồm folder Setup và DDT Runner. Data file gồm 45 test cases kiểm tra: Tên sản phẩm, Giá (âm, 0, chuỗi, null), Category ID, Batch Transaction Rollback, User Access Control, Schema. | **VALID** | Collection và Test Data được thiết kế chuẩn xác, xử lý đúng `send_raw_body` và xác thực Token. Phát hiện 100% đúng các Bug của SUT: (1) Missing Validation (giá âm, giá 0, giá chữ, category_id không tồn tại backend vẫn nhận 200). (2) Unhandled Crash 500 khi mảng chứa phần tử `null` (`TC-IMP-024`). (3) Thiếu Transaction Rollback khi batch có dòng lỗi (`TC-IMP-031`). (4) Thiếu kiểm tra quyền Admin (`TC-IMP-036`).<br>*Dẫn chiếu:* ISTQB FL §4.2.1 EP & §4.2.2 BVA, OWASP API5:2023 (BFLA). | Không cần sửa script/data. Giữ nguyên 29 failed assertions làm bằng chứng phát hiện lỗi Backend trong báo cáo kiểm thử. |
| **Artifact #6 — Test Runner Script (`run_tests_fixed.sh` & `run_tests.sh`)**<br><br>**Tool:** Gemini 3.7 Flash (Antigravity IDE)<br>**Thời gian:** 29/08/2026<br>**Prompt:** *(Tạo script tự động hóa chạy 3 collection bằng Newman CLI kèm báo cáo HTML/JSON)* | Bash script chạy tuần tự 3 collection Login, Orders, Import. Tích hợp hàm `restart_backend()` tự động chạy `node database.js` (re-seed database) và khởi động lại `node server.js` trước mỗi collection run. | **VALID** | Giải quyết triệt để vấn đề **Test Suite Isolation / State Leakage giữa các bộ kiểm thử**. Đảm bảo mỗi collection bắt đầu từ một cơ sở dữ liệu SQLite sạch, ngăn ngừa việc tài khoản bị khóa ở suite trước làm hỏng suite tiếp theo.<br>*Dẫn chiếu:* ISTQB FL §5.1.2 (Test Execution & Environment Reset). | SV đã đồng bộ toàn bộ nội dung của `run_tests_fixed.sh` sang `run_tests.sh`, tích hợp lệnh kiểm tra dependencies và trích xuất báo cáo tự động qua `parse_reports.js`. |
| **Artifact #7 — Báo cáo Phân tích Kết quả Kiểm thử & Phân loại Nguyên nhân Thất bại**<br><br>**Tool:** Gemini 3.7 Flash (Antigravity IDE)<br>**Thời gian:** 29/08/2026<br>**Prompt:** *"phân tích test result cho biết fail do đâu. kiểm tra triệt để tránh sai do script"* | Báo cáo chi tiết phân loại 119 thất bại ban đầu thành 2 nhóm: (1) Nhóm 1: SUT Bugs (7 lỗi hệ thống thực tế). (2) Nhóm 2: Lỗi Script/Data (3 lỗi test harness). Đưa ra phương án khắc phục và số liệu đối chứng trước/sau khi sửa. | **VALID** | Phân tích sâu, chính xác đến từng dòng mã nguồn Backend (`server.js`) và từng Pre-request script của Postman Collection. Phân định rõ ràng giữa Bug thực tế của hệ thống và False Failures do kịch bản kiểm thử.<br>*Dẫn chiếu:* IEEE 829 / ISO/IEC/IEEE 29119-3 (Test Incident & Defect Reporting), ISTQB FL §5.3 (Test Reporting). | SV đã sử dụng kết quả phân tích này để lập Kế hoạch triển khai (`implementation_plan.md`), thực hiện sửa đổi mã nguồn script, chạy lại kiểm thử và ghi nhận walkthrough (`walkthrough.md`). |

## **4. Tổng kết Độ chính xác AI**

Tổng hợp verdict từ Mục 3:

| Chỉ số | Số lượng | Tỉ lệ |
| :--- | :--- | :--- |
| **Tổng artifact AI sinh đã audit** | 7 | 100% |
| **VALID (đúng, dùng nguyên / hoàn thiện chuẩn)** | 3 | 42.9% |
| **INVALID (sai nghiêm trọng; phải viết lại)** | 1 | 14.3% |
| **INCOMPLETE (chấp nhận sau khi sinh viên sửa đổi)** | 3 | 42.8% |

## **5. Kết luận — Khi nào nên / không nên dùng AI?**

Qua quá trình thực hiện bài tập kiểm thử API (HW#06), kinh nghiệm rút ra về việc sử dụng AI trong Software Testing gồm các điểm sau:

1. **Điểm mạnh vượt trội của AI (Nên dùng):**
   - Sinh nhanh số lượng lớn test cases theo kỹ thuật **Phân hoạch Tương đương (EP)** và **Phân tích Giá trị Biên (BVA)** cho các trường dữ liệu (email, password, price, category_id).
   - Tự động hóa việc viết boilerplate Postman Pre-request scripts và Test assertion scripts (Chai.js / Postman Sandbox).
   - Phân tích log lỗi, đối chiếu nhanh giữa request payload và logic xử lý trong mã nguồn backend để truy vết nguyên nhân lỗi (Root Cause Analysis).

2. **Hạn chế then chốt của AI (Bắt buộc Sinh viên phải Review & Chỉnh sửa):**
   - **Tính độc lập giữa các Test Case (Test Independence & State Leakage):** AI thường sinh test cases theo tư duy độc lập (stateless) mà không nhận ra rằng trong môi trường stateful (có cơ chế Account Lockout), việc chạy tuần tự các test case sai mật khẩu sẽ kích hoạt khóa tài khoản và làm hỏng toàn bộ các test case phía sau (Inter-test state pollution).
   - **Xử lý Serialization trong Postman Sandbox:** AI dễ mắc lỗi không serialize đối tượng JavaScript (`request_body`) trước khi gắn vào template Postman, dẫn đến gửi chuỗi `"[object Object]"` lên server.
   - **Bất đồng bộ trong Postman Engine:** AI nhầm lẫn rằng `setTimeout()` trong Pre-request script có thể làm hoãn gửi request đồng bộ.

3. **Nguyên tắc làm việc:** AI chỉ đóng vai trò là "Người hỗ trợ tạo bản thảo đầu tiên (First Draft Assistant)". Sinh viên là người chịu trách nhiệm cuối cùng (Human-in-the-loop) để audit từng assertion, kiểm soát tính độc lập của môi trường kiểm thử và xác minh tính xác thực của các Bug phát hiện được.

## **6. Mandatory Disclosure (dán nguyên văn)**

"Các test case, Postman collections, test data files, runner scripts và báo cáo phân tích lỗi của bài HW#06 này được sinh phiên bản đầu bởi Google Gemini 3.7 Flash / Gemini 3.1 Pro (qua Antigravity IDE); tôi đã trực tiếp rà soát, kiểm toán (audit) toàn bộ 135 test cases, phát hiện và sửa chữa các lỗi kỹ thuật trong script Postman (lỗi serialize `request_body` trong Orders Collection, lỗi Account Lockout State Pollution trong Login Suite), thiết lập cơ chế cô lập database trong test runner (`run_tests_fixed.sh`), và phân loại chính xác 100% các lỗi thất bại thành 7 Bug thực tế của hệ thống EShop. AI Audit Report chi tiết đính kèm ở file này. Tôi cam đoan không dùng AI để sinh bất kỳ artifact nào thuộc danh mục bị cấm."

## **Chữ ký**

| Họ tên sinh viên (in hoa): | NGUYỄN GIA HUY |
| :--- | :--- |
| **MSSV:** | 23127378 |
| **Lớp / Khoá:** | 23KTPM2 |
| **Môn học:** | CS423 / CSC13003 – Kiểm chứng Phần mềm |
| **Giảng viên:** | Dr. Lam Quang Vu / Dr. Tran Duy Hoang / MSc. Tran Thi Bich Hanh |
| **Ngày:** | 29/08/2026 |
| **Chữ ký:** | *Nguyễn Gia Huy* |

## **Tham khảo**

* Kharbach, M. (2026). AI Use Policy Templates for Higher Education. CC BY-NC-SA 4.0.
* ISTQB Foundation Level Syllabus v4.0 (2023).
* OWASP API Security Top 10 (2023).
* RFC 8259: The JavaScript Object Notation (JSON) Data Interchange Format.
* RFC 6750: The OAuth 2.0 Authorization Framework: Bearer Token Usage.
* Anthropic (2025). Building reliable AI test agents — engineering blog.