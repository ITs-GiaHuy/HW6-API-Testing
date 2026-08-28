const fs = require('fs');
const path = require('path');

const reportsDir = '/home/giahuy/HCMUS/US-3rd/SoftwareTesting/Homeworks/HW-06/api-test/reports';
const reportFiles = ['LoginReport.json', 'OrdersReport.json', 'ImportReport.json'];

reportFiles.forEach(file => {
    const filePath = path.join(reportsDir, file);
    if (!fs.existsSync(filePath)) return;
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`\n=== Requests without assertions in ${file} ===`);
    let noAsserts = {};
    data.run.executions.forEach(exec => {
       if (!exec.assertions || exec.assertions.length === 0) {
           let name = exec.item ? exec.item.name : 'Unknown Request';
           noAsserts[name] = (noAsserts[name] || 0) + 1;
       }
    });
    for (let req in noAsserts) {
        console.log(`- ${req}: ${noAsserts[req]} times`);
    }
});
