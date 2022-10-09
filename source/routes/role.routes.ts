import express from 'express';
import controller from '../controllers/role.controller';
import { Role } from '../enums';
import middleware from '../middleware/auth.middleware';
const router = express.Router();

router.get('/', middleware.verifyToken([Role.AccessAdministrator]), controller.getAll);

router.post('/', middleware.verifyToken([Role.AccessAdministrator]), controller.add);

router.put('/:id', middleware.verifyToken([Role.AccessAdministrator]), controller.updateById);

router.delete('/:id', middleware.verifyToken([Role.AccessAdministrator]), controller.deleteById);


export default { router }; 