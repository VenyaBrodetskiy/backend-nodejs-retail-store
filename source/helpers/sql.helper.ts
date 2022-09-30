import { Connection, SqlClient, Error, Query } from "msnodesqlv8";
import { DB_CONNECTION_STRING, Quaries } from "../constants";
import { systemError, entityWithId } from "../entities";
import { ErrorService } from "../services/error.service";
import { AppError } from "../enums";

export class SqlHelper {
    static sql: SqlClient = require("msnodesqlv8");

    public static executeQueryArrayResult<T>(errorService: ErrorService, query: string, ...params: (string | number)[]): Promise<T[]> {
        return new Promise<T[]>((resolve, reject) => {

            SqlHelper.openConnection(errorService)
                .then((connection: Connection) => {
                    connection.query(query, params, (queryError: Error | undefined, queryResult: T[] | undefined) => {
                        if (queryError) {
                            reject(errorService.getError(AppError.QueryError));
                        }
                        else {
                            if (queryResult !== undefined) {
                                resolve(queryResult);
                            }
                            else {
                                resolve([]);
                            }
                        }
                    })
                })
                .catch((error: systemError) => reject(error));
        })
    }

    public static executeQuerySingleResult<T>(errorService: ErrorService, query: string, ...params: (string | number )[]): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            SqlHelper.openConnection(errorService)
                .then((connection: Connection) => {

                    connection.query(query, params, (queryError: Error | undefined, queryResult: T[] | undefined) => {
                        if (queryError) {
                            reject(errorService.getError(AppError.QueryError));
                        }
                        else {
                            const notFoundError: systemError = errorService.getError(AppError.NoData);
                            if (queryResult !== undefined) {
                                switch (queryResult.length) {
                                    case 0:
                                        reject(notFoundError);
                                        break;
                                    case 1:
                                        resolve(queryResult[0]);
                                        break;
                                    default: // In case more than a single result is returned
                                        resolve(queryResult[0]);
                                        break;
                                }
                            }
                            else {
                                reject(notFoundError);
                            }
                        }
                    })

                })
                .catch((error:systemError) => reject(error));
            
        })
    }

    public static executeQueryNoResult(errorService: ErrorService, query: string, ignoreNoRowsAffected: boolean, ...params: (string | number )[]): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            SqlHelper.openConnection(errorService)
                .then((connection: Connection) => {

                    const q: Query = connection.query(query, params, (queryError: Error | undefined) => {
                        if (queryError) {
                            switch (queryError.code) {
                                case 547: // specific number of error which this package shows in case there is a conflict in DB
                                    reject(errorService.getError(AppError.DeletionConflict));
                                    break;
                                default:
                                    reject(errorService.getError(AppError.QueryError));
                            }
                            
                        }; 
                    })

                    q.on('rowcount', (rowCount: number) => {
                        if (!ignoreNoRowsAffected && (rowCount === 0)) {
                            reject(errorService.getError(AppError.NoData));
                            return;
                        }

                        resolve();
                    })

                })
                .catch((error:systemError) => reject(error));
            
        })
    }

    public static createNew(
        errorService: ErrorService, 
        query: string, 
        original: entityWithId, 
        ...params: (string | number )[]
        ): Promise<entityWithId> {

        return new Promise<entityWithId>((resolve, reject) => {
            SqlHelper.openConnection(errorService)
                .then((connection: Connection) => {
                    const quaries: string[] = [query, Quaries.SelectIdentity];
                    const executedQuery: string = quaries.join(';');
                    let executionCounter: number = 0;
                    connection.query(executedQuery, params, (queryError: Error | undefined, queryResult: entityWithId[] | undefined) => {
                        if (queryError) {
                            reject(errorService.getError(AppError.QueryError));
                        }
                        else {
                            executionCounter++;
                            const badQueryError: systemError = errorService.getError(AppError.QueryError);
                            
                            if (executionCounter === quaries.length) {
                                if (queryResult !== undefined) {
                                    if (queryResult.length === 1) {
                                        original.id = queryResult[0].id;
                                        resolve(original);
                                    }
                                    else {
                                        reject(badQueryError);
                                    }
                                }
                                else {
                                    reject(badQueryError);
                                }
                            }
                        }
                    })

                })
                .catch((error:systemError) => reject(error));
            
        })
    }

    private static openConnection(errorService: ErrorService,): Promise<Connection> {
        return new Promise<Connection>((resolve, reject) => {
            SqlHelper.sql.open(DB_CONNECTION_STRING,  (connectionError: Error, connection: Connection) => {
                if (connectionError) {
                    reject(errorService.getError(AppError.ConnectionError));
                } 
                else {
                    resolve(connection);
                }
            });
        });
    }
}