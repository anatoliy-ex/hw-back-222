import {UsersRepositories} from "../repositories/users.repositories";
import {UsersService} from "../domain/users.service";
import {UserController} from "../controllers/user.controller";
import {AuthUsersService} from "../domain/auth.users.service";
import {AuthUsersRepositories} from "../repositories/auth.users.repositories";
import {JwtTokenService} from "../application/jwt.token.service";
import {AuthUsersController} from "../controllers/auth.user.controller";
import {BlogsRepositories} from "../repositories/blogs.repositories";
import {BlogsController} from "../controllers/blog.controller";
import {BlogsService} from "../domain/blogs.service";
import {PostsService} from "../domain/posts.service";
import {PostsRepositories} from "../repositories/posts.repositories";
import {PostsController} from "../controllers/post.controller";
import {CommentRepositories} from "../repositories/comment.repositories";
import {CommentsController} from "../controllers/comments.controller";
import {SecurityDevicesRepositories} from "../repositories/security.device.repositories";
import {SecurityDeviceController} from "../controllers/security.devices.controller";

const usersRepositories = new UsersRepositories();
const usersService = new UsersService(usersRepositories);
export const userController = new UserController(usersService);

const jwtTokenService = new JwtTokenService();
const authUsersRepositories = new AuthUsersRepositories();
const authUsersService = new AuthUsersService();
export const authUserController = new AuthUsersController( authUsersService,authUsersRepositories, jwtTokenService);

export const blogsRepositories  = new BlogsRepositories();
const blogsService = new BlogsService(blogsRepositories);
export const blogController = new BlogsController(blogsService);

const postsRepositories = new  PostsRepositories();
const postsService = new PostsService(postsRepositories);
export const postController = new PostsController(postsService, postsRepositories, blogsRepositories);

export const commentRepositories = new CommentRepositories();
export const commentController = new CommentsController(commentRepositories);

const securityDevicesRepositories = new SecurityDevicesRepositories()
export const securityDevicesController = new SecurityDeviceController(securityDevicesRepositories, jwtTokenService)