import { SqlClient, Connection, Error } from "msnodesqlv8";
import { DB_CONNECTION_STRING, ErrorCodes, ErrorMessages, Quaries } from "../constants";
import { Store } from "../entities";
import { ErrorHelper } from "../helpers/error.helper";

interface IStoreService {
    getAllStores(): Promise<Store[]>;
    // TODO: getStoreById(id: number): Promise<Store>; 
}

interface localStore {
    id: number;
    store_name: string;
    store_address: string;
    opening_date: Date;
    scale: string;
}

export class StoreService implements IStoreService {

    public getAllStores(): Promise<Store[]> {
        return new Promise<Store[]>((resolve, reject) => {
            const sql: SqlClient = require("msnodesqlv8");
            const connectionString: string = DB_CONNECTION_STRING;
            const result: Store[] = [];          
            

            // TODO: Ask Ilya: can we make this 10-deep nested function somehow easier or more readable?
            sql.open(connectionString,  (connectionError: Error, connection: Connection) => {
                if (connectionError) {
                    reject(ErrorHelper.parseError(ErrorCodes.QueryError, ErrorMessages.DBConnectionError));
                } 
                else {
                    
                    connection.query(Quaries.allStores, (queryError: Error | undefined, queryResult: localStore[] | undefined) => {
                        if (queryError) {
                            reject(ErrorHelper.parseError(ErrorCodes.QueryError, ErrorMessages.SQLQueryError));
                        }
                        else {
                            if (queryResult !== undefined) {
                                queryResult.forEach(
                                    (store: localStore) => {
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

    // TODO: public getStoreById(id: number): Promise<localStore> {
    //     return new Promise<localStore>
        
    // }

    private parseLocalStore(store: localStore) : Store {
        return {
            id: store.id,
            name: store.store_name,
            address: store.store_address,
            openDate: store.opening_date,
            scale: store.scale
        }
    }
}