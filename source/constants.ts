export class ErrorCodes {
    public static ConnectionError: number = 100;
    public static QueryError: number = 101;

}

export class ErrorMessages {
    public static DBConnectionError: string = "DB server connection error";
    public static SQLQueryError: string = "Incorrect query";
}

export class Quaries {
    public static allStores: string = 
        `SELECT stores.id, store_name, store_address, opening_date, scale
        FROM stores
        INNER JOIN store_scale ON store_scale_id = store_scale.id`;
    public static storeById: string = "SELECT * FROM stores WHERE id = ";
    
    public static addNewStore: string = "EXEC sp_add_new_store ";
    // @store_name NVARCHAR(50), @store_address NVARCHAR(50), @opening_date DATETIME, @store_scale NVARCHAR(50)
    
}

export const DB_CONNECTION_STRING: string = "server=.;Database=retail_store;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";