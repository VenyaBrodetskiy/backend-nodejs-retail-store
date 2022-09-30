import { Quaries } from "../constants";
import { entityWithId, jwtUserData, systemError } from "../entities";
import { SqlHelper } from "../helpers/sql.helper";
import { ErrorService } from "./error.service";
import bcrypt from 'bcryptjs';
import { AppError, Role } from "../enums";

interface localUser extends entityWithId{
    password: string;
    role_id: Role;
}

interface IAuthenticationService {
    login(login: string, password: string):Promise<jwtUserData>;
}

export class AuthenticationService implements IAuthenticationService {
    
    constructor(private errorService: ErrorService) {
    }

    public login(login: string, password: string):Promise<jwtUserData> {
        return new Promise<jwtUserData>((resolve, reject) => {
            SqlHelper.executeQuerySingleResult<localUser>(this.errorService, Quaries.GetUserByLogin, login)
            .then((user: localUser) => {
                if (bcrypt.compareSync(password, user.password)) {
                    const result: jwtUserData = {
                        userId: user.id,
                        roleId: user.role_id
                    }
                    resolve(result);
                } 
                else {
                    reject(this.errorService.getError(AppError.NoData));
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