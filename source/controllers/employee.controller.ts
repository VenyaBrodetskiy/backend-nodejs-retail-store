import { NextFunction, Request, Response } from "express";
import { ErrorCodes } from "../constants";
import { EmployeeType, systemError } from "../entities";
import { EmployeeService } from "../services/employee.service";

const employeeService: EmployeeService = new EmployeeService();

async function getAllEmployees(req: Request, res: Response, next: NextFunction) {
    employeeService.getAllEmployees()
        .then((result: EmployeeType[]) => {
            return res.status(200).json(result)
        })
}

export default {getAllEmployees};