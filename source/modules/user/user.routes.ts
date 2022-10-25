import { RouteConfig } from '../../framework/routes.config';
import { Application } from "express"
import UserController from "./user.controller"
import AuthMiddleware from '../../core/middleware/auth.middleware';
import { Role } from '../../enums';

export class UserRoutes extends RouteConfig {
    
    constructor(app: Application) {
        super(app, "UserRoutes");
    }

    configureRoutes() {
        this.app.route(`/user/`).post([
            AuthMiddleware.verifyToken([Role.AccessAdministrator]), 
            UserController.add]);

        this.app.route(`/user/:id`).put([
            AuthMiddleware.verifyToken([Role.AccessAdministrator]), 
            UserController.updateById]);

        this.app.route(`/user/:id`).delete([
            AuthMiddleware.verifyToken([Role.AccessAdministrator]), 
            UserController.deleteById]);

        return this.app;
    }
}