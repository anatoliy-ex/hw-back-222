import {Request, Response, Router} from "express"
import {usersRepositories} from "../repositories/users.repositories";
import {createUsersValidator, inputValidationMiddleware} from "../middlewares/middlewares.validators";
export const usersRouter = Router({});

export const expressBasicAuth = require('express-basic-auth');
export const adminStatusAuth = expressBasicAuth({users: { 'admin': 'qwerty' }});

export type PaginationQueryTypeForUsers = {
    searchLoginTerm: string,
    searchEmailTerm: string,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageNumber: number,
    pageSize: number,
}
export const getPaginationFromQueryUsers = (query: any): PaginationQueryTypeForUsers => {

    const pageNumber = parseInt(query.pageNumber, 10);
    const pageSize = parseInt(query.pageSize, 10);
    const sortDirection = query.sortDirection === 'asc' ? 'asc' : 'desc';

    return {
        searchLoginTerm: query.searchLoginTerm ?? '',
        searchEmailTerm: query.searchEmailTerm ?? '',
        sortBy: query.sortBy ?? 'createdAt',
        sortDirection,
        pageNumber: isNaN(pageNumber) ? 1 : pageNumber,
        pageSize: isNaN(pageSize) ? 10 : pageSize,
    };
};

//get all user
usersRouter.get('/', async (req: Request, res: Response)=>
{
    const paginationUsers = getPaginationFromQueryUsers(req.query);
    const allUsers = await usersRepositories.allUsers(paginationUsers);
    res.status(200).send(allUsers);

});

//post user
usersRouter.post('/', adminStatusAuth, createUsersValidator, inputValidationMiddleware, async (req: Request, res: Response)=>
{
    const newUser = await usersRepositories.createNewUser(req.body)

    if(newUser)
    {
        res.status(201).send(newUser)
        return;
    }
    else
    {
        res.sendStatus(400);
        return;
    }
});

//delete user bu ID
usersRouter.delete('/:id', adminStatusAuth, async (req: Request, res: Response)=>
{
    const isDelete = await usersRepositories.deleteUserById(req.params.id)

    if(isDelete)
    {
        res.sendStatus(204);
        return;
    }
    else
    {
        res.sendStatus(404);
        return;
    }
});