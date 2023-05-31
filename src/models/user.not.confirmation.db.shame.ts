import mongoose from "mongoose";
import {UserIsNotConfirmTypes} from "../types/userConfirmTypes";

export const userNotConfirmationSchema = new mongoose.Schema<UserIsNotConfirmTypes>({
    id: {type: String, required: true},
    login: {type: String, required: true},
    hash: {type: String, required: true},
    email: {type: String, required: true},
    createdAt: {type: String, required: true},
    isConfirm: {type: Boolean, required: true},
    confirmationCode: {type: String, required: true},
    expirationDate: {type: Date, required: true},
})