import {Request, Response, Router} from "express"
import {loginUsersRepositories} from "../repositories/login.users.repositories";
export const loginUsersRoutes = Router({});

loginUsersRoutes.post('/', async (req: Request, res: Response) =>{

    const isLogin = await loginUsersRepositories.loginUser(req.body);

    if(isLogin)
    {
        res.sendStatus(204)
        return;
    }
    else
    {
        res.sendStatus(401)
        return;

    }
});
