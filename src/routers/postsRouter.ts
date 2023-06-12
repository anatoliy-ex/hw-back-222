import { Router} from "express"
export const postsRouter = Router({});
import {
    contentCommentValidator,
    createPostValidator,
    inputValidationMiddleware} from "../middlewares/middleware.validators";
import {adminStatusAuth, authMiddleware} from "../middlewares/auth/auth.middleware";
import {postController} from "../roots/composition.root";

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