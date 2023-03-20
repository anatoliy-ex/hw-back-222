import bodyParser from "body-parser";
import {runDb} from "./dataBase/db.posts.and.blogs";
import {postsRouter} from "./routes/posts.routes";
import {blogsRouter} from "./routes/blogs.routes";
import {usersRouter} from "./routes/users.routes";
import {loginUsersRoutes} from "./routes/login.users.routes";

const express = require('express');
const app = express();
const port = process.env.PORT || 1234;
const parserMiddleware = bodyParser({});

app.use(parserMiddleware);
app.use('/posts', postsRouter);
app.use('/blogs', blogsRouter);
app.use('/testing', blogsRouter);
app.use('/users', usersRouter);
app.use('/auth/login', loginUsersRoutes)


const startApp = async () =>
{
    await runDb();

    app.listen(port, () =>
    {
        console.log(`Example app listening on port ${port}`);
    })
}

startApp();