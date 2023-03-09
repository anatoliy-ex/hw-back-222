import {Request, Response, Router} from "express"
export const postsRouter = Router({});
import {blogsTypes} from "../types/blogs.types";
import {postsTypes} from "../types/posts.types";
import {postsRepositories} from "../repositories/posts.repositories";
import {blogsRepositories} from "../repositories/blogs.repositories";
import {createPostValidator, inputValidationMiddleware} from "../middlewares/middlewares.validators";
import {getPaginationFromQueryBlogs, PaginationQueryTypeForBlogs} from "./blogs.routes";
export const expressBasicAuth = require('express-basic-auth');
export const adminStatusAuth = expressBasicAuth({users: { 'admin': 'qwerty' }});

export type PaginationQueryTypeForPosts = {
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageNumber: number,
    pageSize: number,
}

export const getPaginationFromQueryPosts = (query: any): PaginationQueryTypeForPosts => {

    const pageNumber = parseInt(query.pageNumber, 10);
    const pageSize = parseInt(query.pageSize, 10);
    const sortDirection = query.sortDirection === 'asc' ? 'asc' : 'desc';

    return {
        sortBy: query.sortBy ?? 'createdAt',
        sortDirection,
        pageNumber: isNaN(pageNumber) ? 1 : pageNumber,
        pageSize: isNaN(pageSize) ? 10 : pageSize,
    };
}


//get all posts
postsRouter.get('/', async (req:Request, res: Response) =>
{
    const pagination = getPaginationFromQueryPosts(req.query)
    const allPosts = await postsRepositories.allPosts(pagination);
    res.status(200).send(allPosts);

});

//create new post
postsRouter.post('/', adminStatusAuth, createPostValidator, inputValidationMiddleware, async (req:Request, res: Response) =>
{
    const foundBlog : blogsTypes | null = await blogsRepositories.getBlogById(req.body.blogId);

    if(!foundBlog)
    {
        res.sendStatus(404);
    }
    else
    {
        const blogName = foundBlog.name;
        const newPost : postsTypes = await postsRepositories.createNewPost(req.body, blogName);
        res.status(201).send(newPost);
    }
});

//get post by ID
postsRouter.get('/:id', async (req:Request, res: Response) =>
{
    const PostWithId : postsTypes | null = await postsRepositories.getPostById(req.params.id)

    if(PostWithId)
    {
        res.status(200).send(PostWithId);
        return;
    }
    else
    {
        res.sendStatus(404);
        return;
    }
});

//update post
postsRouter.put('/:id',adminStatusAuth, createPostValidator, inputValidationMiddleware, async (req:Request, res: Response) =>
{

    const findBlogWithID = await blogsRepositories.getBlogById(req.body.blogId);
    const findPostWithID = await postsRepositories.getPostById(req.params.id);

    if(findBlogWithID && findPostWithID)
    {
        await postsRepositories.updatePost(req.body, req.params.id);
        res.sendStatus(204);
        return;
    }
    else
    {
        res.sendStatus(404);
        return;
    }
});

//delete post by ID
postsRouter.delete('/:id', adminStatusAuth, inputValidationMiddleware, async (req:Request, res: Response) =>
{
    const isDelete = await postsRepositories.deletePostsById(req.params.id);

    if(isDelete)
    {
        res.sendStatus(204);
        return;
    }
    else
    {
        res.sendStatus(404);
        return;
    }
});