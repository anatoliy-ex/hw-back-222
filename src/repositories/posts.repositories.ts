import {postsCollection} from "../dataBase/db.posts.and.blogs";
import {postsTypes} from "../types/posts.types";

export const postsRepositories =
{
    //return all posts
    async allPosts() : Promise<postsTypes[]>
    {
        return await postsCollection.find({},{projection: {_id: 0}}).toArray();
    },

    //create new post
    async createNewPost(post: postsTypes, blogName : string) : Promise<postsTypes>
    {
        const now = new Date();

        const newPost  =
        {
            id: `${Date.now()}`,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: blogName,
            createdAt: now.toISOString(),
        };
        await postsCollection.insertOne({...newPost});
        return newPost;
    },

    //get post by ID
    async getPostById(id: string) : Promise<postsTypes | null>
    {
        return await postsCollection.findOne({id: id}, {projection :{_id: 0}});

    },

    //update post by ID
    async updatePost(newPost : postsTypes, id: string) : Promise<boolean>
    {
        const result = await postsCollection.updateOne({id: id}, {
            $set:
            {
                title: newPost.title,
                shortDescription: newPost.shortDescription,
                content: newPost.content,
                blogId: newPost.blogId
            }
        });
        return result.matchedCount === 1;
    },

    //delete post by ID
    async deletePostsById(id: string) : Promise<boolean>
    {
        const isDeleted = await postsCollection.deleteOne({id: id});
        return isDeleted.deletedCount === 1;
    },
};