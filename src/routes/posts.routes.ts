import {Request, Response, Router} from "express"
export const postsRouter = Router({});
import {blogsViewTypes} from "../types/blogs.types";
import {postsViewTypes} from "../types/posts.types";
import {postsRepositories} from "../repositories/posts.repositories";
import {blogsRepositories} from "../repositories/blogs.repositories";
import {createPostValidator, inputValidationMiddleware} from "../middlewares/middlewares.validators";
export const expressBasicAuth = require('express-basic-auth');
export const adminStatusAuth = expressBasicAuth({users: { 'admin': 'qwerty' }});


//get all posts
postsRouter.get('/', async (req:Request, res: Response) =>
{
    console.log('allBlogs')
    const allPosts = await postsRepositories.allPosts();

    if(allPosts)
    {
        res.status(200).send(allPosts);
        return;
    }
    else
    {
        res.sendStatus(404);
        return;
    }
});

//create new post
postsRouter.post('/', adminStatusAuth, createPostValidator, inputValidationMiddleware, async (req:Request, res: Response) =>
{
    const foundBlog : blogsViewTypes | null = await blogsRepositories.getBlogById(req.body.blogId);

    if(!foundBlog)
    {
        res.sendStatus(404);
    }
    else
    {
        const blogName = foundBlog.name;
        const newPost : postsViewTypes = await postsRepositories.createNewPost(req.body, blogName);
        res.status(201).send(newPost);
    }
});

//get post by ID
postsRouter.get('/:id', async (req:Request, res: Response) =>
{
    const PostWithId : postsViewTypes | null = await postsRepositories.getPostById(req.params.id)

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