import {runDb, UserModel} from "./dataBase/db";
import {postsController} from "./controllers/posts.controller";
import {blogsController} from "./controllers/blogs.controller";
import {usersController} from "./controllers/users.controller";
import {authUsersController} from "./controllers/auth.users.controller";
import {commentsController} from "./controllers/comments.controller";
import {securityDevicesController} from "./controllers/security.devices.controller";
import cookieParser from "cookie-parser";

const express = require('express');
export const app = express();
const port = process.env.PORT || 5001;
const parserMiddleware = express.json()

app.use(cookieParser())
app.use(parserMiddleware);
app.set('trust proxy', true)

app.use('/posts', postsController);
app.use('/blogs', blogsController);
app.use('/testing', blogsController);
app.use('/users', usersController);
app.use('/auth', authUsersController)
app.use('/comments', commentsController)
app.use('/security', securityDevicesController)


const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()