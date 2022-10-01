import { SqlClient, Connection, Error } from "msnodesqlv8";
import { DB_CONNECTION_STRING, Quaries } from "../constants";
import { entityWithId, storeType, systemError } from "../entities";
import { SqlHelper } from "../helpers/sql.helper";
import { Statuses } from '../enums';
import _ from 'underscore';
import { ErrorService } from "./error.service";
import { DateHelper } from "../helpers/date.helpers";

interface IStoreService {
    getAllStores(): Promise<storeType[]>;
    getStoreById(id: number): Promise<storeType>; 
    getStoreByTitle(title: string): Promise<storeType[]>;
    updateStoreById(store: storeType, userId: number): Promise<storeType>;
    addNewStore(store: storeType, userId: number): Promise<storeType>;
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
            
            SqlHelper.executeQueryArrayResult<localStoreType>(this.errorService, Quaries.allStores, Statuses.Active)
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
            
            SqlHelper.executeQuerySingleResult<localStoreType>(this.errorService, Quaries.StoreById, id)
            .then((queryResult: localStoreType) => {
                resolve(this.parseLocalStore(queryResult))
            })
            .catch((error: systemError) => reject(error));
        });
    }

    public getStoreByTitle(title: string): Promise<storeType[]> {
        return new Promise<storeType[]>((resolve, reject) => {
            SqlHelper.executeQueryArrayResult<localStoreType>(this.errorService, Quaries.StoreByTitle, `%${title}%`)
                .then((queryResult: localStoreType[]) => {
                    resolve(_.map(queryResult, (result: localStoreType) => this.parseLocalStore(result)));
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    // TODO: add update of STORE RANGE also
    // TODO: ask Ilya how to update connected tables..
    public updateStoreById(store: storeType, userId: number): Promise<storeType> {
        return new Promise<storeType>((resolve, reject) => {
            const updateDate: Date = new Date();
            SqlHelper.executeQueryNoResult(
                this.errorService,
                Quaries.UpdateStoreById, false, 
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

    // TODO: ask Ilya how to add smth to DB if has connected columns
    public addNewStore(store: storeType, userId: number): Promise<storeType> {
        return new Promise<storeType>((resolve, reject) => {

            const createDate: string = DateHelper.dateToString(new Date());

            SqlHelper.createNew(
                this.errorService, 
                Quaries.AddNewStore + this.parseStoreToDb(store), 
                store)
            .then((result: entityWithId) => {
                resolve(result as storeType);
            })
            .catch((error: systemError) => reject(error));
        });
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

    private parseStoreToDb(store: storeType) : string {
        // @store_name NVARCHAR(50), @store_address NVARCHAR(50), @opening_date DATETIME, @store_scale NVARCHAR(50)
        return `'${store.name}', '${store.address}', '${store.openDate}', '${store.scale}'`;
    }
}