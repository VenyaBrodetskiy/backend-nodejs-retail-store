import { StoredProcedures } from "../constants";
import { employeeOfStore, employeeType, entityWithId, storeType, systemError } from "../entities";
import { SqlHelper } from "../helpers/sql.helper";
import { ErrorService } from "./error.service";

interface IEmployeeService {
    getAll(storeId: number): Promise<employeeOfStore[]>;
    getOne(id: number): Promise<employeeOfStore[]>;
    update(employee: employeeType, userId: number): Promise<employeeType>;
}

interface localEmployee {
    id: number;
    first_name: string;
    last_name: string;
    position: string;
    store_name: string;
}

// TODO: not to create repeated code for each employee/product/store services, we can create abstract class 
// abstract class with basic functionality and extend it for each services
export class EmployeeService implements IEmployeeService {
    
    // TODO: will it work same?
    private errorService: ErrorService;
    constructor(errorService: ErrorService) {
        this.errorService = errorService;
    }

    public getAll(storeId: number): Promise<employeeOfStore[]> {
        return new Promise<employeeOfStore[]>((resolve, reject) => {
            const result: employeeOfStore[] = [];

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

    public getOne(id: number): Promise<employeeOfStore[]> {
        return new Promise<employeeOfStore[]>((resolve, reject) => {
            const result: employeeOfStore[] = [];

            SqlHelper.executeSpArrayResult<localEmployee>(this.errorService, StoredProcedures.EmployeeById, id)
            .then((queryResult: localEmployee[]) => {
                queryResult.forEach((employee: localEmployee) => {
                    result.push(this.parseLocalEmployee(employee))
                });
                resolve(result);
            })
            .catch((error: systemError) => reject(error))
        })
        
    }

    public update(employee: employeeType, userId: number): Promise<employeeType> {
        return new Promise<employeeType>((resolve, reject) => {
            SqlHelper.executeSpNoResult(
                this.errorService,
                StoredProcedures.UpdateEmployee, false, 
                employee.id, 
                employee.firstName,
                employee.lastName,
                employee.position,
                userId
                )
            .then(() => {
                resolve(employee);
            })
            .catch((error: systemError) => reject(error));
        });
    }

    public add(employee: employeeOfStore, userId: number): Promise<employeeOfStore> {
        return new Promise<employeeOfStore>((resolve, reject) => {

            SqlHelper.executeSpCreateNew(
                this.errorService, 
                StoredProcedures.CreateEmployee, employee,
                employee.firstName, employee.lastName,
                employee.position, employee.storeName,
                userId
            )
            .then((result: entityWithId) => {
                resolve(result as employeeOfStore);
            })
            .catch((error: systemError) => reject(error));
        });
    }

    public del(id: number, userId: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const updateDate: Date = new Date();

            SqlHelper.executeSpNoResult(
                this.errorService, 
                StoredProcedures.DeleteEmployee, true,
                id, userId)
            .then(() => {
                resolve();
            })
            .catch((error: systemError) => reject(error));
        })
    }

    private parseLocalEmployee(employee: localEmployee): employeeOfStore {
        return {
            id: employee.id,
            firstName: employee.first_name,
            lastName: employee.last_name,
            position: employee.position,
            storeName: employee.store_name
        }
    }
}