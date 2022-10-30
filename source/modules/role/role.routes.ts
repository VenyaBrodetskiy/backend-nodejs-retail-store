import { RouteConfig } from '../../framework/routes.config';
import { Application } from "express"
import RoleController from "./role.controller"
import AuthMiddleware from '../../core/middleware/auth.middleware';
import { Role } from '../../common/enums';

export class RoleRoutes extends RouteConfig {
    
    constructor(app: Application) {
        super(app, "RoleRoutes", "role");
    }

    configureRoutes() {

        this.app.route(`/${this.baseUrl}`).get([
            AuthMiddleware.verifyToken([Role.AccessAdministrator]), 
            RoleController.getAll]);

        this.app.route(`/${this.baseUrl}`).post([
            AuthMiddleware.verifyToken([Role.AccessAdministrator]), 
            RoleController.add]);

        this.app.route(`/${this.baseUrl}/:id`).put([
            AuthMiddleware.verifyToken([Role.AccessAdministrator]), 
            RoleController.updateById]);

        this.app.route(`/${this.baseUrl}/:id`).delete([
            AuthMiddleware.verifyToken([Role.AccessAdministrator]), 
            RoleController.deleteById]);

        return this.app;
    }
}