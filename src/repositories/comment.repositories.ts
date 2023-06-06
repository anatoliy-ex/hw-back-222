import {TypeCommentatorInfo, TypeViewCommentModel} from "../types/comments.types";
import {CommentModel} from "../dataBase/db";

export class CommentRepositories {

    //update comment by ID
    async updateComment(commentId: string, content: string) : Promise<boolean> {

        const newComment = await CommentModel.updateOne({id: commentId}, {
            $set: {
                    content: content,
                }
        });
        return newComment.matchedCount === 1;
    }

    //delete comment by ID
    async deleteComment(id: string): Promise<boolean>{
        const isDeleted = await CommentModel.deleteOne({id: id});
        return isDeleted.deletedCount === 1;
    }

    //get comment by ID
    async getComment(id: string): Promise<TypeViewCommentModel<TypeCommentatorInfo> | null>{
        return CommentModel
            .findOne({id: id})
            .select('-_id -postId ');
    }
}

export const commentRepositories = new CommentRepositories();