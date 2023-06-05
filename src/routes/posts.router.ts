import {Request, Response, Router} from "express"
export const postsRouter = Router({});
import {BlogsTypes} from "../types/blogs.types";
import {PostsTypes} from "../types/posts.types";
import {blogsRepositories} from "../repositories/blogs.repositories";
import {
    contentCommentValidator,
    createPostValidator,
    inputValidationMiddleware
} from "../middlewares/middleware.validators";
import {postsService} from "../domain/posts.service";
import {adminStatusAuth, authMiddleware} from "../middlewares/auth/auth.middleware";
import {postsRepositories} from "../repositories/posts.repositories";
import {commentRepositories} from "../repositories/comment.repositories";

export type PaginationQueryTypeForPosts = {
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageNumber: number,
    pageSize: number,
}

export const getPaginationFromQueryPostsAndComments = (query: any): PaginationQueryTypeForPosts => {

    const pageNumber = parseInt(query.pageNumber, 10);
    const pageSize = parseInt(query.pageSize, 10);
    const sortDirection = query.sortDirection === 'asc' ? 'asc' : 'desc';

    return {
        sortBy: query.sortBy ?? 'createdAt',
        sortDirection,
        pageNumber: isNaN(pageNumber) ? 1 : pageNumber,
        pageSize: isNaN(pageSize) ? 10 : pageSize,
    };
}

export type PaginationQueryTypeForComments = {
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageNumber: number,
    pageSize: number,
}

class PostsController {

    async GetCommentsForPost (req: Request, res: Response) {

        const post = await postsRepositories.getPostById(req.params.postId);

        if(post) {
            const paginationComments = getPaginationFromQueryPostsAndComments(req.query)
            const commentsForPost = await postsRepositories.getCommentsForPost(paginationComments, req.params.postId);
            res.status(200).send(commentsForPost);
        }
        else {
            res.sendStatus(404);
        }

    }

    async CreateNewComment (req: Request, res: Response) {

        const postForComment = await postsRepositories.getPostById(req.params.postId);
        const content =  req.body.content;

        if(req.user != null) {
            if(postForComment) {
                const newComment = await postsRepositories.createCommentForPost(req.params.postId, content, req.user);
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
        const allPosts = await postsService.allPosts(pagination);
        res.status(200).send(allPosts);
    }

    async CreateNewPost (req: Request, res: Response) {

        const foundBlog : BlogsTypes | null = await blogsRepositories.getBlogById(req.body.blogId);

        if(!foundBlog) {
            res.sendStatus(404);
        }
        else {
            const blogName = foundBlog.name;
            const newPost : PostsTypes = await postsService.createNewPost(req.body, blogName);
            res.status(201).send(newPost);
        }
    }

    async GetPostById (req: Request, res: Response) {

        const PostWithId : PostsTypes | null = await postsService.getPostById(req.params.id);

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

        const findBlogWithID = await blogsRepositories.getBlogById(req.body.blogId);
        const findPostWithID = await postsService.getPostById(req.params.id);

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

        const isDelete = await postsService.deletePostsById(req.params.id);

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
postsRouter.get('/:postId/comments', postController.GetCommentsForPost);
//create new comment
postsRouter.post('/:postId/comments',authMiddleware, contentCommentValidator, inputValidationMiddleware, postController.CreateNewComment);

//get all posts
postsRouter.get('/', postController.GetAllPosts);

//create new post
postsRouter.post('/', adminStatusAuth, createPostValidator, inputValidationMiddleware, postController.CreateNewPost);

//get post by ID
postsRouter.get('/:id', postController.GetPostById);

//update post by ID
postsRouter.put('/:id',adminStatusAuth, createPostValidator, inputValidationMiddleware, postController.UpdatePostById);

//delete post by ID
postsRouter.delete('/:id', adminStatusAuth, inputValidationMiddleware, postController.DeletePostById);