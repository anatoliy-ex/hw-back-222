import {runDb, UserModel} from "./dataBase/db";
import {postsRouter} from "./routers/postsRouter";
import {blogsRouter} from "./routers/blogsRouter";
import {usersRouter} from "./routers/usersRouter";
import {authUsersRouter} from "./routers/authUsersRouter";
import {commentsRouter} from "./routers/commentsRouter";
import {securityDevicesRouter} from "./routers/securityDevicesRouter";
import cookieParser from "cookie-parser";

const express = require('express');
export const app = express();
const port = process.env.PORT || 5001;
const parserMiddleware = express.json()

app.use(cookieParser())
app.use(parserMiddleware);
app.set('trust proxy', true)

app.use('/posts', postsRouter);
app.use('/blogs', blogsRouter);
app.use('/testing', blogsRouter);
app.use('/users', usersRouter);
app.use('/auth', authUsersRouter)
app.use('/comments', commentsRouter)
app.use('/security', securityDevicesRouter)


const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()