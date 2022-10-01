import { NextFunction, Request, Response } from "express";
import { NON_EXISTING_ID } from "../constants";
import { AuthenticatedRequest, employeeOfStore, employeeType, systemError } from "../entities";
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
                .then((result: employeeOfStore[]) => {
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

// TODO: very similar to getArray. refactor
async function getOne(req: Request, res: Response, next: NextFunction) {
    const numericParamOrError: number | systemError = 
        RequestHelper.ParseNumericInput(errorService, req.params.id);
    
    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            employeeService.getOne(numericParamOrError)
                .then((result: employeeOfStore[]) => {
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

const update = async (req: Request, res: Response, next: NextFunction) => {

    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id);

    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            const body: employeeType = req.body;
            const employee = {
                id: numericParamOrError,
                firstName: body.firstName,
                lastName: body.lastName,
                position: body.position
            };
            
            employeeService.update(employee, (req as AuthenticatedRequest).userData.userId)
                .then((result: employeeType) => {
                    return res.status(200).json(result);
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
};

async function add(req: Request, res: Response, next: NextFunction) {

    const body: employeeOfStore = req.body;    
    const inputEmployee = {
        id: NON_EXISTING_ID,
        firstName: body.firstName,
        lastName: body.lastName,
        position: body.position,
        storeName: body.storeName
    };

    employeeService.add(inputEmployee, (req as AuthenticatedRequest).userData.userId)
        .then((result: employeeOfStore) => {
            return res.status(200).json(result);
        })
        .catch((error: systemError) => {
            return ResponseHelper.handleError(res, error);
        })
}

export default {
    getAll, 
    getOne,
    update,
    add
};