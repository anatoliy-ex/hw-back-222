import {
    blogsCollection,
    postsCollection,
    usersCollection,
    usersNotConfirmCollection
} from "../dataBase/db.posts.and.blogs";
import {BlogsTypes} from "../types/blogs.types";
import {PostsTypes} from "../types/posts.types";
import {OutputType} from "../types/output.type";
import {PaginationQueryTypeForBlogs} from "../routes/blogs.router";
import {PaginationQueryTypeForPosts} from "../routes/posts.router";
import {blogsRepositories} from "../repositories/blogs.repositories";

export const blogsService =
    {
        //delete all
        async deleteAll(): Promise<[]> {
            await postsCollection.deleteMany({});
            await blogsCollection.deleteMany({});
            await usersCollection.deleteMany({});
            await usersNotConfirmCollection.deleteMany({})
            return [];
        },

        //return all blogs+++
        async allBlogs(pagination: PaginationQueryTypeForBlogs): Promise<OutputType<BlogsTypes[]>> {

            return blogsRepositories.allBlogs(pagination);
        },

        //create new blog+++
        async createNewBlog(blog: BlogsTypes): Promise<BlogsTypes> {

            const now = new Date();

            const newBlog = {
                id: `${Date.now()}`,
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                createdAt: now.toISOString(),
                isMembership: false,
            };

           return  blogsRepositories.createNewBlog(newBlog);
        },

        //get posts for specified blog
        async getPostsForBlog(pagination: PaginationQueryTypeForPosts, blogId: string): Promise<OutputType<PostsTypes[]>> {

            const posts = await blogsRepositories.getPostsForBlog(pagination, blogId)
            const countOfPosts = await postsCollection.countDocuments({blogId});
            const pageCount = Math.ceil(countOfPosts/pagination.pageSize);

            return {
                page: pagination.pageNumber,
                pagesCount: pageCount === 0 ? 1 : pageCount,
                pageSize: pagination.pageSize,
                totalCount: countOfPosts,
                items: posts
            }
        },

        //create new post for specific blog+++
        async createPostForSpecificBlog(post: PostsTypes, blogId: string, blogName: string): Promise<PostsTypes> {
            const now = new Date();

            const newPost =
                {
                    id: `${Date.now()}`,
                    title: post.title,
                    shortDescription: post.shortDescription,
                    content: post.content,
                    blogId: blogId,
                    blogName: blogName,
                    createdAt: now.toISOString(),
                };

            return blogsRepositories.createPostForSpecificBlog(newPost);
        },


        //get blog bu ID+++
        async getBlogById(id: string): Promise<BlogsTypes | null> {

            return await blogsRepositories.getBlogById(id);
        },

        //update blog by ID+++
        async updateBlog(newBlog: BlogsTypes, id: string): Promise<boolean> {

            return await blogsRepositories.updateBlog(newBlog, id);
        },

        //delete blog byID+++
        async deleteBlogById(id: string): Promise<boolean> {

            return await blogsRepositories.deleteBlogById(id);
        },
    }