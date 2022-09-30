
export class SqlParameters {
    public static Id: string = "id";
}
export class Quaries {
    public static allStores: string = 
        `SELECT stores.id, store_name, store_address, opening_date, scale
        FROM stores
        INNER JOIN store_scale ON store_scale_id = store_scale.id`;
    public static StoreById: string = "SELECT * FROM stores WHERE id = ?";
    public static StoreByTitle: string = "SELECT * FROM stores WHERE store_name LIKE ?";

    // TODO: ask Ilya how to update scale (it's in other table)
    // TODO: need to add possibility to change scale of store also
    public static UpdateStoreById: string = "UPDATE stores SET store_name = ?, store_address = ?, opening_date = ? WHERE id = ?";
    public static AddNewStore: string = "EXEC sp_add_new_store ";
    // @store_name NVARCHAR(50), @store_address NVARCHAR(50), @opening_date DATETIME, @store_scale NVARCHAR(50)

    public static SelectIdentity: string = "SELECT SCOPE_IDENTITY() AS id";
   
    
    
    // public static AddWhiteBoardType: string = "INSERT white_board_type (white_board_type) VALUES (?)";
    // public static DeleteWhiteBoardTypeById: string = "UPDATE white_board_type SET update_date = ?, update_user = ?, status_id = ? WHERE id = ? AND status_id = ?";
}

export const DB_CONNECTION_STRING: string = "server=.;Database=retail_store;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";
export const NON_EXISTING_ID: number = -1;
export const TEMP_USER_ID: number = 1;

