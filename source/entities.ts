export interface StoreType {
    id: number;
    name: string;
    address: string;
    openDate: Date;
    scale: string;
}

export interface EmployeeType {
    id: number;
    firstName: string;
    lastName: string;
    position: string;
}

export interface newStoreType {
    name: string;
    address: string;
    openDate: Date;
    scale: string;
}
export interface systemError {
    code: number;
    message: string;
}
