const fs = require('fs');
const path = require('path');

const reportFiles = [
    'reports/LoginReport.json',
    'reports/OrdersReport.json',
    'reports/ImportReport.json'
];

let summary = '# API Test Failures Summary\n\n';

for (const file of reportFiles) {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) {
        summary += `## ${file} not found\n\n`;
        continue;
    }
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    summary += `## Report: ${file}\n`;
    summary += `- Total requests: ${data.run.stats.requests.total}\n`;
    summary += `- Failed requests: ${data.run.stats.requests.failed}\n`;
    summary += `- Total assertions: ${data.run.stats.assertions.total}\n`;
    summary += `- Failed assertions: ${data.run.stats.assertions.failed}\n\n`;
    
    if (data.run.failures.length > 0) {
        summary += `### Failures:\n`;
        
        // Group by test name/iteration
        const failureGroups = {};
        data.run.failures.forEach(f => {
            const iter = f.cursor.iteration;
            const requestName = f.source.name || "Unknown Request";
            const assertion = f.error.name + ': ' + f.error.message;
            
            const key = `Iteration ${iter}: ${requestName}`;
            if (!failureGroups[key]) failureGroups[key] = [];
            failureGroups[key].push(assertion);
        });
        
        for (const [key, errors] of Object.entries(failureGroups)) {
            summary += `- **${key}**\n`;
            errors.forEach(e => summary += `  - ${e}\n`);
        }
    }
    summary += '\n';
}

fs.writeFileSync(path.join(__dirname, 'reports/summary.md'), summary);
console.log('Summary generated at ' + path.join(__dirname, 'reports/summary.md'));
