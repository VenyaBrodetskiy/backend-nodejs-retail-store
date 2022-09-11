import { SqlClient, Connection, Error } from "msnodesqlv8";
import { DB_CONNECTION_STRING, ErrorCodes, ErrorMessages, Quaries } from "../constants";
import { newStoreType, StoreType } from "../entities";
import { ErrorHelper } from "../helpers/error.helper";

interface IStoreService {
    getAllStores(): Promise<StoreType[]>;
    getStoreById(id: number): Promise<StoreType>; 
    addNewStore(store: StoreType): Promise<number>;
}

interface localStoreType {
    id: number;
    store_name: string;
    store_address: string;
    opening_date: Date;
    scale: string;
}

export class StoreService implements IStoreService {

    public getAllStores(): Promise<StoreType[]> {
        return new Promise<StoreType[]>((resolve, reject) => {
            const sql: SqlClient = require("msnodesqlv8");
            const connectionString: string = DB_CONNECTION_STRING;
            const result: StoreType[] = [];          
            
            sql.open(connectionString,  (connectionError: Error, connection: Connection) => {
                if (connectionError) {
                    reject(ErrorHelper.parseError(ErrorCodes.QueryError, ErrorMessages.DBConnectionError));
                } 
                else {
                    
                    connection.query(Quaries.allStores, (queryError: Error | undefined, queryResult: localStoreType[] | undefined) => {
                        if (queryError) {
                            reject(ErrorHelper.parseError(ErrorCodes.QueryError, ErrorMessages.SQLQueryError));
                        }
                        else {
                            if (queryResult !== undefined) {
                                queryResult.forEach(
                                    (store: localStoreType) => {
                                        result.push(this.parseLocalStore(store))
                                    });
                            }
                            
                            //console.log(result);
                            resolve(result);
                        }   
                    })
                }
            });
        });
    }

    public getStoreById(id: number): Promise<StoreType> {
        return new Promise<StoreType>((resolve, reject) => {
            const sql: SqlClient = require("msnodesqlv8");
            const connectionString: string = DB_CONNECTION_STRING;
            let result: StoreType;     

            sql.open(connectionString, (connectionError: Error, connection: Connection) => {
                if (connectionError) {
                    reject(ErrorHelper.parseError(ErrorCodes.ConnectionError, ErrorMessages.DBConnectionError));
                }
                else {

                    connection.query(`${Quaries.storeById} ${id}`, (queryError: Error | undefined, queryResult: localStoreType[] | undefined) => {
                        if (queryError) {
                            reject(ErrorHelper.parseError(ErrorCodes.QueryError, ErrorMessages.SQLQueryError));
                        }
                        else {

                            if (queryResult !== undefined && queryResult.length === 1) {
                                result = this.parseLocalStore(queryResult[0]);
                            }
                            else if (queryResult !== undefined && queryResult.length === 0) {
                                // TODO: Not found error
                            }
                            
                            resolve(result);
                        }
                    })
                }
            })

        })
        
    }

    public addNewStore(store: newStoreType): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            const sql: SqlClient = require("msnodesqlv8");
            const connectionString: string = DB_CONNECTION_STRING;
            let result_id: number;

            sql.open(connectionString,  (connectionError: Error, connection: Connection) => {
                if (connectionError) {
                    reject(ErrorHelper.parseError(ErrorCodes.QueryError, ErrorMessages.DBConnectionError));
                } 
                else {
                    const quareAddStore: string = Quaries.addNewStore + this.parseStoreToDb(store);
                    connection.query(quareAddStore, (queryError: Error | undefined, queryResult: number[] | undefined) => {
                        if (queryError) {
                            reject(ErrorHelper.parseError(ErrorCodes.QueryError, ErrorMessages.SQLQueryError));
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