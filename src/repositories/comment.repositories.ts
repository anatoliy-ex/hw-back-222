import {CommentModel, LikeModelForComment} from "../dataBase/db";
import {LikeStatusUserForComment} from "../types/like.status.user.for.comment";
import {LikeStatusesEnum} from "../scheme/like.status.user.for.comment.shame";
import {CommentsController} from "../controllers/comments.controller";

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

        const comment = await CommentModel.findOne({id: commentId})
        const postId = comment!.postId
        const allCommentsForPost = await CommentModel.find({postId: postId})

        return CommentModel.updateOne({id: commentId}, {
            $set: {
                'likesInfo.likesCount':likesCount,
                'likesInfo.dislikesCount': dislikesCount
            }
        })

        // const iLike = await LikeModelForComment.findOne({ commentId: commentId, userId: userId})
        //
        // if(iLike == null) {
        //     const LikeInfo: LikeStatusUserForComment = {
        //         commentId: commentId,
        //         userStatus: 'None',
        //         userId: userId,
        //     }
        //     await LikeModelForComment.create({...LikeInfo})
        //     await CommentModel.updateOne({id: commentId}, {
        //         $set:{
        //             'likesInfo.myStatus': 'None'
        //         }
        //     })
        // }
        // else {
        //     const status = await LikeModelForComment.findOne({commentId: commentId, userId: userId})
        //     console.log(status!.userStatus + '######')
        //     await CommentModel.updateOne({id: commentId}, {
        //         $set:{
        //             'likesInfo.myStatus': status!.userStatus
        //         }
        //     })
        //     const status2 = await LikeModelForComment.findOne({commentId: commentId, userId: userId})
        //     console.log(status2!.userStatus + '@@@@@')
        // }
        //
        // const comment = await CommentModel.findOne({id: commentId});
        //
        // //if like
        // if(likeStatus == 'Like') {
        //
        //     if(comment!.likesInfo.myStatus == 'None') {
        //         await CommentModel.updateMany({id: commentId}, {
        //             $set: {
        //                 'likesInfo.likesCount': (comment!.likesInfo.likesCount + 1),
        //                 'likesInfo.myStatus': likeStatus
        //             }
        //         });
        //         await LikeModelForComment.updateOne({commentId: commentId, userId: userId}, {
        //             $set:{
        //                 userStatus: likeStatus
        //             }
        //         });
        //         return;
        //     }
        //     else if (comment!.likesInfo.myStatus == 'Like') {
        //         return;
        //     }
        //     else if(comment!.likesInfo.myStatus == 'Dislike') {
        //
        //         await CommentModel.updateMany({id: commentId}, {
        //             $set: {
        //                 'likesInfo.dislikesCount': (comment!.likesInfo.dislikesCount - 1),
        //                 'likesInfo.likesCount': (comment!.likesInfo.likesCount + 1),
        //                 'likesInfo.myStatus': likeStatus
        //             }
        //         });
        //         await LikeModelForComment.updateOne({commentId: commentId, userId: userId}, {
        //             $set:{
        //                 userStatus: likeStatus
        //             }
        //         });
        //         return;
        //     }
        // }
        //
        // //if dislike
        // if(likeStatus == 'Dislike') {
        //
        //     if(comment!.likesInfo.myStatus == 'None') {
        //         await CommentModel.updateMany({id: commentId}, {
        //             $set: {
        //                 'likesInfo.dislikesCount': (comment!.likesInfo.dislikesCount + 1),
        //                 'likesInfo.myStatus': likeStatus
        //             }
        //         });
        //         await LikeModelForComment.updateOne({commentId: commentId, userId: userId}, {
        //             $set:{
        //                 userStatus: likeStatus
        //             }
        //         });
        //         return;
        //     }
        //     else if (comment!.likesInfo.myStatus == 'Dislike') {
        //         return;
        //     }
        //     else if(comment!.likesInfo.myStatus == 'Like') {
        //
        //         await CommentModel.updateMany({id: commentId}, {
        //             $set: {
        //                 'likesInfo.likesCount': (comment!.likesInfo.likesCount - 1),
        //                 'likesInfo.dislikesCount': (comment!.likesInfo.dislikesCount + 1),
        //                 'likesInfo.myStatus': likeStatus
        //             }
        //         });
        //         await LikeModelForComment.updateOne({commentId: commentId, userId: userId}, {
        //             $set:{
        //                 userStatus: likeStatus
        //             }
        //         });
        //         return;
        //     }
        // }
        //
        // //if none
        // if(likeStatus == 'None') {
        //
        //     if(comment!.likesInfo.myStatus == 'None') {
        //         return;
        //     }
        //     else if (comment!.likesInfo.myStatus == 'Dislike') {
        //         await CommentModel.updateMany({id: commentId}, {
        //             $set: {
        //                 'likesInfo.dislikesCount': (comment!.likesInfo.dislikesCount - 1),
        //                 'likesInfo.myStatus': likeStatus
        //             }
        //         });
        //         await LikeModelForComment.updateOne({commentId: commentId, userId: userId}, {
        //             $set: {
        //                 userStatus: likeStatus
        //             }
        //         });
        //         return;
        //     }
        //     else if(comment!.likesInfo.myStatus == 'Like') {
        //
        //         await CommentModel.updateMany({id: commentId}, {
        //             $set: {
        //                 'likesInfo.likesCount': (comment!.likesInfo.likesCount - 1),
        //                 'likesInfo.myStatus': likeStatus
        //             }
        //         });
        //         await LikeModelForComment.updateOne({commentId: commentId, userId: userId}, {
        //             $set: {
        //                 userStatus: likeStatus
        //             }
        //         });
        //         return;
        //     }
        // }
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
    async getComment(id: string, userId?: string | null) {

        const comment = await CommentModel
            .findOne({id: id})
            .select('-_id -postId -__v');

        if(!comment) return false

        if(userId){
            const findUser = await LikeModelForComment.findOne({userId: userId, commentId: id}, {_id: 0, userStatus: 1})
            if (!findUser) return comment
            comment.likesInfo.myStatus = findUser.userStatus
            return comment
        }
        return comment

    }
}
