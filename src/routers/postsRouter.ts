import {Request, Response, Router} from "express"
export const postsRouter = Router({});
import {BlogsTypes} from "../types/blogs.types";
import {PostsTypes} from "../types/posts.types";
import {BlogsRepositories, blogsRepositories} from "../repositories/blogs.repositories";
import {
    contentCommentValidator,
    createPostValidator,
    inputValidationMiddleware
} from "../middlewares/middleware.validators";
import {PostsService, postsService} from "../domain/posts.service";
import {adminStatusAuth, authMiddleware} from "../middlewares/auth/auth.middleware";
import {PostsRepositories, postsRepositories} from "../repositories/posts.repositories";
import {commentRepositories} from "../repositories/comment.repositories";
import {getPaginationFromQueryPostsAndComments} from "../pagination.query/post.pagination";


class PostsController {

    private postsService : PostsService
    private postsRepositories : PostsRepositories
    private blogsRepositories: BlogsRepositories

    constructor() {

        this.postsService = new PostsService()
        this.postsRepositories = new PostsRepositories()
        this.blogsRepositories = new BlogsRepositories()
    }

    async GetCommentsForPost (req: Request, res: Response) {

        const post = await postsRepositories.getPostById(req.params.postId);

        if(post) {
            const paginationComments = getPaginationFromQueryPostsAndComments(req.query)
            const commentsForPost = await this.postsRepositories.getCommentsForPost(paginationComments, req.params.postId);
            res.status(200).send(commentsForPost);
        }
        else {
            res.sendStatus(404);
        }

    }

    async CreateNewComment (req: Request, res: Response) {

        const postForComment = await this.postsRepositories.getPostById(req.params.postId);
        const content =  req.body.content;

        if(req.user != null) {
            if(postForComment) {
                const newComment = await this.postsRepositories.createCommentForPost(req.params.postId, content, req.user);
                const viewComment = await commentRepositories.getComment(newComment.id);
                res.status(201).send(viewComment);
            }
            else {
                res.sendStatus(404);
            }
        }
        else {
            res.sendStatus(404);
        }
    }

    async GetAllPosts (req: Request, res: Response) {

        const pagination = getPaginationFromQueryPostsAndComments(req.query);
        const allPosts = await this.postsService.allPosts(pagination);
        res.status(200).send(allPosts);
    }

    async CreateNewPost (req: Request, res: Response) {

        const foundBlog : BlogsTypes | null = await blogsRepositories.getBlogById(req.body.blogId);

        if(!foundBlog) {
            res.sendStatus(404);
        }
        else {
            const blogName = foundBlog.name;
            const newPost : PostsTypes = await this.postsService.createNewPost(req.body, blogName);
            res.status(201).send(newPost);
        }
    }

    async GetPostById (req: Request, res: Response) {

        const PostWithId : PostsTypes | null = await this.postsService.getPostById(req.params.id);

        if(PostWithId) {
            res.status(200).send(PostWithId);
            return;
        }
        else {
            res.sendStatus(404);
            return;
        }
    }

    async UpdatePostById (req: Request, res: Response) {

        const findBlogWithID = await this.blogsRepositories.getBlogById(req.body.blogId);
        const findPostWithID = await this.postsService.getPostById(req.params.id);

        if(findBlogWithID && findPostWithID) {
            await postsService.updatePost(req.body, req.params.id);
            res.sendStatus(204);
            return;
        }
        else {
            res.sendStatus(404);
            return;
        }
    }

    async DeletePostById (req: Request, res: Response) {

        const isDelete = await this.postsService.deletePostsById(req.params.id);

        if(isDelete) {
            res.sendStatus(204);
            return;
        }
        else {
            res.sendStatus(404);
            return;
        }
    }
}

const postController = new PostsController()
//get comment for post
postsRouter.get('/:postId/comments', postController.GetCommentsForPost.bind(postController));

//create new comment
postsRouter.post('/:postId/comments',authMiddleware, contentCommentValidator, inputValidationMiddleware, postController.CreateNewComment.bind(postController));

//get all posts
postsRouter.get('/', postController.GetAllPosts.bind(postController));

//create new post
postsRouter.post('/', adminStatusAuth, createPostValidator, inputValidationMiddleware, postController.CreateNewPost.bind(postController));

//get post by ID
postsRouter.get('/:id', postController.GetPostById.bind(postController));

//update post by ID
postsRouter.put('/:id',adminStatusAuth, createPostValidator, inputValidationMiddleware, postController.UpdatePostById.bind(postController));

//delete post by ID
postsRouter.delete('/:id', adminStatusAuth, inputValidationMiddleware, postController.DeletePostById.bind(postController));