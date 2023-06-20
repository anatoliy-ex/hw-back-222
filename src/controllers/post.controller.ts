import {PostsService} from "../domain/posts.service";
import {postsRepositories, PostsRepositories} from "../repositories/posts.repositories";
import {BlogsRepositories} from "../repositories/blogs.repositories";
import {Request, Response} from "express";
import {getPaginationFromQueryPostsAndComments} from "../pagination.query/post.pagination";
import {BlogsTypes} from "../types/blogs.types";
import {PostsTypes} from "../types/posts.types";
import jwt from "jsonwebtoken";
import {settings} from "../../.env/settings";
import {authUsersRepositories} from "../repositories/auth.users.repositories";
import {injectable} from "inversify";
import {CommentRepositories} from "../repositories/comment.repositories";

@injectable()
export class PostsController {

    constructor(protected postsService: PostsService,
                protected commentRepositories: CommentRepositories,
                protected postsRepositories: PostsRepositories,
                protected blogsRepositories: BlogsRepositories) {
    }

    async GetCommentsForPost(req: Request, res: Response) {

        const post = await postsRepositories.getPostById(req.params.postId);

        let userId = null
        if (!req.headers.authorization) userId = null

        const token = req.headers.authorization?.split(' ')[1];
        if (!token) userId = null
        try {
            const IsDecode: any = jwt.verify(token!,  settings.JWT_SECRET)

            if (IsDecode) {
                const user = await authUsersRepositories.getUserWithAccessToken(token!)

                if (user === null) {
                    userId = null
                } else {
                    userId = user.id
                }
            }
        } catch (e) {
            userId = null
        }

        if (post) {
            const paginationComments = getPaginationFromQueryPostsAndComments(req.query)
            const commentsForPost = await this.postsRepositories.getCommentsForPost(paginationComments, req.params.postId, userId);
            res.status(200).send(commentsForPost);
        } else {
            res.sendStatus(404);
        }

    }

    async CreateNewComment(req: Request, res: Response) {

        const postForComment = await this.postsRepositories.getPostById(req.params.postId);
        const content = req.body.content;

        if (req.user != null) {
            if (postForComment) {
                const newComment = await this.postsRepositories.createCommentForPost(req.params.postId, content, req.user);
                const viewComment = await this.commentRepositories.getComment(newComment.id);
                res.status(201).send(viewComment);
            } else {
                res.sendStatus(404);
            }
        } else {
            res.sendStatus(404);
        }
    }

    async GetAllPosts(req: Request, res: Response) {

        const pagination = getPaginationFromQueryPostsAndComments(req.query);
        const allPosts = await this.postsService.allPosts(pagination);
        res.status(200).send(allPosts);
    }

    async CreateNewPost(req: Request, res: Response) {
        const foundBlog: BlogsTypes | null = await this.blogsRepositories.getBlogById(req.body.blogId);

        if (!foundBlog) {
            res.sendStatus(404);
        } else {
            const blogName = foundBlog.name;
            const newPost: PostsTypes = await this.postsService.createNewPost(req.body, blogName);
            res.status(201).send(newPost);
        }


    }

    async GetPostById(req: Request, res: Response) {

        const PostWithId: PostsTypes | null = await this.postsService.getPostById(req.params.id);

        if (PostWithId) {
            res.status(200).send(PostWithId);
            return;
        } else {
            res.sendStatus(404);
            return;
        }
    }

    async UpdatePostById(req: Request, res: Response) {

        const findBlogWithID = await this.blogsRepositories.getBlogById(req.body.blogId);
        const findPostWithID = await this.postsService.getPostById(req.params.id);

        if (findBlogWithID && findPostWithID) {
            await this.postsService.updatePost(req.body, req.params.id);
            res.sendStatus(204);
            return;
        } else {
            res.sendStatus(404);
            return;
        }
    }

    async DeletePostById(req: Request, res: Response) {

        const isDelete = await this.postsService.deletePostsById(req.params.id);

        if (isDelete) {
            res.sendStatus(204);
            return;
        } else {
            res.sendStatus(404);
            return;
        }
    }
}
