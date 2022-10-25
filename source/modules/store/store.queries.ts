
export class StoreQueries {
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
}