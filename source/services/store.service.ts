import { Queries } from "../constants";
import { entityWithId, storeType, systemError } from "../entities";
import { SqlHelper } from "../helpers/sql.helper";
import { Statuses } from '../enums';
import _ from 'underscore';
import { ErrorService } from "./error.service";
import { DateHelper } from "../framework/date.helpers";

interface IStoreService {
    getAllStores(): Promise<storeType[]>;
    getStoreById(id: number): Promise<storeType>; 
    getStoreByTitle(title: string): Promise<storeType[]>;
    updateStoreById(store: storeType, userId: number): Promise<storeType>;
    addNewStore(store: storeType, userId: number): Promise<storeType>;
    deleteStore(id: number, userId: number): Promise<void>
}

interface localStoreType {
    id: number;
    store_name: string;
    store_address: string;
    opening_date: string;
    scale: number;
}

export class StoreService implements IStoreService {

    constructor(private errorService: ErrorService) {

    }

    public getAllStores(): Promise<storeType[]> {
        return new Promise<storeType[]>((resolve, reject) => {
            const result: storeType[] = [];          
            
            SqlHelper.executeQueryArrayResult<localStoreType>(this.errorService, Queries.AllStores, Statuses.Active)
            .then((queryResult: localStoreType[]) => {
                queryResult.forEach((store: localStoreType) => {
                    result.push(this.parseLocalStore(store))
                });
                resolve(result);
            })
            .catch((error: systemError) => reject(error));
        });
    }

    public getStoreById(id: number): Promise<storeType> {
        return new Promise<storeType>((resolve, reject) => {    
            
            SqlHelper.executeQuerySingleResult<localStoreType>(this.errorService, Queries.StoreById, id, Statuses.Active)
            .then((queryResult: localStoreType) => {
                resolve(this.parseLocalStore(queryResult))
            })
            .catch((error: systemError) => reject(error));
        });
    }

    public getStoreByTitle(title: string): Promise<storeType[]> {
        return new Promise<storeType[]>((resolve, reject) => {
            SqlHelper.executeQueryArrayResult<localStoreType>(this.errorService, Queries.StoreByTitle, `%${title}%`)
                .then((queryResult: localStoreType[]) => {
                    resolve(_.map(queryResult, (result: localStoreType) => this.parseLocalStore(result)));
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public updateStoreById(store: storeType, userId: number): Promise<storeType> {
        return new Promise<storeType>((resolve, reject) => {
            const updateDate: Date = new Date();
            SqlHelper.executeQueryNoResult(
                this.errorService,
                Queries.UpdateStoreById, false, 
                store.name, 
                store.address, 
                store.openDate, 
                store.scale,
                DateHelper.dateToString(updateDate),
                userId,
                store.id,
                Statuses.Active
                )
            .then(() => {
                resolve(store);
            })
            .catch((error: systemError) => reject(error));
        });
    }

    public addNewStore(store: storeType, userId: number): Promise<storeType> {
        return new Promise<storeType>((resolve, reject) => {

            const createDate: string = DateHelper.dateToString(new Date());

            SqlHelper.createNew(
                this.errorService,
                Queries.AddNewStore, store,
                store.name, store.address, store.openDate, store.scale,
                createDate, createDate,
                userId, userId,
                Statuses.Active
            )
            .then((result: entityWithId) => {
                resolve(result as storeType);
            })
            .catch((error: systemError) => reject(error));
        });
    }

    public deleteStore(id: number, userId: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const updateDate: Date = new Date();

            SqlHelper.executeQueryNoResult(
                this.errorService, 
                Queries.DeleteStore, true, 
                DateHelper.dateToString(updateDate), userId, Statuses.NotActive,
                id, Statuses.Active)
            .then(() => {
                resolve();
            })
            .catch((error: systemError) => reject(error));
        })
    }

    private parseLocalStore(store: localStoreType) : storeType {
        return {
            id: store.id,
            name: store.store_name,
            address: store.store_address,
            openDate: store.opening_date,
            scale: store.scale
        }
    }
}