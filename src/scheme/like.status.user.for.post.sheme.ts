import mongoose from "mongoose";
import {LikeStatusUserForPost} from "../types/like.status.user.for.post";

export enum LikeStatusesEnum {
    Like = 'Like',
    Dislike = 'Dislike',
    None = 'None',
}

export const likeStatusUserForPostShame = new mongoose.Schema<LikeStatusUserForPost>({
    postId: {type: String, required: true},
    userStatus: {type: String, enum: LikeStatusesEnum, required: true},
    userId: {type: String, required: true},
    addedAt: {type: String, required: true},
    login: {type: String, required: true}
})