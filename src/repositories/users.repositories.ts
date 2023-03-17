import {OutputType} from "../types/outputType";
import {UsersTypes} from "../types/users.types";
import {blogsCollection, usersCollection} from "../dataBase/db.posts.and.blogs";
import {PaginationQueryTypeForUsers} from "../routes/users.routes";
import {BlogsTypes} from "../types/blogsTypes";

export const usersRepositories = {

    //return all users
    async allUsers(paginationUsers : PaginationQueryTypeForUsers) : Promise<OutputType<UsersTypes[]>>
    {
        const filter = {$or: [
            {searchEmailTerm: {$regex: paginationUsers.searchEmailTerm, $options: 'i'}},
            {searchEmailTerm: {$regex: paginationUsers.searchLoginTerm, $options: 'i'}}
            ]};

        const users : UsersTypes[] =  await usersCollection
            .find(filter, {projection: {_id: 0}})
            .sort({[paginationUsers.sortBy]: paginationUsers.sortDirection})
            .skip((paginationUsers.pageNumber - 1) * paginationUsers.pageSize)
            .limit(paginationUsers.pageSize)
            .toArray()

        const countOfUsers = await blogsCollection.countDocuments(filter);
        const pagesCount =  Math.ceil(countOfUsers/paginationUsers.pageSize);

        return {
            page: paginationUsers.pageNumber,
            pagesCount: pagesCount === 0 ? 1 : pagesCount,
            pageSize: paginationUsers.pageSize,
            totalCount: countOfUsers,
            items: users
        };

    },

    //create user
    async createNewUser(user: UsersTypes): Promise<UsersTypes>
    {
        const now = new Date();

        const newUser = {
            id: `${Date.now()}`,
            login: user.login,
            email: user.email,
            createdAt: now.toISOString(),
        }
        await usersCollection.insertOne({...newUser});
        return newUser;
    },

    //delete user bu ID
    async deleteUserById(id: string): Promise<boolean>
    {
        const isDeleted = await usersCollection.deleteOne({id: id})
        return isDeleted.deletedCount === 1;
    },
};