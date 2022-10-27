import { entityWithId, RoleType, systemError, user } from '../../common/entities';
import { SqlHelper } from '../../core/helpers/sql.helper';
import _ from 'underscore';
import { Role, Statuses } from '../../common/enums';
import { DateHelper } from '../../framework/date.helpers';
import { UserQueries } from './user.queries';

interface localUser {
    id: number;
    first_name: string;
    last_name: string;
    login: string;
    role_name: string | string[];
}
interface IUserService {
    getAll(): Promise<user[]>;
    updateById(user: user, userId: number): Promise<user>;
    add(user: user, userId: number): Promise<user>;
    deleteById(id: number, userId: number): Promise<void>;
}
class UserService implements IUserService {
    
    constructor() {

    }

    public getAll(): Promise<user[]> {
        return new Promise<user[]>((resolve, reject) => {
            const result: user[] = [];          
            
            SqlHelper.executeQueryArrayResult<localUser>(UserQueries.GetAll, Statuses.Active, Statuses.Active, Statuses.Active)
            .then((queryResult: localUser[]) => {
                queryResult.reduce((prevUser: localUser, currUser: localUser, index: number) => {
                    if (prevUser.id === currUser.id) {
                        if (typeof prevUser.role_name == 'string') prevUser.role_name = [prevUser.role_name as string];
                        prevUser.role_name.push(currUser.role_name as string);
                        if (index === queryResult.length - 1) result.push(this.parseUser(prevUser));
                        return prevUser;
                    }
                    else {
                        result.push(this.parseUser(prevUser));
                        if (index === queryResult.length - 1) result.push(this.parseUser(currUser));
                        return currUser;
                    }
                });
                resolve(result);
            })
            .catch((error: systemError) => reject(error));
        });
    }

    public updateById(user: user, userId: number): Promise<user> {
        return new Promise<user>((resolve, reject) => {
            const updateDate: string = DateHelper.dateToString(new Date());

            const [AddRolesExtended, roleParams] = this.prepareQueryToAddRoles(user, updateDate, userId);
            Promise.all([
                // delete old roles of user (table: user_to_role)
                SqlHelper.executeQueryNoResult(
                    UserQueries.DeleteRolesOfUser, true,
                    updateDate, userId,
                    Statuses.NotActive,
                    user.id, Statuses.Active),
                // updates other user property except roles (table: user)
                SqlHelper.executeQueryNoResult(
                    UserQueries.UpdateUserById, false, 
                    user.firstName, user.lastName, 
                    updateDate, userId, 
                    user.id, Statuses.Active)
            ])
            .then(() => {
                // adds new roles to user (table: user_to_role)
                return SqlHelper.executeQueryNoResult(
                    AddRolesExtended as string, false, 
                    ...roleParams, 
                    );
            })
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
                UserQueries.AddUser, user, 
                user.firstName, user.lastName, 
                user.login as string, user.password as string,  
                createDate, createDate, 
                userId, userId, 
                Statuses.Active)
            .then((result: entityWithId) => {
                
                const [AddRolesExtended, roleParams] = this.prepareQueryToAddRoles(result as user, createDate, userId);

                return SqlHelper.executeQueryNoResult(
                    AddRolesExtended as string, false, 
                    ...roleParams, 
                    createDate, createDate, 
                    userId, userId, 
                    Statuses.Active), (result as user);

                // code below was refactored to send just 1 request instead of many (not to fight witrh asyncs in a loop)
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
                    UserQueries.DeleteUserById, true, 
                    updateDate, userId, 
                    Statuses.NotActive, 
                    id, Statuses.Active),
                SqlHelper.executeQueryNoResult(
                    UserQueries.DeleteRolesOfUser, true,
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

    private parseUser(localUser: localUser): user {
        if (typeof localUser.role_name === 'string') localUser.role_name = [localUser.role_name];
        return {
            id: localUser.id,
            firstName: localUser.first_name,
            lastName: localUser.last_name,
            login: localUser.login,
            roles: localUser.role_name
        }
    }

    private prepareQueryToAddRoles(user: user, createDate: string, userId: number): (string | (string | number)[])[] {
        
        const roles: string[] = user.roles;
        const params: (string | number)[] = [
            user.id, Role[(roles[0] as RoleType)], 
            createDate, createDate,
            userId, userId, Statuses.Active];
        let AddRolesExtended: string = UserQueries.AddRolesToUser;

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

export default new UserService();