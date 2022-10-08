import { Request, Response, NextFunction } from 'express';
import { NON_EXISTING_ID } from '../constants';
import { AuthenticatedRequest, RoleType, systemError, user } from '../entities';
import { RequestHelper } from '../helpers/request.helpers';
import { ResponseHelper } from '../helpers/response.helper';
import { ErrorService } from '../services/error.service';
import { UserService } from '../services/user.service';
import bcrypt from 'bcryptjs';
import { AppError, Role } from '../enums';

const errorService: ErrorService = new ErrorService();
const userService: UserService = new UserService(errorService);

const updateById = async (req: Request, res: Response, next: NextFunction) => {

    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id);

    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            const body: user = req.body;

            const user = {
                id: numericParamOrError,
                firstName: body.firstName,
                lastName: body.lastName,
                roles: body.roles
            };
            
            userService.updateById(user, (req as AuthenticatedRequest).userData.userId)
                .then((result: user) => {
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

const add = async (req: Request, res: Response, next: NextFunction) => {
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

    let inputParamsSupplied : boolean = true;
    for (const role of user.roles) {
        if (Role[role as RoleType] === undefined) { 
            inputParamsSupplied = false;
            break;
        }
    }
    
    if (inputParamsSupplied) {
        userService.add(user, (req as AuthenticatedRequest).userData.userId)
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
        return ResponseHelper.handleError(res, errorService.getError(AppError.InputParameterNotSupplied));
    }
};


const deleteById = async (req: Request, res: Response, next: NextFunction) => {
    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id);

    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            userService.deleteById(numericParamOrError, (req as AuthenticatedRequest).userData.userId)
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



export default { 
    add, updateById, deleteById
};