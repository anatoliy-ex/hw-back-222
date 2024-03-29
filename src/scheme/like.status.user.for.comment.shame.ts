import mongoose from "mongoose";
import {LikeStatusUserForComment} from "../types/like.status.user.for.comment";

export enum LikeStatusesEnum {
    Like = 'Like',
    Dislike = 'Dislike',
    None = 'None',
}

export const likeStatusUserForCommentShame = new mongoose.Schema<LikeStatusUserForComment>({
    commentId: {type: String, required: true},
    userStatus: {type: String, enum: LikeStatusesEnum, required: true},
    userId: {type: String, required: true},
})