import {LoginType} from "../types/auth.users.types";
import {AuthUsersRepositories, authUsersRepositories} from "../repositories/auth.users.repositories";
import {jwtService} from "../application/jwtService";
import {RefreshTokenSessionsTypes} from "../types/refreshTokenSessionsTypes";
import {RefreshTokenSessionModel} from "../dataBase/db";

export class AuthUsersService {

    private authUsersRepositories : AuthUsersRepositories

    constructor() {

        this.authUsersRepositories = new AuthUsersRepositories()
    }

    //login users
    async loginUser(authUser: LoginType, userIp: string, deviceId: string, deviceName: string) {

        const userId = await this.authUsersRepositories.loginUser(authUser);

        if (userId) {

            const newAccessTokes = await jwtService.createJWT(userId);
            const newRefreshToken = await jwtService.createRefreshToken(userId, deviceId);
            const lastActiveDate = await jwtService.getLastActiveDateFromToken(newRefreshToken)
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

        const newAccessTokes = await jwtService.createJWT(userId);
        const newRefreshToken = await jwtService.createRefreshToken(userId, deviceId);
        const lastActiveDate = await jwtService.getLastActiveDateFromToken(newRefreshToken)

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