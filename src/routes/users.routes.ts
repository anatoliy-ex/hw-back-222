import {Request, Response, Router} from "express"
import {createUsersValidator, inputValidationMiddleware} from "../middlewares/middlewares.validators";
import {usersService} from "../domain/users.service";
export const usersRouter = Router({});
import {adminStatusAuth} from "../middlewares/auth/auth.express";

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
    const allUsers = await usersService.allUsers(paginationUsers);
    res.status(200).send(allUsers);

});

//post user
usersRouter.post('/', adminStatusAuth, createUsersValidator, inputValidationMiddleware, async (req: Request, res: Response)=>
{
    const newUser = await usersService.createNewUser(req.body)

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
    const isDelete = await usersService.deleteUserById(req.params.id)

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