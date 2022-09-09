import { NextFunction, Request, Response } from "express";
import { ErrorCodes } from "../constants";
import { Store, systemError } from "../entities";
import { StoreService } from "../services/store.service";

const storeService: StoreService = new StoreService();

// TODO: ask Ilya. why arrow function? Will it be same if not arrow function

// TODO: ask Ilya why is this function async. It works with regular function (let's remove async key-word for ex.)
async function getAllStores(req: Request, res: Response, next: NextFunction) {
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

export default {getAllStores};