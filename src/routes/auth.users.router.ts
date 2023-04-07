import {Request, Response, Router} from "express"
import {authUsersService} from "../domain/auth.users.service";
import {authMiddleware} from "../middlewares/auth/auth.middleware";
import {jwtService} from "../application/jwtService";
import {usersCollection} from "../dataBase/db.posts.and.blogs";
export const authUsersRouter = Router({});

//login user
authUsersRouter.post('/login', async (req: Request, res: Response) =>{

    const user = await authUsersService.loginUser(req.body);
    const userId = await usersCollection.findOne({password: req.body.password})
    const token = await jwtService.createJWT(userId!.id)
    const accessToken = {accessToken: token}

    if(user)
    {
        res.status(200).send(accessToken)
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
