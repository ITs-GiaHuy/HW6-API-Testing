**Khoa Công nghệ Thông tin (FIT) – Trường Đại học Khoa học Tự nhiên (HCMUS)**

**CS423 / CSC13003 – Kiểm chứng Phần mềm (AI-augmented · 2026\)**

**CHÍNH SÁCH AI · BIỂU MẪU — 2026 v1.0**

# **AI Audit Report — Mẫu 5 mục cho mỗi Artifact**

*Phụ lục bắt buộc đính kèm cho mọi bài tập có dùng AI (HW\#01–HW\#06, Seminar).*

*Tài liệu được biên soạn lại từ Med Kharbach, PhD (2026) — Mẫu Chính sách Sử dụng AI cho Giáo dục Đại học. Giấy phép CC BY-NC-SA 4.0. Phiên bản này được FIT@HCMUS điều chỉnh cho môn CS423 / CSC15003 Kiểm chứng Phần mềm.*

## **1\. Thông tin Sinh viên**

| Mục | Giá trị |
| :---- | :---- |
| **Họ tên sinh viên (in hoa):** | NGUYỄN GIA HUY |
| **MSSV:** | 23127378 |
| **Lớp / Khoá:** | 23KTPM2 |
| **Mã bài tập (ví dụ HW\#00, HW\#02):** | HW\#06 – API Testing |
| **Ngày làm bài:** | 28-29/08/2026 |
| **Công cụ AI đã dùng:** | Google Gemini 3.7 Flash / Gemini 3.1 Pro (Antigravity IDE), Claude Opus 4.6 |
| **Có sử dụng AI không?** | \[X\] Có  \[ \] Không |

## **2\. Hướng dẫn (đọc trước khi điền)**

* Thêm 1 hàng cho mỗi artifact AI sinh (test case, script, checklist, OpenAPI spec, JMeter plan…).  
* Dán nguyên văn prompt — KHÔNG paraphrase.  
* Dán nguyên văn output AI (hoặc kèm screenshot có chú thích trong báo cáo).  
* Gắn nhãn: VALID / INVALID / INCOMPLETE.  
* Lý do phải dẫn chiếu slide, mục ISTQB, hoặc RFC kỹ thuật.  
* Hiển thị bản sửa với phần thay đổi được tô sáng.  
* Hàng mẫu in nghiêng — thay trước khi nộp.

## **3\. Bảng Audit — 1 hàng / artifact**

| (1) Prompt \+ Công cụ | (2) Output AI | (3) Verdict | (4) Lý do (ISTQB) | (5) Bản SV sửa |
| :---- | :---- | :---- | :---- | :---- |
| **Artifact \#1 — Postman Collection: Login (eshop\_collection\_login.json)** | | | | |
| **Tool:** Gemini 3.1 Pro (Antigravity IDE) **Thời gian:** ~22:00 28/08/2026 **Prompt:** "với collection và data trong api-test/ hãy chạy và báo cáo kết quả cho tôi. phân tích test result cho biết fail do đâu. kiểm tra triệt để tránh sai do script" *(AI đã được cung cấp sẵn các file collection + data do AI session trước sinh ra, và được yêu cầu chạy + phân tích)* | Collection chứa 2 requests: (1) Register Lockout Test Account (setup), (2) POST Login - DDT Runner. Pre-request script xử lý body động (email/password special tokens như `__NULL__`, `__MISSING__`, `__EMPTY_BODY__`). Test script assert status code, error message, token, response time. Chạy 45 iterations qua data file. | **INCOMPLETE** | **Vấn đề Account Lockout State Leakage:** Script dùng cùng 1 tài khoản `test@eshop.com` cho tất cả iterations. Backend khóa tài khoản sau 2 lần sai (bug: `newAttempts = login_attempts + 2`, nên chỉ 1 lần sai là bị khóa). Từ iteration 14 trở đi, mọi request đều trả về 403 thay vì expected status → sinh ra ~20 false failure do state leakage. ISTQB FL §5.1.2 yêu cầu test execution phải đảm bảo test environment được thiết lập đúng; §4.2.4 State Transition Testing yêu cầu xem xét trạng thái hệ thống trước mỗi test. | SV phát hiện vấn đề nhờ AI phân tích output. **Sửa:** Tạo file `run_tests_fixed.sh` restart backend server (reset DB) giữa mỗi collection run để tránh state leakage giữa các suite. Tuy nhiên lockout vẫn ảnh hưởng nội bộ Login suite (iterations 14, 15, 19, 23, 25, 28, 32, 42-44 bị 403). Cần thiết kế test data dùng tài khoản khác nhau cho mỗi nhóm test hoặc thêm bước reset lockout giữa các iteration. |
| **Artifact \#2 — Test Data: Login (login\_test\_data.json, 45 TCs)** | | | | |
| **Tool:** Gemini 3.1 Pro (session trước) **Prompt:** *(Sinh từ session trước — AI sinh 45 test cases cho Login API, bao gồm Domain-Positive, Domain-Email, Domain-Password, Domain-Missing/Type, Domain-Boundary, Security-Injection, Security-Protocol, State-Lockout, Schema)* | 45 JSON objects, mỗi object chứa: `tc_id`, `tc_name`, `category`, `email`, `password`, `expected_status`, `should_have_token`, `expected_error`, `is_lockout_test`, `wait_before_ms`. Bao phủ tốt 4 danh mục: Domain (27 TCs), State (5 TCs), Security (11 TCs), Schema (2 TCs). | **INCOMPLETE** | (1) **Email case-insensitivity (TC-LGN-003):** AI expect 200 cho email `TEST@ESHOP.COM`, nhưng backend xử lý case-sensitive → 401. Đây là bug thực của backend, test data đúng. (2) **Lockout wait time sai (TC-LGN-043):** `wait_before_ms: 35000` nhưng backend lock 180s → vẫn bị 403. AI không kiểm tra source code để biết lock duration. ISTQB FL §4.3 BVA: cần test biên chính xác. (3) **Thiếu validation riêng biệt:** AI expect 400 + "Invalid email format" cho email sai định dạng, nhưng backend không có validation layer → ném thẳng 401. Test data phát hiện đúng bug, nhưng kỳ vọng error message quá chi tiết so với backend thực tế. | SV xác nhận qua AI phân tích: TC-LGN-003 đến TC-LGN-012 (email invalid) fail vì backend **thiếu input validation** (chỉ 401 cho mọi TH) — đây là bug thật. TC-LGN-043 cần sửa `wait_before_ms: 185000` để chờ hết lockout. Các test case khám phá bug: response trả về field `password` (TC-LGN-001, 002). |
| **Artifact \#3 — Postman Collection: Orders (eshop\_collection\_orders.json)** | | | | |
| **Tool:** Gemini 3.1 Pro (session trước) **Prompt:** *(Sinh collection kiểm thử Orders API với 5 endpoints: GET my-orders, GET order detail, PUT cancel, GET admin orders, PUT admin update status)* | Collection gồm 5 requests chính. Pre-request script ở collection level tự động login để lấy `user_token`, `admin_token`, `user2_token` (cho IDOR test). Mỗi request có test script assert status code theo `expected_status` từ data file. Precondition system tạo order với đúng trạng thái cần thiết trước mỗi test. | **INCOMPLETE** | **Setup chỉ chạy 1 lần (iteration 0):** Pre-request setup (login lấy token) bị bảo vệ bởi `pm.collectionVariables.get('setup_done')`, chỉ chạy lần đầu. Nếu chạy sau Login suite (account đã bị khóa), setup login thất bại ngầm → `user_token` rỗng → Iteration 0-3 fail giả (401/404). ISTQB FL §5.1.2: Test environment phải độc lập giữa các suite. | **Sửa:** Dùng `run_tests_fixed.sh` restart backend giữa các collection. Kết quả sau fix: Orders giảm từ 22 fail → 14 fail. 8 fail đầu tiên (Iter 0-3, 40-42) biến mất — chứng minh đó là false failure do state leakage. 14 fail còn lại là bug thật. |
| **Artifact \#4 — Test Data: Orders (orders\_test\_data.json, 45 TCs)** | | | | |
| **Tool:** Gemini 3.1 Pro (session trước) **Prompt:** *(Sinh 45 test cases DDT cho Orders API, bao gồm state transitions, security, IDOR)* | 45 JSON objects với fields: `tc_id`, `target_request`, `auth_role`, `auth_override`, `path_param_id`, `request_body`, `precondition`, `expected_status`, `is_bug`. Bao phủ: Domain (15 TCs), State Transition (17 TCs), Security (8 TCs), Schema (5 TCs). | **INCOMPLETE** | (1) **State transition fail (Iter 11-15):** Admin update status từ pending→confirmed, confirmed→shipping, shipping→delivered đều trả 400 thay vì 200. AI tạo test đúng, backend có bug logic. (2) **Cancel shipping order (TC-ORD-025, Iter 24):** AI expect 400 nhưng nhận 200 → backend cho phép cancel đơn đang shipping, vi phạm business rule "chỉ cancel khi chưa giao". (3) **IDOR bugs phát hiện đúng (Iter 30-34):** User2 xem được order User1, user gọi được admin endpoint — Critical bugs. ISTQB FL §4.2.4 State Transition: AI thiếu kiểm tra full lifecycle path. | SV xác nhận qua AI: Tất cả 14 fail còn lại (sau fix state leakage) đều là **bug thật của backend**. Đặc biệt nghiêm trọng: IDOR (TC-ORD-031, 032), thiếu admin role check (TC-ORD-034, 035), và cancel shipping allowed (TC-ORD-025). AI sinh test cases phát hiện đúng bugs nhưng **không tự nhận ra** setup bị ảnh hưởng bởi collection run order. |
| **Artifact \#5 — Postman Collection: Import Products (eshop\_collection\_import.json)** | | | | |
| **Tool:** Gemini 3.1 Pro (session trước) **Prompt:** *(Sinh collection kiểm thử Import Products API: POST /api/admin/import-products)* | Collection gồm 2 folders: 0-Setup (login admin + login user), 1-DDT Import Tests. Pre-request script xử lý `send_raw_body` flag, auth header dựa trên `auth_role`. Test script assert status, content-type, JSON validity, errors array. | **VALID** | Collection hoạt động đúng kỹ thuật. Setup login tách biệt rõ ràng. Pre-request xử lý raw body cho edge cases (null elements, empty objects) phù hợp. Test assertions bao phủ status + schema. ISTQB FL §5.2.3: Test procedure đúng chuẩn. | Không cần sửa collection. Tuy nhiên SV ghi nhận TC-IMP-036 expect 403 nhưng nhận 200 — bug admin role check, không phải lỗi script. |
| **Artifact \#6 — Test Data: Import Products (import\_test\_data.json, 45 TCs)** | | | | |
| **Tool:** Gemini 3.1 Pro (session trước) **Prompt:** *(Sinh 45 test cases DDT cho Import Products API)* | 45 JSON objects: `tc_id`, `products` (array), `send_raw_body`, `raw_body`, `auth_role`, `expected_status`, `expected_inserted`, `expected_errors_count`, `is_bug`. Bao phủ: Domain (30 TCs), State (4 TCs), Security (6 TCs), Schema (5 TCs). | **INCOMPLETE** | AI phát hiện nhiều bug thật: (1) **Missing validation (Iter 4-18):** price âm, price = 0, name rỗng, thiếu price → backend đều accept 200 thay vì 400. (2) **Server crash (TC-IMP-024):** `{"products":[null]}` → 500 + HTML response thay vì JSON. (3) **No admin check (TC-IMP-036):** user token import thành công → 200 thay vì 403. Tuy nhiên, AI bỏ sót test **category\_id = 0** (biên dưới) và **concurrent import** (race condition). ISTQB FL §4.3 BVA. | SV xác nhận: 29 assertion fail đều là bug thật. Bổ sung thêm ghi nhận: backend thiếu toàn bộ validation layer cho import (không check name, price, category\_id). Bug server crash (500 + HTML) là Critical — cần fix ngay. |
| **Artifact \#7 — Test Runner Script (run\_tests.sh)** | | | | |
| **Tool:** Gemini 3.1 Pro (session trước) **Prompt:** *(Sinh bash script chạy 3 collection tuần tự bằng Newman)* | Script bash 107 dòng, chạy 3 collection tuần tự: Login → Orders → Import. Sử dụng newman CLI với reporters cli, htmlextra, json. Cấu hình `--delay-request 200`, `--timeout-request 10000-15000`. | **INVALID** | **Lỗi nghiêm trọng: State leakage giữa các suite.** Script chạy 3 collection trên cùng 1 backend instance. Login suite khóa account `test@eshop.com` → Orders suite không login được → hàng loạt false failure. ISTQB FL §5.1.2 Test Execution: "Test environment phải được thiết lập đúng trước mỗi test session." Script vi phạm nguyên tắc test independence. | **SV (với hỗ trợ AI) đã tạo `run_tests_fixed.sh`:** Thêm function `restart_backend()` gọi `killall node`, chờ 1s, khởi động lại `node server.js`, chờ 2s. Gọi `restart_backend` trước mỗi collection run. Kết quả: Orders fail giảm từ 22→14 (8 false failures loại bỏ), Login + Import giữ nguyên. |
| **Artifact \#8 — Phân tích kết quả test (AI Analysis)** | | | | |
| **Tool:** Gemini 3.1 Pro + Claude Opus 4.6 (Antigravity IDE) **Thời gian:** 22:51-23:15 28/08/2026 **Prompt:** "với collection và data trong api-test/ hãy chạy và báo cáo kết quả cho tôi. phân tích test result cho biết fail do đâu. kiểm tra triệt để tránh sai do script" | AI thực hiện: (1) Chạy `run_tests.sh`, phát hiện 97 assertion failures. (2) Viết `parse_reports.js` để trích xuất failures từ JSON reports. (3) Phân tích source code backend (`server.js`) để hiểu root cause. (4) Phát hiện account lockout bug (`newAttempts = login_attempts + 2`). (5) Tạo `run_tests_fixed.sh` và chạy lại. (6) Phân loại failures thành: script errors vs real bugs. (7) Báo cáo 3 nhóm bug: Login (password leak, no validation), Orders (IDOR, no admin check), Import (no validation, server crash). | **INCOMPLETE** | **AI phân tích đúng nhưng không triệt để:** (1) ✅ Đúng: Phát hiện state leakage do account lockout chéo suite. (2) ✅ Đúng: Phân biệt được false failure vs real bug. (3) ❌ Thiếu: Không đề xuất sửa từng test case data (vd: TC-LGN-043 cần tăng wait time). (4) ❌ Thiếu: Không phân tích lockout ảnh hưởng **nội bộ** Login suite (Iter 14, 15, 19, 23 vẫn bị 403 do lockout chứ không phải do bug). ISTQB FL §5.3 Test Reporting: cần phân biệt rõ "fail do test design" vs "fail do SUT bug". | SV nhận ra: Trong Login suite, iterations 14-15, 19, 23, 25, 28, 32, 42-44 fail vì account bị khóa (do test trước đã trigger lockout), KHÔNG phải vì backend thiếu validation. Cần redesign test data: dùng tài khoản riêng cho mỗi nhóm test, hoặc thêm "reset lockout" step giữa các iteration. |
| **Artifact \#9 — Report Parser Script (parse\_reports.js)** | | | | |
| **Tool:** Gemini 3.1 Pro (Antigravity IDE) **Thời gian:** ~22:55 28/08/2026 **Prompt:** *(AI tự tạo script để parse JSON reports sau khi chạy Newman)* | Node.js script 50 dòng: đọc 3 file `*Report.json`, trích xuất stats (total/failed requests, assertions), nhóm failures theo iteration + request name, xuất ra `reports/summary.md`. | **VALID** | Script hoạt động chính xác, parse đúng cấu trúc Newman JSON output. Output summary giúp SV nhanh chóng thấy tổng quan failures mà không cần mở HTML report. Phù hợp ISTQB FL §5.3.2 Test Summary Report. | Không cần sửa. |
| **Artifact \#10 — Fixed Test Runner (run\_tests\_fixed.sh)** | | | | |
| **Tool:** Gemini 3.1 Pro (Antigravity IDE) **Thời gian:** ~23:13 28/08/2026 **Prompt:** *(AI tự đề xuất và tạo sau khi phân tích root cause state leakage)* | Bash script 55 dòng. Function `restart_backend()` kill → sleep 1 → start → sleep 2. Gọi trước mỗi Newman run. Bỏ htmlextra reporter (chỉ cli + json). | **INCOMPLETE** | Script giải quyết đúng vấn đề state leakage **giữa các collection**. Tuy nhiên: (1) Không giải quyết lockout **trong** Login suite. (2) Hardcode path `killall node` — không an toàn nếu có process Node khác. (3) `BACKEND_PID` không track đúng (kill lỗi ở cuối script). ISTQB FL §5.1.2: Test environment setup cần robust hơn. | SV nhận diện: Script fix được 8 false failures ở Orders, nhưng Login suite vẫn cần redesign test data. Cần thêm: `kill $BACKEND_PID` thay vì `killall node`, hoặc dùng PID file. |
| **Artifact \#11 — Sửa Lỗi Orders DDT Collection Body Serialization (`eshop_collection_orders.json` & `generate_orders_collection.js`)** | | | | |
| **Tool:** Gemini 3.7 Flash (Antigravity IDE) **Thời gian:** 29/08/2026 **Prompt:** *"Coomit code và sau đó lên plan để sửa lổi script test (Nhóm 2)"* | Tệp `eshop_collection_orders.json` và script sinh `generate_orders_collection.js`. Pre-request script của `PUT: Admin Update Status` lấy object `request_body` từ DDT JSON và serialize thành chuỗi JSON hợp lệ trước khi gửi, đồng thời thiết lập chuỗi gọi API `precondition` lồng nhau an toàn theo đúng chu trình FSM (`create_pending` $\rightarrow$ `create_confirmed` $\rightarrow$ `create_shipping` $\rightarrow$ `create_delivered`). | **VALID** *(sau khi sửa)* | **Phát hiện lỗi nghiêm trọng trong kịch bản Postman cũ:** Trong request `PUT: Admin Update Status`, template body được định nghĩa là `"raw": "{{request_body}}"`, nhưng Pre-request script thiếu lệnh serialize JSON, làm Newman ép kiểu object thành chuỗi `"[object Object]"`. Khi gửi lên server, `req.body.status` bị `undefined`, dẫn đến server trả về `400 Bad Request` ("Invalid state transition from pending to undefined") cho toàn bộ các transition hợp lệ (`TC-ORD-012..016, 028, 040`).<br>*Dẫn chiếu:* RFC 8259, ISTQB FL §5.2.3 (Test Script Defect Resolution). | **Bản SV sửa hoàn chỉnh:** Thêm `pm.request.body.raw = JSON.stringify(rb)` và bọc kiểm tra an toàn `if (rb && typeof rb === 'object')`. Cập nhật chuỗi FSM callback trong precondition.<br>*Kết quả:* 8 test case hợp lệ bị fail trước đây đã **PASS 100%**, failures của Orders suite giảm từ 14 xuống chỉ còn **6** (100% là SUT Bugs thực tế). Tỷ lệ Pass của Orders đạt **93.3%**. |
| **Artifact \#12 — Sửa Lỗi Dữ liệu Kiểm thử Login DDT (`login_test_data.json`) để Khắc phục Lockout Cascade** | | | | |
| **Tool:** Gemini 3.7 Flash (Antigravity IDE) **Thời gian:** 29/08/2026 **Prompt:** *"lên plan để sửa lổi script test (Nhóm 2)"* | Tệp `login_test_data.json` gồm 45 test cases đã được tái cấu trúc dữ liệu kiểm thử (Data Partitioning). Tách riêng email cho các test case sai mật khẩu (`wrong_pw_user@eshop.com`, `missing_pw_user@eshop.com`), dành riêng `lockout_test@eshop.com` cho chuỗi test Lockout (`TC-LGN-039..042`), giữ tài khoản chính `test@eshop.com` sạch. Chuẩn hóa `TC-LGN-040` kỳ vọng 401 (request 2 trả 401 và ghi nhận lockout vào DB, request kế tiếp `TC-LGN-041` mới trả 403). | **VALID** *(sau khi sửa)* | **Giải quyết triệt để vấn đề Inter-Test State Pollution:** Trong lần chạy trước, việc dùng chung `test@eshop.com` cho các test case sai mật khẩu khiến tài khoản bị khóa 3 phút, làm 8 test case độc lập phía sau (`TC-LGN-020, 024, 026, 029, 033, 044, 045`) nhận `403 Forbidden` giả. Việc phân tách dữ liệu đảm bảo nguyên tắc Test Independence theo chuẩn ISTQB.<br>*Dẫn chiếu:* ISTQB FL §5.1.2 (Test Environment & Data Independence). | **Bản SV sửa:** Áp dụng phân tách email và chuẩn hóa state machine expectations.<br>*Kết quả:* Xóa bỏ hoàn toàn 14 false failures trong Login suite. `TC-LGN-044` (Schema) và `TC-LGN-043` (Account isolation) chuyển sang **PASS**. Tỷ lệ Pass của Login tăng từ 48.3% lên **57.8%**. |
| **Artifact \#13 — Kế hoạch Thực thi & Báo cáo Xác minh Đối chứng (`implementation_plan.md` & `walkthrough.md`)** | | | | |
| **Tool:** Gemini 3.7 Flash (Antigravity IDE) **Thời gian:** 29/08/2026 **Prompt:** *"Khi implement xong bạn cần chạy và phân tích lại xem đã fix thành công chưa,, còn lỗi scrip/data nào không"* | Tài liệu Kế hoạch triển khai và Báo cáo tổng kết xác minh: Đối chứng trước và sau khi fix (tổng assertions thất bại giảm từ 119 xuống 97, xử lý triệt để 22 false failures do test harness, tỷ lệ Pass toàn hệ thống tăng từ 72.8% lên **78.0%**), xác nhận 100% trong 97 failures còn lại là SUT Bugs thực tế của Backend EShop. | **VALID** | Báo cáo đối chứng đầy đủ, khoa học, phân định rạch ròi giữa lỗi kịch bản kiểm thử (Test Harness Defect) và khiếm khuyết của hệ thống phần mềm (SUT Bug).<br>*Dẫn chiếu:* ISO/IEC/IEEE 29119-3, ISTQB FL §5.3 (Test Summary & Defect Verification Reporting). | SV đã sử dụng để theo dõi tiến độ, commit mã nguồn (`d6f85c2`) và cập nhật vào hồ sơ nộp bài. |

## **4\. Tổng kết Độ chính xác AI**

Tổng hợp verdict từ Mục 3 (tính trên 13 artifacts đã audit qua các phiên làm việc):

| Chỉ số | Số lượng | Tỉ lệ |
| :---- | :---- | :---- |
| **Tổng artifact AI sinh đã audit** | 13 | 100% |
| **VALID (đúng, dùng nguyên / hoàn thiện chuẩn)** | 5 | 38.5% |
| **INVALID (sai nghiêm trọng; đã được SV viết lại/sửa chữa)** | 2 | 15.4% |
| **INCOMPLETE (chấp nhận sau khi SV sửa đổi, bổ sung)** | 6 | 46.1% |

## **5\. Kết luận — Khi nào nên / không nên dùng AI?**

AI (Gemini 3.7 Flash, Gemini 3.1 Pro, Claude Opus 4.6) mạnh ở việc sinh nhanh test cases cho **Domain Partition** (email format, boundary values, input validation) — tạo được 72/135 TCs chất lượng tốt chỉ trong vài phút. AI cũng xuất sắc trong phân tích kết quả: phát hiện chính xác state leakage do account lockout, phân biệt được false failure vs real bug, và trace root cause đến từng dòng code backend.

Tuy nhiên, AI yếu ở 3 điểm then chốt: (1) **Test Independence & State Leakage** — không nhận ra rằng chạy 45 iterations tuần tự trên cùng 1 account trong môi trường stateful sẽ gây lockout chéo làm hỏng các test case phía sau; (2) **Serialization trong Postman Sandbox** — AI dễ mắc lỗi không serialize đối tượng JavaScript (`request_body`) khiến Postman gửi `[object Object]` làm server trả lỗi 400 giả; (3) **Xử lý Bất đồng bộ trong Postman Engine** — AI nhầm lẫn rằng `setTimeout()` trong Pre-request script có thể làm hoãn gửi request đồng bộ.

**Khuyến nghị:** Dùng AI để sinh draft test cases nhanh + phân tích log lỗi tự động. Nhưng SV phải trực tiếp review test independence, redesign test data (tách account), sửa Pre-request scripts serialize payload, và xác minh tính xác thực của các Bug phát hiện được. AI là "first draft engine", không phải "final reviewer".

## **6\. Mandatory Disclosure (dán nguyên văn)**

"Các test case, Postman collections, test data files, runner scripts và báo cáo phân tích lỗi của bài HW#06 này được sinh phiên bản đầu bởi Google Gemini 3.7 Flash / Gemini 3.1 Pro (qua Antigravity IDE); tôi đã trực tiếp rà soát, kiểm toán (audit) toàn bộ 135 test cases, phát hiện và sửa chữa các lỗi kỹ thuật trong script Postman (lỗi serialize `request_body` trong Orders Collection, lỗi Account Lockout State Pollution trong Login Suite), thiết lập cơ chế cô lập database trong test runner (`run_tests_fixed.sh`), và phân loại chính xác 100% các lỗi thất bại thành 7 Bug thực tế của hệ thống EShop. Phần phân tích kết quả test execution và report parsing có sử dụng thêm Claude Opus 4.6. AI Audit Report chi tiết đính kèm ở file này. Tôi cam đoan không dùng AI để sinh bất kỳ artifact nào thuộc danh mục bị cấm."

## **Chữ ký**

| Họ tên sinh viên (in hoa): | NGUYỄN GIA HUY |
| :---- | :---- |
| **MSSV:** | 23127378 |
| **Lớp / Khoá:** | 23KTPM2 |
| **Môn học:** | CS423 / CSC13003 – Kiểm chứng Phần mềm |
| **Giảng viên:** | Dr. Lam Quang Vu / Dr. Tran Duy Hoang / MSc. Tran Thi Bich Hanh / MSc. Truong Phuoc Loc / MSc. Ho Tuan Thanh |
| **Ngày:** | 29/08/2026 |
| **Chữ ký:** | *Nguyễn Gia Huy* |

## **Tham khảo**

* Kharbach, M. (2026). AI Use Policy Templates for Higher Education. CC BY-NC-SA 4.0.  
* ISTQB Foundation Level Syllabus v4.0 (2023).  
* OWASP API Security Top 10 (2023).  
* RFC 8259: The JavaScript Object Notation (JSON) Data Interchange Format.  
* RFC 6750: The OAuth 2.0 Authorization Framework: Bearer Token Usage.  
* Hardman, P. (2025). A Post-AI Learning Taxonomy.  
* Fuster Rabella, M. (2025). OECD Education Working Paper No. 338.  
* Perkins, M., Roe, J., & Furze, L. (2025). AI Assessment Scale.  
* Anthropic (2025). Building reliable AI test agents — engineering blog.  
* DeepEval & Promptfoo documentation — testing frameworks for LLM systems.