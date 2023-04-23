import e, {Request, Response, Router} from "express"
import {authUsersService} from "../domain/auth.users.service";
import {authMiddleware} from "../middlewares/auth/auth.middleware";
import {jwtService} from "../application/jwtService";
import {authUsersRepositories} from "../repositories/auth.users.repositories";
import {
    codeValidator,
    createUsersValidator, emailAlreadyExistButNotConfirmedValidator,
    existEmailValidator,
    inputValidationMiddleware
} from "../middlewares/middleware.validators";
export const authUsersRouter = Router({});

//login user
authUsersRouter.post('/login', async (req: Request, res: Response) =>{

    const userId = await authUsersService.loginUser(req.body);

    if(userId)
    {
        const token = await jwtService.createJWT(userId);
        const accessToken = {accessToken: token};
        res.status(200).send(accessToken)
        return;
    }
    else
    {
        res.sendStatus(401)
        return;

    }
});

//confirm registration-2
authUsersRouter.post('/registration-confirmation', codeValidator, inputValidationMiddleware, async (req: Request, res: Response) =>{

    const confirmationWithCode = await authUsersRepositories.confirmEmailByUser(req.body.code);

    if(confirmationWithCode)
    {
        res.sendStatus(204);
    }
    else
    {
        res.sendStatus(400);
    }

});

//first registration in system => send to email code for verification-1
authUsersRouter.post('/registration', createUsersValidator, existEmailValidator, inputValidationMiddleware,  async (req: Request, res: Response) =>{

    const firstRegistration : boolean = await authUsersRepositories.firstRegistrationInSystem(req.body);

    if(firstRegistration)
    {
        res.sendStatus(204);
    }
    else
    {
        res.sendStatus(400);
    }
});


//registration in system-3
authUsersRouter.post('/registration-email-resending', emailAlreadyExistButNotConfirmedValidator, inputValidationMiddleware, async (req: Request, res: Response) =>{

    const isResending = await authUsersRepositories.registrationWithSendingEmail(req.body.email);

    if(isResending)
    {
        res.sendStatus(204);
    }
    else
    {
        res.status(400);
    }

});

//get information about user
authUsersRouter.get('/me', authMiddleware, async (req: Request, res: Response) => {

    const user = req.user


    if(user != null)
    {
        res.status(200).send(user)
    }
    else
    {
        res.sendStatus(401)
    }
});
