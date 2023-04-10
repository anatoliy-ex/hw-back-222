import {NextFunction, Request, Response} from "express";
import {jwtService} from "../../application/jwtService";
import {usersService} from "../../domain/users.service";
import jwt from "jsonwebtoken";
import {usersCollection} from "../../dataBase/db.posts.and.blogs";

//super admin check
const expressBasicAuth = require('express-basic-auth');
export const adminStatusAuth = expressBasicAuth({users: {'admin': 'qwerty'}});



//check token
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) =>
{
   if(!req.headers.authorization) {
       console.log("1")
       res.sendStatus(401)
       return
   }
   const token = req.headers.authorization.split(' ')[1]

    try{
        const decode: any = jwt.verify(token, '34343434')
        const user = await usersService.findUserById(decode.userId)
        return req.user = user
    }
    catch (e)
    {
        console.log(e)
        console.log("3")
        res.sendStatus(401)
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
