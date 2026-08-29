const fs = require('fs');
const file = 'api-test/eshop_collection_orders.json';
let data = JSON.parse(fs.readFileSync(file, 'utf8'));

// We need to add logic to create an order before the test if precondition requires it.
// The easiest way is to intercept the prerequest script of the Collection or the Item.
// Let's modify the collection-level prerequest script to execute the precondition.
// Wait, postman collection variables can track if an order was created. But `pm.sendRequest` is async.
// In Postman, we can't easily block test execution with async `pm.sendRequest` in pre-request script UNLESS we do it carefully.
// Actually, it's easier to seed the database with all necessary orders in `backend/database.js` 
// and map preconditions to specific IDs!
