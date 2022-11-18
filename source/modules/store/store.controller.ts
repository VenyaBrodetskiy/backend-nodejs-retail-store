import { Request, Response, NextFunction } from "express";
import { NON_EXISTING_ID } from "../../common/constants";
import { AcessHelper } from "../../core/helpers/access.helper";
import { RequestHelper } from "../../core/helpers/request.helpers";
import { ResponseHelper } from "../../core/helpers/response.helper";
import { AuthenticatedRequest, storeType, systemError } from "../../common/entities";
import { Role } from "../../common/enums";
import StoreService from './store.service';

class StoreController {

    constructor() {}

    public getAllStores(req: Request, res: Response, next: NextFunction) {
        StoreService.getAllStores()
            .then((result: storeType[]) => {
                return res.status(200).json(result);
            })
            .catch((error: systemError) => {
                return ResponseHelper.handleError(res, error);
            })
    }
    
    public getStoreById(req: Request, res: Response, next: NextFunction) {
        const numericParamOrError: number | systemError = 
            RequestHelper.parseNumericInput(req.params.id);
        
        if (typeof numericParamOrError === "number") {
            if (numericParamOrError > 0) {
                StoreService.getStoreById(numericParamOrError)
                    .then((result: storeType) => {
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
    
    // SQL injection made by sending the following as a parameter: <' OR 1=1 -- >
    public async getStoreByTitle(req: Request, res: Response, next: NextFunction) {
        let title: string = req.params.title;
        
        try {
            const result: storeType[] =  await StoreService.getStoreByTitle(title)
            return res.status(200).json(result);
        }
        catch(error) {
            return ResponseHelper.handleError(res, error as systemError);
        }
    };
    
    public async updateStoreById(req: Request, res: Response, next: NextFunction) {
    
        const numericParamOrError: number | systemError = RequestHelper.parseNumericInput(req.params.id);
    
        if (typeof numericParamOrError === "number") {
            const storeId = numericParamOrError; // just alias for better reading
            const userId = (req as AuthenticatedRequest).userData.userId;
            const userRoles: Role[] = (req as AuthenticatedRequest).userData.rolesId;
    
            const isUserHasAccess: boolean = await AcessHelper.isUserHasAccessToStore(
                userId, userRoles, storeId)
            
            if (!isUserHasAccess) {
                    return res.sendStatus(401);
            }
    
            if (storeId > 0) {
                const body: storeType = req.body;
                const store: storeType = {
                    id: storeId,
                    name: body.name,
                    address: body.address,
                    openDate: body.openDate,
                    scale: body.scale
                };
                
                StoreService.updateStoreById(store, (req as AuthenticatedRequest).userData.userId)
                    .then((result: storeType) => {
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
    
    
    public addNewStore(req: Request, res: Response, next: NextFunction) {
        
        const body: storeType = req.body;    
        const inputStore = {
            id: NON_EXISTING_ID,
            name: body.name,
            address: body.address,
            openDate: body.openDate,
            scale: body.scale
        };
    
        StoreService.addNewStore(inputStore, (req as AuthenticatedRequest).userData.userId)
            .then((result: storeType) => {
                return res.status(200).json(result);
            })
            .catch((error: systemError) => {
                return ResponseHelper.handleError(res, error);
            })
    }
    
    public async deleteStore(req: Request, res: Response, next: NextFunction) {
        const numericParamOrError: number | systemError = RequestHelper.parseNumericInput(req.params.id);
    
        if (typeof numericParamOrError === "number") {
            const storeId = numericParamOrError; // just alias for better reading
            const userId = (req as AuthenticatedRequest).userData.userId;
            const userRoles: Role[] = (req as AuthenticatedRequest).userData.rolesId;
    
            const isUserHasAccess: boolean = await AcessHelper.isUserHasAccessToStore(
                userId, userRoles, storeId)
            
            if (!isUserHasAccess) {
                    return res.sendStatus(401);
            }
            
            if (numericParamOrError > 0) {
                StoreService.deleteStore(numericParamOrError, (req as AuthenticatedRequest).userData.userId)
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
export default new StoreController();