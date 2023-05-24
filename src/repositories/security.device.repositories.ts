import { refreshTokenSessionCollection} from "../dataBase/db.posts.and.blogs";

export const securityDevicesRepositories = {

    //get information  about all sessions
    async getInformationAboutAllSessions( userId: string) {

        return refreshTokenSessionCollection.find({userId}, {projection: {userId: 0, _id: 0}}).toArray()
    },

    //logout on all sessions(expect current)
    async deleteAllSessions (deviceId: string, userId: string) {

        return refreshTokenSessionCollection.deleteMany({userId, deviceId: {$ne: deviceId}})
    },

    //logout in specific session
    async deleteSessionById(deviceId: string, userId: string): Promise<boolean> {

        const res = await refreshTokenSessionCollection.deleteOne({deviceId, userId})
        return res.deletedCount === 1

    },

    async getDeviceByDeviceIdAndLastActiveDate(deviceId: string, lastActiveDate: string) {

        return refreshTokenSessionCollection.findOne({deviceId, lastActiveDate})
    },
}