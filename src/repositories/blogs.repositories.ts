import {blogsCollection, postsCollection} from "../dataBase/db.posts.and.blogs";
import {blogsTypes} from "../types/blogs.types";
import {postsTypes} from "../types/posts.types";
import {OutputType} from "../types/outputType";
import {PaginationQueryTypeForBlogs} from "../routes/blogs.routes";
import {PaginationQueryTypeForPosts} from "../routes/posts.routes";

export const blogsRepositories =
    {
        //delete all
        async deleteAll(): Promise<[]> {
            await postsCollection.deleteMany({});
            await blogsCollection.deleteMany({});
            return [];
        },

        //return all blogs
        // async allBlogs(blogs: outputTypes) : Promise<blogsTypes[]>
        async allBlogs(pagination: PaginationQueryTypeForBlogs): Promise<OutputType<blogsTypes[]>> {

            const filter = {name: {$regex: pagination.searchNameTerm, $options: 'i'}}

            const blogs: blogsTypes[] = await blogsCollection
                .find(filter, {projection: {_id: 0}})
                .sort({[pagination.sortBy]: pagination.sortDirection})
                .skip((pagination.pageNumber - 1) * pagination.pageSize)
                .limit(pagination.pageSize)
                .toArray();

            const countOfBlogs = await blogsCollection.countDocuments(filter);
            const pagesCount =  Math.ceil(countOfBlogs/pagination.pageSize);

            return {
                page: pagination.pageNumber,
                pagesCount: pagesCount === 0 ? 1 : pagesCount,
                pageSize: pagination.pageSize,
                totalCount: countOfBlogs,
                items: blogs
            };
        },

        //create new blog
        async createNewBlog(blog: blogsTypes): Promise<blogsTypes> {
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
        async getPostsForBlog(pagination: PaginationQueryTypeForPosts, blogId: string): Promise<OutputType<postsTypes[]>> {

            const filter = {name: {$regex: blogId, $options: 'i'}};

            const posts: postsTypes[] = await postsCollection
                .find( filter, {projection: {_id: 0}})
                .sort({[pagination.sortBy]: pagination.sortDirection})
                .skip((pagination.pageNumber - 1) * pagination.pageSize)
                .limit(pagination.pageSize)
                .toArray();

            const countOfPosts = await postsCollection.countDocuments(filter);
            const pageCount = Math.ceil(countOfPosts/pagination.pageSize);

            return {
                page: pagination.pageNumber,
                pagesCount: pageCount === 0 ? 1 : pageCount,
                pageSize: pagination.pageSize,
                totalCount: countOfPosts,
                items: posts
            }
        },

        //create new post for specific blog
        async createPostForSpecificBlog(post: postsTypes, blogId: string, blogName: string): Promise<postsTypes> {
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
            await postsCollection.insertOne({...newPost});
            return newPost;
        },

        //get blog bu ID
        async getBlogById(id: string): Promise<blogsTypes | null> {
            return await blogsCollection.findOne({id: id}, {projection: {_id: 0}});
        },

        //update blog by ID
        async updateBlog(newBlog: blogsTypes, id: string): Promise<boolean> {
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
        async deleteBlogById(id: string): Promise<boolean> {
            const isDeleted = await blogsCollection.deleteOne({id: id});
            return isDeleted.deletedCount === 1;
        }
    }
