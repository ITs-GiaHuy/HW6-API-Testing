# HW06 — API Testing | EShop SUT

## Thông tin sinh viên

| Thông tin | Chi tiết |
|-----------|----------|
| **Họ tên** | Nguyễn Gia Huy |
| **MSSV** | 23127378 |
| **Lớp** | 23KTPM2 |
| **Môn** | Kiểm thử phần mềm |
| **GitHub Repository** | `[TODO: ĐIỀN LINK GITHUB REPO]` |

---

## Bảng tự đánh giá (Self-Assessment)

| **No.** | **Criteria** | **Grade** | **Self-Assessed Grade** |
|---------|-------------|-----------|------------------------|
| **1** | API 1 — Login (FR-02): full pipeline (generate + audit + extend + execute + bugs) | 30 | `[TODO: ĐIỀN ĐIỂM]` |
| **2** | API 2 — Orders (FR-10/11): full pipeline (same criteria) | 30 | `[TODO: ĐIỀN ĐIỂM]` |
| **3** | API 3 — Import Products (FR-16): full pipeline (same criteria) | 30 | `[TODO: ĐIỀN ĐIỂM]` |
| **4** | Agent Skills (AI-driven test generator) | 10 | `[TODO: ĐIỀN ĐIỂM]` |
| | **Total** | **100** | `[TODO: TỔNG ĐIỂM]` |

---

## Test Summary Report

### Tổng quan

| Metric | Value |
|--------|-------|
| **Số lượng API kiểm thử** | 3 |
| **Tổng test cases** | 135 |
| **Test cases per API** | 45 |
| **Test cases sinh bởi AI** | ~120 |
| **Test cases human-added** | ~15 (≥5 per API) |
| **Tổng test cases executed** | 135 |
| **Tổng assertions** | 441 |
| **Assertions passed** | 344 |
| **Assertions failed** | 97 |
| **Tổng bugs phát hiện** | 17 |

### Chi tiết per API

| API | Pool | FR | Test Cases | Assertions | Pass | Fail | Bugs |
|-----|------|----|-----------|------------|------|------|------|
| POST /api/login | A | FR-02 | 45 | 147 | 85 | 62 | 5 |
| Orders API | B | FR-10/11 | 45 | 90 | 84 | 6 | 5 |
| POST /api/admin/import-products | C | FR-16 | 45 | 204 | 175 | 29 | 7 |
| **Total** | | | **135** | **441** | **344** | **97** | **17** |

### Test Case Coverage (4 Categories)

| Category | Login | Orders | Import | Total |
|----------|-------|--------|--------|-------|
| Domain Partition | 27 | 15 | 30 | 72 |
| State Transition | 5 | 17 | 4 | 26 |
| Security | 11 | 8 | 6 | 25 |
| Schema Validation | 2 | 5 | 5 | 12 |
| **Total** | **45** | **45** | **45** | **135** |

### Bug Severity Summary

| Severity | Login | Orders | Import | Total |
|----------|-------|--------|--------|-------|
| Critical | 1 | 4 | 3 | 8 |
| High | 0 | 0 | 3 | 3 |
| Medium | 2 | 1 | 1 | 4 |
| Low | 2 | 0 | 0 | 2 |
| **Total** | **5** | **5** | **7** | **17** |

---

## Cấu trúc thư mục nộp bài

```
23127378_HW06_AI_API_XXX/
├── README.md                        ← (file này)
├── main_report.md                   ← Báo cáo chính
├── bug_report.md                    ← Bug report chi tiết
├── cicd_report.md                   ← CI/CD report
├── ai_critique.md                   ← AI Critique (200-300 từ)
├── ai_audit_report.md               ← AI Audit Report
├── test_cases.csv                   ← Excel-compatible test cases (135 TCs)
├── git_commit_log.txt               ← Git commit history
├── agent-skill/
│   └── design.md                    ← Agent Skill design + pseudocode + diagrams
├── postman/
│   ├── eshop_collection_login.json  ← Postman Collection: Login API
│   ├── eshop_collection_orders.json ← Postman Collection: Orders API
│   ├── eshop_collection_import.json ← Postman Collection: Import API
│   └── eshop_environment.json       ← Postman Environment
├── newman-reports/
│   ├── LoginReport.html             ← Newman HTML Report: Login
│   ├── OrdersReport.html            ← Newman HTML Report: Orders
│   └── ImportReport.html            ← Newman HTML Report: Import
├── cicd/
│   └── api-test.yml                 ← GitHub Actions workflow
└── screenshots/
    └── README.md                    ← Hướng dẫn chụp screenshots
```

---

## Postman Features Used

| # | Feature | Mô tả sử dụng |
|---|---------|---------------|
| 1 | Collections | 3 collections riêng biệt cho 3 APIs |
| 2 | Environment Variables | `base_url`, `student_id`, `user_token`, `admin_token` |
| 3 | Collection Variables | `setup_done`, `order_id`, dynamic variables |
| 4 | Pre-request Scripts | Tự động thêm `X-Student-Id` header, authentication setup |
| 5 | Test Scripts (Chai.js) | Status code, JSON schema, response body assertions |
| 6 | Data-Driven Testing | Collection Runner với 3 JSON data files |
| 7 | Folder Organization | Tests nhóm theo category/workflow |
| 8 | Request Chaining | Token từ login → subsequent requests |
| 9 | Dynamic Variables | `pm.environment.set()` runtime token storage |
| 10 | Newman CLI | Tự động hóa test execution |
| 11 | htmlextra Reporter | Rich HTML reports |
| 12 | Conditional Execution | `pm.execution.skipRequest()` cho setup |

---

## Tools Used

| Tool | Version | Purpose |
|------|---------|---------|
| Postman (Newman) | CLI | API test execution |
| newman-reporter-htmlextra | Latest | HTML report generation |
| Node.js | 18 | Backend SUT + test runner |
| GitHub Actions | v4 | CI/CD pipeline |
| `[TODO: AI Tool]` | `[TODO]` | Test case generation & review |

---

## How to Run Tests Locally

```bash
# 1. Install dependencies
npm install
cd backend && npm install && cd ..

# 2. Run all API tests
cd api-test
chmod +x run_tests_fixed.sh
./run_tests_fixed.sh

# 3. View reports
open api-test/reports/LoginReport.html
open api-test/reports/OrdersReport.html
open api-test/reports/ImportReport.html
```
