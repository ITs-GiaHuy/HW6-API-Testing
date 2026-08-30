---
name: "test-case-auditor"
description: "Kiểm toán, đánh giá chất lượng bộ Test Case theo chuẩn IEEE 829 / ISO 29119: Độ tin cậy (Soundness), Tính đầy đủ (Completeness) và AI Critique."
---

# Test Case Auditor

## 1. Nền tảng Kiến thức Cốt lõi (Domain Knowledge)

Kỹ năng này đóng vai trò như một kỹ sư kiểm thử cấp cao (Senior QA/Test Auditor) để rà soát, đánh giá chéo (cross-validation) và khắc phục các sai sót do con người hoặc mô hình AI tạo ra trong bộ Test Case. Nó tuân thủ các quy chuẩn IEEE 829 / ISO 29119 về tài liệu kiểm thử.

### 1.1. 5 Tiêu Chí Kiểm Toán Cốt Lõi (Audit Dimensions)
Mỗi test case phải vượt qua sự đánh giá nghiêm ngặt trên 5 trục:
1. **Soundness (Tính đúng đắn/Độ tin cậy)**: Precondition, Action (Input), và Expected Result có hợp lý và khớp với đặc tả kỹ thuật (API Spec) không? HTTP Status có chuẩn RESTful không? (Không chấp nhận ảo tưởng AI - Hallucination).
2. **Completeness & Coverage (Tính đầy đủ & Độ phủ)**: Bộ test đã phủ đủ 4 nhóm chiến lược chưa (Domain Partitions, State Transitions, Security, Schema Validation)? Các trường hợp ranh giới, giá trị âm, kịch bản lỗi (Negative paths) đã bao quát hết chưa? Đủ >= 35 test cases / API?
3. **Consistency (Tính nhất quán)**: Các test cases có mâu thuẫn lẫn nhau không? (Cùng 1 input invalid nhưng test 1 mong đợi HTTP 400, test 2 lại mong đợi HTTP 200).
4. **Independence & Determinism (Tính độc lập & Tính tất định)**: Test case có chạy độc lập được không? Hay bị Flaky (phụ thuộc thứ tự chạy hoặc môi trường chưa dọn dẹp)?
5. **Traceability (Khả năng truy vết)**: Tên test case có giải thích được mục tiêu không? Test case có ánh xạ về yêu cầu bảo mật (SEC-xx) hoặc yêu cầu chức năng (FR-xx) cụ thể không?

### 1.2. Quy tắc Phân loại và Xử lý (Triaging & Remediation Rules)
Đối với TỪNG test case, kiểm toán viên gán một trong ba nhãn và đưa ra hành động sửa chữa (Remediation):
- ✅ **VALID**: Hoàn hảo, không cần chỉnh sửa.
- ❌ **INVALID**: Chứa lỗi sai về mặt kỹ thuật. 
  - *Nguyên nhân thường gặp*: LLM hallucination (sinh ra endpoint không tồn tại, sai định dạng JSON, kỳ vọng mã HTTP sai chuẩn).
  - *Hành động*: Bắt buộc chỉ ra lỗi và viết lại phần sửa chữa.
- ⚠️ **INCOMPLETE**: Đúng nhưng thiếu chiều sâu.
  - *Nguyên nhân thường gặp*: Bỏ qua kiểm tra nội dung Response Body, chỉ assert Status Code; thiếu Precondition rõ ràng; Payload tấn công hời hợt.
  - *Hành động*: Bổ sung Assertions chi tiết.

### 1.3. Khung Đánh giá Phản biện AI (AI Critique Engine)
Kiểm toán viên (hoặc user) sử dụng mẫu sau để phân tích điểm yếu của mô hình AI sinh test case:
- *Bias*: AI có xu hướng tập trung quá nhiều vào Happy Path (Domain hợp lệ) mà bỏ quên Negative Path không?
- *Hallucination Rate*: AI có tưởng tượng ra các trường thông tin hoặc tham số không có trong tài liệu Spec không?
- *Context Window Loss*: AI có quên mất yêu cầu Headers (như `X-Student-Id`) hay cấu trúc Object lồng nhau không?
- *Complex Logic Failure*: AI có thường bỏ sót các lỗi logic nghiệp vụ phức tạp như IDOR, Race Condition, Idempotency không?

### 1.4. Bộ Đề xuất Mở rộng Test Case (Gap Analysis)
Auditor tự động rà soát và đề xuất tối thiểu 5 test case thuộc nhóm hẹp, rủi ro cao thường bị bỏ sót:
1. **Concurrency/Race Condition**: Gửi 2 request cập nhật trạng thái đồng thời.
2. **IDOR / BOLA**: Sửa đổi `id` của tài nguyên thuộc người khác.
3. **Double Submission**: Submit lại cùng 1 form checkout / import lần 2.
4. **Edge Cases**: Giới hạn phân trang khổng lồ, giá trị chuỗi rỗng `""` thay vì thiếu trường.
5. **Role Escalation**: Thao tác vượt quyền.

---

## 2. Định dạng Kết quả Đầu ra (Output Format)

Kết quả Audit Report phải bao gồm 3 bảng theo thứ tự.

### 2.1. Bảng Tổng hợp Kiểm toán (Audit Summary)
| Category (Chiến lược) | Total Cases | ✅ Valid | ❌ Invalid | ⚠️ Incomplete |
|---|---|---|---|---|
| Domain Partitions | ... | ... | ... | ... |
| State Transitions | ... | ... | ... | ... |
| Security | ... | ... | ... | ... |
| Schema Validation | ... | ... | ... | ... |

### 2.2. Danh sách Triaging & Remediation
*Liệt kê các test case INVALID/INCOMPLETE và cách sửa lại.*

| TC ID | Label | Issue Description (Mô tả lỗi do AI/Người dùng) | Remediation (Giải pháp sửa lỗi) |
|---|---|---|---|
| TC-DOM-005 | ❌ INVALID | AI ảo tưởng endpoint trả về 200 khi chuỗi rỗng. Theo chuẩn phải là 400. | Sửa Expected Status thành 400 Bad Request, sửa Assertion |
| TC-SEC-002 | ⚠️ INCOMPLETE | Payload SQLi quá đơn giản (`' OR 1=1`), thiếu assert Response Body. | Nâng cấp payload và assert Response Array is empty |

### 2.3. Đề xuất Bổ sung (Gap Suggestions)
| ID Đề xuất | Tên Test Case Đề xuất (Tiếng Anh) | Rationale (Lý do cần thêm) |
|---|---|---|
| TC-EXT-001 | Concurrent order state transition | Phát hiện lỗi Race condition khi User và Admin đồng thời hủy đơn |
| TC-EXT-002 | IDOR cross-access verification | Bổ sung test IDOR bị thiếu trong danh sách hiện tại |
