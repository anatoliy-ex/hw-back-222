import {PostsTypes, UserLikes, ViewTypePost} from "../types/posts.types";
import {OutputType} from "../types/output.type";
import {PostsRepositories, postsRepositories} from "../repositories/posts.repositories";
import {PaginationQueryTypeForPostsAndComments} from "../pagination.query/post.pagination";
import {injectable} from "inversify";
import {LikeStatusesEnum} from "../scheme/like.status.user.for.comment.shame";

@injectable()
export class PostsService {

    constructor(protected postsRepositories : PostsRepositories) {}

    //return all posts
    async allPosts(pagination: PaginationQueryTypeForPostsAndComments) : Promise<OutputType<PostsTypes<UserLikes>[]>>
    {
        return postsRepositories.allPosts((pagination))
    }

    //create new post+++
    async createNewPost(post: PostsTypes<UserLikes>, blogName : string)
    {
        const now = new Date();

        const newPost  = {
                id: `${Date.now()}`,
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: blogName,
                createdAt: now.toISOString(),
                extendedLikesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: LikeStatusesEnum.None,
                    newestLikes: {
                        addedAt: "1",
                        userId: "2",
                        login: "3",
                    }


                }
            };

         return  this.postsRepositories.createNewPost(newPost);
    }

    //get post by ID
    async getPostById(id: string) {
        return await this.postsRepositories.getPostById(id)

    }

    //update post by ID
    async updatePost(newPost : PostsTypes<UserLikes>, id: string) : Promise<boolean>
    {
        return await this.postsRepositories.updatePost(newPost, id)
    }

    //delete post by ID
    async deletePostsById(id: string) : Promise<boolean>
    {
        return await this.postsRepositories.deletePostsById(id)
    }
}