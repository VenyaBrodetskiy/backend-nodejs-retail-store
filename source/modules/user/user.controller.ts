import { Request, Response, NextFunction } from "express";
import { RequestHelper } from "../../core/helpers/request.helpers";
import { ResponseHelper } from "../../core/helpers/response.helper";
import { AuthenticatedRequest, systemError, user } from "../../common/entities";
import { AppError } from "../../common/enums";
import UserService from "./user.service";
import ErrorService from "../../core/error.service";
import bcrypt from 'bcryptjs';
import { NON_EXISTING_ID } from "../../common/constants";

class UserController {

    constructor() {}

    
    public getAll(req: Request, res: Response, next: NextFunction) {
        UserService.getAll()
            .then((result: user[]) => {
                return res.status(200).json(result);
            })
            .catch((error: systemError) => {
                return ResponseHelper.handleError(res, error);
            })
    }

    public updateById(req: Request, res: Response, next: NextFunction) {

        const numericParamOrError: number | systemError = RequestHelper.parseNumericInput(req.params.id);
    
        const body: user = req.body;
        let inputParamsSupplied: boolean = RequestHelper.checkInputRoles(body.roles);
    
        if (typeof numericParamOrError === "number") {
            if (numericParamOrError > 0  && inputParamsSupplied === true) {
                const user = {
                    id: numericParamOrError,
                    firstName: body.firstName,
                    lastName: body.lastName,
                    roles: body.roles
                };
                
                UserService.updateById(user, (req as AuthenticatedRequest).userData.userId)
                    .then((result: user) => {
                        return res.status(200).json(result);
                    })
                    .catch((error: systemError) => {
                        return ResponseHelper.handleError(res, error);
                    })
            }
            else {
                return ResponseHelper.handleError(res, ErrorService.getError(AppError.InputParameterNotSupplied));
            }
        }
        else {
            return ResponseHelper.handleError(res, numericParamOrError);
        }  
    };
    
    public add(req: Request, res: Response, next: NextFunction) {
        const body: user = req.body;
        const hashedPasword: string = bcrypt.hashSync(body.password as string);
    
        const user: user = {
            id: NON_EXISTING_ID,
            firstName: body.firstName,
            lastName: body.lastName,
            login: body.login,
            password: hashedPasword,
            roles: body.roles
        };
    
        let inputParamsSupplied: boolean = RequestHelper.checkInputRoles(user.roles);
        if (inputParamsSupplied) {
            UserService.add(user, (req as AuthenticatedRequest).userData.userId)
                .then((result: user) => {
                    // it's important to replace returnUser in order to hide password
                    const returnUser: user = {
                        id: result.id,
                        firstName: result.firstName,
                        lastName: result.lastName,
                        roles: result.roles
                    }
                    return res.status(200).json(returnUser);
                })
                .catch((error: systemError) => {
                    return ResponseHelper.handleError(res, error);
                })
        }
        else {
            return ResponseHelper.handleError(res, ErrorService.getError(AppError.InputParameterNotSupplied));
        }
    };
    
    
    public deleteById(req: Request, res: Response, next: NextFunction) {
        const numericParamOrError: number | systemError = RequestHelper.parseNumericInput(req.params.id);
    
        if (typeof numericParamOrError === "number") {
            if (numericParamOrError > 0) {
                UserService.deleteById(numericParamOrError, (req as AuthenticatedRequest).userData.userId)
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
        
    };
}

// creating singleton
export default new UserController();