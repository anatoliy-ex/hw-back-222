import {LoginType} from "../types/login.users.types";
import * as bcrypt from 'bcrypt'

export const loginUsersRepositories = {
  //login users
   async loginUser(loginUser: LoginType): Promise<boolean>
   {
       return true;
   },
};