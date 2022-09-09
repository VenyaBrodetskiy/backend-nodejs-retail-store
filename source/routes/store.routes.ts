import express from 'express';
import controller from '../controllers/store.controller'
const router = express.Router();

// TODO: ask Ilya if it's okay to 
// firstly route all responses for /store -> separate file from /store to /all store /:id /addStore etc
// 
//

router.get('/store/all', controller.getAllStores);

// TODO: get store by id:
//router.get('/store/all:id', controller.getStoreById);

export default { router }; 