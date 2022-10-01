
export class SqlParameters {
    public static Id: string = "id";
}
export class Queries {
    // Queries for Stores management
    public static AllStores: string = 
        `SELECT stores.id, store_name, store_address, opening_date, scale
        FROM stores
        INNER JOIN store_scale ON store_scale_id = store_scale.id
        WHERE status_id = ?`;
    public static StoreById: string = "SELECT * FROM stores WHERE id = ? AND status_id = ?";
    public static StoreByTitle: string = "SELECT * FROM stores WHERE store_name LIKE ?";
    public static UpdateStoreById: string = `
        UPDATE stores 
        SET store_name = ?, 
            store_address = ?, 
            opening_date = ?, 
            store_scale_id = ?, 
            update_date = ?, 
            update_user_id = ? 
        WHERE id = ? AND status_id = ?`;
    public static AddNewStore: string = `
        INSERT stores 
            (store_name, store_address, opening_date, store_scale_id, 
            create_date, update_date,
            create_user_id, update_user_id,
            status_id)
        VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ? )`;
    public static DeleteStore: string = `
        UPDATE stores
        SET update_date = ?,
            update_user_id = ?,
            status_id = ?
        WHERE id = ? AND status_id = ?`;

    public static SelectIdentity: string = "SELECT SCOPE_IDENTITY() AS id";

    // Queries for User management
    public static GetUserByLogin: string = "SELECT id, password, role_id FROM [user] WHERE login = ?";
    public static UpdateUserById: string = `
        UPDATE [user] 
        SET first_name = ?, last_name = ?, update_date = ?, update_user_id = ? 
        WHERE id = ? AND status_id = ?`;
    public static AddUser: string = `
        INSERT [user] 
            (first_name, last_name, 
            login, password, role_id, 
            create_date, update_date, 
            create_user_id, update_user_id, 
            status_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    public static DeleteUserById: string = `
        UPDATE [user] 
        SET update_date = ?, update_user_id = ?, status_id = ? 
        WHERE id = ? AND status_id = ?`;
}

export const DB_CONNECTION_STRING: string = "server=.;Database=retail_store;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";
export const NON_EXISTING_ID: number = -1;
export const TEMP_USER_ID: number = 1;
export const TOKEN_SECRET: string = '1382d946-516b-44fa-bb35-4ac3ad5b2c12'; // generated from google with GUID generator https://www.guidgenerator.com/