import {OutputType} from "../types/output.type";
import {InputUserType, UserConfirmTypes, UserViewType} from "../types/userConfirmTypes";
import {PaginationQueryTypeForUsers} from "../routes/users.router";
import * as bcrypt from "bcrypt";
import {usersRepositories} from "../repositories/users.repositories";
import {usersCollection} from "../dataBase/db.posts.and.blogs";

export const usersService = {

    //return all users
    async allUsers(paginationUsers: PaginationQueryTypeForUsers): Promise<OutputType<UserConfirmTypes[]>> {

        return usersRepositories.allUsers(paginationUsers)
    },

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

        return usersRepositories.createNewUser(newUser)
    },

    //delete user bu ID
    async deleteUserById(id: string): Promise<boolean> {

        return usersRepositories.deleteUserById(id);
    },

    //get user bu ID
    async findUserById(id: string){
        const user =   await usersCollection.findOne({id}, {projection: {_id:0, hash:0, createdAt:0, isConfirm:0}})

        if(!user)
        {
            return null;
        }
        else
        {
            return user;
        }
    },
};