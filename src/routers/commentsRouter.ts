import {Router} from "express"
import {authMiddleware, checkForUser} from "../middlewares/auth/auth.middleware";
import {
    contentCommentValidator,
    inputValidationMiddleware,
    likeStatusValidator
} from "../middlewares/middleware.validators";
import {commentController} from "../roots/composition.root";
export const commentsRouter = Router({});

//like and dislike status
commentsRouter.put('/:commentId/like-status', authMiddleware, likeStatusValidator, inputValidationMiddleware , commentController.LikeAndDislikeStatus.bind(commentController));

//update comment by ID
commentsRouter.put('/:commentId', authMiddleware, checkForUser, contentCommentValidator, inputValidationMiddleware , commentController.UpdateCommentById.bind(commentController));

//delete comment by ID
commentsRouter.delete('/:commentId', authMiddleware, checkForUser, commentController.DeleteCommentById.bind(commentController));

//get comment by ID
commentsRouter.get('/:id', commentController.GetCommentById.bind(commentController));