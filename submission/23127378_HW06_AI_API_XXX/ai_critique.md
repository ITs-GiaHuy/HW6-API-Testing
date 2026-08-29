# AI Critique — HW06 API Testing

**Sinh viên:** Nguyễn Gia Huy — MSSV: 23127378  
**Lớp:** 23KTPM2 — Môn: Kiểm thử phần mềm  
**Số từ:** ~280 từ

---

Trong quá trình thực hiện bài tập HW06, tôi đã sử dụng AI (Claude, Gemini) làm trợ lý chính để sinh test cases cho 3 API. Dưới đây là đánh giá phê bình về hiệu quả và hạn chế của AI trong quá trình này.

**Điểm mạnh:** AI rất giỏi trong việc sinh nhanh các test cases thuộc nhóm Domain Partition — ví dụ kiểm tra email format, password validation, boundary values cho giá sản phẩm. Với một prompt rõ ràng kèm API specification, AI có thể tạo ra 15–20 domain test cases chất lượng tốt chỉ trong vài giây, bao gồm cả các trường hợp biên mà con người dễ bỏ sót như Unicode, whitespace-only string, hay số âm.

**Điểm yếu nghiêm trọng:** AI thể hiện rõ hạn chế ở hai lĩnh vực. Thứ nhất, **State Transition Testing** — AI sinh được các transition đơn lẻ (pending → confirmed) nhưng bỏ qua các chuỗi transition phức tạp và kiểm tra terminal state (canceled → delivered). AI cũng không tự phát hiện rằng cần thiết lập preconditions qua nhiều API calls liên tiếp. Thứ hai, **Security Testing** — AI tạo ra các payload SQL injection và XSS cơ bản, nhưng hoàn toàn bỏ qua các lỗ hổng IDOR (Insecure Direct Object Reference) và thiếu kiểm tra phân quyền admin role. Trong thực tế, 4/5 bug Critical mà tôi phát hiện ở Orders API đều liên quan đến missing authentication và authorization — những thứ AI không nghĩ tới vì nó tập trung vào input validation thay vì access control.

**Nguyên nhân gốc:** AI có xu hướng thiên lệch (bias) về kiểm thử đầu vào đơn lẻ, thiếu khả năng suy luận về **trạng thái hệ thống** và **ngữ cảnh đa người dùng**. Nó không hiểu rằng "User A không được xem đơn hàng của User B" là một yêu cầu bảo mật quan trọng.

**Bài học rút ra:** AI là công cụ hỗ trợ mạnh mẽ cho việc sinh test cases nhanh, nhưng con người phải luôn review và bổ sung — đặc biệt ở các khía cạnh bảo mật, phân quyền, và luồng nghiệp vụ đa bước. Không nên tin tưởng hoàn toàn vào AI mà bỏ qua tư duy phản biện của tester.
