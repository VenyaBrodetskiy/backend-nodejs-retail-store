import { Request, Response, NextFunction } from "express";
import { RequestHelper } from "../../core/helpers/request.helpers";
import { ResponseHelper } from "../../core/helpers/response.helper";
import { AuthenticatedRequest, roleType, systemError, user } from "../../common/entities";
import { NON_EXISTING_ID } from "../../common/constants";
import RoleService from "./role.service";

class RoleController {

    constructor() {}

    public getAll(req: Request, res: Response, next: NextFunction) {
        RoleService.getAll()
            .then((result: roleType[]) => {
                return res.status(200).json(result);
            })
            .catch((error: systemError) => {
                return ResponseHelper.handleError(res, error);
            })
    }
    
    public updateById(req: Request, res: Response, next: NextFunction) {
    
        const numericParamOrError: number | systemError = RequestHelper.parseNumericInput(req.params.id);
    
        if (typeof numericParamOrError === "number") {
            if (numericParamOrError > 0) {
                const body: roleType = req.body;
                const role = {
                    id: numericParamOrError,
                    roleName: body.roleName,
                };
                
                RoleService.updateById(role, (req as AuthenticatedRequest).userData.userId)
                    .then((result: roleType) => {
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
        
        // TODO: Ask Ilya - how to check that input is of type newrole??
        const body: roleType = req.body;    
        const inputrole = {
            id: NON_EXISTING_ID,
            roleName: body.roleName,
        };
    
        RoleService.add(inputrole, (req as AuthenticatedRequest).userData.userId)
            .then((result: roleType) => {
                return res.status(200).json(result);
            })
            .catch((error: systemError) => {
                return ResponseHelper.handleError(res, error);
            })
    }
    
    public deleteById(req: Request, res: Response, next: NextFunction) {
        const numericParamOrError: number | systemError = RequestHelper.parseNumericInput(req.params.id);
    
        if (typeof numericParamOrError === "number") {
            if (numericParamOrError > 0) {
                RoleService.deleteById(numericParamOrError, (req as AuthenticatedRequest).userData.userId)
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
export default new RoleController();