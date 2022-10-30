import { RouteConfig } from '../../framework/routes.config';
import { Application } from "express";
import { Role } from '../../common/enums';
import SchoolController from "./store.controller";
import AuthMiddleware from '../../core/middleware/auth.middleware';

export class StoreRoutes extends RouteConfig {
    
    constructor(app: Application) {
        super(app, "StoreRoutes", "store");
    }

     public configureRoutes() {
        // get requests
        this.app.route(`/${this.baseUrl}`).get([
            AuthMiddleware.verifyToken([Role.NetworkAdministrator, Role.Cashier, Role.StoreManager]), 
            SchoolController.getAllStores]);

        this.app.route(`/${this.baseUrl}/:id`).get([
            AuthMiddleware.verifyToken([Role.NetworkAdministrator, Role.Cashier, Role.StoreManager]), 
            SchoolController.getStoreById]);

        this.app.route(`/${this.baseUrl}/by-title/:title`).get([
            AuthMiddleware.verifyToken([Role.NetworkAdministrator, Role.Cashier, Role.StoreManager]), 
            SchoolController.getStoreByTitle]);

        // put, post, delete
        this.app.route(`/${this.baseUrl}/:id`).put([
            AuthMiddleware.verifyToken([Role.NetworkAdministrator, Role.Cashier, Role.StoreManager]), 
            SchoolController.updateStoreById]);

        this.app.route(`/${this.baseUrl}`).post([
            AuthMiddleware.verifyToken([Role.NetworkAdministrator, Role.Cashier, Role.StoreManager]), 
            SchoolController.addNewStore]);

        this.app.route(`/${this.baseUrl}/:id`).delete([
            AuthMiddleware.verifyToken([Role.NetworkAdministrator, Role.Cashier, Role.StoreManager]), 
            SchoolController.deleteStore]);

        return this.app;
    }
}