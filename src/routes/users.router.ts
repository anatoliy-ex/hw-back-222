import {Request, Response, Router} from "express"
import {createUsersValidator, inputValidationMiddleware} from "../middlewares/middleware.validators";
import {usersService} from "../domain/users.service";
export const usersRouter = Router({});
import {adminStatusAuth} from "../middlewares/auth/auth.middleware";

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

class UsersController {

    //get all user
    async getAllUsers (req: Request, res: Response) {

        const paginationUsers = getPaginationFromQueryUsers(req.query);
        const allUsers = await usersService.allUsers(paginationUsers);
        res.status(200).send(allUsers);
    }

    async CreateUser (req: Request, res: Response) {

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
    }

    async DeleteUserById (req: Request, res: Response) {

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
    }
}

const userController = new UsersController()

//get all user
usersRouter.get('/', userController.getAllUsers);

//post user
usersRouter.post('/', adminStatusAuth, createUsersValidator, inputValidationMiddleware, userController.CreateUser);

//delete user bu ID
usersRouter.delete('/:id', adminStatusAuth, userController.DeleteUserById);

