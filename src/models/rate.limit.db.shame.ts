import mongoose from "mongoose";
import {RateLimitedTypes} from "../types/rate.limited.types";

export const rateLimitedSchema = new mongoose.Schema<RateLimitedTypes>({
    ip: {type: String, required: true},
    url: {type: String, required: true},
    connectionDate: {type: Date, required: true},
})