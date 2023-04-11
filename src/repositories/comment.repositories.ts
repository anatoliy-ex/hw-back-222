import {TypeCommentatorInfo, TypeInputModel, TypeViewCommentModel} from "../types/comments.types";
import {blogsCollection, commentsCollection} from "../dataBase/db.posts.and.blogs";

export const commentRepositories = {

    //update comment by ID
    async updateComment(commentId: string, content: string) : Promise<boolean> {

        const newComment = await commentsCollection.updateOne({id: commentId}, {
            $set:
                {
                    content: content,
                }
        });
        return newComment.matchedCount === 1;
    },

    //delete comment by ID
    async deleteComment(id: string): Promise<boolean>{
        const isDeleted = await commentsCollection.deleteOne({id: id});
        return isDeleted.deletedCount === 1;
    },

    //get comment by ID
    async getComment(id: string): Promise<TypeViewCommentModel<TypeCommentatorInfo> | null>{
        return await commentsCollection.findOne({id: id}, {projection: {_id: 0, postId: 0}});
    },

    async getCommentByUserId(userId: string)
    {
        return await commentsCollection.findOne({userId: userId})
    },
};