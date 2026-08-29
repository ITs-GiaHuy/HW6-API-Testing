const fs = require('fs');

['api-test/eshop_collection_orders.json', 'api-test/eshop_collection_import.json'].forEach(file => {
    let data = JSON.parse(fs.readFileSync(file, 'utf8'));
    
    data.item.forEach(reqGroup => {
        // sometimes it's item > event, sometimes item > item > event (folders)
        let items = reqGroup.item ? reqGroup.item : [reqGroup];
        
        items.forEach(item => {
            if (!item.event) return;
            let testEvent = item.event.find(e => e.listen === 'test');
            if (testEvent && testEvent.script && testEvent.script.exec) {
                let exec = testEvent.script.exec;
                for (let i = 0; i < exec.length; i++) {
                    if (exec[i].includes('const json = pm.response.json();')) {
                        exec[i] = exec[i].replace('const json = pm.response.json();', 'let json; try { json = pm.response.json(); } catch(e) { pm.expect.fail("Response is not JSON"); }');
                    }
                }
            }
        });
    });
    
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    console.log(file + " patched for safe JSON parsing!");
});
