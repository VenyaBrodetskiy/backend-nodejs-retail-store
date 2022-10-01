import { NextFunction, Request, Response } from "express";
import { ErrorService } from "../services/error.service";
import { AuthenticatedRequest, storeType, systemError } from "../entities";
import { RequestHelper } from "../helpers/request.helpers";
import { ResponseHelper } from "../helpers/response.helper";
import { StoreService } from "../services/store.service";
import { NON_EXISTING_ID } from "../constants";

const errorService: ErrorService = new ErrorService();
const storeService: StoreService = new StoreService(errorService);

const getAllStores = async (req: Request, res: Response, next: NextFunction) => {
    storeService.getAllStores()
        .then((result: storeType[]) => {
            return res.status(200).json(result);
        })
        .catch((error: systemError) => {
            return ResponseHelper.handleError(res, error);
        })
}

async function getStoreById(req: Request, res: Response, next: NextFunction) {
    const numericParamOrError: number | systemError = 
        RequestHelper.ParseNumericInput(errorService, req.params.id);
    
    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            storeService.getStoreById(numericParamOrError)
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
const getStoreByTitle = async (req: Request, res: Response, next: NextFunction) => {
    let title: string = req.params.title;
    
    storeService.getStoreByTitle(title)
        .then((result: storeType[]) => {
            return res.status(200).json(result);
        })
        .catch((error: systemError) => {
            return ResponseHelper.handleError(res, error);
        });
};

const updateStoreById = async (req: Request, res: Response, next: NextFunction) => {

    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id);

    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            const body: storeType = req.body;
            const store = {
                id: numericParamOrError,
                name: body.name,
                address: body.address,
                openDate: body.openDate,
                scale: body.scale
            };
            
            storeService.updateStoreById(store, (req as AuthenticatedRequest).userData.userId)
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


async function addNewStore(req: Request, res: Response, next: NextFunction) {
    
    // TODO: Ask Ilya - how to check that input is of type newStore??
    const body: storeType = req.body;    
    const inputStore = {
        id: NON_EXISTING_ID,
        name: body.name,
        address: body.address,
        openDate: body.openDate,
        scale: body.scale
    };

    storeService.addNewStore(inputStore, (req as AuthenticatedRequest).userData.userId)
        .then((result: storeType) => {
            return res.status(200).json(result);
        })
        .catch((error: systemError) => {
            return ResponseHelper.handleError(res, error);
        })
}

async function deleteStore(req: Request, res: Response, next: NextFunction) {
    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id);

    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            storeService.deleteStore(numericParamOrError, (req as AuthenticatedRequest).userData.userId)
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
    getAllStores,
    getStoreById, 
    getStoreByTitle, 
    updateStoreById, 
    addNewStore,
    deleteStore
};