import { AppError, Role } from "./enums";
import { Request } from "express";
export interface entityWithId{
    id: number;
}
export interface user extends entityWithId {
    firstName: string;
    lastName: string;
    login?: string;
    password?: string;
}
export interface storeType extends entityWithId{
    name: string;
    address: string;
    openDate: string;
    scale: number;
}
export interface employeeType extends entityWithId{
    firstName: string;
    lastName: string;
    position: string;
    storeName: string;
}
export interface systemError {
    key: AppError
    code: number;
    message: string;
}

export interface sqlParameter {
    name: string;
    type: any;
    value: string | number;
}

export interface authenticationToken {
    userData: jwtUserData;
}

export interface AuthenticatedRequest extends Request, authenticationToken {}
export interface jwtUserData {
    userId: number;
    roleId: Role;
}