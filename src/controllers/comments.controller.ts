import {CommentRepositories} from "../repositories/comment.repositories";
import {Request, Response} from "express";

export class CommentsController {

    constructor(protected commentRepositories : CommentRepositories) {}

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