export class ErrorCodes {
    public static ConnectionError: number = 100;
    public static QueryError: number = 101;

}

export class ErrorMessages {
    public static DBConnectionError: string = "DB server connection error";
    public static SQLQueryError: string = "Incorrect query";
}

export class Quaries {
    public static allStores: string = "SELECT * FROM stores";
    public static storeById: string = "SELECT * FROM stores WHERE id = ";
}

export const DB_CONNECTION_STRING: string = "server=.;Database=retail_store;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";