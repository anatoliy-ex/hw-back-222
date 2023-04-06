import {Request, Response, Router} from "express"
import {commentsCollection} from "../dataBase/db.posts.and.blogs";
import {commentRepositories} from "../repositories/comment.repositories";
import {authMiddleware} from "../middlewares/auth/auth.middleware";
export const commentRouter = Router({});


//update comment by ID
commentRouter.put('/:commentId', authMiddleware, async (req: Request, res:Response) => {

    const newComment = await commentRepositories.updateComment(req.params.id, req.body);

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
commentRouter.delete('/:commentId', authMiddleware, async (req: Request, res:Response) => {

    const isDeleted = await commentRepositories.deleteComment(req.params.id);

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
commentRouter.get('/:commentId', async (req: Request, res:Response) => {

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
