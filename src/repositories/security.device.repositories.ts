import { RefreshTokenSessionModel} from "../dataBase/db";

export const securityDevicesRepositories = {

    //get information  about all sessions
    async getInformationAboutAllSessions(userId: string) {

        return RefreshTokenSessionModel
            .find({userId: userId}, {projection: {userId: 0, _id: 0}})
            .lean()
    },

    //logout on all sessions(expect current)
    async deleteAllSessions (deviceId: string, userId: string) {

        return RefreshTokenSessionModel.deleteMany({userId, deviceId: {$ne: deviceId}})
    },

    //logout in specific session
    async deleteSessionById(deviceId: string, userId: string): Promise<boolean> {

        const res = await RefreshTokenSessionModel.deleteOne({deviceId, userId})
        return res.deletedCount === 1

    },

    async getDeviceByDeviceIdAndLastActiveDate(deviceId: string, lastActiveDate: string) {

        return RefreshTokenSessionModel.findOne({deviceId: deviceId, lastActiveDate: lastActiveDate})
    },
}