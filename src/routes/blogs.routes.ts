import {Request, Response, Router} from "express"
export const blogsRouter = Router({});
import {blogsViewTypes} from "../types/blogs.types";
import {postsViewTypes} from "../types/posts.types";
import {blogsCollection} from "../dataBase/db.posts.and.blogs";
import {blogsRepositories} from "../repositories/blogs.repositories";
import {postsRepositories} from "../repositories/posts.repositories";
export const expressBasicAuth = require('express-basic-auth');
export const adminStatusAuth = expressBasicAuth({users: { 'admin': 'qwerty' }});


//delete all
blogsRouter.delete('/all-data', async (req:Request, res: Response) =>
{
     await blogsRepositories.deleteAll();
     res.sendStatus(204);
     return;
});

//get all blogs
blogsRouter.get('/', async(req:Request, res: Response) =>
{
    const allBlogs = await blogsRepositories.allBlogs()

    if(allBlogs)
    {
        res.status(200).send(allBlogs);
        return;
    }
    else
    {
        res.sendStatus(404);
        return;
    }
});

//create new blogs
blogsRouter.post('/', async(req:Request, res: Response) =>
{
    const newBlog : blogsViewTypes = await blogsRepositories.createNewBlog(req.body)

    if(newBlog)
    {
        res.status(201).send(newBlog);
        return;
    }
    else
    {
        res.sendStatus(404);
        return;
    }
});

//get blogs by ID
blogsRouter.get('/:id', async(req:Request, res: Response) =>
{
    const BlogWithId : blogsViewTypes | null = await blogsRepositories.getBlogById(req.params.id);

    if(BlogWithId)
    {
        res.status(200).send(BlogWithId);
        return;
    }
    else
    {
        res.sendStatus(404);
        return;
    }
});

//update blogs by ID
blogsRouter.put('/:id', async(req:Request, res: Response) =>
{
    const isUpdated = await blogsRepositories.updateBlog(req.body, req.params.id);

    if(isUpdated)
    {
        res.status(204);
        return;
    }
    else
    {
        res.sendStatus(404);
        return;
    }
});

//delete blog by id
blogsRouter.delete('/:id', async(req:Request, res: Response) =>
{
    const isDelete = await blogsRepositories.deleteBlogById(req.params.id);

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