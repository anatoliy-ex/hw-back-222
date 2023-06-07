import {Request, Response, Router} from "express"
import {createUsersValidator, inputValidationMiddleware} from "../middlewares/middleware.validators";
import {UsersService} from "../domain/users.service";
export const usersRouter = Router({});
import {adminStatusAuth} from "../middlewares/auth/auth.middleware";
import {getPaginationFromQueryUsers} from "../pagination.query/user.pagination";
import {userController} from "../roots/user.root";


export class UsersController {


    constructor(protected usersService: UsersService) {}
    //get all user
    async getAllUsers (req: Request, res: Response) {

        const paginationUsers = getPaginationFromQueryUsers(req.query);
        const allUsers = await this.usersService.allUsers(paginationUsers);
        res.status(200).send(allUsers);
    }

    async CreateUser (req: Request, res: Response) {

        const newUser = await this.usersService.createNewUser(req.body)

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

        const isDelete = await this.usersService.deleteUserById(req.params.id)

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

//get all user
usersRouter.get('/', userController.getAllUsers.bind(userController));

//post user
usersRouter.post('/', adminStatusAuth, createUsersValidator, inputValidationMiddleware, userController.CreateUser.bind(userController));

//delete user bu ID
usersRouter.delete('/:id', adminStatusAuth, userController.DeleteUserById.bind(userController));

