import {LoginType} from "../types/auth.users.types";
import {AuthUsersRepositories, authUsersRepositories} from "../repositories/auth.users.repositories";
import {JwtTokenService, jwtTokenService} from "../application/jwt.token.service";
import {RefreshTokenSessionsTypes} from "../types/refreshTokenSessionsTypes";
import {RefreshTokenSessionModel} from "../dataBase/db";
import {injectable} from "inversify";

@injectable()
export class AuthUsersService {

    private authUsersRepositories : AuthUsersRepositories
    private jwtTokenService : JwtTokenService

    constructor() {

        this.authUsersRepositories = new AuthUsersRepositories()
        this.jwtTokenService = new JwtTokenService()
    }

    //login users
    async loginUser(authUser: LoginType, userIp: string, deviceId: string, deviceName: string) {

        const userId = await this.authUsersRepositories.loginUser(authUser);

        if (userId) {

            const newAccessTokes = await this.jwtTokenService.createAccessTokes(userId);
            const newRefreshToken = await this.jwtTokenService.createRefreshToken(userId, deviceId);
            const lastActiveDate = await this.jwtTokenService.getLastActiveDateFromToken(newRefreshToken)
            console.log(newRefreshToken)

            const newSessions: RefreshTokenSessionsTypes = {
                deviceId: deviceId,
                ip: userIp,//device IP(user IP)
                title: deviceName,//device name
                lastActiveDate,
                userId: userId
            };

            await RefreshTokenSessionModel.insertMany([newSessions]);
            return {refreshToken: newRefreshToken, accessTokes: newAccessTokes}
        }
        else
        {
            return false
        }
    }

    async GenerateRefreshAndAccessToken(userId: string, deviceId: string, sessions: any, deviceIp: string) {

        const newAccessTokes = await this.jwtTokenService.createAccessTokes(userId);
        const newRefreshToken = await this.jwtTokenService.createRefreshToken(userId, deviceId);
        const lastActiveDate = await this.jwtTokenService.getLastActiveDateFromToken(newRefreshToken)

        const updateSessions: RefreshTokenSessionsTypes = {
            deviceId: sessions.deviceId,
            ip: deviceIp,//device IP(user IP)
            title: sessions.title,//device name
            lastActiveDate,
            userId: userId
        }
        await RefreshTokenSessionModel.updateOne({deviceId, userId}, {$set: updateSessions})
        return {refreshToken: newRefreshToken, accessTokes: newAccessTokes}
    }
}

export const authUsersService = new AuthUsersService();