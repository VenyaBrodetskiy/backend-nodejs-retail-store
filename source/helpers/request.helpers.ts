import { NON_EXISTING_ID, Queries } from "../constants";
import { RoleType, systemError } from "../entities";
import { AppError, Role, Statuses } from "../enums";
import { ErrorService } from "../services/error.service";
import { SqlHelper } from "./sql.helper";

interface localUserName {
    first_name: string,
    last_name: string
}

interface localStoreId {
    store_id: number
}
export class RequestHelper {
    
    public static parseNumericInput(errorService: ErrorService, input: string): number | systemError {
        let result: number = NON_EXISTING_ID; // declare default value, which obviously cannot work

        if (isNaN(Number(input))) {
            const nonNumericError: systemError = errorService.getError(AppError.NonNumericInput);
            return nonNumericError;
        }
    
        if (input !== null && input !== undefined) {
            result = parseInt(input);
        }
        else {
            const noInputParameterError: systemError = errorService.getError(AppError.InputParameterNotSupplied);
            return noInputParameterError;
        }

        return result;
    }

    /** 
     * Function checks if Roles from request exists in DB-roles-table
     * */  
    public static checkInputRoles(roles: string[]) : boolean {
        for (const role of roles) {
            if (Role[role as RoleType] === undefined) { 
                return false;
            }
        }
        // else
        return true;
    }
    
    /**
     * Store manager allowed to change only it's own store
     */
    public static async isUserHasAccessToStore(errorService: ErrorService, userId: number, userRoles: number[], storeId: number) {
        const isUserStoreManager = userRoles.indexOf(Role.StoreManager) > -1;

        if (isUserStoreManager) {
            const storeManagerStores: number[] = await this.getStoreManagerStores(errorService, userId);

            const isChangingOwnStore: boolean = storeManagerStores.indexOf(storeId) > -1;
            
            if (isChangingOwnStore) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Store manager allowed to change employyes of it's own store
     */
    public static async isUserHasAccessToEmployee(errorService: ErrorService, userId: number, userRoles: number[], employeeId: number) {

        const isUserStoreManager = userRoles.indexOf(Role.StoreManager) > -1;

        if (isUserStoreManager) {
            
            const storeManagerStores: number[] = await this.getStoreManagerStores(errorService, userId);

            const employeeStoresObj: localStoreId[] = await SqlHelper.executeQueryArrayResult(
                errorService, Queries.GetStoresOfEmployee,
                employeeId, Statuses.Active, Statuses.Active);
            const employeeStores: number[] = employeeStoresObj.map((obj) => obj.store_id);

            const intersectionStores: number[] = storeManagerStores.filter(id => employeeStores.includes(id));
            const isChangingOwnEmployee = intersectionStores.length === 0 ? false : true;

            if (isChangingOwnEmployee) {
                return true;
            }
        }
        return false;
    }

    private static async getStoreManagerStores(errorService: ErrorService, userId: number): Promise<number[]> {
        const storeManagerName: localUserName = await SqlHelper.executeQuerySingleResult(
            errorService, Queries.GetUserNameById, userId);

        const smStoresObj: localStoreId[] = await SqlHelper.executeQueryArrayResult(
            errorService, Queries.GetStoresByUserName,
            storeManagerName.first_name, storeManagerName.last_name, Statuses.Active, Statuses.Active);
        const storeManagerStores: number[] = smStoresObj.map((obj) => obj.store_id); 
        
        return storeManagerStores;
    }
}