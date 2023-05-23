import {UserConfirmTypes} from "./userConfirmTypes";

declare global {
    declare namespace  Express {
        export interface Request {
            user: UserConfirmTypes | null
            deviceId: string | null
        }
    }
}