const fs = require('fs');
const path = require('path');

const reportsDir = '/home/giahuy/HCMUS/US-3rd/SoftwareTesting/Homeworks/HW-06/api-test/reports';
const reportFiles = ['LoginReport.json', 'OrdersReport.json', 'ImportReport.json'];

function analyzeReport(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`Report not found: ${filePath}`);
        return;
    }

    console.log(`\n=== Analyzing ${path.basename(filePath)} ===`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const run = data.run;
    const stats = run.stats;
    const failures = run.failures;
    const executions = run.executions;

    console.log(`Total Iterations (DDT): ${stats.iterations.total}`);
    console.log(`Total Requests: ${stats.requests.total}`);
    console.log(`Total Assertions: ${stats.assertions.total}, Failed: ${stats.assertions.failed}`);

    let failureReasons = {};
    let iterationStats = {};

    failures.forEach(f => {
        let errorMsg = f.error.message;
        if (errorMsg) {
            errorMsg = errorMsg.replace(/\n/g, ' '); // remove newlines
        } else {
            errorMsg = 'No message';
        }
        const assertion = f.error.name + ": " + errorMsg;
        
        failureReasons[assertion] = (failureReasons[assertion] || 0) + 1;
        
        if (f.cursor && f.cursor.iteration !== undefined) {
             let iter = f.cursor.iteration;
             iterationStats[iter] = (iterationStats[iter] || 0) + 1;
        }
    });

    console.log(`\nFailure Reasons Summary for ${path.basename(filePath)}:`);
    let sortedFailures = Object.entries(failureReasons).sort((a, b) => b[1] - a[1]);
    sortedFailures.forEach(([reason, count]) => {
        console.log(`- [${count} times] ${reason}`);
    });

    // Check DDT compliance
    let isDataDriven = stats.iterations.total > 1;
    console.log(`\nData-Driven Compliance: ${isDataDriven ? 'YES' : 'NO'} (${stats.iterations.total} iterations)`);
    
    // Anomaly checks
    let iterationsWithoutFailures = stats.iterations.total - Object.keys(iterationStats).length;
    console.log(`Iterations with failures: ${Object.keys(iterationStats).length}, Iterations without failures (passed): ${iterationsWithoutFailures}`);
    
    // Check if assertions are missing in some iterations
    let noAssertionRequests = 0;
    executions.forEach(exec => {
       if (!exec.assertions || exec.assertions.length === 0) {
           noAssertionRequests++;
       }
    });
    if (noAssertionRequests > 0) {
        console.log(`ANOMALY: ${noAssertionRequests} requests executed without any assertions.`);
    }
}

reportFiles.forEach(file => {
    analyzeReport(path.join(reportsDir, file));
});

