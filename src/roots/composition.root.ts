import "reflect-metadata"
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
import { Container, injectable, inject } from "inversify";
import exp from "constants";

// const usersRepositories = new UsersRepositories();
// const usersService = new UsersService(usersRepositories);
// export const userController = new UserController(usersService);

export const container = new Container();

container.bind<UserController>(UserController).to(UserController);
container.bind<UsersService>(UsersService).to(UsersService);
container.bind<UsersRepositories>(UsersRepositories).to(UsersRepositories);
container.bind<AuthUsersRepositories>(AuthUsersRepositories).to(AuthUsersRepositories);
container.bind<AuthUsersService>(AuthUsersService).to(AuthUsersService);
container.bind<JwtTokenService>(JwtTokenService).to(JwtTokenService);
container.bind<BlogsService>(BlogsService).to(BlogsService);
container.bind<BlogsController>(BlogsController).to(BlogsController);
container.bind<BlogsRepositories>(BlogsRepositories).to(BlogsRepositories);
container.bind<PostsRepositories>(PostsRepositories).to(PostsRepositories);
container.bind<PostsService>(PostsService).to(PostsService);
container.bind<PostsController>(PostsController).to(PostsController);
container.bind<CommentRepositories>(CommentRepositories).to(CommentRepositories);
container.bind<CommentsController>(CommentsController).to(CommentsController);
container.bind<SecurityDeviceController>(SecurityDeviceController).to(SecurityDeviceController);
container.bind<SecurityDevicesRepositories>(SecurityDevicesRepositories).to(SecurityDevicesRepositories);

