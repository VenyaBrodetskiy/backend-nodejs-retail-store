import { entityWithId, roleType, systemError } from "../../common/entities";
import { SqlHelper } from "../../core/helpers/sql.helper";
import { Statuses } from '../../common/enums';
import _ from 'underscore';
import { DateHelper } from "../../framework/date.helpers";
import { RoleQueries } from "./role.queries";

interface IRoleService {
    getAll(): Promise<roleType[]>;
    updateById(role: roleType, userId: number): Promise<roleType>;
    add(role: roleType, userId: number): Promise<roleType>;
    deleteById(id: number, userId: number): Promise<void>
}

interface localRoleType {
    id: number;
    role_name: string;
}

class RoleService implements IRoleService {

    constructor() {
    }

    public getAll(): Promise<roleType[]> {
        return new Promise<roleType[]>((resolve, reject) => {
            const result: roleType[] = [];          
            
            SqlHelper.executeQueryArrayResult<localRoleType>(RoleQueries.GetRoles, Statuses.Active)
            .then((queryResult: localRoleType[]) => {
                queryResult.forEach((role: localRoleType) => {
                    result.push(this.parseLocalrole(role))
                });
                resolve(result);
            })
            .catch((error: systemError) => reject(error));
        });
    }

    public updateById(role: roleType, userId: number): Promise<roleType> {
        return new Promise<roleType>((resolve, reject) => {
            const updateDate: string = DateHelper.dateToString(new Date());
            SqlHelper.executeQueryNoResult(
                RoleQueries.UpdateRole, false, 
                role.roleName, 
                updateDate,
                userId,
                role.id,
                Statuses.Active
                )
            .then(() => {
                resolve(role);
            })
            .catch((error: systemError) => reject(error));
        });
    }

    public add(role: roleType, userId: number): Promise<roleType> {
        return new Promise<roleType>((resolve, reject) => {

            const createDate: string = DateHelper.dateToString(new Date());

            SqlHelper.createNew(
                RoleQueries.AddRole, role,
                role.roleName,
                createDate, createDate,
                userId, userId,
                Statuses.Active
            )
            .then((result: entityWithId) => {
                resolve(result as roleType);
            })
            .catch((error: systemError) => reject(error));
        });
    }

    public deleteById(id: number, userId: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const updateDate: string = DateHelper.dateToString(new Date());

            SqlHelper.executeQueryNoResult(
                RoleQueries.DeleteRole, true, 
                updateDate, userId, Statuses.NotActive,
                id, Statuses.Active)
            .then(() => {
                resolve();
            })
            .catch((error: systemError) => reject(error));
        })
    }

    private parseLocalrole(role: localRoleType): roleType {
        return {
            id: role.id,
            roleName: role.role_name
        }
    }
}

export default new RoleService();