import {LikeStatusesEnum} from "../scheme/like.status.user.for.comment.shame";

export type LikeStatusUserForComment = {
    commentId: string,
    userStatus: LikeStatusesEnum,
    userId: string,
}