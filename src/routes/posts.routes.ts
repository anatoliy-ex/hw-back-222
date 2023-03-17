import {Request, Response, Router} from "express"
export const postsRouter = Router({});
import {BlogsTypes} from "../types/blogsTypes";
import {PostsTypes} from "../types/postsTypes";
import {blogsRepositories} from "../repositories/blogs.repositories";
import {createPostValidator, inputValidationMiddleware} from "../middlewares/middlewares.validators";
import {postsService} from "../domain/posts.service";
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
    const allPosts = await postsService.allPosts(pagination);
    res.status(200).send(allPosts);
});

//create new post
postsRouter.post('/', adminStatusAuth, createPostValidator, inputValidationMiddleware, async (req:Request, res: Response) =>
{
    const foundBlog : BlogsTypes | null = await blogsRepositories.getBlogById(req.body.blogId);

    if(!foundBlog)
    {
        res.sendStatus(404);
    }
    else
    {
        const blogName = foundBlog.name;
        const newPost : PostsTypes = await postsService.createNewPost(req.body, blogName);
        res.status(201).send(newPost);
    }
});

//get post by ID
postsRouter.get('/:id', async (req:Request, res: Response) =>
{
    const PostWithId : PostsTypes | null = await postsService.getPostById(req.params.id)

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
    const findPostWithID = await postsService.getPostById(req.params.id);

    if(findBlogWithID && findPostWithID)
    {
        await postsService.updatePost(req.body, req.params.id);
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
    const isDelete = await postsService.deletePostsById(req.params.id);

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