import express from 'express';
import employeeController from '../controllers/employee.controller';
import middleware from '../middleware/auth.middleware';
import { Role } from '../enums';
const router = express.Router();

router.get('/:id', middleware.verifyToken([Role.Administrator, Role.RegularUser]), employeeController.getAll);

export default { router }; 