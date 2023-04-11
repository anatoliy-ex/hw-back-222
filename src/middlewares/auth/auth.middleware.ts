import {NextFunction, Request, Response} from "express";
import {jwtService} from "../../application/jwtService";
import {usersService} from "../../domain/users.service";
import jwt from "jsonwebtoken";
import {usersCollection} from "../../dataBase/db.posts.and.blogs";
import {usersRepositories} from "../../repositories/users.repositories";
import {authUsersRepositories} from "../../repositories/auth.users.repositories";
import {commentRepositories} from "../../repositories/comment.repositories";

//super admin check
const expressBasicAuth = require('express-basic-auth');
export const adminStatusAuth = expressBasicAuth({users: {'admin': 'qwerty'}});



//check token
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) =>
{
    if(!req.headers.authorization)
    {
        res.sendStatus(401)
        return
    }
    const token = req.headers.authorization.split(' ')[1];


    try
    {
        const IsDecode: any = jwt.verify(token, '34343434')

        if(IsDecode)
        {

            const user = await authUsersRepositories.getUser(token)

            if(user === null)
            {
                res.sendStatus(402)
                return
            }
            else
            {
                const com = await commentRepositories.getCommentByUserId(user.id)

                if(com!.id != req.params.commentId)
                {
                    res.sendStatus(403);
                }
                else
                {
                    req.user = user
                }
            }
        }
    }
   catch (e)
    {
        res.sendStatus(401)
        return;
    }
   next()
}

/*
if(!req.headers.authorization){
    res.status(401)
    return;
}

const token = req.headers.authorization.split(' ')[1]
const userId = await jwtService.getUserIdByToken(token)

if(userId){
    const user = await usersService.findUserById(userId);
    req.user = user
    next();
}
res.status(401)*/
