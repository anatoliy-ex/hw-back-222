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
import {refreshTokenSessionCollection} from "../dataBase/db.posts.and.blogs";
import * as os from "os";
import jwt from "jsonwebtoken";
import {settings} from "../../.env/settings";
import {RefreshTokenSessionsTypes} from "../types/refreshTokenSessionsTypes";
export const authUsersRouter = Router({});

//login user
authUsersRouter.post('/login', async (req: Request, res: Response) =>{

    const userId = await authUsersService.loginUser(req.body);
    const userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || ' ';
    const deviceId = `${Date.now()}`;
    const deviceName = req.headers["user-agent"] || "Other Device"
    const now = new Date();


    if(userId)
    {
        const token = await jwtService.createJWT(userId);
        const refreshToken = await jwtService.createRefreshToken(userId, deviceId);
        console.log(refreshToken)

        const newSessions: RefreshTokenSessionsTypes = {
            deviceId: deviceId,
            ip: userIp,//device IP(user IP)
            title: deviceName,//device name
            lastActiveDate: now.toISOString(),
            userId: userId
        };

        await refreshTokenSessionCollection.insertOne({...newSessions});

        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true,});
        res.status(200).send({accessToken: token});
        return;
    }
    else
    {
        res.sendStatus(401);
        return;
    }
});


// TODO: cron job for delete old tokens (scheduler)
//generate new refresh Token and access Token
authUsersRouter.post('/refresh-token', refreshAuthMiddleware, async (req: Request, res: Response) => {

    const userId = req.user!.id

    const oldRefreshToken = req.cookies.refreshToken
    const result : any = jwt.verify(oldRefreshToken, settings.REFRESH_TOKEN_SECRET)
    const deviceId =  result.deviceId

    const token = await jwtService.createJWT(userId);
    const refreshToken = await jwtService.createRefreshToken(userId, deviceId);
    const sessions = await refreshTokenSessionCollection.findOne({deviceId: deviceId})

    if(sessions != null)
    {
        const now = new Date();

        const updateSessions : RefreshTokenSessionsTypes= {
            deviceId: sessions.deviceId,
            ip: sessions.ip,//device IP(user IP)
            title: sessions.title,//device name
            lastActiveDate: now.toISOString(),
            userId: userId
        }
        await refreshTokenSessionCollection.deleteOne({deviceId: deviceId})
        await refreshTokenSessionCollection.insertOne({...updateSessions})
    }

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
    await refreshTokenSessionCollection.insertOne(refreshToken)

    const result : any = jwt.verify(refreshToken, settings.REFRESH_TOKEN_SECRET)
    const deviceId =  result.deviceId
    await refreshTokenSessionCollection.deleteOne({deviceId: deviceId})

    res.cookie('refreshToken', '', {httpOnly: true, secure: true}).status(204).send()
});

//get information about user
authUsersRouter.get('/me', authMiddleware, async (req: Request, res: Response) => {

    const user = req.user!

    res.status(200).send({email: user.email, login: user.login, userId: user.id})
});