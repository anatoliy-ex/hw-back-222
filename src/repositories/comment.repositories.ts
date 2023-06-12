import {TypeCommentatorInfo, TypeLikeAndDislikeInfo, TypeViewCommentModel} from "../types/comments.types";
import {CommentModel, LikeModelForComment} from "../dataBase/db";
import {LikeStatusUserForComment} from "../types/like.status.user.for.comment";

export class CommentRepositories {

    //like and dislike status
    async updateLikeAndDislikeStatus(commentId: string, likeStatus: string, userId: string) {

        const iLike = await LikeModelForComment.findOne({ commentId: commentId})

        if(iLike == null) {
            const LikeInfo: LikeStatusUserForComment = {
                commentId: commentId,
                userStatus: 'None',
                userId: userId,
            }
            await LikeModelForComment.create({...LikeInfo})
            await CommentModel.updateOne({id: commentId}, {
                $set:{
                    'likesInfo.myStatus': LikeInfo.userStatus
                }
            })
        }
        else {
            const status = await LikeModelForComment.findOne({commentId: commentId})
            await CommentModel.updateOne({id: commentId}, {
                $set:{
                    'likesInfo.myStatus': status!.userStatus
                }
            })
        }

        const comment = await CommentModel.findOne({id: commentId});

        //if like
        if(likeStatus == 'Like') {

            if(comment!.likesInfo.myStatus == 'None') {
                await CommentModel.updateOne({id: commentId}, {
                    $set: {
                        'likesInfo.likesCount': + 1
                    }
                });
                await LikeModelForComment.updateOne({commentId: commentId}, {
                    $set:{
                        userStatus: likeStatus
                    }
                });
                return;
            }
            else if (comment!.likesInfo.myStatus == 'Like') {
                return;
            }
            else if(comment!.likesInfo.myStatus == 'Dislike') {

                await CommentModel.updateOne({id: commentId}, {
                    set$: {
                        'likesInfo.dislikesCount': - 1,
                        'likesInfo.likesCount': + 1
                    }
                });
                await LikeModelForComment.updateOne({commentId: commentId}, {
                    $set:{
                        userStatus: likeStatus
                    }
                });
                return;
            }
        }

        //if dislike
        if(likeStatus == 'Dislike ') {

            if(comment!.likesInfo.myStatus == 'None') {
                await CommentModel.updateOne({id: commentId}, {
                    $set: {
                        'likesInfo.dislikesCount': + 1
                    }
                });
                await LikeModelForComment.updateOne({commentId: commentId}, {
                    $set:{
                        userStatus: likeStatus
                    }
                });
                return;
            }
            else if (comment!.likesInfo.myStatus == 'Dislike') {
                return;
            }
            else if(comment!.likesInfo.myStatus == 'Like') {

                await CommentModel.updateOne({id: commentId}, {
                    $set: {
                        'likesInfo.likesCount': - 1,
                        'likesInfo.dislikesCount': + 1
                    }
                });
                await LikeModelForComment.updateOne({commentId: commentId}, {
                    $set:{
                        userStatus: likeStatus
                    }
                });
                return;
            }
        }

        //if none
        if(likeStatus == 'None') {

            if(comment!.likesInfo.myStatus == 'None') {
                return;
            }
            else if (comment!.likesInfo.myStatus == 'Dislike') {
                await CommentModel.updateOne({id: commentId}, {
                    $set: {
                        'likesInfo.dislikesCount': - 1
                    }
                });
                await LikeModelForComment.updateOne({commentId: commentId}, {
                    $set:{
                        userStatus: likeStatus
                    }
                });
                return;
            }
            else if(comment!.likesInfo.myStatus == 'Like') {

                await CommentModel.updateOne({id: commentId}, {
                    $set: {
                        'likesInfo.likesCount': - 1
                    }
                });
                await LikeModelForComment.updateOne({commentId: commentId}, {
                    $set:{
                        userStatus: likeStatus
                    }
                });
                return;
            }
        }
    }

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
    async getComment(id: string): Promise<TypeViewCommentModel<TypeCommentatorInfo, TypeLikeAndDislikeInfo> | null>{
        return CommentModel
            .findOne({id: id})
            .select('-_id -postId -__v');
    }
}