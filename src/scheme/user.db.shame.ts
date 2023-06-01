import mongoose from "mongoose";
import {UserConfirmTypes} from "../types/userConfirmTypes";

export const userSchema = new mongoose.Schema<UserConfirmTypes>({
    id: {type: String, required: true},
    login: {type: String, required: true},
    hash: {type: String, required: true},
    email: {type: String, required: true},
    createdAt: {type: String, required: true},
    isConfirm: {type: Boolean, required: true},
})