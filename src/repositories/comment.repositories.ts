import {TypeCommentatorInfo, TypeLikeAndDislikeInfo, TypeViewCommentModel} from "../types/comments.types";
import {CommentModel} from "../dataBase/db";

export class CommentRepositories {

    //like and dislike status
    async updateLikeAndDislikeStatus(commentId: string, likeStatus: string) {

        const comment = await CommentModel.findOne({id: commentId});
        //if like
        if(likeStatus == 'Like') {

            if(comment!.likesInfo.myStatus == 'None') {
                await CommentModel.updateMany({id: commentId}, {
                    $set: {
                        'likesInfo.myStatus': likeStatus,
                        'likesInfo.likesCount': + 1
                    }
                });
                return;
            }
            else if (comment!.likesInfo.myStatus == 'Like') {
                return;
            }
            else if(comment!.likesInfo.myStatus == 'Dislike') {

                await CommentModel.updateMany({id: commentId}, {

                    set$: {
                        'likesInfo.myStatus': likeStatus,
                        'likesInfo.dislikesCount': - 1,
                        'likesInfo.likesCount': + 1
                    }
                });
                return;
            }
        }

        //if dislike
        if(likeStatus == 'Dislike ') {

            if(comment!.likesInfo.myStatus == 'None') {
                await CommentModel.updateMany({id: commentId}, {
                    $set: {
                        'likesInfo.myStatus': likeStatus,
                        'likesInfo.dislikesCount': + 1
                    }
                });
                return;
            }
            else if (comment!.likesInfo.myStatus == 'Dislike') {
                return;
            }
            else if(comment!.likesInfo.myStatus == 'Like') {

                await CommentModel.updateMany({id: commentId}, {

                    $set: {
                        'likesInfo.myStatus': likeStatus,
                        'likesInfo.likesCount': - 1,
                        'likesInfo.dislikesCount': + 1
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
                await CommentModel.updateMany({id: commentId}, {
                    $set: {
                        'likesInfo.myStatus': likeStatus,
                        'likesInfo.dislikesCount': - 1
                    }
                });
                return;
            }
            else if(comment!.likesInfo.myStatus == 'Like') {

                await CommentModel.updateMany({id: commentId}, {
                    $set: {
                        'likesInfo.myStatus': likeStatus,
                        'likesInfo.likesCount': - 1
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