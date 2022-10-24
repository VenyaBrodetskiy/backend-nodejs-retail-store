import { RouteConfig } from '../../framework/routes.config';
import express, { Application, Request, Response } from "express"
import UserController from "./user.controller"

export class UserRoutes extends RouteConfig {
    
    constructor(app: Application) {
        super(app, "UserRoutes");
    }

    configureRoutes() {
        this.app.route(`/user/:id`).get([UserController.getUserById]);
        return this.app;
    }
}