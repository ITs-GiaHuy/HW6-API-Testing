#!/bin/bash
# ============================================================
# EShop API Testing - Data-Driven Testing Runner
# Student ID: 23127378
# APIs: FR-02 Login, FR-10/11 Orders, FR-16 Import Products
# ============================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "============================================"
echo "  EShop API DDT Test Runner"
echo "  Student: 23127378"
echo "============================================"

# Check and install dependencies
echo ""
echo "[1/4] Checking dependencies..."
cd "$PROJECT_DIR"

if [ ! -d "node_modules/newman" ]; then
    echo "  Installing Newman..."
    npm install newman
fi

if [ ! -d "node_modules/newman-reporter-htmlextra" ]; then
    echo "  Installing newman-reporter-htmlextra..."
    npm install newman-reporter-htmlextra
fi

echo "  ✓ Dependencies OK"

# Create reports directory
mkdir -p "$SCRIPT_DIR/reports"

# ============================================================
# FR-02: Login API Tests (45 test cases, DDT)
# ============================================================
echo ""
echo "[2/4] Running FR-02: Login API Tests (45 DDT iterations)..."
npx newman run "$SCRIPT_DIR/eshop_collection_login.json" \
  -e "$SCRIPT_DIR/eshop_environment.json" \
  -d "$SCRIPT_DIR/test-data/login_test_data.json" \
  --reporters cli,htmlextra,json \
  --reporter-htmlextra-export "$SCRIPT_DIR/reports/LoginReport.html" \
  --reporter-htmlextra-title "EShop Login API - DDT Report (23127378)" \
  --reporter-json-export "$SCRIPT_DIR/reports/LoginReport.json" \
  --delay-request 200 \
  --timeout-request 10000 \
  || echo "  ⚠ Login tests completed with failures (expected for bug detection)"

# ============================================================
# FR-10/11: Orders API Tests (45 test cases, DDT)
# ============================================================
echo ""
echo "[3/4] Running FR-10/11: Orders API Tests (45 DDT iterations)..."
npx newman run "$SCRIPT_DIR/eshop_collection_orders.json" \
  -e "$SCRIPT_DIR/eshop_environment.json" \
  -d "$SCRIPT_DIR/test-data/orders_test_data.json" \
  --reporters cli,htmlextra,json \
  --reporter-htmlextra-export "$SCRIPT_DIR/reports/OrdersReport.html" \
  --reporter-htmlextra-title "EShop Orders API - DDT Report (23127378)" \
  --reporter-json-export "$SCRIPT_DIR/reports/OrdersReport.json" \
  --delay-request 200 \
  --timeout-request 15000 \
  || echo "  ⚠ Orders tests completed with failures (expected for bug detection)"

# ============================================================
# FR-16: Import Products API Tests (45 test cases, DDT)
# ============================================================
echo ""
echo "[4/4] Running FR-16: Import Products API Tests (45 DDT iterations)..."
npx newman run "$SCRIPT_DIR/eshop_collection_import.json" \
  -e "$SCRIPT_DIR/eshop_environment.json" \
  -d "$SCRIPT_DIR/test-data/import_test_data.json" \
  --reporters cli,htmlextra,json \
  --reporter-htmlextra-export "$SCRIPT_DIR/reports/ImportReport.html" \
  --reporter-htmlextra-title "EShop Import Products API - DDT Report (23127378)" \
  --reporter-json-export "$SCRIPT_DIR/reports/ImportReport.json" \
  --delay-request 200 \
  --timeout-request 15000 \
  || echo "  ⚠ Import tests completed with failures (expected for bug detection)"

# ============================================================
# Summary
# ============================================================
echo ""
echo "============================================"
echo "  Test Execution Complete!"
echo "============================================"
echo ""
echo "Reports generated in: $SCRIPT_DIR/reports/"
echo "  - LoginReport.html"
echo "  - OrdersReport.html"
echo "  - ImportReport.html"
echo ""
echo "Total test cases: 135 (45 per API)"
echo "Data files used:"
echo "  - test-data/login_test_data.json"
echo "  - test-data/orders_test_data.json"
echo "  - test-data/import_test_data.json"
echo ""
echo "Note: Some test failures are EXPECTED (bug detection tests)."
echo "Review the HTML reports for detailed results."
