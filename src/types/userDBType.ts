export type UserDBType ={
    id: string,
    login: string,
    hash: string,
    email: string,
    createdAt: string,
};
export type InputUserType ={
    login: string,
    password: string,
    email: string
};

export type UserViewType ={
    id: string
    login: string,
    email: string,
    createdAt: string,
};