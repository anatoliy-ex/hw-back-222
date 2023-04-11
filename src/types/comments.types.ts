export type TypeInputModel = {
    content: string,
};

export type TypeCommentatorInfo = {
    userId: string,
    userLogin: string,
};

export type TypeViewCommentModel<T> = {
    id: string,
    content: string,
    commentatorInfo: T,
    createdAt: string,
    postId: string,
};

export type TypeGetCommentModel<T> = {
    id: string,
    content: string,
    commentatorInfo: T,
    createdAt: string,
};
