import {AuthUsersService} from "../domain/auth.users.service";
import {AuthUsersRepositories} from "../repositories/auth.users.repositories";
import {JwtTokenService} from "../application/jwt.token.service";
import {Request, Response} from "express";
import {randomUUID} from "crypto";
import {RefreshTokenSessionModel} from "../dataBase/db";

export class AuthUsersController {


    constructor (protected authUsersService: AuthUsersService,
                 protected authUsersRepositories: AuthUsersRepositories,
                 protected jwtTokenService: JwtTokenService) {}

    async LoginUser(req: Request, res: Response) {

        const userIp = req.ip
        const deviceId = randomUUID();
        const deviceName = req.headers["user-agent"] || "Other Device"
        const isLogin = await this.authUsersService.loginUser(req.body, userIp, deviceId, deviceName);

        if (isLogin) {

            res.cookie('refreshToken', isLogin.refreshToken, {httpOnly: true, secure: true,});
            res.status(200).send({accessToken: isLogin.accessTokes});
            return;
        } else {
            res.sendStatus(401);
            return;
        }
    }

    async PasswordRecovery(req: Request, res: Response) {

        await this.authUsersRepositories.recoveryPasswordWithSendEmail(req.body.email);
        res.sendStatus(204);
    }

    async ConfirmNewPassword(req: Request, res: Response) {

        const isConfirmation = await this.authUsersRepositories.confirmNewPasswordWithCode(req.body.newPassword, req.body.recoveryCode);

        if (isConfirmation) {
            res.sendStatus(204);
        } else {
            res.sendStatus(400);
        }
    }

    async GenerateRefreshAndAccessToken(req: Request, res: Response) {

        const oldRefreshToken = req.cookies.refreshToken
        const userId = req.user!.id
        const deviceId = req.deviceId!
        const deviceIp = req.ip;
        const oldLastActiveDate = await this.jwtTokenService.getLastActiveDateFromToken(oldRefreshToken)
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

    async RegistrationAndConfirmation(req: Request, res: Response) {

        const confirmationWithCode = await this.authUsersRepositories.confirmEmailByUser(req.body.code);
        console.log(confirmationWithCode)

        if (confirmationWithCode) {
            res.sendStatus(204);
        } else {
            res.sendStatus(400);
        }
    }

    async FirstRegistration(req: Request, res: Response) {

        const firstRegistration: boolean = await this.authUsersRepositories.firstRegistrationInSystem(req.body);

        if (firstRegistration) {
            res.sendStatus(204);
        } else {
            res.sendStatus(400)
        }
    }

    async RegistrationEmailResending(req: Request, res: Response) {

        const isResending = await this.authUsersRepositories.registrationWithSendingEmail(req.body.email);

        if (isResending) {
            res.sendStatus(204);
        } else {
            res.status(400);
        }
    }

    async Logout(req: Request, res: Response) {

        const userId = req.user!.id
        const deviceId = req.deviceId!

        await RefreshTokenSessionModel.deleteOne({userId, deviceId: deviceId})

        res.cookie('refreshToken', '', {httpOnly: true, secure: true}).status(204).send()
    }

    async GetInformationAboutUser(req: Request, res: Response) {

        const user = req.user!
        res.status(200).send({email: user.email, login: user.login, userId: user.id})
    }
}
