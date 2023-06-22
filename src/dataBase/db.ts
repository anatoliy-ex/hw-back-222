
import {settings} from "../../.env/settings";
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import {userNotConfirmationSchema} from "../scheme/user.not.confirmation.db.shame";
import {blogSchema} from "../scheme/blog.db.shame";
import {postSchema} from "../scheme/post.db.shame";
import {userSchema} from "../scheme/user.db.shame";
import {refreshTokenSchema} from "../scheme/refresh.token.session.db.shame";
import {rateLimitedSchema} from "../scheme/rate.limit.db.shame";
import {commentSchema} from "../scheme/comment.db.shame";
import {passwordRecoveryShame} from "../scheme/password.recovery.shame";
import {likeStatusUserForCommentShame} from "../scheme/like.status.user.for.comment.shame";
import {likeStatusUserForPostShame} from "../scheme/like.status.user.for.post.sheme";
dotenv.config()

const dbName = 'it-incubator-blog'
const mongoURI = settings.MONGO_URI || `mongodb://0.0.0.0:27017/${dbName}`

export const BlogModel = mongoose.model('blogs', blogSchema)
export const PostModel = mongoose.model('posts', postSchema)
export const UserModel = mongoose.model('users', userSchema)
export const CommentModel = mongoose.model('comments', commentSchema)
export const UserNotConfirmationModel = mongoose.model('userNotConfirmation', userNotConfirmationSchema)
export const RefreshTokenSessionModel = mongoose.model('refreshTokenSession', refreshTokenSchema)
export const RateLimitedModel = mongoose.model('rateLimited', rateLimitedSchema)
export const PasswordRecoveryModel = mongoose.model('passwordRecovery', passwordRecoveryShame)
export const LikeModelForComment = mongoose.model('likeModelForComment', likeStatusUserForCommentShame)
export const LikeModelForPost = mongoose.model('likeModelForPost', likeStatusUserForPostShame)

export const collections = [
    BlogModel,
    PostModel,
    UserModel,
    CommentModel,
    UserNotConfirmationModel,
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
