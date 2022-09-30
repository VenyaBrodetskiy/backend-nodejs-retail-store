import express from 'express';
import storeController from '../controllers/store.controller';
import employeeController from '../controllers/employee.controller';
const router = express.Router();

router.get('/', storeController.getAllStores);
router.get('/:id', storeController.getStoreById);
router.get('/by-title/:title', storeController.getStoreByTitle);

router.put('/:id', storeController.updateStoreById);
router.post('/', storeController.addNewStore);
//router.put('/store', storeController.addNewStore);

// router.post('/general/board-types', controller.addBoardType);
// router.post('/general/board-types2', controller.addBoardType2);

// router.delete('/general/board-types/:id', controller.deleteBoardTypeById);

router.get('/employee', employeeController.getAllEmployees);

export default { router }; 