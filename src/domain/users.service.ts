import {OutputType} from "../types/output.type";
import {InputUserType, UsersTypes, UserViewType} from "../types/users.types";
import {PaginationQueryTypeForUsers} from "../routes/users.routes";
import * as bcrypt from "bcrypt";
import {usersRepositories} from "../repositories/users.repositories";

export const usersService = {

    //return all users
    async allUsers(paginationUsers: PaginationQueryTypeForUsers): Promise<OutputType<UsersTypes[]>> {

        return usersRepositories.allUsers(paginationUsers)
    },

    //create user
    async createNewUser(user: InputUserType): Promise<UserViewType> {

        const passwordHash = await bcrypt.hash(user.password, 10)

        const now = new Date();

        const newUser: UsersTypes = {
            id: `${Date.now()}`,
            login: user.login,
            email: user.email,
            hash: passwordHash,
            createdAt: now.toISOString(),
        }

        return usersRepositories.createNewUser(newUser)
    },

    //delete user bu ID
    async deleteUserById(id: string): Promise<boolean> {

        return usersRepositories.deleteUserById(id);
    },
};