import { RouteConfig } from '../../framework/routes.config';
import { Application } from "express";
import { Role } from '../../enums';
import SchoolController from "./store.controller";
import AuthMiddleware from '../../core/middleware/auth.middleware';

export class StoreRoutes extends RouteConfig {
    
    constructor(app: Application) {
        super(app, "StoreRoutes");
    }

     public configureRoutes() {
        // get requests
        this.app.route(`/store`).get([AuthMiddleware.verifyToken([Role.NetworkAdministrator, Role.Cashier, Role.StoreManager]), SchoolController.getAllStores]);
        this.app.route(`/store/:id`).get([AuthMiddleware.verifyToken([Role.NetworkAdministrator, Role.Cashier, Role.StoreManager]), SchoolController.getStoreById]);
        this.app.route(`/store/by-title/:title`).get([AuthMiddleware.verifyToken([Role.NetworkAdministrator, Role.Cashier, Role.StoreManager]), SchoolController.getStoreByTitle]);

        // put, post, delete
        this.app.route(`/store/:id`).put([AuthMiddleware.verifyToken([Role.NetworkAdministrator, Role.Cashier, Role.StoreManager]), SchoolController.updateStoreById]);
        this.app.route(`/store`).post([AuthMiddleware.verifyToken([Role.NetworkAdministrator, Role.Cashier, Role.StoreManager]), SchoolController.addNewStore]);
        this.app.route(`/store/:id`).delete([AuthMiddleware.verifyToken([Role.NetworkAdministrator, Role.Cashier, Role.StoreManager]), SchoolController.deleteStore]);

        // router.get('/', middleware.verifyToken([Role.NetworkAdministrator, Role.Cashier, Role.StoreManager]), storeController.getAllStores);
        // router.get('/:id', middleware.verifyToken([Role.NetworkAdministrator, Role.Cashier, Role.StoreManager]), storeController.getStoreById);
        // router.get('/by-title/:title', middleware.verifyToken([Role.NetworkAdministrator, Role.Cashier, Role.StoreManager]), storeController.getStoreByTitle);

        // router.put('/:id', middleware.verifyToken([Role.NetworkAdministrator, Role.Cashier, Role.StoreManager]), storeController.updateStoreById);
        // router.post('/', middleware.verifyToken([Role.NetworkAdministrator, Role.Cashier, Role.StoreManager]), storeController.addNewStore);
        // router.delete('/:id', middleware.verifyToken([Role.NetworkAdministrator, Role.Cashier, Role.StoreManager]), storeController.deleteStore)
        return this.app;
    }
}