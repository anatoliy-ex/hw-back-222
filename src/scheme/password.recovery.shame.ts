import mongoose, {Schema} from "mongoose";
import {PasswordRecoveryType} from "../types/password.recovery.type";

export const passwordRecoveryShame = new mongoose.Schema<PasswordRecoveryType>({
    email: {type: String, required: true},
    confirmCode: {type: String, required: true},
    dateAt: {type: Date, required: true}
})