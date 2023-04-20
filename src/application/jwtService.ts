import jwt from 'jsonwebtoken';
import {settings} from "../../.env/settings";

export const jwtService = {
    //create jwt
    async createJWT(userId: any) {
        return jwt.sign({userId : userId}, settings.JWT_SECRET, {expiresIn: '5h'});
    },

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

};