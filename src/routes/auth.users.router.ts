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
import {refreshTokenCollection} from "../dataBase/db.posts.and.blogs";
import {RefreshTokenTypes} from "../types/refresh.token.types";
export const authUsersRouter = Router({});

//login user
authUsersRouter.post('/login', async (req: Request, res: Response) =>{

    const userId = await authUsersService.loginUser(req.body);

    if(userId)
    {
        const token = await jwtService.createJWT(userId);
        const refreshToken = await jwtService.createRefreshToken(userId)

        console.log(token)
        console.log(refreshToken)

        const refreshTokenObject : RefreshTokenTypes = {
            userId: userId,
            tokenId: `${Date.now()}`,
            token: refreshToken
        }
        await refreshTokenCollection.insertOne({...refreshTokenObject})
        const accessToken = {accessToken: token};

        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true,})
        res.status(200).send(accessToken);
        return;
    }
    else
    {
        res.sendStatus(401)
        return;
    }
});

//generate new refresh Token and access Token
authUsersRouter.post('/refresh-token', refreshAuthMiddleware, async (req: Request, res: Response) => {

    const refreshTokenAndAccess = await authUsersRepositories.checkRefreshToken(req.cookies.refreshToken)

    if(!refreshTokenAndAccess)
    {
        res.sendStatus(401);
    }
    else
    {
        const refreshTokenInfo = await refreshTokenCollection.findOne({token:req.cookies.refreshToken})
        await refreshTokenCollection.deleteOne({token: req.cookies.refreshToken})

        const userId = jwtService.getUserIdByToken(req.cookies.refreshToken);
        const token = await jwtService.createJWT(userId);
        const refreshToken = await jwtService.createRefreshToken(userId);

        const refreshTokenObject : RefreshTokenTypes = {
            userId: refreshTokenInfo!.userId,
            tokenId: `${Date.now()}`,
            token: refreshToken
        }

        await refreshTokenCollection.insertOne({...refreshTokenObject})
        const accessToken = {accessToken: token};

        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true,})
        res.status(200).send(accessToken)
    }
})

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

    const refreshTokenAndAccess = authUsersRepositories.checkRefreshToken(req.cookies.refreshToken)

    if(!refreshTokenAndAccess)
    {
        res.sendStatus(401);
    }
    else
    {
        res.sendStatus(204);
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