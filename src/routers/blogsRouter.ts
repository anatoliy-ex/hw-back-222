import {Request, Response, Router} from "express"
export const blogsRouter = Router({});
import {BlogsTypes} from "../types/blogs.types";
import {PostsTypes} from "../types/posts.types";
import {createBlogValidator, createPostForBlog, inputValidationMiddleware} from "../middlewares/middleware.validators";
import {blogsService} from "../domain/blogs.service";
import {adminStatusAuth} from "../middlewares/auth/auth.middleware";
import {
    BlogModel,
    CommentModel,
    PostModel, RateLimitedModel,
    RefreshTokenSessionModel,
    UserModel,
    UserNotConfirmationModel} from "../dataBase/db";
import {getPaginationFromQueryBlogs} from "../pagination.query/blog.pagination";
import {getPaginationFromQueryPostsAndComments} from "../pagination.query/post.pagination";

class BlogsController {

    async ClearAllModelInDb (req: Request, res: Response) {

        await BlogModel.deleteMany()
        await PostModel.deleteMany()
        await UserModel.deleteMany()
        await CommentModel.deleteMany()
        await UserNotConfirmationModel.deleteMany()
        await RefreshTokenSessionModel.deleteMany()
        await RateLimitedModel.deleteMany()
        res.sendStatus(204);
    }

    async GetAllBlogs (req: Request, res: Response) {

        const pagination = getPaginationFromQueryBlogs(req.query);
        const allBlogs = await blogsService.allBlogs(pagination);
        res.status(200).send(allBlogs);
    }

    async CreateNewBlog (req: Request, res: Response) {

        const newBlog: BlogsTypes = await blogsService.createNewBlog(req.body)

        if (newBlog) {
            res.status(201).send(newBlog);
            return;
        }
        else {
            res.sendStatus(404);
            return;
        }
    }

    async GetPostsForSpecifiedBlog (req: Request, res: Response) {

        const foundBlog: BlogsTypes | null = await blogsService.getBlogById(req.params.blogId);

        if (foundBlog) {
            const pagination = getPaginationFromQueryPostsAndComments(req.query);
            const postsForBlog = await blogsService.getPostsForBlog(pagination, foundBlog.id);

            res.status(200).send(postsForBlog);
            return;
        }
        else {
            res.sendStatus(404);
            return
        }
    }

    async CreateNewPostForSpecificBlog (req: Request, res: Response) {

        const foundBlog: BlogsTypes | null = await blogsService.getBlogById(req.params.blogId);

        if (foundBlog) {
            const newPostsForBlog: PostsTypes = await blogsService.createPostForSpecificBlog(req.body, req.params.blogId, foundBlog.name)
            res.status(201).send(newPostsForBlog);
            return;
        }
        else {
            res.sendStatus(404);
            return;
        }
    }

    async GetBlogById (req: Request, res: Response) {

        const BlogWithId: BlogsTypes | null = await blogsService.getBlogById(req.params.id);

        if (BlogWithId) {
            res.status(200).send(BlogWithId);
            return;
        }
        else {
            res.sendStatus(404);
            return;
        }
    }

    async UpdateBlogById (req: Request, res: Response) {

        const isUpdated = await blogsService.updateBlog(req.body, req.params.id);

        if (isUpdated) {
            res.sendStatus(204);
            return;
        }
        else {
            res.sendStatus(404);
            return;
        }

    }

    async DeleteBlogById (req: Request, res: Response) {

        const isDelete = await blogsService.deleteBlogById(req.params.id);

        if (isDelete) {
            res.sendStatus(204);
            return;
        }
        else {
            res.sendStatus(404);
            return;
        }

    }
}

const blogController = new BlogsController()
//delete all
blogsRouter.delete('/all-data', blogController.ClearAllModelInDb)

//get all blogs
blogsRouter.get('/', blogController.GetAllBlogs);

//create new blogs
blogsRouter.post('/', adminStatusAuth, createBlogValidator, inputValidationMiddleware, blogController.CreateNewBlog);

//get posts for specified blog
blogsRouter.get('/:blogId/posts', blogController.GetPostsForSpecifiedBlog);

//create new post for specific blog
blogsRouter.post('/:blogId/posts', adminStatusAuth, createPostForBlog, inputValidationMiddleware, blogController.CreateNewPostForSpecificBlog);

//get blog by ID
blogsRouter.get('/:id', blogController.GetBlogById);

//update blog by ID
blogsRouter.put('/:id', adminStatusAuth, createBlogValidator, inputValidationMiddleware, blogController.UpdateBlogById);

//delete blog by id
blogsRouter.delete('/:id', adminStatusAuth, inputValidationMiddleware, blogController.DeleteBlogById);