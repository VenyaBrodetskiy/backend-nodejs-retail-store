export interface Store {
    id: number;
    name: string;
    address: string;
    openDate: Date;
    scale: string;
}

export interface newStore {
    name: string;
    address: string;
    openDate: Date;
    scale: string;
}
export interface systemError {
    code: number;
    message: string;
}
