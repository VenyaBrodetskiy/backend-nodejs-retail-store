export class StoredProcedures {
    // Get a list of all employees of all stores (sorted by positions)
    public static AllEmployees = "sp_get_all_employees";
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
    // not implemented..
    // Delete employees relation by manager id and subordinate id
    // not implemented..
}