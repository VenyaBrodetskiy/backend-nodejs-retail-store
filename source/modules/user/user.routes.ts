import { RouteConfig } from '../../framework/routes.config';
import { Application } from "express"
import UserController from "./user.controller"
import AuthMiddleware from '../../core/middleware/auth.middleware';
import { Role } from '../../common/enums';

export class UserRoutes extends RouteConfig {
    
    constructor(app: Application) {
        super(app, "UserRoutes", "user");
    }

    configureRoutes() {
        this.app.route(`/${this.baseUrl}`).get([
            AuthMiddleware.verifyToken([Role.AccessAdministrator]), 
            UserController.getAll]);

        this.app.route(`/${this.baseUrl}`).post([
            AuthMiddleware.verifyToken([Role.AccessAdministrator]), 
            UserController.add]);

        this.app.route(`/${this.baseUrl}/:id`).put([
            AuthMiddleware.verifyToken([Role.AccessAdministrator]), 
            UserController.updateById]);

        this.app.route(`/${this.baseUrl}/:id`).delete([
            AuthMiddleware.verifyToken([Role.AccessAdministrator]), 
            UserController.deleteById]);

        return this.app;
    }
}