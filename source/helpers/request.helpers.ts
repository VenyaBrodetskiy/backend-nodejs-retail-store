import { NON_EXISTING_ID } from "../constants";
import { RoleType, systemError } from "../entities";
import { AppError, Role } from "../enums";
import { ErrorService } from "../services/error.service";


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
}