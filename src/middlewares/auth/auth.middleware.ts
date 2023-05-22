import {NextFunction, Request, Response} from "express";
import {jwtService} from "../../application/jwtService";
import jwt from "jsonwebtoken";
import {commentsCollection, refreshTokenSessionCollection, usersCollection} from "../../dataBase/db.posts.and.blogs";
import {authUsersRepositories} from "../../repositories/auth.users.repositories";
import {commentRepositories} from "../../repositories/comment.repositories";
import {settings} from "../../../.env/settings";

//super admin check
const expressBasicAuth = require('express-basic-auth');
export const adminStatusAuth = expressBasicAuth({users: {'admin': 'qwerty'}});



//check token
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) =>
{

    // const sessionsFind = await refreshTokenSessionCollection.findOne({deviceId: req.body.deviceId})
    //
    // if(!sessionsFind)
    // {
    //     res.sendStatus(404);
    //     return;
    // }

    if(!req.headers.authorization)
    {
        res.sendStatus(401)
        return;
    }
    const token = req.headers.authorization.split(' ')[1];

    try
    {
        const IsDecode: any = jwt.verify(token, settings.JWT_SECRET)

        if(IsDecode)
        {
            const user = await authUsersRepositories.getUserWithAccessToken(token)

            if(user === null)
            {
                res.sendStatus(402)
                return
            }
            else
            {
                req.user = user
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

export const refreshAuthMiddleware = async (req: Request, res: Response, next: NextFunction) =>
{
    if(!req.cookies.refreshToken)
    {
        res.sendStatus(401)
        return
    }
    console.log(req.cookies.refreshToken);
    const refreshToken = req.cookies.refreshToken

    try{
        const IsDecode: any = jwt.verify(refreshToken, settings.REFRESH_TOKEN_SECRET)
        if(IsDecode == undefined)
        {
            res.sendStatus(401);
            return;
        }

        if(IsDecode){
            // const isBlocked = await refreshTokenSessionCollection.findOne({refreshToken})
            // if (isBlocked) return res.sendStatus(401)

            const user = await authUsersRepositories.getUserWithRefreshToken(refreshToken)

            if(user == null){
                res.sendStatus(402)
                return
            }else{
                req.cookies = IsDecode
                req.user = user
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
//check if try edit the comment that
export const checkForUser = async (req: Request, res: Response, next: NextFunction) => {

    const token : string = req.headers.authorization!.split(" ")[1]

    const userId = await jwtService.getUserIdByToken(token)
    const comment = await commentRepositories.getComment(req.params.commentId)

    if (!comment) {
        res.sendStatus(404)
    }
    else if (comment.commentatorInfo.userId === userId)
    {
        next()
    }
    else
    {
        res.sendStatus(403)
    }
}
