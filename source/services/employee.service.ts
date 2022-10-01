import { SqlClient, Connection, Error } from "msnodesqlv8";
import { DB_CONNECTION_STRING, Queries } from "../constants";
import { employeeType, storeType } from "../entities";

interface IEmployeeService {
    getAllEmployees(): Promise<employeeType[]>;
}

interface localEmployee {
    id: number;
    first_name: string;
    last_name: string;
    position_id: number;
}

export class EmployeeService implements IEmployeeService {
    public getAllEmployees(): Promise<employeeType[]> {
        return new Promise<employeeType[]>((resolve, reject) => {
            const result: employeeType[] = [];

            // TODO: create logic here
            resolve(result);
            reject();
        })
    }
}