import {LoginType} from "../types/auth.users.types";
import {authUsersRepositories} from "../repositories/auth.users.repositories";

class AuthUsersService {

    //login users
    async loginUser(authUser: LoginType)
    {
        return await authUsersRepositories.loginUser(authUser)
    }
}
export const authUsersService = new AuthUsersService();