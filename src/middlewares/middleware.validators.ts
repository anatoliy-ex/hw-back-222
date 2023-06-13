import {CustomValidator} from "express-validator";
import { Response, Request } from "express";
import {  body,  validationResult } from 'express-validator';
import {NextFunction} from "express";
import {PasswordRecoveryModel, UserModel, UserNotConfirmationModel} from "../dataBase/db";
import {blogsRepositories} from "../roots/composition.root";

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

    const checkUserInSystem = await UserModel.find(filter)
    const checkUserIsNotConfirmInSystem = await UserNotConfirmationModel.find(filter)

    if(checkUserInSystem.length != 0)
    {
        throw new Error('email is exist');
    }
    else if(checkUserIsNotConfirmInSystem.length != 0)
    {
        throw new Error('email is exist');
    }
};

//should send email with new code if user exists but not confirmed yet
const emailAlreadyExistButNotConfirmed : CustomValidator = async value =>
{
    const filter = {email: value};
    const checkUserInSystem = await UserModel.find(filter)
    const checkUserIsNotConfirmInSystem = await UserNotConfirmationModel.find(filter)

    if(checkUserInSystem.length != 0)
    {
        throw new Error('email is exist');
    }
    else if(checkUserIsNotConfirmInSystem.length == 0)
    {
        throw new Error('email is exist');
    }
};

const loginAlreadyExist : CustomValidator = async value =>
{
    const filter = {login: value};

    const checkUserInSystem = await UserModel.find(filter)
    const checkUserIsNotConfirmInSystem = await UserNotConfirmationModel.find(filter)

    if(checkUserInSystem.length != 0)
    {
        throw new Error('login is exist');
    }
    else if(checkUserIsNotConfirmInSystem.length != 0)
    {
        throw new Error('login is exist');
    }

};

const codeAlreadyExist : CustomValidator = async value =>
{
    const filter = {confirmationCode: value};
    const checkUserIsNotConfirmInSystem = await UserNotConfirmationModel.find(filter)

    if(checkUserIsNotConfirmInSystem.length == 0)
    {
        throw new Error('code is exist');
    }

};

const recoveryCode : CustomValidator = async value =>
{
    const user = await PasswordRecoveryModel.findOne({confirmCode: value})

    if(user == null)
    {
        throw new Error('recoveryCode');
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

const likeDislikeNone : CustomValidator = async value =>
{
    console.log(value)
    if(value != "None" || value != "Like" ||  value ||  "Dislike")
    {
        throw new Error('inputModel has incorrect values');
    }
};

//for login
export const loginOrEmailValidator = body('loginOrEmail').isString().trim().notEmpty()

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
export const passwordValidator = body('password').isString().trim().isLength({min: 6, max: 20});
export const emailValidator = body ('email').trim().isLength({min: 1, max: 100}).matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).isString();

//for recovery password
export const recoveryPasswordValidator = body('newPassword').isString().trim().isLength({min: 6, max: 20});
export const recoveryCodeValidator = body('recoveryCode').trim().isString().custom(recoveryCode);
export const recoveryEmailValidator = body ('email').trim().isLength({min: 1, max: 1000}).matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).isString();

export const codeValidator = body('code').trim().isString().custom(codeAlreadyExist);

//for comment
export const contentCommentValidator = body('content').isString().trim().isLength({min: 20, max: 300});

//check for exits email validator
export const existEmailValidator = body('email').custom(emailAlreadyExist)

//for like and dislike status
export const likeStatusValidator = body('likeStatus').trim().isString().custom(likeDislikeNone)

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

