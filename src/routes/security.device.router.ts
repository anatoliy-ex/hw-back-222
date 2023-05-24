import {Request, Response, Router} from "express"
import {refreshAuthMiddleware} from "../middlewares/auth/auth.middleware";
import {securityDevicesRepositories} from "../repositories/security.device.repositories";
import {refreshTokenSessionCollection} from "../dataBase/db.posts.and.blogs";
import {jwtService} from "../application/jwtService";

export const securityDeviceRouter = Router({});

//get information  about all sessions
securityDeviceRouter.get('/devices', refreshAuthMiddleware, async (req: Request, res: Response) => {

    const refreshToken = req.cookies.refreshToken!

    const deviceId = req.deviceId!
    const userId = req.user!.id

    const lastActiveDate = await jwtService.getLastActiveDateFromToken(refreshToken)

    const device = await securityDevicesRepositories.getDeviceByDeviceIdAndLastActiveDate(deviceId, lastActiveDate)

    if(!device) return res.sendStatus(401)
    let allSessions = await securityDevicesRepositories.getInformationAboutAllSessions(userId);
    console.log(allSessions)
    res.status(200).send(allSessions)
});

//logout on all sessions(expect current)
securityDeviceRouter.delete('/devices', refreshAuthMiddleware, async (req: Request, res: Response) => {

    const userId = req.user!.id
    const deviceId = req.deviceId!

    const isDeletedAll = await securityDevicesRepositories.deleteAllSessions(deviceId, userId)

    if (isDeletedAll) {
        res.sendStatus(204);
    } else {
        res.sendStatus(401)
    }
});

//logout in specific session
securityDeviceRouter.delete('/devices/:deviceId', refreshAuthMiddleware, async (req: Request, res: Response) => {

    const userId = req.user!.id
    const deviceId = req.params.deviceId

    const device = await refreshTokenSessionCollection.findOne({deviceId})

    if (!device) return res.sendStatus(404);
    if (device.userId !== userId) return res.sendStatus(403);

    await securityDevicesRepositories.deleteSessionById(deviceId, userId);
    return res.sendStatus(204)
});