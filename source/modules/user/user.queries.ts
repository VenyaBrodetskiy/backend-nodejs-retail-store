export class UserQueries {
    // Queries for User management
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
}