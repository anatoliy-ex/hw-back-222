import {OutputType} from "../types/output.type";
import {InputUserType, UserConfirmTypes, UserViewType} from "../types/userConfirmTypes";
import * as bcrypt from "bcrypt";
import {UsersRepositories, usersRepositories} from "../repositories/users.repositories";
import {PaginationQueryTypeForUsers} from "../pagination.query/user.pagination";

export class UsersService {

    private usersRepositories: UsersRepositories;

    constructor() {

        this.usersRepositories = new UsersRepositories()
    }
    //return all users
    async allUsers(paginationUsers: PaginationQueryTypeForUsers): Promise<OutputType<UserConfirmTypes[]>> {

        return this.usersRepositories.allUsers(paginationUsers)
    }

    //create user
    async createNewUser(user: InputUserType): Promise<UserViewType> {

        const passwordHash = await bcrypt.hash(user.password, 10)

        const now = new Date();

        const newUser   = {
            id: `${Date.now()}`,
            login: user.login,
            email: user.email,
            hash: passwordHash,
            createdAt: now.toISOString(),
            isConfirm: true
        }

        console.log(user.email)

        return this.usersRepositories.createNewUser(newUser)
    }

    //delete user bu ID
    async deleteUserById(id: string): Promise<boolean> {

        return this.usersRepositories.deleteUserById(id);
    }
}

export const usersService = new UsersService();