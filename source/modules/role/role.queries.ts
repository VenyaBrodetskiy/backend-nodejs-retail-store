export class RoleQueries {
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
}