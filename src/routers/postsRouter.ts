import { Router} from "express"
export const postsRouter = Router({});
import {
    contentCommentValidator,
    createPostValidator,
    inputValidationMiddleware, likeStatusValidator
} from "../middlewares/middleware.validators";
import {adminStatusAuth, authMiddleware, authNotBlock} from "../middlewares/auth/auth.middleware";
import {container} from "../roots/composition.root";
import {PostsController} from "../controllers/post.controller";

const postController = container.resolve(PostsController)

//update like and dislike on post
postsRouter.put('/:postId/like-status', authMiddleware, likeStatusValidator, inputValidationMiddleware, postController.LikeAndDislikeStatusForPost.bind(postController));
//get comment for post
postsRouter.get('/:postId/comments', postController.GetCommentsForPost.bind(postController));

//create new comment
postsRouter.post('/:postId/comments',authMiddleware, contentCommentValidator, inputValidationMiddleware, postController.CreateNewComment.bind(postController));

//get all posts
postsRouter.get('/', authNotBlock, postController.GetAllPosts.bind(postController));

//create new post
postsRouter.post('/', adminStatusAuth, createPostValidator, inputValidationMiddleware, postController.CreateNewPost.bind(postController));

//get post by ID
postsRouter.get('/:id', authNotBlock, postController.GetPostById.bind(postController));

//update post by ID
postsRouter.put('/:id',adminStatusAuth, createPostValidator, inputValidationMiddleware, postController.UpdatePostById.bind(postController));

//delete post by ID
postsRouter.delete('/:id', adminStatusAuth, inputValidationMiddleware, postController.DeletePostById.bind(postController));