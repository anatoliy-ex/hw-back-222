import {postsCollection} from "../dataBase/db.posts.and.blogs";
import {postsTypes} from "../types/posts.types";
import {OutputType} from "../types/outputType";
import {PaginationQueryTypeForPosts} from "../routes/posts.routes";
import {postsRepositories} from "../repositories/posts.repositories";

export const postsService =
    {
        //return all posts
        async allPosts(pagination: PaginationQueryTypeForPosts) : Promise<OutputType<postsTypes[]>>
        {
            return postsRepositories.allPosts((pagination))
        },

        //create new post+++
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

            return postsRepositories.createNewPost(newPost);
        },

        //get post by ID
        async getPostById(id: string) : Promise<postsTypes | null>
        {
            return await postsRepositories.getPostById(id)

        },

        //update post by ID
        async updatePost(newPost : postsTypes, id: string) : Promise<boolean>
        {
           return await postsRepositories.updatePost(newPost, id)
        },

        //delete post by ID
        async deletePostsById(id: string) : Promise<boolean>
        {
            return await postsRepositories.deletePostsById(id)
        },
    };