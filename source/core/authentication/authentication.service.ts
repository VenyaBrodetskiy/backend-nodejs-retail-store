import bcrypt from 'bcryptjs';
import { Queries } from '../../common/constants';
import { entityWithId, jwtUserData, systemError } from '../../common/entities';
import { AppError, Role, Statuses } from '../../common/enums';
import { SqlHelper } from '../helpers/sql.helper';
import ErrorService from "../../core/error.service";

interface localUser extends entityWithId{
    password: string;
    role_id: Role;
}

interface IAuthenticationService {
    login(login: string, password: string):Promise<jwtUserData>;
}

export class AuthenticationService implements IAuthenticationService {
    
    constructor() {
    }

    public login(login: string, password: string):Promise<jwtUserData> {
        return new Promise<jwtUserData>((resolve, reject) => {
            SqlHelper.executeQueryArrayResult<localUser>(
                Queries.GetUserByLogin, login, 
                Statuses.Active, Statuses.Active)
            .then((user: localUser[]) => {
                if (bcrypt.compareSync(password, user[0].password)) {
                    let roles : number[] = [];
                    // user.forEach(user => roles.push(user.role_id)); // check if is makes same as map
                    roles = user.map(user => user.role_id);
                    const result: jwtUserData = {
                        userId: user[0].id,
                        rolesId: roles
                    }
                    resolve(result);
                } 
                else {
                    reject(ErrorService.getError(AppError.NoData));
                }
            })
            .catch((error: systemError) => {
                reject(error);
            });
        }) 
    }

    // private static createPassword() {
    //     const temp_pass: string = bcrypt.hashSync('password');
    //     console.log(temp_pass);
    //     console.log(bcrypt.compareSync('password', '$2a$10$nk.AB39zLdPrYLhtyP6o7u93Vk7SmGVTYqgMhh8l6YlQjb8xaLU9u'));
    // }
}

export default new AuthenticationService();