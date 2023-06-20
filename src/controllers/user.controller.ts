import {UsersService} from "../domain/users.service";
import {Request, Response} from "express";
import {getPaginationFromQueryUsers} from "../pagination.query/user.pagination";
import {injectable} from "inversify";

@injectable()
export class UserController {

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