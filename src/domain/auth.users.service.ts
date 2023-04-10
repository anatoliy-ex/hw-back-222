import {LoginType} from "../types/auth.users.types";
import {authUsersRepositories} from "../repositories/auth.users.repositories";

export const authUsersService = {
    //login users
    async loginUser(authUser: LoginType)
    {
        return await authUsersRepositories.loginUser(authUser)
    },
};