import {Request, Response, Router} from "express"
import {authUsersService} from "../domain/auth.users.service";
import {authMiddleware, rateLimitedMiddleware, refreshAuthMiddleware} from "../middlewares/auth/auth.middleware";
import {jwtService} from "../application/jwtService";
import {authUsersRepositories} from "../repositories/auth.users.repositories";
import {
    codeValidator,
    createUsersValidator,
    emailAlreadyExistButNotConfirmedValidator,
    emailValidator,
    existEmailValidator,
    inputValidationMiddleware,
    loginOrEmailValidator,
    recoveryPasswordValidator,
    passwordValidator,
    recoveryCodeValidator,
    recoveryEmailValidator
} from "../middlewares/middleware.validators";
import {RefreshTokenSessionModel} from "../dataBase/db";
import {RefreshTokenSessionsTypes} from "../types/refreshTokenSessionsTypes";
import {randomUUID} from "crypto";
import jwt from "jsonwebtoken";
import {settings} from "../../.env/settings";
import {body} from "express-validator";

export const authUsersRouter = Router({});

//login user
authUsersRouter.post('/login', rateLimitedMiddleware, loginOrEmailValidator, passwordValidator, inputValidationMiddleware, async (req: Request, res: Response) => {

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

        await RefreshTokenSessionModel.insertMany([newSessions]);

        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true,});
        res.status(200).send({accessToken: token});
        return;
    } else {
        res.sendStatus(401);
        return;
    }
});

//password recovery via email
authUsersRouter.post('/password-recovery', rateLimitedMiddleware, recoveryEmailValidator,  inputValidationMiddleware, async (req: Request, res: Response) => {


    await authUsersRepositories.recoveryPasswordWithSendEmail(req.body.email);
    res.sendStatus(204);
});

//confirm new password with recovery code
authUsersRouter.post('/new-password', rateLimitedMiddleware, recoveryPasswordValidator, recoveryCodeValidator, inputValidationMiddleware, async (req: Request, res: Response) => {

    const isConfirmation = await authUsersRepositories.confirmNewPasswordWithCode(req.body.newPassword, req.body.recoveryCode);

    if(isConfirmation) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(400);
    }

});

// TODO: cron job for delete old tokens (scheduler)
//generate new refresh Token and access Token
authUsersRouter.post('/refresh-token', refreshAuthMiddleware, async (req: Request, res: Response) => {

    const oldRefreshToken = req.cookies.refreshToken

    const userId = req.user!.id
    const deviceId = req.deviceId!
    const oldLastActiveDate = await jwtService.getLastActiveDateFromToken(oldRefreshToken)
    const sessions = await RefreshTokenSessionModel.findOne({deviceId: deviceId})

    if (!sessions || sessions.lastActiveDate !== oldLastActiveDate) {
        return res.sendStatus(401)
    }

    if (sessions.userId !== userId) {
        return res.sendStatus(403)
    }

    const token = await jwtService.createJWT(userId);
    const refreshToken = await jwtService.createRefreshToken(userId, deviceId);
    const lastActiveDate = await jwtService.getLastActiveDateFromToken(refreshToken)

    const updateSessions: RefreshTokenSessionsTypes = {
        deviceId: sessions.deviceId,
        ip: req.ip,//device IP(user IP)
        title: sessions.title,//device name
        lastActiveDate,
        userId: userId
    }
    await RefreshTokenSessionModel.updateOne({deviceId, userId}, {$set: updateSessions})

    res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true,})
    res.status(200).send({accessToken: token})
});

//confirm registration-2
authUsersRouter.post('/registration-confirmation', rateLimitedMiddleware, codeValidator, inputValidationMiddleware, async (req: Request, res: Response) => {

    const confirmationWithCode = await authUsersRepositories.confirmEmailByUser(req.body.code);
    console.log(confirmationWithCode)

    if (confirmationWithCode) {
        res.sendStatus(204);
    } else {
        res.sendStatus(400);
    }

});

//first registration in system => send to email code for verification-1
authUsersRouter.post('/registration', rateLimitedMiddleware, createUsersValidator, existEmailValidator, inputValidationMiddleware, async (req: Request, res: Response) => {

    const firstRegistration: boolean = await authUsersRepositories.firstRegistrationInSystem(req.body);

    if (firstRegistration) {
        res.sendStatus(204);
    } else {
        res.sendStatus(400)
    }
});

//registration in system-3
authUsersRouter.post('/registration-email-resending', rateLimitedMiddleware, emailAlreadyExistButNotConfirmedValidator, inputValidationMiddleware, async (req: Request, res: Response) => {

    const isResending = await authUsersRepositories.registrationWithSendingEmail(req.body.email);

    if (isResending) {
        res.sendStatus(204);
    } else {
        res.status(400);
    }
});

//logout if bad refresh token
authUsersRouter.post('/logout', refreshAuthMiddleware, async (req: Request, res: Response) => {

    const userId = req.user!.id
    const deviceId = req.deviceId!

    await RefreshTokenSessionModel.deleteOne({userId, deviceId: deviceId})

    res.cookie('refreshToken', '', {httpOnly: true, secure: true}).status(204).send()
});

//get information about user
authUsersRouter.get('/me', authMiddleware, async (req: Request, res: Response) => {

    const user = req.user!

    res.status(200).send({email: user.email, login: user.login, userId: user.id})
});