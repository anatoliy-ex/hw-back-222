import {CommentRepositories} from "../repositories/comment.repositories";
import {Request, Response} from "express";
import {CommentModel} from "../dataBase/db";
import jwt from "jsonwebtoken";
import {settings} from "../../.env/settings";
import {authUsersRepositories} from "../repositories/auth.users.repositories";

export class CommentsController {

    constructor(protected commentRepositories : CommentRepositories) {}

    async LikeAndDislikeStatus (req: Request, res: Response){

        const userId = req.user!.id
        const searchComment = await this.commentRepositories.getComment(req.params.commentId)

        if(searchComment == false) {

            res.sendStatus(404);
        }

        await this.commentRepositories.updateLikeAndDislikeStatus(req.params.commentId,  req.body.likeStatus, userId)
        res.sendStatus(204);
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
        const comment = await this.commentRepositories.getComment(req.params.id, userId);

        if(comment != false) {
            res.status(200).send(comment);

        }
        else {
            res.sendStatus(404);
        }
    }
}