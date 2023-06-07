import {Router} from "express"
import {refreshAuthMiddleware} from "../middlewares/auth/auth.middleware";
import {securityDevicesController} from "../roots/composition.root";

export const securityDevicesRouter = Router({});

//get information  about all sessions
securityDevicesRouter.get('/devices', refreshAuthMiddleware, securityDevicesController.GetInformationAboutAllSessions.bind(securityDevicesController));

//logout on all sessions(expect current)
securityDevicesRouter.delete('/devices', refreshAuthMiddleware, securityDevicesController.LogoutInAllAllSessions.bind(securityDevicesController));

//logout in specific session
securityDevicesRouter.delete('/devices/:deviceId', refreshAuthMiddleware, securityDevicesController.LogoutInSpecificSession.bind(securityDevicesController));