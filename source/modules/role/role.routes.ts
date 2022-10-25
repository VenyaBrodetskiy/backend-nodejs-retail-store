import { RouteConfig } from '../../framework/routes.config';
import { Application } from "express"
import RoleController from "./role.controller"
import AuthMiddleware from '../../core/middleware/auth.middleware';
import { Role } from '../../enums';

export class RoleRoutes extends RouteConfig {
    
    constructor(app: Application) {
        super(app, "RoleRoutes");
    }

    configureRoutes() {

        this.app.route(`/role`).get([
            AuthMiddleware.verifyToken([Role.AccessAdministrator]), 
            RoleController.getAll]);

        this.app.route(`/role`).post([
            AuthMiddleware.verifyToken([Role.AccessAdministrator]), 
            RoleController.add]);

        this.app.route(`/role/:id`).put([
            AuthMiddleware.verifyToken([Role.AccessAdministrator]), 
            RoleController.updateById]);

        this.app.route(`/role/:id`).delete([
            AuthMiddleware.verifyToken([Role.AccessAdministrator]), 
            RoleController.deleteById]);

        return this.app;
    }
}