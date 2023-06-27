import {BlogsService} from "../domain/blogs.service";
import {Request, Response} from "express";
import {
    BlogModel,
    CommentModel, LikeModelForComment, LikeModelForPost, PasswordRecoveryModel,
    PostModel, RateLimitedModel,
    RefreshTokenSessionModel,
    UserModel,
    UserNotConfirmationModel
} from "../dataBase/db";
import {getPaginationFromQueryBlogs} from "../pagination.query/blog.pagination";
import {BlogsTypes} from "../types/blogs.types";
import {getPaginationFromQueryPostsAndComments} from "../pagination.query/post.pagination";
import {PostsTypes, UserLikes} from "../types/posts.types";
import {injectable} from "inversify";

@injectable()
export class BlogsController {

    constructor(protected blogsService : BlogsService) {}

    async ClearAllModelInDb (req: Request, res: Response) {

        await BlogModel.deleteMany()
        await PostModel.deleteMany()
        await UserModel.deleteMany()
        await CommentModel.deleteMany()
        await UserNotConfirmationModel.deleteMany()
        await RefreshTokenSessionModel.deleteMany()
        await RateLimitedModel.deleteMany()
        await PasswordRecoveryModel.deleteMany()
        await LikeModelForComment.deleteMany()
        await LikeModelForPost.deleteMany()
        res.sendStatus(204);
    }

    async GetAllBlogs (req: Request, res: Response) {

        const pagination = getPaginationFromQueryBlogs(req.query);
        const allBlogs = await this.blogsService.allBlogs(pagination);
        res.status(200).send(allBlogs);
    }

    async CreateNewBlog (req: Request, res: Response) {

        const newBlog: BlogsTypes = await this.blogsService.createNewBlog(req.body)

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

        const foundBlog: BlogsTypes | null = await this.blogsService.getBlogById(req.params.blogId);

        if (foundBlog) {
            const pagination = getPaginationFromQueryPostsAndComments(req.query);
            const postsForBlog = await this.blogsService.getPostsForBlog(pagination, foundBlog.id);

            res.status(200).send(postsForBlog);
            return;
        }
        else {
            res.sendStatus(404);
            return
        }
    }

    async CreateNewPostForSpecificBlog (req: Request, res: Response) {

        const foundBlog: BlogsTypes | null = await this.blogsService.getBlogById(req.params.blogId);

        if (foundBlog) {
            const newPostsForBlog: PostsTypes<UserLikes> = await this.blogsService.createPostForSpecificBlog(req.body, req.params.blogId, foundBlog.name)
            res.status(201).send(newPostsForBlog);
            return;
        }
        else {
            res.sendStatus(404);
            return;
        }
    }

    async GetBlogById (req: Request, res: Response) {

        const BlogWithId: BlogsTypes | null = await this.blogsService.getBlogById(req.params.id);

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

        const isUpdated = await this.blogsService.updateBlog(req.body, req.params.id);

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

        const isDelete = await this.blogsService.deleteBlogById(req.params.id);

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