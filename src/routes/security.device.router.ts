import  {Request, Response, Router} from "express"
import {refreshAuthMiddleware} from "../middlewares/auth/auth.middleware";
import {securityDevicesRepositories} from "../repositories/security.device.repositories";
import jwt from "jsonwebtoken";
import {settings} from "../../.env/settings";
import {refreshTokenSessionCollection} from "../dataBase/db.posts.and.blogs";
export const securityDeviceRouter = Router({});

//get information  about all sessions
securityDeviceRouter.get('/devices', async (req: Request, res: Response) =>{

    const refreshToken = req.cookies.refreshToken

    if(!refreshToken)
    {
        res.sendStatus(401)
    }

    const result : any = jwt.verify(refreshToken, settings.REFRESH_TOKEN_SECRET)

    if(result)
    {
        const deviceId =  result.deviceId
        const userId = req.user!.id
        let allSessions = await securityDevicesRepositories.getInformationAboutAllSessions(deviceId, userId);
        res.status(200).send(allSessions)
    }
    else
    {
        res.sendStatus(401)
    }
});

//logout on all sessions(expect current)
securityDeviceRouter.delete('/devices', refreshAuthMiddleware, async (req: Request, res: Response) =>{

    const refreshToken = req.cookies.refreshToken
    const result : any = jwt.verify(refreshToken, settings.REFRESH_TOKEN_SECRET)
    const deviceId =  result.deviceId
    const userId = req.user!.id
    const isDeletedAll = await securityDevicesRepositories.deleteAllSessions(deviceId, userId)

    if(isDeletedAll)
    {
        res.sendStatus(204);
    }
});

//logout in specific session
securityDeviceRouter.delete('/devices/:deviceId', refreshAuthMiddleware,  async (req: Request, res: Response) =>{

    const sessionsFind = await refreshTokenSessionCollection.findOne({deviceId: req.body.deviceId})

    if(!sessionsFind)
    {
        res.sendStatus(404);
    }

    const userId = req.user!.id
    const isDeleted  = await securityDevicesRepositories.deleteSessionById(req.body.deviceId,userId);
    if(isDeleted)
    {
        res.sendStatus(204);
    }
    else
    {
        res.sendStatus(403);
    }
});