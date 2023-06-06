import {BlogModel, PostModel} from "../dataBase/db";
import {BlogsTypes} from "../types/blogs.types";
import {PostsTypes} from "../types/posts.types";
import {OutputType} from "../types/output.type";
import {PaginationQueryTypeForBlogs} from "../pagination.query/blog.pagination";
import {PaginationQueryTypeForPostsAndComments} from "../pagination.query/post.pagination";

class BlogsRepositories {

    //return all blogs
    async allBlogs(pagination: PaginationQueryTypeForBlogs): Promise<OutputType<BlogsTypes[]>> {

        const filter = {name: {$regex: pagination.searchNameTerm, $options: 'i'}}

        const blogs : BlogsTypes[] =  await BlogModel
            .find(filter)
            .select('-_id')
            .sort({[pagination.sortBy]: pagination.sortDirection})
            .skip((pagination.pageNumber - 1) * pagination.pageSize)
            .limit(pagination.pageSize)
            .lean()

        const countOfBlogs = await BlogModel.countDocuments(filter);
        const pagesCount =  Math.ceil(countOfBlogs/pagination.pageSize);

        return {
            page: pagination.pageNumber,
            pagesCount: pagesCount === 0 ? 1 : pagesCount,
            pageSize: pagination.pageSize,
            totalCount: countOfBlogs,
            items: blogs
        };
    }

    //create new blog
    async createNewBlog(newBlog: BlogsTypes): Promise<BlogsTypes> {

        await BlogModel.create({...newBlog});
        return newBlog;
    }

    //get posts for specified blog
    async getPostsForBlog(pagination: PaginationQueryTypeForPostsAndComments, blogId: string): Promise<PostsTypes[]> {

        const filter = {blogId: {$regex: blogId}}

        return PostModel
            .find(filter, {projection: {_id: 0}})
            .sort({[pagination.sortBy]: pagination.sortDirection})
            .skip((pagination.pageNumber - 1) * pagination.pageSize)
            .limit(pagination.pageSize)
            .lean()
    }

    //create new post for specific blog
    async createPostForSpecificBlog(newPost: PostsTypes): Promise<PostsTypes> {

        await PostModel.create({...newPost});
        return newPost;
    }

    //get blog bu ID
    async getBlogById(id: string): Promise<BlogsTypes | null> {
        return BlogModel.findOne({id: id}, {projection: {_id: 0}});
    }

    //update blog by ID
    async updateBlog(newBlog: BlogsTypes, id: string): Promise<boolean> {
        const result = await BlogModel.updateOne({id: id}, {
            $set: {
                    name: newBlog.name,
                    description: newBlog.description,
                    websiteUrl: newBlog.websiteUrl,
                }
        });
        return result.matchedCount === 1;
    }

    //delete blog byID
    async deleteBlogById(id: string): Promise<boolean> {

        const isDeleted = await BlogModel.deleteOne({id: id});
        return isDeleted.deletedCount === 1;
    }
}
export const blogsRepositories = new BlogsRepositories();
