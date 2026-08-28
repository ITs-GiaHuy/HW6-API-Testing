#!/bin/bash

echo "Checking dependencies..."
if [ ! -d "node_modules/newman" ]; then
    echo "Installing Newman locally..."
    npm install newman
fi

if [ ! -d "node_modules/newman-reporter-htmlextra" ]; then
    echo "Installing newman-reporter-htmlextra locally..."
    npm install newman-reporter-htmlextra
fi

echo "Running FR-02: Login tests..."
npx newman run eshop_collection_login.json \
  -e eshop_environment.json \
  --reporters cli,htmlextra,json \
  --reporter-htmlextra-export ./reports/LoginReport.html \
  --reporter-htmlextra-title "EShop Login Tests" \
  --reporter-json-export ./reports/LoginReport.json \
  --delay-request 100

echo "Running FR-11: Orders tests..."
npx newman run eshop_collection_orders.json \
  -e eshop_environment.json \
  --reporters cli,htmlextra,json \
  --reporter-htmlextra-export ./reports/OrdersReport.html \
  --reporter-htmlextra-title "EShop Orders Tests" \
  --reporter-json-export ./reports/OrdersReport.json \
  --delay-request 100

echo "Running FR-16: Import tests..."
npx newman run eshop_collection_import.json \
  -e eshop_environment.json \
  --reporters cli,htmlextra,json \
  --reporter-htmlextra-export ./reports/ImportReport.html \
  --reporter-htmlextra-title "EShop Import Tests" \
  --reporter-json-export ./reports/ImportReport.json \
  --delay-request 100
