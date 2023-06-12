import jwt from 'jsonwebtoken';
import {settings} from "../../.env/settings";

export class JwtTokenService {

    async createAccessTokes(userId: any) {
        return jwt.sign({userId : userId}, settings.JWT_SECRET, {expiresIn: '420s'});
    }

    async createRefreshToken(userId: any, deviceId: any){
        return  jwt.sign({userId : userId, deviceId: deviceId}, settings.REFRESH_TOKEN_SECRET, {expiresIn: '540s'});

    }

    //id user on  token
    async getUserIdByToken(token: string) {
        try
        {
            const result : any = jwt.verify(token, settings.JWT_SECRET)
            console.log(result)
            return result.userId
        }
        catch(error){
            return null
        }
    }

    async getUserIdByRefreshToken(token: string) {
        try
        {
            const result : any = jwt.verify(token, settings.REFRESH_TOKEN_SECRET)
            return result.userId
        }
        catch(error){
            return null
        }
    }

    async getLastActiveDateFromToken(refreshToken: string) {
        const payload: any = jwt.decode(refreshToken)
        return new Date(payload.iat * 1000).toISOString()
    }

}

export const jwtTokenService = new JwtTokenService()
