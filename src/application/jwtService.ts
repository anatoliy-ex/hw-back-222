import jwt from 'jsonwebtoken';
import {ObjectId} from "mongodb";
import {UsersTypes} from "../types/users.types";

export const jwtService = {
    //create jwt
    async createJWT(user: UsersTypes) {
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