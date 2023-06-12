import mongoose from "mongoose";
import {LikeStatusUserForComment} from "../types/like.status.user.for.comment";

export const likeStatusUserForCommentShame = new mongoose.Schema<LikeStatusUserForComment>({
    commentId: {type: String, required: true},
    userStatus: {type: String, required: true},
    userId: {type: String, required: true},
})