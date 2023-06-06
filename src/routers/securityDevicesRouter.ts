import {Request, Response, Router} from "express"
import {refreshAuthMiddleware} from "../middlewares/auth/auth.middleware";
import {SecurityDevicesRepositories, securityDevicesRepositories} from "../repositories/security.device.repositories";
import {RefreshTokenSessionModel} from "../dataBase/db";
import {jwtService} from "../application/jwtService";

export const securityDevicesRouter = Router({});

export class  SecurityDeviceController {

    private securityDevicesRepositories : SecurityDevicesRepositories

    constructor() {

        this.securityDevicesRepositories = new SecurityDevicesRepositories()
    }
    async GetInformationAboutAllSessions (req: Request, res: Response) {

        const refreshToken = req.cookies.refreshToken!
        const deviceId = req.deviceId!
        const userId = req.user!.id
        const lastActiveDate = await jwtService.getLastActiveDateFromToken(refreshToken);
        const device = await this.securityDevicesRepositories.getDeviceByDeviceIdAndLastActiveDate(deviceId, lastActiveDate);

        if(!device) return res.sendStatus(401);
        let allSessions = await this.securityDevicesRepositories.getInformationAboutAllSessions(userId);
        res.status(200).send(allSessions);
    }

    async LogoutInAllAllSessions (req: Request, res: Response) {

        const userId = req.user!.id
        const deviceId = req.deviceId!
        const isDeletedAll = await this.securityDevicesRepositories.deleteAllSessions(deviceId, userId);

        if (isDeletedAll) {
            res.sendStatus(204);
        }
        else {
            res.sendStatus(401);
        }
    }

    async LogoutInSpecificSession (req: Request, res: Response) {

        const userId = req.user!.id;
        const deviceId = req.params.deviceId;
        const device = await RefreshTokenSessionModel.findOne({deviceId});

        if (!device) return res.sendStatus(404);
        if (device.userId !== userId) return res.sendStatus(403);

        await this.securityDevicesRepositories.deleteSessionById(deviceId, userId);
        return res.sendStatus(204)
    }
}

const securityDevicesController = new SecurityDeviceController()

//get information  about all sessions
securityDevicesRouter.get('/devices', refreshAuthMiddleware, securityDevicesController.GetInformationAboutAllSessions.bind(securityDevicesController));

//logout on all sessions(expect current)
securityDevicesRouter.delete('/devices', refreshAuthMiddleware, securityDevicesController.LogoutInAllAllSessions.bind(securityDevicesController));

//logout in specific session
securityDevicesRouter.delete('/devices/:deviceId', refreshAuthMiddleware, securityDevicesController.LogoutInSpecificSession.bind(securityDevicesController));