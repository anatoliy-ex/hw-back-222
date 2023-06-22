import {CommentModel, LikeModelForComment} from "../dataBase/db";
import {LikeStatusesEnum} from "../scheme/like.status.user.for.comment.shame";
import {injectable} from "inversify";

@injectable()
export class CommentRepositories {

    //like and dislike status
    async updateLikeAndDislikeStatus(commentId: string, likeStatus: LikeStatusesEnum, userId: string) {

        await LikeModelForComment.updateOne(
            {commentId, userId},
            {$set: {userStatus: likeStatus}},
            {upsert: true}
        )
        const likesCount = await LikeModelForComment.countDocuments({commentId, userStatus: LikeStatusesEnum.Like})
        const dislikesCount = await LikeModelForComment.countDocuments({commentId, userStatus: LikeStatusesEnum.Dislike})

        return CommentModel.updateOne({id: commentId}, {
            $set: {
                'likesInfo.likesCount': likesCount,
                'likesInfo.dislikesCount': dislikesCount
            }
        })
    }

    //update comment by ID
    async updateComment(commentId: string, content: string): Promise<boolean> {

        const newComment = await CommentModel.updateOne({id: commentId}, {
            $set: {
                content: content,
            }
        });
        return newComment.matchedCount === 1;
    }

    //delete comment by ID
    async deleteComment(id: string): Promise<boolean> {
        const isDeleted = await CommentModel.deleteOne({id: id});
        return isDeleted.deletedCount === 1;
    }

    //get comment by ID
    async getComment(commentId: string, userId?: string | null) {

        const comment = await CommentModel
            .findOne({id: commentId})
            .select('-_id -postId -__v');

        if(!comment) return false

        if(userId) {
            const findUser = await LikeModelForComment.findOne({userId: userId, commentId: commentId}, {_id: 0, userStatus: 1})
            if (!findUser) return comment
            comment.likesInfo.myStatus = findUser.userStatus
            return comment
        }
        return comment

    }
}
