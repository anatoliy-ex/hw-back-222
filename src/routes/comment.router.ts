import {Request, Response, Router} from "express"
import {commentRepositories} from "../repositories/comment.repositories";
import {authMiddleware, checkForUser} from "../middlewares/auth/auth.middleware";
import {contentCommentValidator, inputValidationMiddleware} from "../middlewares/middleware.validators";
import {authUsersRepositories} from "../repositories/auth.users.repositories";
import {CommentModel} from "../dataBase/db";
export const commentRouter = Router({});


//update comment by ID
commentRouter.put('/:commentId', authMiddleware, checkForUser, contentCommentValidator, inputValidationMiddleware ,async (req: Request, res:Response) => {

    const newComment = await commentRepositories.updateComment(req.params.commentId, req.body.content);

    if(newComment)
    {
        res.sendStatus(204);
    }
    else
    {
        res.sendStatus(404);
    }
});

//delete comment by ID
commentRouter.delete('/:commentId', authMiddleware, checkForUser, async (req: Request, res:Response) => {

    const isDeleted = await commentRepositories.deleteComment(req.params.commentId);

    if(isDeleted)
    {

        res.sendStatus(204);
    }
    else
    {
        res.sendStatus(404);
    }
});

//get comment by ID
commentRouter.get('/:id', async (req: Request, res:Response) => {

    const comment = await commentRepositories.getComment(req.params.id)

    if(comment)
    {
        res.status(200).send(comment);
    }
    else
    {
        res.sendStatus(404);
    }
});
