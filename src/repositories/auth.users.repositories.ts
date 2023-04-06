import {LoginType} from "../types/auth.users.types";
import * as bcrypt from 'bcrypt'
import {usersCollection} from "../dataBase/db.posts.and.blogs";
import {jwtService} from "../application/jwtService";

export const authUsersRepositories = {
  //login users
   async loginUser(authUser: LoginType): Promise<boolean>
   {
       const filter = {
           $or: [
               {login: {$regex: authUser.loginOrEmail, $options: 'i'}},
               {email: {$regex: authUser.loginOrEmail, $options: 'i'}}
           ]
       };

       const user = await usersCollection.findOne(filter)

       if(user)
       {
           return await bcrypt.compare(authUser.password, user.hash);

       }
       else
       {
           return false;
       }
   },

    //get information about user
    async getUser(token: string)
    {
        const userId = await  jwtService.getUserIdByToken(token);

        if(userId != null) {
            return await usersCollection.findOne({id: userId.id})
        }
        else
        {
            return null
        }
    }
};