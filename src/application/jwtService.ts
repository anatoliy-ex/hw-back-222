import jwt from 'jsonwebtoken';
import {UsersTypes} from "../types/users.types";

export const jwtService = {
    //create jwt
    async createJWT(user: any) {
        return jwt.sign({userId : user.id}, '34343434', {expiresIn: '5h'});
    },

    //id user on  token
    async getUserIdByToken(token: string) {
        try
        {
            const result : any = jwt.verify(token, '34343434')
            return result.userId
        }
        catch(error){
            return null
        }

    }

};