import mongoose from "mongoose";
import {PostsTypes} from "../types/posts.types";

export const postSchema = new mongoose.Schema<PostsTypes>({
    id: {type: String, required: true},
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId:	{type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String, required: true},
})