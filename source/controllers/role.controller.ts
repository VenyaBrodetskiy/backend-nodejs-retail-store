import { NextFunction, Request, Response } from "express";
import { ErrorService } from "../services/error.service";
import { AuthenticatedRequest, roleType, systemError } from "../entities";
import { RequestHelper } from "../helpers/request.helpers";
import { ResponseHelper } from "../helpers/response.helper";
import { RoleService } from "../services/role.service";
import { NON_EXISTING_ID } from "../constants";

const errorService: ErrorService = new ErrorService();
const roleService: RoleService = new RoleService(errorService);

const getAll = async (req: Request, res: Response, next: NextFunction) => {
    roleService.getAll()
        .then((result: roleType[]) => {
            return res.status(200).json(result);
        })
        .catch((error: systemError) => {
            return ResponseHelper.handleError(res, error);
        })
}

const updateById = async (req: Request, res: Response, next: NextFunction) => {

    const numericParamOrError: number | systemError = RequestHelper.parseNumericInput(errorService, req.params.id);

    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            const body: roleType = req.body;
            const role = {
                id: numericParamOrError,
                roleName: body.roleName,
            };
            
            roleService.updateById(role, (req as AuthenticatedRequest).userData.userId)
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

async function add(req: Request, res: Response, next: NextFunction) {
    
    // TODO: Ask Ilya - how to check that input is of type newrole??
    const body: roleType = req.body;    
    const inputrole = {
        id: NON_EXISTING_ID,
        roleName: body.roleName,
    };

    roleService.add(inputrole, (req as AuthenticatedRequest).userData.userId)
        .then((result: roleType) => {
            return res.status(200).json(result);
        })
        .catch((error: systemError) => {
            return ResponseHelper.handleError(res, error);
        })
}

async function deleteById(req: Request, res: Response, next: NextFunction) {
    const numericParamOrError: number | systemError = RequestHelper.parseNumericInput(errorService, req.params.id);

    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            roleService.deleteById(numericParamOrError, (req as AuthenticatedRequest).userData.userId)
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

export default {
    getAll,
    add, 
    updateById, 
    deleteById, 
};