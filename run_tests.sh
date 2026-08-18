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

echo "Running tests..."
npx newman run eshop_collection.json \
  -e eshop_environment.json \
  --reporters cli,htmlextra,json \
  --reporter-htmlextra-export ./reports/TestReport.html \
  --reporter-htmlextra-title "EShop API Test Report" \
  --reporter-json-export ./reports/TestReport.json \
  --delay-request 100
