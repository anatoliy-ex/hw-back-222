import e, {Request, Response, Router} from "express"
import {authUsersService} from "../domain/auth.users.service";
import {authMiddleware, refreshAuthMiddleware} from "../middlewares/auth/auth.middleware";
import {jwtService} from "../application/jwtService";
import {authUsersRepositories} from "../repositories/auth.users.repositories";
import {codeValidator,
    createUsersValidator,
    emailAlreadyExistButNotConfirmedValidator,
    existEmailValidator,
    inputValidationMiddleware
} from "../middlewares/middleware.validators";
import {refreshTokenBlackListCollection} from "../dataBase/db.posts.and.blogs";
export const authUsersRouter = Router({});

//login user
authUsersRouter.post('/login', async (req: Request, res: Response) =>{

    const userId = await authUsersService.loginUser(req.body);

    if(userId)
    {
        const token = await jwtService.createJWT(userId);
        const refreshToken = await jwtService.createRefreshToken(userId)

        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true,})
        res.status(200).send({accessToken: token});
        return;
    }
    else
    {
        res.sendStatus(401)
        return;
    }
});


// TODO: cron job for delete old tokens (scheduler)
//generate new refresh Token and access Token
authUsersRouter.post('/refresh-token', refreshAuthMiddleware, async (req: Request, res: Response) => {

        const userId = req.user!.id
        const token = await jwtService.createJWT(userId);
        const refreshToken = await jwtService.createRefreshToken(userId);
        const oldRefreshToken = req.cookies.refreshToken

        await refreshTokenBlackListCollection.insertOne({refreshToken: oldRefreshToken})

        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true,})
        res.status(200).send({accessToken: token})
});

//confirm registration-2
authUsersRouter.post('/registration-confirmation', codeValidator, inputValidationMiddleware, async (req: Request, res: Response) =>{

    const confirmationWithCode = await authUsersRepositories.confirmEmailByUser(req.body.code);

    if(confirmationWithCode)
    {
        res.sendStatus(204);
    }
    else
    {
        res.sendStatus(400);
    }

});

//first registration in system => send to email code for verification-1
authUsersRouter.post('/registration', createUsersValidator, existEmailValidator, inputValidationMiddleware,  async (req: Request, res: Response) =>{

    const firstRegistration : boolean = await authUsersRepositories.firstRegistrationInSystem(req.body);

    if(firstRegistration)
    {
        res.sendStatus(204);
    }
    else
    {
        res.sendStatus(400);
    }
});

//registration in system-3
authUsersRouter.post('/registration-email-resending', emailAlreadyExistButNotConfirmedValidator, inputValidationMiddleware, async (req: Request, res: Response) =>{

    const isResending = await authUsersRepositories.registrationWithSendingEmail(req.body.email);

    if(isResending)
    {
        res.sendStatus(204);
    }
    else
    {
        res.status(400);
    }
});

//logout if bad refresh token
authUsersRouter.post('/logout', refreshAuthMiddleware, async (req: Request, res: Response) => {

    const refreshToken = req.cookies
    await refreshTokenBlackListCollection.insertOne(refreshToken)

    res.cookie('refreshToken', '', {httpOnly: true, secure: true}).status(204).send()
});

//get information about user
authUsersRouter.get('/me', authMiddleware, async (req: Request, res: Response) => {

    const user = req.user!

    res.status(200).send({email: user.email, login: user.login, userId: user.id})
});