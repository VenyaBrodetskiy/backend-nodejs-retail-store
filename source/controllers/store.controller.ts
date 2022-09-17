import { NextFunction, Request, Response } from "express";
import { ErrorCodes } from "../constants";
import { newStoreType, StoreType, systemError } from "../entities";
import { RequestHelper } from "../helpers/request.helpers";
import { ResponseHelper } from "../helpers/response.helper";
import { StoreService } from "../services/store.service";

const storeService: StoreService = new StoreService();

const getAllStores = async (req: Request, res: Response, next: NextFunction) => {
    storeService.getAllStores()
        .then((result: StoreType[]) => {
            return res.status(200).json(result);
        })
        .catch((error: systemError) => {
            switch (error.code) {
                case ErrorCodes.ConnectionError:
                    return res.status(408).json(error.message);
                case ErrorCodes.QueryError:
                    return res.status(406).json(error.message);
                default:
                    return res.status(400).json(error.message);
            }

        })
}

async function getStoreById(req: Request, res: Response, next: NextFunction) {
    const numericParamOrError: number | systemError = 
            RequestHelper.ParseNumericInput(req.params.id);
    
    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            storeService.getStoreById(numericParamOrError)
                .then((result: StoreType) => {
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
        .then((result: StoreType[]) => {
            return res.status(200).json(result);
        })
        .catch((error: systemError) => {
            return ResponseHelper.handleError(res, error);
        });
};

const updateStoreById = async (req: Request, res: Response, next: NextFunction) => {

    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(req.params.id);

    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            const body: StoreType = req.body;
            const store = {
                id: numericParamOrError,
                name: body.name,
                address: body.address,
                openDate: body.openDate,
                scale: body.scale
            };
            
            storeService.updateStoreById(store)
                .then((result: StoreType) => {
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
    const inputStore: newStoreType = req.body;    

    storeService.addNewStore(inputStore)
        .then((store_id: number) => {
            return res.status(200).json(store_id);
        })
        .catch((error: systemError) => {
            switch (error.code) {
                case ErrorCodes.ConnectionError:
                    return res.status(408).json(error.message);
                case ErrorCodes.QueryError:
                    return res.status(406).json(error.message);
                default:
                    return res.status(400).json(error.message);
            }

        })
}

export default {getAllStores, getStoreById, getStoreByTitle, updateStoreById, addNewStore};