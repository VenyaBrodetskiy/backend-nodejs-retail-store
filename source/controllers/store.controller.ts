import { NextFunction, Request, Response } from "express";
import { ErrorCodes } from "../constants";
import { newStoreType, StoreType, systemError } from "../entities";
import { StoreService } from "../services/store.service";

const storeService: StoreService = new StoreService();

// TODO: ask Ilya. why arrow function? Will it be same if not arrow function

// TODO: ask Ilya why is this function async. It works with regular function (let's remove async key-word for ex.)

// TODO: ask Ilya why don't we use res.send(). What's the difference with res.status()
async function getAllStores(req: Request, res: Response, next: NextFunction) {
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

//just in case here is arrow function
/* const getAllStores = async (req: Request, res: Response, next: NextFunction) => {
    storeService.getAllStores()
        .then((result: Store[]) => {
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
 */


async function getStoreById(req: Request, res: Response, next: NextFunction) {
    let id: number = -1; // declare default value, which obviously cannot work

    const sId: string = req.params.id;
    if (isNaN(Number(sId))) {
        // TODO: Error handling
    }

    if (sId !== null && sId !== undefined) {
        id = parseInt(sId);
    }
    else {
        // TODO: Error handling
    }

    if (id > 0) {
        storeService.getStoreById(id)
            .then((result: StoreType) => {
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
}

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

export default {getAllStores, getStoreById, addNewStore};