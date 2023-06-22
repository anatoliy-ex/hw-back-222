import {LikeStatusesEnum} from "../scheme/like.status.user.for.post.sheme";

export type LikeStatusUserForPost = {
    postId: string,
    userStatus: LikeStatusesEnum,
    userId: string,
}