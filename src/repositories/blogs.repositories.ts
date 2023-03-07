import {blogsCollection, postsCollection} from "../dataBase/db.posts.and.blogs";
import {blogsViewTypes} from "../types/blogs.types";
import {postsViewTypes} from "../types/posts.types";

export const blogsRepositories =
{
    //delete all
    async deleteAll() : Promise<[]>
    {
        await postsCollection.deleteMany({});
        await blogsCollection.deleteMany({});
        return[];
    },

    //return all blogs
    async allBlogs() : Promise<blogsViewTypes[]>
    {
        return await blogsCollection.find({}, {projection: {_id: 0}}).toArray();
    },

    //create new blog
    async createNewBlog(blog: blogsViewTypes) : Promise<blogsViewTypes>
    {
        const now = new Date();

        const newBlog = {
            id: `${Date.now()}`,
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: now.toISOString(),
            isMembership: false,
        };
        await blogsCollection.insertOne({...newBlog});
        return newBlog;
    },

    //get posts for specified blog
    async getPostsForBlog(blogId : string): Promise<postsViewTypes[]>
    {
       return await postsCollection.find({id: blogId}, {projection: {_id: 0}}).toArray();
    },

    //create new post for specific blog
    async createPostForSpecificBlog(post: postsViewTypes, blogId :string, blogName: string) : Promise<postsViewTypes>
    {
        const now = new Date();

        const newPost  =
            {
                id: `${Date.now()}`,
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: blogId,
                blogName: blogName,
                createdAt: now.toISOString(),
            };
        await postsCollection.insertOne({...newPost});
        return newPost;
    },

    //get blog bu ID
    async getBlogById(id: string): Promise<blogsViewTypes | null>
    {
        return await blogsCollection.findOne({id: id}, {projection: {_id: 0}});
    },

    //update blog by ID
    async updateBlog(newBlog : blogsViewTypes, id: string) : Promise<boolean>
    {
        const result = await blogsCollection.updateOne({id: id}, {
            $set:
            {
                name: newBlog.name,
                description: newBlog.description,
                websiteUrl: newBlog.websiteUrl,
            }
        });
        return result.matchedCount === 1;
    },

    //delete blog byID
    async deleteBlogById(id: string) : Promise<boolean>
    {
        const isDeleted = await blogsCollection.deleteOne({id: id});
        return isDeleted.deletedCount === 1;
    }
}
