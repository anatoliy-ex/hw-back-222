import {settings} from "../../.env/settings";
import add from "date-fns/add";

export type UserConfirmTypes ={
    id: string,
    login: string,
    hash: string,
    email: string,
    createdAt: string,
    isConfirm: boolean,
};

export type UserIsNotConfirmTypes ={
    id: string,
    login: string,
    hash: string,
    email: string,
    createdAt: string,
    isConfirm: boolean
    confirmationCode: string,
    expirationDate: number | Date
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