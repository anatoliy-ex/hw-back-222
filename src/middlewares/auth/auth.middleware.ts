import "reflect-metadata"
import {NextFunction, Request, Response} from "express";
import {jwtTokenService} from "../../application/jwt.token.service";
import jwt from "jsonwebtoken";
import {RateLimitedModel, UserModel} from "../../dataBase/db";
import {authUsersRepositories} from "../../repositories/auth.users.repositories";
import {settings} from "../../../.env/settings";
import {RateLimitedTypes} from "../../types/rate.limited.types";
import {addSeconds} from "date-fns";
import {CommentRepositories} from "../../repositories/comment.repositories";
import {injectable} from "inversify";
import {container} from "../../roots/composition.root";

//super admin check
const expressBasicAuth = require('express-basic-auth');
export const adminStatusAuth = expressBasicAuth({users: {'admin': 'qwerty'}});

const commentRepositories = container.resolve(CommentRepositories)
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
        res.sendStatus(401);
        return;
    }

    try {
        const IsDecode: any = jwt.verify(refreshToken, settings.REFRESH_TOKEN_SECRET)

        if (IsDecode) {

            const user = await UserModel.findOne({id: IsDecode.userId})
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
        console.log(e)
        res.sendStatus(401)
        return;
    }
    return next()
}

//check if try edit the comment that()
export const checkForUser = async (req: Request, res: Response, next: NextFunction) => {

    const token: string = req.headers.authorization!.split(" ")[1]

    const userId = await jwtTokenService.getUserIdByToken(token)
    const comment = await commentRepositories.getComment(req.params.commentId)

    if (comment == false) {
        res.sendStatus(404)
    } else if (comment.commentatorInfo.userId === userId) {
        next()
    } else {
        res.sendStatus(403)
    }
}

//rate limited
export const rateLimitedMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const rateLimitedMeta: RateLimitedTypes = {
        ip: req.ip,
        url: req.originalUrl,
        connectionDate: new Date()
    }

    const blockInterval = addSeconds(rateLimitedMeta.connectionDate, -10);

    const blockFilter = {ip: rateLimitedMeta.ip,
        url: rateLimitedMeta.url,
        connectionDate: {$gte: blockInterval}};

    const deleteFilter = {ip: rateLimitedMeta.ip,
        url: rateLimitedMeta.url,
        connectionDate: {$lt:  blockInterval}};

    const connectionCount: number = await RateLimitedModel.countDocuments(blockFilter);

    if (connectionCount + 1 > 5) {
        await RateLimitedModel.deleteMany(deleteFilter);
        return res.sendStatus(429);
    }
    else {
        await RateLimitedModel.create(rateLimitedMeta);
        return next();
    }
};

export const authNotBlock = async (req: Request, res: Response, next: NextFunction) => {

    let user = null
    if (!req.headers.authorization) user = null

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) user = null
    try {
        const IsDecode: any = jwt.verify(token!,  settings.JWT_SECRET)

        if (IsDecode) {
            const user_ = await authUsersRepositories.getUserWithAccessToken(token!)

            if (user_ === null) {
                user = null
            } else {
                user = user_
            }
        }
    } catch (e) {
        user = null
    }
    req.user = user
    next()
}