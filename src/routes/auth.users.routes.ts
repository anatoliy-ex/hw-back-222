import {Request, Response, Router} from "express"
import {authUsersService} from "../domain/auth.users.service";
export const authUsersRoutes = Router({});

authUsersRoutes.post('/', async (req: Request, res: Response) =>{

    const isLogin = await authUsersService.loginUser(req.body);

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
