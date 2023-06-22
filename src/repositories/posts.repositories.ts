import {CommentModel, LikeModelForComment, LikeModelForPost, PostModel} from "../dataBase/db";
import {PostsTypes, UserLikes, ViewTypePost} from "../types/posts.types";
import {OutputType} from "../types/output.type";
import {TypeCommentatorInfo, TypeLikeAndDislikeInfo, TypeViewCommentModel} from "../types/comments.types";
import {UserConfirmTypes} from "../types/userConfirmTypes";
import {PaginationQueryTypeForPostsAndComments} from "../pagination.query/post.pagination";
import {LikeStatusesEnum} from "../scheme/like.status.user.for.comment.shame";
import {injectable} from "inversify";

@injectable()
export class PostsRepositories {

    //update like and dislike status for post
    async updateLikeAndDislikeStatusForPost(postId: string, likeStatus: LikeStatusesEnum, userId: string) {

        await LikeModelForPost.updateOne(
            {postId, userId},
            {$set: {userStatus: likeStatus}},
            {upsert: true}
        )

        const likesCount = await LikeModelForComment.countDocuments({postId, userStatus: LikeStatusesEnum.Like})
        const dislikesCount = await LikeModelForComment.countDocuments({postId, userStatus: LikeStatusesEnum.Dislike})

        return PostModel.updateOne({id: postId}, {
            $set: {
                'extendedLikesInfo.likesCount': likesCount,
                'extendedLikesInfo.dislikesCount': dislikesCount
            }
        })
    }
    //get comments for post
    async getCommentsForPost(pagination: PaginationQueryTypeForPostsAndComments, postId: string, userId?: string | null) {

        const filter = {postId: postId}
        console.log(postId)

        const comments: TypeViewCommentModel<TypeCommentatorInfo, TypeLikeAndDislikeInfo>[] = await CommentModel
            .find(filter, {_id: 0, __v: 0, postId: 0})
            .sort({[pagination.sortBy]: pagination.sortDirection})
            .skip((pagination.pageNumber - 1) * pagination.pageSize)
            .limit(pagination.pageSize)
            .lean()

        console.log(comments)

        const countOfComments = await CommentModel.countDocuments(filter);
        const pagesCount = Math.ceil(countOfComments / pagination.pageSize);

        if (userId == null) {
            return {
                page: pagination.pageNumber,
                pagesCount: pagesCount === 0 ? 1 : pagesCount,
                pageSize: pagination.pageSize,
                totalCount: countOfComments,
                items: comments,
            }
        } else {
            const commentsWithStatuses = await Promise.all(comments.map(async c => {
                const findUser = await LikeModelForComment.findOne({commentId: c.id, userId: userId}, {_id: 0, userStatus: 1})

                if (findUser) {
                    c.likesInfo.myStatus = findUser.userStatus
                    return c
                }
                return c
            }))

            return {
                page: pagination.pageNumber,
                pagesCount: pagesCount === 0 ? 1 : pagesCount,
                pageSize: pagination.pageSize,
                totalCount: countOfComments,
                items: commentsWithStatuses,
            }
        }
    }

    //create comment for post
    async createCommentForPost(postId: string, content: string, user: UserConfirmTypes): Promise<TypeViewCommentModel<TypeCommentatorInfo, TypeLikeAndDislikeInfo>> {


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
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: LikeStatusesEnum.None,
            }
        };
        console.log(newComment.id)

        await CommentModel.insertMany([newComment]);
        return newComment;
    }

    //return all posts
    async allPosts(pagination: PaginationQueryTypeForPostsAndComments): Promise<OutputType<PostsTypes<UserLikes>[]>> {
        const posts: PostsTypes<UserLikes>[] = await PostModel
            .find({})
            .select('-_id')
            .sort({[pagination.sortBy]: pagination.sortDirection})
            .skip((pagination.pageNumber - 1) * pagination.pageSize)
            .limit(pagination.pageSize)
            .lean()

        const countOfPosts = await PostModel.countDocuments();
        const pageCount = Math.ceil(countOfPosts / pagination.pageSize);

        return {
            page: pagination.pageNumber,
            pagesCount: pageCount === 0 ? 1 : pageCount,
            pageSize: pagination.pageSize,
            totalCount: countOfPosts,
            items: posts
        };
    }

    //create new post
    async createNewPost(newPost: PostsTypes<UserLikes>) : Promise<ViewTypePost>{
        await PostModel.create({...newPost})
        return {
            id: newPost.id,
            title: newPost.title,
            shortDescription: newPost.shortDescription,
            content: newPost.content,
            blogId: newPost.blogId,
            blogName: newPost.blogName,
            createdAt: newPost.createdAt,
            extendedLikesInfo: {
                likesCount: newPost.extendedLikesInfo.likesCount,
                dislikesCount: newPost.extendedLikesInfo.dislikesCount,
                myStatus: newPost.extendedLikesInfo.myStatus,
                newestLikes: []
            }
        }
    }

    //get post by ID
    async getPostById(postId: string, userId?: string | null) {

        const post = await PostModel
            .findOne({id: postId})
            .select('-_id -__v');


        if(!post) return false;

        if(userId) {
            const findUser = await LikeModelForPost.findOne({userId: userId, postId: postId}, {_id: 0, userStatus: 1})
            if (!findUser) return post
            post.extendedLikesInfo.myStatus = findUser.userStatus
            return post
        }
        return post
    }

    //update post by ID
    async updatePost(newPost: PostsTypes<UserLikes>, id: string): Promise<boolean> {
        const result = await PostModel.updateOne({id: id}, {
            $set: {
                title: newPost.title,
                shortDescription: newPost.shortDescription,
                content: newPost.content,
                blogId: newPost.blogId
            }
        });
        return result.matchedCount === 1;
    }

    //delete post by ID
    async deletePostsById(id: string): Promise<boolean> {
        const isDeleted = await PostModel.deleteOne({id: id});
        return isDeleted.deletedCount === 1;
    }
}

export const postsRepositories = new PostsRepositories();