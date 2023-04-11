import {NextFunction, Request, Response} from "express";
import {jwtService} from "../../application/jwtService";
import {usersService} from "../../domain/users.service";
import jwt from "jsonwebtoken";
import {commentsCollection, usersCollection} from "../../dataBase/db.posts.and.blogs";
import {usersRepositories} from "../../repositories/users.repositories";
import {authUsersRepositories} from "../../repositories/auth.users.repositories";
import {commentRepositories} from "../../repositories/comment.repositories";
import {postsRepositories} from "../../repositories/posts.repositories";

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

            const outUser = await authUsersRepositories.getUser(token)

            const comment = await commentRepositories.getComment(req.params.commentId)
            const b = await usersCollection.findOne({id: comment!.commentatorInfo.userId})

            if(outUser!.id != b!.id)
            {
                res.sendStatus(403)
            }


            if(outUser === null)
            {
                res.sendStatus(402)
                return
            }
            else
            {
                req.user = outUser
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
