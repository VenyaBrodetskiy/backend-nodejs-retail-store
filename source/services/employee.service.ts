import { SqlClient, Connection, Error } from "msnodesqlv8";
import { DB_CONNECTION_STRING, ErrorCodes, ErrorMessages, Quaries } from "../constants";
import { EmployeeType, newStoreType, StoreType } from "../entities";
import { ErrorHelper } from "../helpers/error.helper";

interface IEmployeeService {
    getAllEmployees(): Promise<EmployeeType[]>;
}

interface localEmployee {
    id: number;
    first_name: string;
    last_name: string;
    position_id: number;
}

export class EmployeeService implements IEmployeeService {
    public getAllEmployees(): Promise<EmployeeType[]> {
        return new Promise<EmployeeType[]>((resolve, reject) => {
            const result: EmployeeType[] = [];

            // TODO: create logic here
            resolve(result);
            reject();
        })
    }
}