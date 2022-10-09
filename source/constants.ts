export class SqlParameters {
    public static Id: string = "id";
}
export class Queries {
    public static SelectIdentity: string = "SELECT SCOPE_IDENTITY() AS id";

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

    // Queries for User management
    public static GetUserByLogin: string = `
        SELECT [user].id, password, role_id
        FROM [user] 
        INNER JOIN user_to_role AS ur ON [user].id = ur.user_id
        INNER JOIN role ON ur.role_id = role.id
        WHERE login = ? AND [user].status_id = ? AND ur.status_id = ?`;
    public static UpdateUserById: string = `
        UPDATE [user] 
        SET first_name = ?, last_name = ?, update_date = ?, update_user_id = ? 
        WHERE id = ? AND status_id = ?`;
    public static AddUser: string = `
        INSERT [user] 
            (first_name, last_name, 
            login, password,  
            create_date, update_date, 
            create_user_id, update_user_id, 
            status_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    public static AddRolesToUser: string = `
        INSERT user_to_role
        (user_id, role_id, 
        create_date, update_date, 
        create_user_id, update_user_id, 
        status_id)
        VALUES
        (?, ?, ?, ?, ?, ?, ?)`;
    public static DeleteUserById: string = `
        UPDATE [user] 
        SET update_date = ?, update_user_id = ?, status_id = ? 
        WHERE id = ? AND status_id = ?`;
    public static DeleteRolesOfUser: string = `
        UPDATE user_to_role
        SET update_date = ?, update_user_id = ?, status_id = ?
        WHERE user_id = ? AND status_id = ?`;

    // Queries for Role Management
    public static GetRoles: string = `
        SELECT id, role_name
        FROM role
        WHERE status_id = ?`;
    public static UpdateRole: string = `
        UPDATE role 
        SET role_name = ?, update_date = ?, update_user_id = ? 
        WHERE id = ? AND status_id = ?`;
    public static AddRole: string = `
        INSERT role 
            (role_name,  
            create_date, update_date, 
            create_user_id, update_user_id, 
            status_id) 
        VALUES (?, ?, ?, ?, ?, ?)`;
    public static DeleteRole: string = `
        UPDATE role
        SET update_date = ?, update_user_id = ?, status_id = ?
        WHERE id = ? AND status_id = ?`;

    // Queries helpers
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
}

export class StoredProcedures {
    // Queries for employee management       
    // Get a list of all employees by store id
    public static AllEmployeesByStore = "sp_get_employees_by_store";
    // Get an employee by id
    public static EmployeeById = "sp_get_employee_by_id";
    // Update employee info by id (including position)
    public static UpdateEmployee = "sp_update_employee";
    // Create new employee and reference the employee to a store(s) (including position)
    public static CreateEmployee = "sp_add_employee";
    // Delete an employee by id
    public static DeleteEmployee = "sp_delete_employee";
    // Add employee relation by id of a manager and id of subordinate
    // Delete employees relation by manager id and subordinate id
    // Get all employees positions
}

export const DB_CONNECTION_STRING: string = "server=.;Database=retail_store;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";
export const NON_EXISTING_ID: number = -1;
export const TEMP_USER_ID: number = 1;
export const TOKEN_SECRET: string = '1382d946-516b-44fa-bb35-4ac3ad5b2c12'; // generated from google with GUID generator https://www.guidgenerator.com/