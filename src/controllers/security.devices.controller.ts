import {JwtTokenService} from "../application/jwt.token.service";
import {SecurityDevicesRepositories} from "../repositories/security.device.repositories";
import {Request, Response} from "express";
import {RefreshTokenSessionModel} from "../dataBase/db";

export class  SecurityDeviceController {

    constructor(protected securityDevicesRepositories : SecurityDevicesRepositories,
                protected jwtTokenService : JwtTokenService) {}

    async GetInformationAboutAllSessions (req: Request, res: Response) {

        const refreshToken = req.cookies.refreshToken!
        const deviceId = req.deviceId!
        const userId = req.user!.id
        const lastActiveDate = await this.jwtTokenService.getLastActiveDateFromToken(refreshToken);
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
