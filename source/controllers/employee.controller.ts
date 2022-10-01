import { NextFunction, Request, Response } from "express";
import { employeeType, systemError } from "../entities";
import { RequestHelper } from "../helpers/request.helpers";
import { ResponseHelper } from "../helpers/response.helper";
import { EmployeeService } from "../services/employee.service";
import { ErrorService } from "../services/error.service";

const errorService: ErrorService = new ErrorService();
const employeeService: EmployeeService = new EmployeeService(errorService);

async function getAll(req: Request, res: Response, next: NextFunction) {
    const numericParamOrError: number | systemError = 
        RequestHelper.ParseNumericInput(errorService, req.params.id);
    
    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            employeeService.getAll(numericParamOrError)
                .then((result: employeeType[]) => {
                    return res.status(200).json(result)
                })
                .catch((error: systemError) => {
                    return ResponseHelper.handleError(res, error);
                })
        }
        else {
            // TODO: Error handling
        }
    }
    else {
        return ResponseHelper.handleError(res, numericParamOrError);
    }
}

export default {getAll};