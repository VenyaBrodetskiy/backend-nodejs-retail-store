export interface StoreType {
    id: number;
    name: string;
    address: string;
    openDate: string;
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
    openDate: string;
    scale: string;
}
export interface systemError {
    code: number;
    message: string;
}

export interface sqlParameter {
    name: string;
    type: any;
    value: string | number;
}
