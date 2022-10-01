import { NextFunction, Request, Response } from "express";
import { employeeType } from "../entities";
import { EmployeeService } from "../services/employee.service";
import { ErrorService } from "../services/error.service";

const errorService: ErrorService = new ErrorService();
const employeeService: EmployeeService = new EmployeeService(errorService);

async function getAll(req: Request, res: Response, next: NextFunction) {
    employeeService.getAll()
        .then((result: employeeType[]) => {
            return res.status(200).json(result)
        })
}

export default {getAll};