import jwt from 'jsonwebtoken';
import {UsersTypes} from "../types/users.types";

export const jwtService = {
    //create jwt
    async createJWT(userId: any) {
        return jwt.sign({userId : userId}, '34343434', {expiresIn: '5h'});
    },

    //id user on  token
    async getUserIdByToken(token: string) {
        try
        {
            const result : any = jwt.verify(token, '34343434')
            console.log(result)
            return result.userId
        }
        catch(error){
            return null
        }

    }

};