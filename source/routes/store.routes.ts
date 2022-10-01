import express from 'express';
import storeController from '../controllers/store.controller';
import employeeController from '../controllers/employee.controller';
import middleware from '../middleware/auth.middleware';
import { Role } from '../enums';
const router = express.Router();

router.get('/', middleware.verifyToken([Role.Administrator, Role.RegularUser]), storeController.getAllStores);
router.get('/:id', middleware.verifyToken([Role.Administrator, Role.RegularUser]), storeController.getStoreById);
router.get('/by-title/:title', middleware.verifyToken([Role.Administrator, Role.RegularUser]), storeController.getStoreByTitle);

router.put('/:id', middleware.verifyToken([Role.Administrator, Role.RegularUser]), storeController.updateStoreById);
router.post('/', middleware.verifyToken([Role.Administrator, Role.RegularUser]), storeController.addNewStore);
//router.put('/store', storeController.addNewStore);

// router.post('/general/board-types', controller.addBoardType);
// router.post('/general/board-types2', controller.addBoardType2);

// router.delete('/general/board-types/:id', controller.deleteBoardTypeById);

router.get('/employee', employeeController.getAllEmployees);

export default { router }; 