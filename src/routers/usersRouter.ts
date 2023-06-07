import {Router} from "express"
import {createUsersValidator, inputValidationMiddleware} from "../middlewares/middleware.validators";
import {adminStatusAuth} from "../middlewares/auth/auth.middleware";
import {userController} from "../roots/composition.root";

export const usersRouter = Router({});


//get all user
usersRouter.get('/', userController.getAllUsers.bind(userController));

//post user
usersRouter.post('/', adminStatusAuth, createUsersValidator, inputValidationMiddleware, userController.CreateUser.bind(userController));

//delete user bu ID
usersRouter.delete('/:id', adminStatusAuth, userController.DeleteUserById.bind(userController));

