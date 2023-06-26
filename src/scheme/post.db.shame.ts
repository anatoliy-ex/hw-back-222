import mongoose from "mongoose";
import {PostsTypes, UserLikes} from "../types/posts.types";
import {LikeStatusesEnum} from "./like.status.user.for.comment.shame";

export const postSchema = new mongoose.Schema<PostsTypes<UserLikes>>({
    id: {type: String, required: true},
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId:	{type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String, required: true},
    extendedLikesInfo: {
        likesCount: {type: Number, required: true},
        dislikesCount: {type: Number, required: true},
        myStatus: {type: String, required: true},
        newestLikes: [{
            addedAt: String,
            userId: String,
            login: String,
            likeStatus: String
        }]
    }
})