import {UsersRepositories} from "../repositories/users.repositories";
import {UsersService} from "../domain/users.service";
import {UsersController} from "../routers/usersRouter";

const usersRepositories = new UsersRepositories()
const usersService = new UsersService(usersRepositories)
export const userController = new UsersController(usersService)