import {LikeStatusesEnum} from "../scheme/like.status.user.for.comment.shame";

export type PostsTypes<T> = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    extendedLikesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: LikeStatusesEnum,
        newestLikes: T
    }
}

export type UserLikes = {
    addedAt: string,
    userId: string,
    login: string,
}

export type ViewTypePost ={
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    extendedLikesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: LikeStatusesEnum,
        newestLikes: []
    }
}