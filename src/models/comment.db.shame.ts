import mongoose from "mongoose";
import {TypeCommentatorInfo, TypeViewCommentModel} from "../types/comments.types";

export const commentSchema = new mongoose.Schema<TypeViewCommentModel<TypeCommentatorInfo>>({
    id: {type: String, required: true},
    content: {type: String, required: true},
    commentatorInfo: {
        userId: {type: String, required: true},
        userLogin: {type: String, required: true},
    },
    createdAt: {type: String, required: true},
    postId: {type: String, required: true},
})
