import {OutputType} from "../types/output.type";
import {InputUserType, UserDBType, UserViewType} from "../types/userDBType";
import {usersCollection} from "../dataBase/db.posts.and.blogs";
import {PaginationQueryTypeForUsers} from "../routes/users.routes";
import * as bcrypt from "bcrypt";

export const usersRepositories = {

    //return all users
    async allUsers(paginationUsers: PaginationQueryTypeForUsers): Promise<OutputType<UserDBType[]>> {
        const filter = {
            $or: [
                {login: {$regex: paginationUsers.searchEmailTerm, $options: 'i'}},
                {email: {$regex: paginationUsers.searchLoginTerm, $options: 'i'}}
            ]
        };

        const users: UserDBType[] = await usersCollection
            .find(filter, {projection: {_id: 0, hash: 0}})
            .sort({[paginationUsers.sortBy]: paginationUsers.sortDirection})
            .skip((paginationUsers.pageNumber - 1) * paginationUsers.pageSize)
            .limit(paginationUsers.pageSize)
            .toArray()


        const countOfUsers = await usersCollection.countDocuments(filter);
        const pagesCount = Math.ceil(countOfUsers / paginationUsers.pageSize);

        return {
            page: paginationUsers.pageNumber,
            pagesCount: pagesCount === 0 ? 1 : pagesCount,
            pageSize: paginationUsers.pageSize,
            totalCount: countOfUsers,
            items: users
        };

    },

    //create user
    async createNewUser(user: InputUserType): Promise<UserViewType> {
        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(user.password, passwordSalt)

        const now = new Date();

        const newUser: UserDBType = {
            id: `${Date.now()}`,
            login: user.login,
            email: user.email,
            hash: passwordHash,
            createdAt: now.toISOString(),
        }
        await usersCollection.insertOne({...newUser});
        return {
            id: newUser.id,
            email: newUser.email,
            login: newUser.login,
            createdAt: newUser.createdAt,
        }

    },

    //delete user bu ID
    async deleteUserById(id: string): Promise<boolean> {
        const isDeleted = await usersCollection.deleteOne({id: id})
        return isDeleted.deletedCount === 1;
    },
};