const fs = require('fs');

const dataFiles = [
    'api-test/test-data/login_test_data.json',
    'api-test/test-data/orders_test_data.json',
    'api-test/test-data/import_test_data.json'
];

dataFiles.forEach(file => {
    if (!fs.existsSync(file)) return;
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    console.log(`\n=== Test Cases in ${file} ===`);
    console.log(`Total test cases: ${data.length}`);
    
    // check for duplicated IDs or names
    let ids = new Set();
    let names = new Set();
    data.forEach(tc => {
        if (ids.has(tc.tc_id)) console.log(`Duplicate ID: ${tc.tc_id}`);
        ids.add(tc.tc_id);
        
        if (names.has(tc.tc_name)) console.log(`Duplicate Name: ${tc.tc_name}`);
        names.add(tc.tc_name);
    });
    
    // basic structure checks
    let hasBugFlag = data.some(tc => tc.is_bug === true);
    console.log(`Has expected bugs flagged: ${hasBugFlag}`);
    
    console.log(`First test case sample:`, data[0]);
});
