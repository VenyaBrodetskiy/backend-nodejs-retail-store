import { Queries } from '../constants';
import { entityWithId, systemError, user } from '../entities';
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
            const updateDate: Date = new Date();
            SqlHelper.executeQueryNoResult(
                this.errorService, 
                Queries.UpdateUserById, false, 
                user.firstName, user.lastName, 
                DateHelper.dateToString(updateDate), userId, 
                user.id, Statuses.Active)
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
                Role.RegularUser, 
                createDate, createDate, 
                userId, userId, 
                Statuses.Active)
            .then((result: entityWithId) => {
                resolve(result as user);
            })
            .catch((error: systemError) => reject(error));
        });
    }

    public deleteById(id: number, userId: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const updateDate: Date = new Date();

            // TODO: revise this const temp user to passed from request (by auth)
            SqlHelper.executeQueryNoResult(
                this.errorService, 
                Queries.DeleteUserById, true, 
                DateHelper.dateToString(updateDate), userId, 
                Statuses.NotActive, 
                id, Statuses.Active)
            .then(() => {
                resolve();
            })
            .catch((error: systemError) => reject(error));
        });
    }

}
