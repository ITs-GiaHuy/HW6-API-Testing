const fs = require('fs');
const file = 'api-test/eshop_collection_orders.json';
let data = JSON.parse(fs.readFileSync(file, 'utf8'));

data.item.forEach(item => {
    let exec = item.event.find(e => e.listen === 'prerequest').script.exec;
    
    // Find the target check
    let targetMatch = exec.find(line => line.includes("target !== '"));
    let target = targetMatch ? targetMatch.match(/target !== '(.*)'/)[1] : "";
    
    if (target) {
        const newExec = [
            `const target = pm.iterationData.get('target_request');`,
            `if (target !== '${target}') {`,
            `    pm.variables.set('skip', 'true');`,
            `    return;`,
            `}`,
            `pm.variables.set('skip', 'false');`,
            `const authRole = pm.iterationData.get('auth_role');`,
            `let token = '';`,
            `if (authRole !== 'none') {`,
            `    token = authRole === 'user2' ? pm.collectionVariables.get('user2_token') : (authRole === 'admin' ? pm.collectionVariables.get('admin_token') : pm.collectionVariables.get('user_token'));`,
            `    const override = pm.iterationData.get('auth_override');`,
            `    if (override) token = override;`,
            `    pm.request.headers.upsert({key: 'Authorization', value: 'Bearer ' + token});`,
            `}`,
            `let pathId = pm.iterationData.get('path_param_id');`,
            `let precondition = pm.iterationData.get('precondition');`,
            `if (pathId) {`,
            `    pm.variables.set('test_order_id', pathId);`,
            `} else if (precondition && precondition.startsWith('create_')) {`,
            `    const status = precondition.split('_')[1];`,
            `    const baseUrl = pm.variables.get('base_url');`,
            `    const userToken = pm.collectionVariables.get('user_token');`,
            `    pm.sendRequest({`,
            `        url: baseUrl + '/api/checkout',`,
            `        method: 'POST',`,
            `        header: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + userToken },`,
            `        body: { mode: 'raw', raw: JSON.stringify({ total_amount: 100000, shipping_address: 'Test Address' }) }`,
            `    }, function (err, res) {`,
            `        if (res && res.code === 200) {`,
            `            const orderId = res.json().orderId;`,
            `            pm.variables.set('test_order_id', orderId);`,
            `            if (status !== 'pending') {`,
            `                const adminToken = pm.collectionVariables.get('admin_token');`,
            `                pm.sendRequest({`,
            `                    url: baseUrl + '/api/admin/orders/' + orderId + '/status',`,
            `                    method: 'PUT',`,
            `                    header: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken },`,
            `                    body: { mode: 'raw', raw: JSON.stringify({ status: status }) }`,
            `                }, function (err2, res2) {});`,
            `            }`,
            `        } else {`,
            `            pm.variables.set('test_order_id', '1');`,
            `        }`,
            `    });`,
            `} else {`,
            `    pm.variables.set('test_order_id', '1');`,
            `}`
        ];
        
        item.event.find(e => e.listen === 'prerequest').script.exec = newExec;
    }
});

fs.writeFileSync(file, JSON.stringify(data, null, 2));
console.log("Orders collection patched successfully!");
