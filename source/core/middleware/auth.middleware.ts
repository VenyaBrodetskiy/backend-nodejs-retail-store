import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { Role } from "../../common/enums";
import { AuthenticatedRequest, jwtUserData } from "../../common/entities";
import { Environment } from "../helpers/env.helper";

interface jwtBase {
    userData: jwtUserData;
    exp: number;
    iat: number;
}

class AuthMiddleware {
    
    public verifyToken = (roles: Role[]) => (req: Request, res: Response, next: NextFunction) => {
        let token: string | undefined = req.headers["authorization"]?.toString(); 
    
        if (!token) {
            return res.status(403).send("A token is required for authentication");
        }
    
        try {
            token = token.substring("Bearer ".length);
            const decoded: string | JwtPayload = jwt.verify(token, Environment.TOKEN_SECRET);
            const intersectionRoles: number[] = (decoded as jwtBase).userData.rolesId.filter(role => roles.includes(role)); 
            if (intersectionRoles.length === 0) {
                return res.sendStatus(401);
            }
            (req as AuthenticatedRequest).userData = (decoded as jwtBase).userData;
        } 
        catch (err) {
            return res.status(401).send("Invalid Token");
        }
        return next();
    }
}

export default new AuthMiddleware();