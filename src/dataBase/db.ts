
import {settings} from "../../.env/settings";
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
