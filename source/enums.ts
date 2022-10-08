export enum Statuses {
    Active = 1,
    NotActive = 2,
}

// TODO: refactor to use Roles from DB automatically
export enum Role {
    Administrator = 1,
    RegularUser,
    AccessAdministrator,
    NetworkAdministrator,
    StoreManager,
    Cashier
}

export enum AppError {
    General = "General",
    ConnectionError = "ConnectionError",
    QueryError = "QueryError",
    NoData = "NoData",
    NonNumericInput = "NonNumericInput",
    InputParameterNotSupplied = "InputParameterNotSupplied",
    DeletionConflict = "DeletionConflict"
}