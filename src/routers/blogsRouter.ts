import {Router} from "express"
import {createBlogValidator, createPostForBlog, inputValidationMiddleware} from "../middlewares/middleware.validators";
import {adminStatusAuth, authNotBlock} from "../middlewares/auth/auth.middleware";
import {container} from "../roots/composition.root";
import {BlogsController} from "../controllers/blog.controller";

export const blogsRouter = Router({});

const blogController = container.resolve(BlogsController)


//delete all
blogsRouter.delete('/all-data', blogController.ClearAllModelInDb.bind(blogController))

//get all blogs
blogsRouter.get('/', blogController.GetAllBlogs.bind(blogController));

//create new blogs
blogsRouter.post('/', adminStatusAuth, createBlogValidator, inputValidationMiddleware, blogController.CreateNewBlog.bind(blogController));

//get posts for specified blog
blogsRouter.get('/:blogId/posts', authNotBlock, blogController.GetPostsForSpecifiedBlog.bind(blogController));

//create new post for specific blog
blogsRouter.post('/:blogId/posts', adminStatusAuth, createPostForBlog, inputValidationMiddleware, blogController.CreateNewPostForSpecificBlog.bind(blogController));

//get blog by ID
blogsRouter.get('/:id', blogController.GetBlogById.bind(blogController));

//update blog by ID
blogsRouter.put('/:id', adminStatusAuth, createBlogValidator, inputValidationMiddleware, blogController.UpdateBlogById.bind(blogController));

//delete blog by id
blogsRouter.delete('/:id', adminStatusAuth, inputValidationMiddleware, blogController.DeleteBlogById.bind(blogController));