import { refreshTokenSessionCollection} from "../dataBase/db.posts.and.blogs";
import {RefreshTokenSessionsTypes} from "../types/refreshTokenSessionsTypes";

export const securityDevicesRepositories = {

    //get information  about all sessions
    async getInformationAboutAllSessions(deviceId: string, userId: string) {

        const session = await refreshTokenSessionCollection.find({deviceId: deviceId})
        const countOfSessions = await refreshTokenSessionCollection.countDocuments({userId: userId});

        if(countOfSessions > 1)
        {
            const allSessions: RefreshTokenSessionsTypes[] = await refreshTokenSessionCollection
                .find({userId: userId}, {projection: {userId: 0, _id: 0}})
                .toArray();
            return allSessions;
        }
        else
        {
            return session;
        }
    },

    //logout on all sessions(expect current)
    async deleteAllSessions (deviceId: string, userId: string) {

        const nowSession = await refreshTokenSessionCollection.findOne({deviceId: deviceId});

        if(nowSession != null)
        {
            await refreshTokenSessionCollection.deleteMany({userId: userId});
            await refreshTokenSessionCollection.insertOne(nowSession);
            return true;
         }
    },

    //logout in specific session
    async deleteSessionById(deviceId: string, userId: string): Promise<boolean> {

        const goodSession = await refreshTokenSessionCollection.findOne({userId: userId})

        if(goodSession)
        {
            if(goodSession.deviceId == deviceId)
            {
                await refreshTokenSessionCollection.deleteOne({deviceId: deviceId})
                return true
            }
            else
            {
                return false
            }
        }
        else
        {
            return false;
        }
    },
}