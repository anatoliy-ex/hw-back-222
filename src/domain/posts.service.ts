import {PostsTypes} from "../types/posts.types";
import {OutputType} from "../types/output.type";
import {PostsRepositories, postsRepositories} from "../repositories/posts.repositories";
import {PaginationQueryTypeForPostsAndComments} from "../pagination.query/post.pagination";

export class PostsService {

    private postsRepositories : PostsRepositories

    constructor() {
        this.postsRepositories = new PostsRepositories()
    }

    //return all posts
    async allPosts(pagination: PaginationQueryTypeForPostsAndComments) : Promise<OutputType<PostsTypes[]>>
    {
        return postsRepositories.allPosts((pagination))
    }

    //create new post+++
    async createNewPost(post: PostsTypes, blogName : string) : Promise<PostsTypes>
    {
        const now = new Date();

        const newPost  =
            {
                id: `${Date.now()}`,
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: blogName,
                createdAt: now.toISOString(),
            };

        return this.postsRepositories.createNewPost(newPost);
    }

    //get post by ID
    async getPostById(id: string) : Promise<PostsTypes | null>
    {
        return await this.postsRepositories.getPostById(id)

    }

    //update post by ID
    async updatePost(newPost : PostsTypes, id: string) : Promise<boolean>
    {
        return await this.postsRepositories.updatePost(newPost, id)
    }

    //delete post by ID
    async deletePostsById(id: string) : Promise<boolean>
    {
        return await this.postsRepositories.deletePostsById(id)
    }
}

export const postsService = new PostsService();