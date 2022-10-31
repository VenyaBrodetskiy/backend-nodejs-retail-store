export class SqlParameters {
    public static Id: string = "id";
}
export class Queries {
    public static SelectIdentity: string = "SELECT SCOPE_IDENTITY() AS id";

    // Queries helpers
    public static GetUserByLogin: string = `
        SELECT [user].id, password, role_id
        FROM [user] 
        INNER JOIN user_to_role AS ur ON [user].id = ur.user_id
        INNER JOIN role ON ur.role_id = role.id
        WHERE login = ? AND [user].status_id = ? AND ur.status_id = ?`;
    public static GetUserNameById: string = `SELECT first_name, last_name FROM [user] WHERE id = ?`;
    public static GetStoresByUserName: string = `
        SELECT store_id
        FROM employee_to_store AS e_s
        INNER JOIN employees AS e ON e.id = e_s.employee_id 
        WHERE e.first_name = ? AND e.last_name = ? AND e.status_id = ? AND e_s.status_id = ?`
    public static GetStoresOfEmployee: string = `
        SELECT store_id
        FROM employee_to_store AS e_s
        INNER JOIN employees AS e ON e.id = e_s.employee_id 
        WHERE e.id = ? AND e.status_id = ? AND e_s.status_id = ?`;
    public static GetCreatedUserOfStore: string = 'SELECT create_user_id FROM stores WHERE id = ? AND status_id = ?';
    public static GetCreatedUserOfEmployee: string = 'SELECT create_user_id FROM employees WHERE id = ? AND status_id = ?';
}

export const NON_EXISTING_ID: number = -1;
export const TEMP_USER_ID: number = 1;
