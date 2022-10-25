import { StoredProcedures } from "./employee.queries";
import { employeeOfStore, employeeType, entityWithId, systemError } from "../../common/entities";
import { SqlHelper } from "../../core/helpers/sql.helper";

interface IEmployeeService {
    getAllByStoreId(storeId: number): Promise<employeeOfStore[]>;
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
class EmployeeService implements IEmployeeService {
    
    constructor() {
    }

    public getAll(): Promise<employeeOfStore[]> {
        return new Promise<employeeOfStore[]>((resolve, reject) => {
            const result: employeeOfStore[] = [];

            SqlHelper.executeSpArrayResult<localEmployee>(StoredProcedures.AllEmployees)
            .then((queryResult: localEmployee[]) => {
                queryResult.forEach((localEmployee: localEmployee) => {
                    result.push(this.parseLocalEmployee(localEmployee));
                });
                resolve(result);
            })
            .catch((error: systemError) => reject(error));
        })
    }

    public getAllByStoreId(storeId: number): Promise<employeeOfStore[]> {
        return new Promise<employeeOfStore[]>((resolve, reject) => {
            const result: employeeOfStore[] = [];

            SqlHelper.executeSpArrayResult<localEmployee>(StoredProcedures.AllEmployeesByStore, storeId)
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

            SqlHelper.executeSpArrayResult<localEmployee>(StoredProcedures.EmployeeById, id)
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

export default new EmployeeService();