import express from 'express';
import storeController from '../controllers/store.controller';
import employeeController from '../controllers/employee.controller';
const router = express.Router();

// TODO: ask Ilya if it's okay to 
// firstly route all responses for /store -> separate file from /store to /all store /:id /addStore etc
// 
//

router.get('/store', storeController.getAllStores);
router.get('/store/:id', storeController.getStoreById);

router.put('/store', storeController.addNewStore);

router.get('/employee', employeeController.getAllEmployees)

export default { router }; 