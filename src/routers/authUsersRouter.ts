import {Request, Response, Router} from "express"
import {AuthUsersService, authUsersService} from "../domain/auth.users.service";
import {authMiddleware, rateLimitedMiddleware, refreshAuthMiddleware} from "../middlewares/auth/auth.middleware";
import {jwtService} from "../application/jwtService";
import {AuthUsersRepositories, authUsersRepositories} from "../repositories/auth.users.repositories";
import {
    codeValidator,
    createUsersValidator,
    emailAlreadyExistButNotConfirmedValidator,
    existEmailValidator,
    inputValidationMiddleware,
    loginOrEmailValidator,
    recoveryPasswordValidator,
    passwordValidator,
    recoveryCodeValidator,
    recoveryEmailValidator} from "../middlewares/middleware.validators";
import {RefreshTokenSessionModel} from "../dataBase/db";
import {randomUUID} from "crypto";

export const authUsersRouter = Router({});

class AuthUsersController {

    private authUsersService: AuthUsersService
    private authUsersRepositories : AuthUsersRepositories

    constructor() {

        this.authUsersService = new AuthUsersService()
        this.authUsersRepositories = new AuthUsersRepositories()
    }

    async LoginUser (req: Request, res: Response) {

        const userIp = req.ip
        const deviceId = randomUUID();
        const deviceName = req.headers["user-agent"] || "Other Device"
        const isLogin = await this.authUsersService.loginUser(req.body, userIp, deviceId, deviceName);

        if (isLogin) {

            res.cookie('refreshToken', isLogin.refreshToken, {httpOnly: true, secure: true,});
            res.status(200).send({accessToken: isLogin.accessTokes});
            return;
        }
        else {
            res.sendStatus(401);
            return;
        }
    }

    async PasswordRecovery (req: Request, res: Response) {

        await this.authUsersRepositories.recoveryPasswordWithSendEmail(req.body.email);
        res.sendStatus(204);
    }

    async ConfirmNewPassword (req: Request, res: Response) {

        const isConfirmation = await this.authUsersRepositories.confirmNewPasswordWithCode(req.body.newPassword, req.body.recoveryCode);

        if(isConfirmation) {
            res.sendStatus(204);
        }
        else {
            res.sendStatus(400);
        }
    }

    async GenerateRefreshAndAccessToken (req: Request, res: Response) {

        const oldRefreshToken = req.cookies.refreshToken
        const userId = req.user!.id
        const deviceId = req.deviceId!
        const deviceIp = req.ip;
        const oldLastActiveDate = await jwtService.getLastActiveDateFromToken(oldRefreshToken)
        const sessions = await RefreshTokenSessionModel.findOne({deviceId: deviceId})

        if (!sessions || sessions.lastActiveDate !== oldLastActiveDate) {
            return res.sendStatus(401)
        }

        if (sessions.userId !== userId) {
            return res.sendStatus(403)
        }

        const isGenerate = await this.authUsersService.GenerateRefreshAndAccessToken(userId, deviceId, sessions, deviceIp)

        res.cookie('refreshToken', isGenerate.refreshToken, {httpOnly: true, secure: true,})
        res.status(200).send({accessToken: isGenerate.accessTokes})
    }

    async RegistrationAndConfirmation (req: Request, res: Response) {

        const confirmationWithCode = await this.authUsersRepositories.confirmEmailByUser(req.body.code);
        console.log(confirmationWithCode)

        if (confirmationWithCode) {
            res.sendStatus(204);
        }
        else {
            res.sendStatus(400);
        }
    }

    async FirstRegistration (req: Request, res: Response) {

        const firstRegistration: boolean = await this.authUsersRepositories.firstRegistrationInSystem(req.body);

        if (firstRegistration) {
            res.sendStatus(204);
        }
        else {
            res.sendStatus(400)
        }
    }

    async RegistrationEmailResending (req: Request, res: Response) {

        const isResending = await this.authUsersRepositories.registrationWithSendingEmail(req.body.email);

        if (isResending) {
            res.sendStatus(204);
        }
        else {
            res.status(400);
        }
    }

    async Logout (req: Request, res: Response) {

        const userId = req.user!.id
        const deviceId = req.deviceId!

        await RefreshTokenSessionModel.deleteOne({userId, deviceId: deviceId})

        res.cookie('refreshToken', '', {httpOnly: true, secure: true}).status(204).send()
    }

    async GetInformationAboutUser (req: Request, res: Response) {

        const user = req.user!
        res.status(200).send({email: user.email, login: user.login, userId: user.id})
    }
}

const authUserController = new AuthUsersController()
//login user
authUsersRouter.post('/login', rateLimitedMiddleware, loginOrEmailValidator, passwordValidator, inputValidationMiddleware, authUserController.LoginUser.bind(authUserController));

//password recovery via email
authUsersRouter.post('/password-recovery', rateLimitedMiddleware, recoveryEmailValidator,  inputValidationMiddleware, authUserController.PasswordRecovery.bind(authUserController));

//confirm new password with recovery code
authUsersRouter.post('/new-password', rateLimitedMiddleware, recoveryPasswordValidator, recoveryCodeValidator, inputValidationMiddleware, authUserController.ConfirmNewPassword.bind(authUserController));

// TODO: cron job for delete old tokens (scheduler)
//generate new refresh Token and access Token
authUsersRouter.post('/refresh-token', refreshAuthMiddleware, authUserController.GenerateRefreshAndAccessToken.bind(authUserController));

//confirm registration-2
authUsersRouter.post('/registration-confirmation', rateLimitedMiddleware, codeValidator, inputValidationMiddleware, authUserController.RegistrationAndConfirmation.bind(authUserController));

//first registration in system => send to email code for verification-1
authUsersRouter.post('/registration', rateLimitedMiddleware, createUsersValidator, existEmailValidator, inputValidationMiddleware, authUserController.FirstRegistration.bind(authUserController));

//registration in system-3
authUsersRouter.post('/registration-email-resending', rateLimitedMiddleware, emailAlreadyExistButNotConfirmedValidator, inputValidationMiddleware, authUserController.RegistrationEmailResending.bind(authUserController));

//logout if bad refresh token
authUsersRouter.post('/logout', refreshAuthMiddleware, authUserController.Logout.bind(authUserController));

//get information about user
authUsersRouter.get('/me', authMiddleware, authUserController.GetInformationAboutUser.bind(authUserController));