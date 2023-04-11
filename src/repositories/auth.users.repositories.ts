import {LoginType} from "../types/auth.users.types";
import * as bcrypt from 'bcrypt'
import {usersCollection} from "../dataBase/db.posts.and.blogs";
import {jwtService} from "../application/jwtService";

export const authUsersRepositories = {
  //login users
   async loginUser(authUser: LoginType)
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
           const isLogin =  await bcrypt.compare(authUser.password, user.hash);

           if(isLogin)
           {
               return user.id
           }
           else
           {
              return false;
           }

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
            return await usersCollection.findOne({id: userId})
        }
        else
        {
            return null
        }
    },

    //get user id by login or email
    async getUserIdByLoginOrEmail(authUser: LoginType){
        const filter = {
            $or: [
                {login: {$regex: authUser.loginOrEmail, $options: 'i'}},
                {email: {$regex: authUser.loginOrEmail, $options: 'i'}}
            ]
        };

        const user = await usersCollection.findOne(filter)

        if(user)
        {
            return user.id
        }
        else
        {
            return false;
        }
    },
};