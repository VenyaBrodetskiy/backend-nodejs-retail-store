import { RouteConfig } from '../../framework/routes.config';
import { Application } from "express";
import { Role } from '../../common/enums';
import SchoolController from "./store.controller";
import AuthMiddleware from '../../core/middleware/auth.middleware';

export class StoreRoutes extends RouteConfig {
    
    constructor(app: Application) {
        super(app, "StoreRoutes");
    }

     public configureRoutes() {
        // get requests
        this.app.route(`/store`).get([
            AuthMiddleware.verifyToken([Role.NetworkAdministrator, Role.Cashier, Role.StoreManager]), 
            SchoolController.getAllStores]);

        this.app.route(`/store/:id`).get([
            AuthMiddleware.verifyToken([Role.NetworkAdministrator, Role.Cashier, Role.StoreManager]), 
            SchoolController.getStoreById]);

        this.app.route(`/store/by-title/:title`).get([
            AuthMiddleware.verifyToken([Role.NetworkAdministrator, Role.Cashier, Role.StoreManager]), 
            SchoolController.getStoreByTitle]);

        // put, post, delete
        this.app.route(`/store/:id`).put([
            AuthMiddleware.verifyToken([Role.NetworkAdministrator, Role.Cashier, Role.StoreManager]), 
            SchoolController.updateStoreById]);

        this.app.route(`/store`).post([
            AuthMiddleware.verifyToken([Role.NetworkAdministrator, Role.Cashier, Role.StoreManager]), 
            SchoolController.addNewStore]);

        this.app.route(`/store/:id`).delete([
            AuthMiddleware.verifyToken([Role.NetworkAdministrator, Role.Cashier, Role.StoreManager]), 
            SchoolController.deleteStore]);

        return this.app;
    }
}