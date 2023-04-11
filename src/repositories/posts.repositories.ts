import {blogsCollection, commentsCollection, postsCollection} from "../dataBase/db.posts.and.blogs";
import {PostsTypes} from "../types/posts.types";
import {OutputType} from "../types/output.type";
import {PaginationQueryTypeForComments, PaginationQueryTypeForPosts} from "../routes/posts.router";
import {TypeCommentatorInfo, TypeGetCommentModel, TypeViewCommentModel} from "../types/comments.types";
import {UsersTypes, UserViewType} from "../types/users.types";

export const postsRepositories =
{


    //get comments for post
    async getCommentsForPost(pagination: PaginationQueryTypeForComments, postId: string) {

        const filter = {postId: postId};

        const comments: TypeGetCommentModel[] = await commentsCollection
            .find(filter, {projection: {_id: 0, createdAt: 0, postId: 0}})
            .sort({[pagination.sortBy]: pagination.sortDirection})
            .skip((pagination.pageNumber - 1) * pagination.pageSize)
            .limit(pagination.pageSize)
            .toArray()

        const countOfComments = await commentsCollection.countDocuments(filter);
        const pagesCount =  Math.ceil(countOfComments/pagination.pageSize);


        return {
            page: pagination.pageNumber,
            pagesCount: pagesCount === 0 ? 1 : pagesCount,
            pageSize: pagination.pageSize,
            totalCount: countOfComments,
            items: comments,
        }
    },

    //create comment for post
    async createCommentForPost(postId: string, content: string, user: UsersTypes) : Promise<TypeViewCommentModel<TypeCommentatorInfo>>{

        const now = new Date();

        const newComment = {
            id: `${Date.now()}`,
            content: content,
            commentatorInfo:
            {
                userId: user.id,
                userLogin: user.login
            },
            createdAt: now.toISOString(),
            postId: postId,
        }

        await commentsCollection.insertOne({...newComment})
        return newComment
    },

    //return all posts
    async allPosts(pagination: PaginationQueryTypeForPosts) : Promise<OutputType<PostsTypes[]>>
    {
        const posts: PostsTypes[] = await postsCollection
            .find({}, {projection: {_id: 0}})
            .sort({[pagination.sortBy]: pagination.sortDirection})
            .skip((pagination.pageNumber - 1) * pagination.pageSize)
            .limit(pagination.pageSize)
            .toArray();

        const countOfPosts = await postsCollection.countDocuments();
        const pageCount = Math.ceil(countOfPosts/pagination.pageSize);

        return {
          page: pagination.pageNumber,
          pagesCount: pageCount === 0 ?  1 : pageCount,
          pageSize: pagination.pageSize,
          totalCount: countOfPosts,
          items: posts
        };
    },

    //create new post
    async createNewPost(newPost: PostsTypes) : Promise<PostsTypes>
    {

        await postsCollection.insertOne({...newPost});
        return newPost;
    },

    //get post by ID
    async getPostById(id: string) : Promise<PostsTypes | null>
    {
        return await postsCollection.findOne({id: id}, {projection :{_id: 0}});
    },

    //update post by ID
    async updatePost(newPost : PostsTypes, id: string) : Promise<boolean>
    {
        const result = await postsCollection.updateOne({id: id}, {
            $set:
            {
                title: newPost.title,
                shortDescription: newPost.shortDescription,
                content: newPost.content,
                blogId: newPost.blogId
            }
        });
        return result.matchedCount === 1;
    },

    //delete post by ID
    async deletePostsById(id: string) : Promise<boolean>
    {
        const isDeleted = await postsCollection.deleteOne({id: id});
        return isDeleted.deletedCount === 1;
    },
};