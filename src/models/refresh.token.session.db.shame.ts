import mongoose from "mongoose";
import {RefreshTokenSessionsTypes} from "../types/refreshTokenSessionsTypes";

export const refreshTokenSchema = new mongoose.Schema<RefreshTokenSessionsTypes>({
    deviceId: {type: String, required: true},
    ip: {type: String, required: true},
    title: {type: String, required: true},//device name
    lastActiveDate: {type: String, required: true},
    userId: {type: String, required: true},
})