import {LoginType} from "../types/auth.users.types";
import * as bcrypt from 'bcrypt'
import {usersCollection} from "../dataBase/db.posts.and.blogs";
import {UsersTypes} from "../types/users.types";

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

       const user: any = await usersCollection.find(filter)

       if(user)
       {
           const passwordSalt = await bcrypt.genSalt(10);
           const passwordHash = await bcrypt.hash(authUser.password, passwordSalt);
           const filter = {hash: {$regex: passwordHash, $options: 'i'}}
           if(filter)
           {
               return true;
           }
       }
       else
       {
           return false;
       }
   },
};