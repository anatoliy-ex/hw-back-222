import {blogsRepositories} from "../repositories/blogs.repositories";
import {CustomValidator} from "express-validator";
import { Response, Request } from "express";
import {  body,  validationResult } from 'express-validator';
import {NextFunction} from "express";
import {db, usersCollection, usersNotConfirmCollection} from "../dataBase/db.posts.and.blogs";

const findBlogId : CustomValidator = async value =>
{
    const foundBlog = await blogsRepositories.getBlogById(value)

    if(foundBlog === null)
    {
        throw new Error('not blogId');
    }


};

const emailAlreadyExist : CustomValidator = async value =>
{
    const filter = {email: value};

    const checkUserInSystem = await usersCollection.findOne(filter)
    const checkUserIsNotConfirmInSystem = await usersNotConfirmCollection.findOne(filter)

    if(checkUserInSystem != null)
    {
        throw new Error('email is exist');
    }
    else if(checkUserIsNotConfirmInSystem != null)
    {
        throw new Error('email is exist');
    }
};

//should send email with new code if user exists but not confirmed yet
const emailAlreadyExistButNotConfirmed : CustomValidator = async value =>
{
    const filter = {email: value};
    const checkUserInSystem = await usersCollection.findOne(filter)
    const checkUserIsNotConfirmInSystem = await usersNotConfirmCollection.findOne(filter)

    if(checkUserInSystem != null)
    {
        throw new Error('email is exist');
    }
    else if(checkUserIsNotConfirmInSystem == null)
    {
        throw new Error('email is exist');
    }
};

const loginAlreadyExist : CustomValidator = async value =>
{
    const filter = {login: value};

    const checkUserInSystem = await usersCollection.findOne(filter)
    const checkUserIsNotConfirmInSystem = await usersNotConfirmCollection.findOne(filter)

    if(checkUserInSystem != null)
    {
        throw new Error('login is exist');
    }
    else if(checkUserIsNotConfirmInSystem != null)
    {
        throw new Error('login is exist');
    }

};

const codeAlreadyExist : CustomValidator = async value =>
{
    const filter = {confirmationCode: value};
    const checkUserIsNotConfirmInSystem = await usersNotConfirmCollection.findOne(filter)

    if(checkUserIsNotConfirmInSystem == null)
    {
        throw new Error('code is exist');
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

//for post
const titleValidator = body('title').isString().trim().notEmpty().isLength({min: 1, max: 30});
const shortDescriptionValidator = body('shortDescription').isString().trim().notEmpty().isLength({min: 1, max: 100});
const contentValidator = body('content').trim().notEmpty().isLength({min: 1, max: 1000});
const blogIdValidator = body('blogId').trim().notEmpty().custom(findBlogId);

//for user
const loginValidator = body('login').isString().trim().isLength({min: 3, max: 10}).matches(/^[a-zA-Z0-9_-]*$/).custom(loginAlreadyExist)
const passwordValidator = body('password').isString().trim().isLength({min: 6, max: 20});
const emailValidator = body ('email').trim().isLength({min: 1, max: 100}).matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).isString();

export const codeValidator = body('code').trim().isString().custom(codeAlreadyExist);

//for comment
export const contentCommentValidator = body('content').isString().trim().isLength({min: 20, max: 300});

//check for exits email validator
export const existEmailValidator = body('email').custom(emailAlreadyExist)

export const emailAlreadyExistButNotConfirmedValidator = body('email').custom(emailAlreadyExistButNotConfirmed)


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

