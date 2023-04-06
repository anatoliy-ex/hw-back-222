import {UsersTypes} from "./users.types";

declare global {
    declare namespace  Express {
        export interface Request {
            user: UsersTypes | null
        }
    }
}