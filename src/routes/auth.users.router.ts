import {Request, Response, Router} from "express"
import {authUsersService} from "../domain/auth.users.service";
import {authMiddleware} from "../middlewares/auth/auth.middleware";
import {jwtService} from "../application/jwtService";
export const authUsersRouter = Router({});

//login user
authUsersRouter.post('/login', async (req: Request, res: Response) =>{

    const user = await authUsersService.loginUser(req.body);

    if(user)
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

//get information about user
authUsersRouter.get('/me', authMiddleware, async (req: Request, res: Response) => {

    const user = req.user


    if(user != null)
    {
        res.status(200).send(user)
    }
    else
    {
        res.sendStatus(401)
    }
});
