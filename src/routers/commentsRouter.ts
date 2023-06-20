import {Router} from "express"
import {authMiddleware, checkForUser} from "../middlewares/auth/auth.middleware";
import {
    contentCommentValidator,
    inputValidationMiddleware,
    likeStatusValidator
} from "../middlewares/middleware.validators";
import {container} from "../roots/composition.root";
import {CommentsController} from "../controllers/comments.controller";
export const commentsRouter = Router({});

const commentController = container.resolve(CommentsController)

//like and dislike status
commentsRouter.put('/:commentId/like-status', authMiddleware, likeStatusValidator, inputValidationMiddleware , commentController.LikeAndDislikeStatus.bind(commentController));

//update comment by ID
commentsRouter.put('/:commentId', authMiddleware, checkForUser, contentCommentValidator, inputValidationMiddleware , commentController.UpdateCommentById.bind(commentController));

//delete comment by ID
commentsRouter.delete('/:commentId', authMiddleware, checkForUser, commentController.DeleteCommentById.bind(commentController));

//get comment by ID
commentsRouter.get('/:id', commentController.GetCommentById.bind(commentController));