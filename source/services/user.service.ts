import { Queries } from '../constants';
import { entityWithId, RoleType, systemError, user } from '../entities';
import { SqlHelper } from '../helpers/sql.helper';
import _ from 'underscore';
import { Role, Statuses } from '../enums';
import { DateHelper } from '../helpers/date.helpers';
import { ErrorService } from './error.service';

interface IUserService {
    updateById(user: user, userId: number): Promise<user>;
    add(user: user, userId: number): Promise<user>;
    deleteById(id: number, userId: number): Promise<void>;
}
export class UserService implements IUserService {
    
    constructor(private errorService: ErrorService) {

    }

    // this is same as
    // constructor(errorService: ErrorService) {
    //    this.errorService = ErrorService
    // }

    public updateById(user: user, userId: number): Promise<user> {
        return new Promise<user>((resolve, reject) => {
            const updateDate: string = DateHelper.dateToString(new Date());

            const [AddRolesExtended, roleParams] = this.prepareQueryToAddRoles(user, updateDate, userId);
            Promise.all([
                SqlHelper.executeQueryNoResult(
                    this.errorService,
                    Queries.DeleteRolesOfUser, true,
                    updateDate, userId,
                    Statuses.NotActive,
                    user.id, Statuses.Active),
                SqlHelper.executeQueryNoResult(
                    this.errorService, 
                    AddRolesExtended as string, false, 
                    ...roleParams, 
                    ),
                SqlHelper.executeQueryNoResult(
                    this.errorService, 
                    Queries.UpdateUserById, false, 
                    user.firstName, user.lastName, 
                    updateDate, userId, 
                    user.id, Statuses.Active)
            ])
            .then(() => {
                resolve(user);
            })
            .catch((error: systemError) => reject(error));
        });
    }

    public add(user: user, userId: number): Promise<user> {
        return new Promise<user>((resolve, reject) => {
            const createDate: string = DateHelper.dateToString(new Date());
            
            SqlHelper.createNew(
                this.errorService, 
                Queries.AddUser, user, 
                user.firstName, user.lastName, 
                user.login as string, user.password as string,  
                createDate, createDate, 
                userId, userId, 
                Statuses.Active)
            .then((result: entityWithId) => {
                
                const [AddRolesExtended, roleParams] = this.prepareQueryToAddRoles(result as user, createDate, userId);

                SqlHelper.executeQueryNoResult(
                    this.errorService, 
                    AddRolesExtended as string, false, 
                    ...roleParams, 
                    createDate, createDate, 
                    userId, userId, 
                    Statuses.Active)
                return (result as user);

                // TODO: code below was refactored to send just 1 request instead of many
                // TODO: ask Ilya. I can't make correct error handling here due to loop I guess. How can improve? 
                // probably in future will need to use Promises inside loops..    
                /* 
                for (const role of roles) {                   
                    SqlHelper.executeQueryNoResult(
                        this.errorService, 
                        Queries.AddRolesToUser, false, 
                        result.id, Role[role as RoleType], 
                        createDate, createDate, 
                        userId, userId, 
                        Statuses.Active)
                    .catch((error: systemError) => reject(error)) // it seems i will never get here. why??
                }
                resolve(result as user);
                 */         
            })
            .then((result: user) => {
                resolve(result);
            })
            .catch((error: systemError) => reject(error));
        });
    }

    public deleteById(id: number, userId: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const updateDate: string = DateHelper.dateToString(new Date());

            // TODO: revise this const temp user to passed from request (by auth)
            Promise.all([
                SqlHelper.executeQueryNoResult(
                    this.errorService, 
                    Queries.DeleteUserById, true, 
                    updateDate, userId, 
                    Statuses.NotActive, 
                    id, Statuses.Active),
                SqlHelper.executeQueryNoResult(
                    this.errorService,
                    Queries.DeleteRolesOfUser, true,
                    updateDate, userId,
                    Statuses.NotActive,
                    id, Statuses.Active
                )
            ])
            .then(() => {
                resolve();
            })
            .catch((error: systemError) => reject(error));

            
        });
    }

    private prepareQueryToAddRoles(user: user, createDate: string, userId: number): (string | (string | number)[])[] {
        
        const roles: string[] = user.roles;
        const params: (string | number)[] = [
            user.id, Role[(roles[0] as RoleType)], 
            createDate, createDate,
            userId, userId, Statuses.Active];
        let AddRolesExtended: string = Queries.AddRolesToUser;

        for (let index = 1; index < roles.length; index++) {
            params.push(
                user.id, Role[(roles[index] as RoleType)], 
                createDate, createDate,
                userId, userId, Statuses.Active);
            AddRolesExtended += ', (?, ?, ?, ?, ?, ?, ?)'
        }

        return [AddRolesExtended, params];
    }
}
