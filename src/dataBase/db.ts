import {MongoClient} from "mongodb";
import {BlogsTypes} from "../types/blogs.types";
import {PostsTypes} from "../types/posts.types";
import {UserConfirmTypes, UserIsNotConfirmTypes} from "../types/userConfirmTypes";
import {TypeCommentatorInfo, TypeViewCommentModel} from "../types/comments.types";
import {settings} from "../../.env/settings";
import {RefreshTokenSessionsTypes} from "../types/refreshTokenSessionsTypes";
import {RateLimitedTypes} from "../types/rate.limited.types";
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import {userNotConfirmationSchema} from "../models/user.not.confirmation.db.shame";
import {blogSchema} from "../models/blog.db.shame";
import {postSchema} from "../models/post.db.shame";
import {userSchema} from "../models/user.db.shame";
import {refreshTokenSchema} from "../models/refresh.token.session.db.shame";
import {rateLimitedSchema} from "../models/rate.limit.db.shame";
import {commentSchema} from "../models/comment.db.shame";
dotenv.config()



//const mongoUri = settings.MONGO_URI
//export const client = new MongoClient(mongoUri)

//export const db = client.db ("it-incubator-blog");

const dbName = 'it-incubator-blog'
const mongoURI = settings.MONGO_URI || `mongodb://0.0.0.0:27017/${dbName}`

export const BlogModel = mongoose.model('blogs', blogSchema)
export const PostModel = mongoose.model('posts', postSchema)
export const UserModel = mongoose.model('users', userSchema)
export const CommentModel = mongoose.model('comments', commentSchema)
export const userNotConfirmationModel = mongoose.model('userNotConfirmation', userNotConfirmationSchema)
export const RefreshTokenSessionModel = mongoose.model('refreshTokenSession', refreshTokenSchema)
export const RateLimitedModel = mongoose.model('rateLimited', rateLimitedSchema)



export const collections = [
    BlogModel,
    PostModel,
    UserModel,
    CommentModel,
    userNotConfirmationModel,
    RefreshTokenSessionModel,
    RateLimitedModel,]

export async function runDb() {
    try {
        await mongoose.connect(mongoURI)
        console.log('It is ok, DB connecting!!!')
    } catch (e) {
        console.log('No connection DB!!!')
        await mongoose.disconnect()
    }
}
