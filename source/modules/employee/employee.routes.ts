import { RouteConfig } from '../../framework/routes.config';
import { Application } from "express"
import AuthMiddleware from '../../core/middleware/auth.middleware';
import EmployeeController from './employee.controller';
import { Role } from '../../common/enums';

export class EmployeeRoutes extends RouteConfig {
    
    constructor(app: Application) {
        super(app, "EmployeeRoutes", "employee");
    }

    configureRoutes() {
        
        this.app.route(`/${this.baseUrl}`).get([
            AuthMiddleware.verifyToken([Role.NetworkAdministrator, Role.Cashier, Role.StoreManager]), 
            EmployeeController.getAll]);

        this.app.route(`/${this.baseUrl}/by-store-id/:id`).get([
            AuthMiddleware.verifyToken([Role.NetworkAdministrator, Role.Cashier, Role.StoreManager]), 
            EmployeeController.getAllByStoreId]);
            
        this.app.route(`/${this.baseUrl}/:id`).get([
            AuthMiddleware.verifyToken([Role.NetworkAdministrator, Role.Cashier, Role.StoreManager]), 
            EmployeeController.getOne]);

        this.app.route(`/${this.baseUrl}/:id`).put([
            AuthMiddleware.verifyToken([Role.NetworkAdministrator, Role.Cashier, Role.StoreManager]), 
            EmployeeController.update]);

        this.app.route(`/${this.baseUrl}`).post([
            AuthMiddleware.verifyToken([Role.NetworkAdministrator, Role.Cashier, Role.StoreManager]), 
            EmployeeController.add]);

        this.app.route(`/${this.baseUrl}/:id`).delete(
            [AuthMiddleware.verifyToken([Role.NetworkAdministrator, Role.Cashier, Role.StoreManager]), 
            EmployeeController.del]);

        return this.app;
    }
}