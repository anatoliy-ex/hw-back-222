import {LoginType} from "../types/auth.users.types";
import * as bcrypt from 'bcrypt'
import {usersCollection} from "../dataBase/db.posts.and.blogs";

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
           const passwordSalt = await bcrypt.genSalt(10);
           const passwordHash = await bcrypt.hash(authUser.password, passwordSalt);
           console.log(user.hash)
           console.log(passwordHash)
           return user.hash === passwordHash;
       }
       else
       {
           return false;
       }
   },
};