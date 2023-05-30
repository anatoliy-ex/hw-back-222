import {MongoClient} from "mongodb";
import {BlogsTypes} from "../types/blogs.types";
import {PostsTypes} from "../types/posts.types";
import {UserConfirmTypes, UserIsNotConfirmTypes} from "../types/userConfirmTypes";
import {TypeCommentatorInfo, TypeViewCommentModel} from "../types/comments.types";
import {settings} from "../../.env/settings";
import {RefreshTokenSessionsTypes} from "../types/refreshTokenSessionsTypes";
import exp from "constants";
import {RateLimitedTypes} from "../types/rate.limited.types";

const mongoUri = settings.MONGO_URI
export const client = new MongoClient(mongoUri)

export const db = client.db ("it-incubator-blog");

export const blogsCollection = db.collection<BlogsTypes>("blogs");
export const postsCollection = db.collection<PostsTypes>("posts");
export const usersCollection = db.collection<UserConfirmTypes>("users")
export const commentsCollection = db.collection<TypeViewCommentModel<TypeCommentatorInfo>>("comments")
export const usersNotConfirmCollection = db.collection<UserIsNotConfirmTypes>("notConfirmUser")
export const refreshTokenSessionCollection = db.collection<RefreshTokenSessionsTypes>('refreshToken')
export const rateLimitedCollection = db.collection<RateLimitedTypes>("rateLimitedMeta")

export const collections = [blogsCollection, postsCollection, usersCollection,
    commentsCollection, usersNotConfirmCollection, refreshTokenSessionCollection, rateLimitedCollection]

export async function runDb()
{
    try
    {
        await client.connect();
        await client.db("blogs").command({ping: 1});
        console.log("Connect successfully to mongo server");
    }
    catch
    {
        console.log("Do not connect to db!!!");
        await client.close();
    }
}
