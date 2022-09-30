import { NextFunction, Request, Response } from "express";
import { employeeType } from "../entities";
import { EmployeeService } from "../services/employee.service";
import { ErrorService } from "../services/error.service";

const errorService: ErrorService = new ErrorService();
// TODO: add errorService inside EmployeeService
const employeeService: EmployeeService = new EmployeeService();

async function getAllEmployees(req: Request, res: Response, next: NextFunction) {
    employeeService.getAllEmployees()
        .then((result: employeeType[]) => {
            return res.status(200).json(result)
        })
}

export default {getAllEmployees};