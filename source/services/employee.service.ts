import { SqlClient, Connection, Error } from "msnodesqlv8";
import { DB_CONNECTION_STRING, Queries } from "../constants";
import { employeeType, storeType } from "../entities";
import { ErrorService } from "./error.service";

interface IEmployeeService {
    getAll(): Promise<employeeType[]>;
}

interface localEmployee {
    id: number;
    first_name: string;
    last_name: string;
    position_id: number;
}

export class EmployeeService implements IEmployeeService {
    
    // TODO: will it work same?
    private errorService: ErrorService;
    constructor(errorService: ErrorService) {
        this.errorService = errorService;
    }

    public getAll(): Promise<employeeType[]> {
        return new Promise<employeeType[]>((resolve, reject) => {
            const result: employeeType[] = [];

            // TODO: create logic here
            resolve(result);
            reject();
        })
    }
}