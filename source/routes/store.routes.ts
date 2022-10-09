import express from 'express';
import storeController from '../controllers/store.controller';
import middleware from '../middleware/auth.middleware';
import { Role } from '../enums';
const router = express.Router();

router.get('/', middleware.verifyToken([Role.NetworkAdministrator, Role.RegularUser, Role.StoreManager]), storeController.getAllStores);
router.get('/:id', middleware.verifyToken([Role.NetworkAdministrator, Role.RegularUser, Role.StoreManager]), storeController.getStoreById);
router.get('/by-title/:title', middleware.verifyToken([Role.NetworkAdministrator, Role.RegularUser, Role.StoreManager]), storeController.getStoreByTitle);

router.put('/:id', middleware.verifyToken([Role.NetworkAdministrator, Role.RegularUser, Role.StoreManager]), storeController.updateStoreById);
router.post('/', middleware.verifyToken([Role.NetworkAdministrator, Role.RegularUser, Role.StoreManager]), storeController.addNewStore);
router.delete('/:id', middleware.verifyToken([Role.NetworkAdministrator, Role.StoreManager]), storeController.deleteStore)

export default { router }; 