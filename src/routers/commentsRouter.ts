import {Request, Response, Router} from "express"
import {CommentRepositories} from "../repositories/comment.repositories";
import {authMiddleware, checkForUser} from "../middlewares/auth/auth.middleware";
import {contentCommentValidator, inputValidationMiddleware} from "../middlewares/middleware.validators";
export const commentsRouter = Router({});

class CommentsController {

    private commentRepositories : CommentRepositories

    constructor() {

        this.commentRepositories = new CommentRepositories()
    }

    async UpdateCommentById (req: Request, res: Response){

        const newComment = await this.commentRepositories.updateComment(req.params.commentId, req.body.content);

        if(newComment) {
            res.sendStatus(204);
        }
        else {
            res.sendStatus(404);
        }
    }

    async DeleteCommentById (req: Request, res: Response){

        const isDeleted = await this.commentRepositories.deleteComment(req.params.commentId);

        if(isDeleted) {

            res.sendStatus(204);
        }
        else {
            res.sendStatus(404);
        }
    }

    async GetCommentById (req: Request, res: Response){

        const comment = await this.commentRepositories.getComment(req.params.id);

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
commentsRouter.put('/:commentId', authMiddleware, checkForUser, contentCommentValidator, inputValidationMiddleware , commentController.UpdateCommentById.bind(commentController));

//delete comment by ID
commentsRouter.delete('/:commentId', authMiddleware, checkForUser, commentController.DeleteCommentById.bind(commentController));

//get comment by ID
commentsRouter.get('/:id', commentController.GetCommentById.bind(commentController));