const fs = require('fs');
const file = 'api-test/eshop_collection_login.json';
let data = JSON.parse(fs.readFileSync(file, 'utf8'));

let exec = data.item[1].item[0].event[1].script.exec;

// Replace pm.response.json() with safe parse
for (let i = 0; i < exec.length; i++) {
    if (exec[i] === '        const json = pm.response.json();') {
        exec[i] = '        let json; try { json = pm.response.json(); } catch(e) { pm.expect.fail("Response is not JSON"); }';
    }
}

fs.writeFileSync(file, JSON.stringify(data, null, 2));
console.log("Login script fixed.");
