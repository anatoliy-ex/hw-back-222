import {LikeStatusesEnum} from "../scheme/like.status.user.for.post.sheme";

export type LikeStatusUserForPost = {
    postId: string,
    likeStatus: LikeStatusesEnum,
    userId: string,
    addedAt: string,
    login: string
}