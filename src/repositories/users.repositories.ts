import {OutputType} from "../types/output.type";
import {InputUserType, UserConfirmTypes, UserViewType} from "../types/userConfirmTypes";
import {UserModel} from "../dataBase/db";
import {PaginationQueryTypeForUsers} from "../routes/users.router";

export const usersRepositories = {

    //return all users
    async allUsers(paginationUsers: PaginationQueryTypeForUsers): Promise<OutputType<UserConfirmTypes[]>> {
        const filter = {
            $or: [
                {login: {$regex: paginationUsers.searchLoginTerm, $options: 'i'}},
                {email: {$regex: paginationUsers.searchEmailTerm, $options: 'i'}}
            ]
        };

        const users: UserConfirmTypes[] = await UserModel
            .find(filter, {projection: {_id: 0, hash: 0}})
            .sort({[paginationUsers.sortBy]: paginationUsers.sortDirection})
            .skip((paginationUsers.pageNumber - 1) * paginationUsers.pageSize)
            .limit(paginationUsers.pageSize)
            .lean()


        const countOfUsers = await UserModel.countDocuments(filter);
        const pagesCount = Math.ceil(countOfUsers / paginationUsers.pageSize);
        console.log(countOfUsers)

        return {
            page: paginationUsers.pageNumber,
            pagesCount: pagesCount === 0 ? 1 : pagesCount,
            pageSize: paginationUsers.pageSize,
            totalCount: countOfUsers,
            items: users
        };
    },

    //create user
    async createNewUser(newUser: UserConfirmTypes): Promise<UserViewType> {

        await UserModel.insertMany([newUser]);

        return {
            id: newUser.id,
            email: newUser.email,
            login: newUser.login,
            createdAt: newUser.createdAt,
        }
    },

    //delete user bu ID
    async deleteUserById(id: string): Promise<boolean> {
        const isDeleted = await UserModel.deleteOne({id: id})
        return isDeleted.deletedCount === 1;
    },
};