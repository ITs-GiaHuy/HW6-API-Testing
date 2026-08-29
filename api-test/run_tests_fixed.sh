#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(dirname "$SCRIPT_DIR")/backend"

echo "============================================"
echo "  EShop API DDT Test Runner (FIXED)"
echo "============================================"

# Helper to restart backend
restart_backend() {
    echo "Restaring backend to clear database state (lockouts, etc.)..."
    killall node || true
    sleep 1
    cd "$BACKEND_DIR"
    node server.js &
    BACKEND_PID=$!
    sleep 2
    cd "$SCRIPT_DIR"
}

mkdir -p "$SCRIPT_DIR/reports"

# 1. Login Tests
restart_backend
echo "[1/3] Running FR-02: Login API Tests..."
npx newman run "$SCRIPT_DIR/eshop_collection_login.json" \
  -e "$SCRIPT_DIR/eshop_environment.json" \
  -d "$SCRIPT_DIR/test-data/login_test_data.json" \
  --reporters cli,json \
  --reporter-json-export "$SCRIPT_DIR/reports/LoginReport.json" \
  || echo "Login tests completed with failures"

# 2. Orders Tests
restart_backend
echo "[2/3] Running FR-10/11: Orders API Tests..."
npx newman run "$SCRIPT_DIR/eshop_collection_orders.json" \
  -e "$SCRIPT_DIR/eshop_environment.json" \
  -d "$SCRIPT_DIR/test-data/orders_test_data.json" \
  --reporters cli,json \
  --reporter-json-export "$SCRIPT_DIR/reports/OrdersReport.json" \
  || echo "Orders tests completed with failures"

# 3. Import Tests
restart_backend
echo "[3/3] Running FR-16: Import API Tests..."
npx newman run "$SCRIPT_DIR/eshop_collection_import.json" \
  -e "$SCRIPT_DIR/eshop_environment.json" \
  -d "$SCRIPT_DIR/test-data/import_test_data.json" \
  --reporters cli,json \
  --reporter-json-export "$SCRIPT_DIR/reports/ImportReport.json" \
  || echo "Import tests completed with failures"

kill $BACKEND_PID || true
echo "Tests completed."
