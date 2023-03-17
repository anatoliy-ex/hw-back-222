import {MongoClient} from "mongodb";
import {BlogsTypes} from "../types/blogsTypes";
import {PostsTypes} from "../types/postsTypes";
import {UsersTypes} from "../types/users.types";

const mongoUri = process.env.mongoURL || "mongodb+srv://flex:Wm6Jo7Gnuy4SCn7l@cluster0.b1gxtc6.mongodb.net/hw2-api-beck?retryWrites=true&w=majority";
export const client = new MongoClient(mongoUri)

export const db = client.db ("it-incubator-blog");
export const blogsCollection = db.collection<BlogsTypes>("blogs");
export const postsCollection = db.collection<PostsTypes>("posts");
export const usersCollection = db.collection<UsersTypes>("users")

export async function runDb()
{
    try
    {
        await client.connect();
        await client.db("blogs").command({ping: 1});
        console.log("Connect successfull to mongo server");
    }
    catch
    {
        console.log("Do not connect to db!!!");
        await client.close();
    }
}
