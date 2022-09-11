import express from 'express';
import controller from '../controllers/store.controller'
const router = express.Router();

// TODO: ask Ilya if it's okay to 
// firstly route all responses for /store -> separate file from /store to /all store /:id /addStore etc
// 
//

router.get('/store', controller.getAllStores);
router.get('/store/:id', controller.getStoreById);

router.put('/store', controller.addNewStore);

export default { router }; 