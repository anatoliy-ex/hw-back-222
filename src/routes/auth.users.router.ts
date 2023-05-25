import e, {Request, Response, Router} from "express"
import {authUsersService} from "../domain/auth.users.service";
import {
    authMiddleware, rateLimiterMiddleware,
} from "../middlewares/auth/auth.middleware";
import {jwtService} from "../application/jwtService";
import {authUsersRepositories} from "../repositories/auth.users.repositories";
import {
    codeValidator,
    createUsersValidator,
    emailAlreadyExistButNotConfirmedValidator,
    existEmailValidator,
    inputValidationMiddleware
} from "../middlewares/middleware.validators";
import {refreshTokenSessionCollection} from "../dataBase/db.posts.and.blogs";
import {RefreshTokenSessionsTypes} from "../types/refreshTokenSessionsTypes";
import {randomUUID} from "crypto";

export const authUsersRouter = Router({});

//login user
authUsersRouter.post('/login', rateLimiterMiddleware, async (req: Request, res: Response) => {

    const userId = await authUsersService.loginUser(req.body);
    const userIp = req.ip
    const deviceId = randomUUID();
    const deviceName = req.headers["user-agent"] || "Other Device"


    if (userId) {
        const token = await jwtService.createJWT(userId);
        const refreshToken = await jwtService.createRefreshToken(userId, deviceId);
        const lastActiveDate = await jwtService.getLastActiveDateFromToken(refreshToken)
        console.log(refreshToken)

        const newSessions: RefreshTokenSessionsTypes = {
            deviceId: deviceId,
            ip: userIp,//device IP(user IP)
            title: deviceName,//device name
            lastActiveDate,
            userId: userId
        };

        await refreshTokenSessionCollection.insertOne({...newSessions});

        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true,});
        res.status(200).send({accessToken: token});
        return;
    } else {
        res.sendStatus(401);
        return;
    }
});


// TODO: cron job for delete old tokens (scheduler)
//generate new refresh Token and access Token
authUsersRouter.post('/refresh-token', async (req: Request, res: Response) => {

    const oldRefreshToken = req.cookies.refreshToken

    const userId = req.user!.id
    const deviceId = req.deviceId!
    const oldLastActiveDate = await jwtService.getLastActiveDateFromToken(oldRefreshToken)

    const sessions = await refreshTokenSessionCollection.findOne({deviceId: deviceId})

    if (!sessions || sessions.lastActiveDate !== oldLastActiveDate) {
        return res.sendStatus(401)
    }

    if (sessions.userId !== userId) {
        return res.sendStatus(403)
    }

    const token = await jwtService.createJWT(userId);
    const refreshToken = await jwtService.createRefreshToken(userId, deviceId);
    const lastActiveDate =  await jwtService.getLastActiveDateFromToken(refreshToken)

    const updateSessions: RefreshTokenSessionsTypes = {
        deviceId: sessions.deviceId,
        ip: req.ip,//device IP(user IP)
        title: sessions.title,//device name
        lastActiveDate,
        userId: userId
    }
    await refreshTokenSessionCollection.updateOne({deviceId, userId}, {$set: updateSessions})

    res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true,})
    res.status(200).send({accessToken: token})
});

//confirm registration-2
authUsersRouter.post('/registration-confirmation', rateLimiterMiddleware, codeValidator, inputValidationMiddleware, async (req: Request, res: Response) => {

    const confirmationWithCode = await authUsersRepositories.confirmEmailByUser(req.body.code);

    if (confirmationWithCode) {
        res.sendStatus(204);
    } else {
        res.sendStatus(400);
    }

});

//first registration in system => send to email code for verification-1
authUsersRouter.post('/registration',  createUsersValidator, existEmailValidator, inputValidationMiddleware, async (req: Request, res: Response) => {

    const firstRegistration: boolean = await authUsersRepositories.firstRegistrationInSystem(req.body);

    if (firstRegistration) {
        res.sendStatus(204);
    } else {
        res.sendStatus(400);
    }
});

//registration in system-3
authUsersRouter.post('/registration-email-resending', rateLimiterMiddleware, emailAlreadyExistButNotConfirmedValidator, inputValidationMiddleware, rateLimiterMiddleware, async (req: Request, res: Response) => {

    const isResending = await authUsersRepositories.registrationWithSendingEmail(req.body.email);

    if (isResending) {
        res.sendStatus(204);
    } else {
        res.status(400);
    }
});

//logout if bad refresh token
authUsersRouter.post('/logout',async (req: Request, res: Response) => {

    const userId = req.user!.id
    const deviceId = req.deviceId!
    await refreshTokenSessionCollection.deleteOne({userId, deviceId: deviceId})

    res.cookie('refreshToken', '', {httpOnly: true, secure: true}).status(204).send()
});

//get information about user
authUsersRouter.get('/me', authMiddleware, async (req: Request, res: Response) => {

    const user = req.user!

    res.status(200).send({email: user.email, login: user.login, userId: user.id})
});