import {blogsTypes} from "./blogs.types";
import {postsTypes} from "./posts.types";

export type OutputType<T> = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: T,
};