export type TypeInputModel = {
    content: string,
};

export type TypeCommentatorInfo = {
    userId: string,
    userLogin: string,
};

export type TypeViewCommentModel<T, Y> = {
    id: string,
    content: string,
    commentatorInfo: T,
    createdAt: string,
    postId: string,
    likesInfo: Y
};

export type TypeLikeAndDislikeInfo = {
    likesCount: number,
    dislikesCount: number,
    myStatus: string,
};


export type TypeGetCommentModel<T> = {
    id: string,
    content: string,
    commentatorInfo: T,
    createdAt: string,
};
