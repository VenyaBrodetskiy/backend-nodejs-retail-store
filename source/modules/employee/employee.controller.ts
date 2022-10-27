import { Request, Response, NextFunction } from "express";
import { RequestHelper } from "../../core/helpers/request.helpers";
import { ResponseHelper } from "../../core/helpers/response.helper";
import { AuthenticatedRequest, employeeOfStore, employeeType, systemError } from "../../common/entities";
import { NON_EXISTING_ID } from "../../common/constants";
import EmployeeService from "./employee.service";
import { Role } from "../../common/enums";
import { AcessHelper } from "../../core/helpers/access.helper";

class EmployeeController {

    constructor() {}

    public getAll(req: Request, res: Response, next: NextFunction) {
        EmployeeService.getAll()
            .then((result: employeeOfStore[]) => {
                return res.status(200).json(result);
            })
            .catch((error: systemError) => {
                return ResponseHelper.handleError(res, error);
            })
    }
    
    public getAllByStoreId(req: Request, res: Response, next: NextFunction) {
        const numericParamOrError: number | systemError = 
            RequestHelper.parseNumericInput(req.params.id);
        
        if (typeof numericParamOrError === "number") {
            if (numericParamOrError > 0) {
                EmployeeService.getAllByStoreId(numericParamOrError)
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
    public getOne(req: Request, res: Response, next: NextFunction) {
        const numericParamOrError: number | systemError = 
            RequestHelper.parseNumericInput(req.params.id);
        
        if (typeof numericParamOrError === "number") {
            if (numericParamOrError > 0) {
                EmployeeService.getOne(numericParamOrError)
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
    
    public async update(req: Request, res: Response, next: NextFunction) {
    
        const numericParamOrError: number | systemError = RequestHelper.parseNumericInput(req.params.id);
    
        if (typeof numericParamOrError === "number") {
            const employeeId = numericParamOrError; // just alias for better reading
            const userId = (req as AuthenticatedRequest).userData.userId;
            const userRoles: Role[] = (req as AuthenticatedRequest).userData.rolesId;
            
            const isUserHasAccess: boolean = await AcessHelper.isUserHasAccessToEmployee(
                res, userId, userRoles, employeeId)
            
            if (!isUserHasAccess) {
                    return res.sendStatus(401);
            }
    
            if (numericParamOrError > 0) {
                const body: employeeType = req.body;
                const employee = {
                    id: numericParamOrError,
                    firstName: body.firstName,
                    lastName: body.lastName,
                    position: body.position
                };
                
                EmployeeService.update(employee, (req as AuthenticatedRequest).userData.userId)
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
    
    public add(req: Request, res: Response, next: NextFunction) {
    
        const body: employeeOfStore = req.body;    
        const inputEmployee = {
            id: NON_EXISTING_ID,
            firstName: body.firstName,
            lastName: body.lastName,
            position: body.position,
            storeName: body.storeName
        };
    
        EmployeeService.add(inputEmployee, (req as AuthenticatedRequest).userData.userId)
            .then((result: employeeOfStore) => {
                return res.status(200).json(result);
            })
            .catch((error: systemError) => {
                return ResponseHelper.handleError(res, error);
            })
    }
    
    public async del(req: Request, res: Response, next: NextFunction) {
        const numericParamOrError: number | systemError = RequestHelper.parseNumericInput(req.params.id);
    
        if (typeof numericParamOrError === "number") {
            const employeeId = numericParamOrError; // just alias for better reading
            const userId = (req as AuthenticatedRequest).userData.userId;
            const userRoles: Role[] = (req as AuthenticatedRequest).userData.rolesId;
            
            const isUserHasAccess: boolean = await AcessHelper.isUserHasAccessToEmployee(
                res, userId, userRoles, employeeId)
            
            if (!isUserHasAccess) {
                    return res.sendStatus(401);
            }
            
            if (numericParamOrError > 0) {
                EmployeeService.del(numericParamOrError, (req as AuthenticatedRequest).userData.userId)
                    .then(() => {
                        return res.sendStatus(200);
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
}

// creating singleton
export default new EmployeeController();