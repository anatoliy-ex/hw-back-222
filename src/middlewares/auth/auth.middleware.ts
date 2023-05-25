import {NextFunction, Request, Response} from "express";
import { IRateLimiterOptions, RateLimiterMemory } from 'rate-limiter-flexible';
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
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.headers.authorization) {
        res.sendStatus(401)
        return;
    }

    const token = req.headers.authorization.split(' ')[1];

    try {
        const IsDecode: any = jwt.verify(token, settings.JWT_SECRET)

        if (IsDecode) {
            const user = await authUsersRepositories.getUserWithAccessToken(token)

            if (user === null) {
                res.sendStatus(402)
                return
            } else {
                req.user = user
            }
        }
    } catch (e) {
        res.sendStatus(401)
        return;
    }
    next()
}

export const refreshAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken
    console.log(refreshToken)
    if (!refreshToken) {
        console.log("111")
        res.sendStatus(401);
        return;
    }

    try {
        const IsDecode: any = jwt.verify(refreshToken, settings.REFRESH_TOKEN_SECRET)

        if (IsDecode) {

            const user = await usersCollection.findOne({id: IsDecode.userId})
            console.log(user)

            if (user == null) {
                res.sendStatus(401)
                return
            } else {
                req.user = user
                req.deviceId = IsDecode.deviceId
            }
        }
    } catch (e) {
        console.log("333")
        res.sendStatus(401)
        return;
    }
    return next()
}
//check if try edit the comment that
export const checkForUser = async (req: Request, res: Response, next: NextFunction) => {

    const token: string = req.headers.authorization!.split(" ")[1]

    const userId = await jwtService.getUserIdByToken(token)
    const comment = await commentRepositories.getComment(req.params.commentId)

    if (!comment) {
        res.sendStatus(404)
    } else if (comment.commentatorInfo.userId === userId) {
        next()
    } else {
        res.sendStatus(403)
    }
}

//rate limited
const MAX_REQUEST_LIMIT = 5;
const MAX_REQUEST_WINDOW = 10; // Per 15 minutes by IP
const TOO_MANY_REQUESTS_MESSAGE = 'Too many requests';

const options: IRateLimiterOptions = {
    duration: MAX_REQUEST_WINDOW,
    points: MAX_REQUEST_LIMIT,
};

const rateLimiter = new RateLimiterMemory(options);

export const rateLimiterMiddleware = (req: Request, res: Response, next: NextFunction) => {
    rateLimiter
        .consume(req.ip)
        .then(() => {
            next();
        })
        .catch(() => {
            res.status(429).json({ message: TOO_MANY_REQUESTS_MESSAGE });
        });
};

export const rateLimiterMiddleware2 = (req: Request, res: Response, next: NextFunction) => {



}
