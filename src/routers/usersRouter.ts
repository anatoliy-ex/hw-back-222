import {Router} from "express"
import {createUsersValidator, inputValidationMiddleware} from "../middlewares/middleware.validators";
import {adminStatusAuth} from "../middlewares/auth/auth.middleware";
import {container} from "../roots/composition.root";
import {UserController} from "../controllers/user.controller";

export const usersRouter = Router({});
const userController = container.resolve(UserController)


//get all user
usersRouter.get('/', userController.getAllUsers.bind(userController));

//post user
usersRouter.post('/', adminStatusAuth, createUsersValidator, inputValidationMiddleware, userController.CreateUser.bind(userController));

//delete user bu ID
usersRouter.delete('/:id', adminStatusAuth, userController.DeleteUserById.bind(userController));

