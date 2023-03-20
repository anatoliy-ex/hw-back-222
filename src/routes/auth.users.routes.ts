import {Request, Response, Router} from "express"
import {authUsersRepositories} from "../repositories/auth.users.repositories";
export const authUsersRoutes = Router({});

authUsersRoutes.post('/', async (req: Request, res: Response) =>{

    const isLogin = await authUsersRepositories.loginUser(req.body);

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
