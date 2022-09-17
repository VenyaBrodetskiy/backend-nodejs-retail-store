import { SqlClient, Connection, Error } from "msnodesqlv8";
import { DB_CONNECTION_STRING, ErrorCodes, ErrorMessages, Quaries } from "../constants";
import { newStoreType, StoreType, systemError } from "../entities";
import { ErrorHelper } from "../helpers/error.helper";
import { SqlHelper } from "../helpers/sql.helper";
import { Statuses } from '../enum';
import _ from 'underscore';

interface IStoreService {
    getAllStores(): Promise<StoreType[]>;
    getStoreById(id: number): Promise<StoreType>; 
    getStoreByTitle(title: string): Promise<StoreType[]>;
    updateStoreById(store: StoreType): Promise<StoreType>;
    addNewStore(store: StoreType): Promise<number>;
}

interface localStoreType {
    id: number;
    store_name: string;
    store_address: string;
    opening_date: string;
    scale: string;
}

export class StoreService implements IStoreService {

    public getAllStores(): Promise<StoreType[]> {
        return new Promise<StoreType[]>((resolve, reject) => {
            const result: StoreType[] = [];          
            
            SqlHelper.executeQueryArrayResult<localStoreType>(Quaries.allStores, Statuses.Active)
            .then((queryResult: localStoreType[]) => {
                queryResult.forEach((store: localStoreType) => {
                    result.push(this.parseLocalStore(store))
                });
                resolve(result);
            })
            .catch((error: systemError) => reject(error));
        });
    }

    public getStoreById(id: number): Promise<StoreType> {
        return new Promise<StoreType>((resolve, reject) => {    
            
            SqlHelper.executeQuerySingleResult<localStoreType>(Quaries.StoreById, id)
            .then((queryResult: localStoreType) => {
                resolve(this.parseLocalStore(queryResult))
            })
            .catch((error: systemError) => reject(error));
        });
    }

    public getStoreByTitle(title: string): Promise<StoreType[]> {
        return new Promise<StoreType[]>((resolve, reject) => {
            SqlHelper.executeQueryArrayResult<localStoreType>(Quaries.StoreByTitle, `%${title}%`)
                .then((queryResult: localStoreType[]) => {
                    resolve(_.map(queryResult, (result: localStoreType) => this.parseLocalStore(result)));
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public updateStoreById(store: StoreType): Promise<StoreType> {
        return new Promise<StoreType>((resolve, reject) => {
            SqlHelper.executeQueryNoResult(
                Quaries.UpdateStoreById, false, 
                `${store.name}`, 
                `${store.address}`, 
                `${store.openDate}`, 
                `${store.id}`)
            .then(() => {
                resolve(store);
            })
            .catch((error: systemError) => reject(error));
        });
    }

    // TODO: refactor acording to Ilya
    public addNewStore(store: newStoreType): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            const sql: SqlClient = require("msnodesqlv8");
            const connectionString: string = DB_CONNECTION_STRING;
            let result_id: number;

            sql.open(connectionString,  (connectionError: Error, connection: Connection) => {
                if (connectionError) {
                    reject(ErrorHelper.createError(ErrorCodes.QueryError, ErrorMessages.DBConnectionError));
                } 
                else {
                    const quareAddStore: string = Quaries.AddNewStore + this.parseStoreToDb(store);
                    connection.query(quareAddStore, (queryError: Error | undefined, queryResult: number[] | undefined) => {
                        if (queryError) {
                            reject(ErrorHelper.createError(ErrorCodes.QueryError, ErrorMessages.SQLQueryError));
                        }
                        else {
                            if (queryResult !== undefined && queryResult.length === 1) {
                                result_id = queryResult[0];
                            }
                            else if (queryResult !== undefined && queryResult.length === 0) {
                                // TODO: Not found error
                            }
                            
                            resolve(result_id);
                            
                        }   
                    })
                }
            });
        });
    }

    private parseLocalStore(store: localStoreType) : StoreType {
        return {
            id: store.id,
            name: store.store_name,
            address: store.store_address,
            openDate: store.opening_date,
            scale: store.scale
        }
    }

    private parseStoreToDb(store: newStoreType) : string {
        // @store_name NVARCHAR(50), @store_address NVARCHAR(50), @opening_date DATETIME, @store_scale NVARCHAR(50)
        return `'${store.name}', '${store.address}', '${store.openDate}', '${store.scale}'`;
    }
}