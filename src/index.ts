import {runDb, usersCollection} from "./dataBase/db.posts.and.blogs";
import {postsRouter} from "./routes/posts.router";
import {blogsRouter} from "./routes/blogs.router";
import {usersRouter} from "./routes/users.router";
import {authUsersRouter} from "./routes/auth.users.router";
import {commentRouter} from "./routes/comment.router";

const express = require('express');
export const app = express();
const port = process.env.PORT || 5001;
const parserMiddleware = express.json()

app.use(parserMiddleware);
app.use('/posts', postsRouter);
app.use('/blogs', blogsRouter);
app.use('/testing', blogsRouter);
app.use('/users', usersRouter);
app.use('/auth', authUsersRouter)
app.use('/comments', commentRouter)


const startApp = async () =>
{
    await runDb();
    app.listen(port, () =>
    {
        console.log(`Example app listening on port ${port}`);
    })
}

startApp();