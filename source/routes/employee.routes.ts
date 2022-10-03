import express from 'express';
import employeeController from '../controllers/employee.controller';
import middleware from '../middleware/auth.middleware';
import { Role } from '../enums';
const router = express.Router();

router.get('/by-store-id/:id', middleware.verifyToken([Role.Administrator, Role.RegularUser]), employeeController.getAll);
router.get('/:id', middleware.verifyToken([Role.Administrator, Role.RegularUser]), employeeController.getOne);
router.put('/:id', middleware.verifyToken([Role.Administrator, Role.RegularUser]), employeeController.update);
router.post('/', middleware.verifyToken([Role.Administrator, Role.RegularUser]), employeeController.add);
router.delete('/:id', middleware.verifyToken([Role.Administrator]), employeeController.del);

export default { router }; 