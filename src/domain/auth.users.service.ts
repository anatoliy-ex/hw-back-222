import {LoginType} from "../types/auth.users.types";
import {authUsersRepositories} from "../repositories/auth.users.repositories";
import {jwtService} from "../application/jwtService";
import {RefreshTokenSessionsTypes} from "../types/refreshTokenSessionsTypes";
import {RefreshTokenSessionModel} from "../dataBase/db";

class AuthUsersService {

    //login users
    async loginUser(authUser: LoginType, userIp: string, deviceId: string, deviceName: string) {

        const userId = await authUsersRepositories.loginUser(authUser);

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
            return {rToken: refreshToken, aTokes: token}
        }
        else
        {
            return false
        }
    }
}

export const authUsersService = new AuthUsersService();