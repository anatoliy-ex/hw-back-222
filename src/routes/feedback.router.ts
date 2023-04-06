import {Router} from "express";
import {Request, Response} from "express";

export const feedbackRouter = Router({})

//update comment with ID
feedbackRouter.put('/:commentId', async (req: Request, res: Response) => {

});

//get comment by ID
feedbackRouter.get('/:id', async (req: Request, res: Response) => {

});

//delete comment by ID
feedbackRouter.delete('/:commentId', async (req: Request, res: Response) => {

});