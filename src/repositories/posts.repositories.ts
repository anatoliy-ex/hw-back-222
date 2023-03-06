import {postsCollection} from "../dataBase/db.posts.and.blogs";
import {postsViewTypes} from "../types/posts.types";

export const postsRepositories =
{
    //return all posts
    async allPosts() : Promise<postsViewTypes[]>
    {
        return await postsCollection.find({},{projection: {_id: 0}}).toArray();
    },

    //create new post
    async createNewPost(post: postsViewTypes, blogName : string) : Promise<postsViewTypes>
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
            isMembership: post.isMembership,
        };
        await postsCollection.insertOne({...newPost});
        return newPost;
    },

    //get post by ID
    async getPostById(id: string) : Promise<postsViewTypes | null>
    {
        return await postsCollection.findOne({id: id}, {projection :{_id: 0}});

    },

    //update post by ID
    async updatePost(newPost : postsViewTypes, id: string) : Promise<boolean>
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