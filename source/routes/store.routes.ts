import express from 'express';
import storeController from '../controllers/store.controller';
import middleware from '../middleware/auth.middleware';
import { Role } from '../enums';
const router = express.Router();

router.get('/', middleware.verifyToken([Role.Administrator, Role.RegularUser]), storeController.getAllStores);
router.get('/:id', middleware.verifyToken([Role.Administrator, Role.RegularUser]), storeController.getStoreById);
router.get('/by-title/:title', middleware.verifyToken([Role.Administrator, Role.RegularUser]), storeController.getStoreByTitle);

router.put('/:id', middleware.verifyToken([Role.Administrator, Role.RegularUser]), storeController.updateStoreById);
router.post('/', middleware.verifyToken([Role.Administrator, Role.RegularUser]), storeController.addNewStore);
router.delete('/:id', middleware.verifyToken([Role.Administrator, Role.RegularUser]), storeController.deleteStore)

export default { router }; 