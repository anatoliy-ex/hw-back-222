import {Request, Response, Router} from "express"
import {commentRepositories} from "../repositories/comment.repositories";
import {authMiddleware, checkForUser} from "../middlewares/auth/auth.middleware";
import {contentCommentValidator, inputValidationMiddleware} from "../middlewares/middleware.validators";
export const commentsRouter = Router({});

class CommentsController {

    async UpdateCommentById (req: Request, res: Response){

        const newComment = await commentRepositories.updateComment(req.params.commentId, req.body.content);

        if(newComment) {
            res.sendStatus(204);
        }
        else {
            res.sendStatus(404);
        }
    }

    async DeleteCommentById (req: Request, res: Response){

        const isDeleted = await commentRepositories.deleteComment(req.params.commentId);

        if(isDeleted) {

            res.sendStatus(204);
        }
        else {
            res.sendStatus(404);
        }
    }

    async GetCommentById (req: Request, res: Response){

        const comment = await commentRepositories.getComment(req.params.id);

        if(comment) {
            res.status(200).send(comment);
        }
        else {
            res.sendStatus(404);
        }
    }
}

const commentController = new CommentsController()

//update comment by ID
commentsRouter.put('/:commentId', authMiddleware, checkForUser, contentCommentValidator, inputValidationMiddleware , commentController.UpdateCommentById);

//delete comment by ID
commentsRouter.delete('/:commentId', authMiddleware, checkForUser, commentController.DeleteCommentById);

//get comment by ID
commentsRouter.get('/:id', commentController.GetCommentById);