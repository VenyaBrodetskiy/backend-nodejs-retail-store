import { Queries } from "../constants";
import { Role, Statuses } from "../enums";
import { ErrorService } from "../services/error.service";
import { SqlHelper } from "./sql.helper";

interface localUserName {
    first_name: string,
    last_name: string
}

interface localStoreId {
    store_id: number
}

interface localCreateUser {
    create_user_id: number
}

export class AcessHelper {
    /**
     * Store manager allowed to change only it's own store
     * Cashiers allowed to change only 
     */
     public static async isUserHasAccessToStore(errorService: ErrorService, userId: number, userRoles: number[], storeId: number) {
        
        const isUserNetworkAdministrator = userRoles.indexOf(Role.NetworkAdministrator) > -1;
        if (isUserNetworkAdministrator) return true;


        const isUserStoreManager = userRoles.indexOf(Role.StoreManager) > -1;
        if (isUserStoreManager) {
            const storeManagerStores: number[] = await this.getStoreManagerStores(errorService, userId);

            const isChangingOwnStore: boolean = storeManagerStores.indexOf(storeId) > -1;
            
            if (isChangingOwnStore) {
                return true;
            }
            return false;
        }

        const isUserCashier = userRoles.indexOf(Role.Cashier) > -1;
        if (isUserCashier) {
            const createdUser: localCreateUser = await SqlHelper.executeQuerySingleResult(
                errorService, Queries.GetCreatedUserOfStore, storeId, Statuses.Active);
            
            if (createdUser.create_user_id === userId) {
                return true;
            }
            return false;
        }
        return true;
        
    }

    /**
     * Store manager allowed to change employyes of it's own store
     */
    public static async isUserHasAccessToEmployee(errorService: ErrorService, userId: number, userRoles: number[], employeeId: number) {

        const isUserNetworkAdministrator = userRoles.indexOf(Role.NetworkAdministrator) > -1;
        if (isUserNetworkAdministrator) return true;

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
            return false;
        }

        const isUserCashier = userRoles.indexOf(Role.Cashier) > -1;
        if (isUserCashier) {
            const createdUser: localCreateUser = await SqlHelper.executeQuerySingleResult(
                errorService, Queries.GetCreatedUserOfEmployee, employeeId, Statuses.Active);
            
            if (createdUser.create_user_id === userId) {
                return true;
            }
            return false;
        }
        return true;
    
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