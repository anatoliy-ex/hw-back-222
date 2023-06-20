import {Router} from "express"
import {refreshAuthMiddleware} from "../middlewares/auth/auth.middleware";
import {container} from "../roots/composition.root";
import {SecurityDeviceController} from "../controllers/security.devices.controller";

const securityDevicesController = container.resolve(SecurityDeviceController)

export const securityDevicesRouter = Router({});

//get information  about all sessions
securityDevicesRouter.get('/devices', refreshAuthMiddleware, securityDevicesController.GetInformationAboutAllSessions.bind(securityDevicesController));

//logout on all sessions(expect current)
securityDevicesRouter.delete('/devices', refreshAuthMiddleware, securityDevicesController.LogoutInAllAllSessions.bind(securityDevicesController));

//logout in specific session
securityDevicesRouter.delete('/devices/:deviceId', refreshAuthMiddleware, securityDevicesController.LogoutInSpecificSession.bind(securityDevicesController));