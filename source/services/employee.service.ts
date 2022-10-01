import { SqlClient, Connection, Error } from "msnodesqlv8";
import { DB_CONNECTION_STRING, Queries, StoredProcedures } from "../constants";
import { employeeType, storeType, systemError } from "../entities";
import { SqlHelper } from "../helpers/sql.helper";
import { ErrorService } from "./error.service";

interface IEmployeeService {
    getAll(storeId: number): Promise<employeeType[]>;
}

interface localEmployee {
    id: number;
    first_name: string;
    last_name: string;
    position: string;
    store_name: string;
}

export class EmployeeService implements IEmployeeService {
    
    // TODO: will it work same?
    private errorService: ErrorService;
    constructor(errorService: ErrorService) {
        this.errorService = errorService;
    }

    public getAll(storeId: number): Promise<employeeType[]> {
        return new Promise<employeeType[]>((resolve, reject) => {
            const result: employeeType[] = [];

            SqlHelper.executeSpArrayResult<localEmployee>(this.errorService, StoredProcedures.AllEmployeesByStore, storeId)
            .then((queryResult: localEmployee[]) => {
                queryResult.forEach((employee: localEmployee) => {
                    result.push(this.parseLocalEmployee(employee))
                });
                resolve(result);
            })
            .catch((error: systemError) => reject(error))
        })
        
    }

    private parseLocalEmployee(employee: localEmployee): employeeType {
        return {
            id: employee.id,
            firstName: employee.first_name,
            lastName: employee.last_name,
            position: employee.position,
            storeName: employee.store_name
        }
    }
}