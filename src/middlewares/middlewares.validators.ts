import express from 'express';
import {blogsRepositories} from "../repositories/blogs.repositories";
import {CustomValidator} from "express-validator";
import { Response, Request } from "express";
import {  body,  validationResult } from 'express-validator';
import {NextFunction} from "express";

const findBlogId : CustomValidator = async value =>
{
    const foundBlog = await blogsRepositories.getBlogById(value)

    console.log(foundBlog)

    if(foundBlog === null)
    {
        throw new Error('not blogId');
    }


};

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorsOccurred = errors.array({onlyFirstError: true}).map(e => {
            return {
                message: e.msg,
                field: e.param
            }
        })
        res.status(400).json({errorsMessages: errorsOccurred});
    }
    else
    {
        next();
    }
};

//for blogs
const nameValidator = body('name').trim().isLength({min: 1, max: 15}).isString();
const descriptionValidator = body('description').trim().isLength({min: 1, max: 500}).isString();
const websiteUrlValidator = body('websiteUrl')
    .trim()
    .isLength({min: 1, max: 100})
    .matches(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)
    .isString();

//for posts
const titleValidator = body('title').isString().trim().notEmpty().isLength({min: 1, max: 30});
const shortDescriptionValidator = body('shortDescription').isString().trim().notEmpty().isLength({min: 1, max: 100});
const contentValidator = body('content').trim().notEmpty().isLength({min: 1, max: 1000});
const blogIdValidator = body('blogId').trim().notEmpty().custom(findBlogId);

//for users
const loginValidator = body('login').trim().isLength({min: 3, max: 10}).matches(/^[a-zA-Z0-9_-]*$/).isString();
const passwordValidator = body('password').trim().isLength({min: 6, max: 20}).isString();
const emailValidator = body('email').trim().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).isString();


export const createBlogValidator = [
    nameValidator,
    descriptionValidator,
    websiteUrlValidator,
];

export const createPostForBlog = [
    titleValidator,
    shortDescriptionValidator,
    contentValidator,
];

export const createPostValidator = [
    titleValidator,
    shortDescriptionValidator,
    contentValidator,
    blogIdValidator
];

export const createUsersValidator =[
    loginValidator,
    passwordValidator,
    emailValidator
];