import {postsCollection} from "../dataBase/db.posts.and.blogs";
import {PostsTypes} from "../types/postsTypes";
import {OutputType} from "../types/outputType";
import {PaginationQueryTypeForPosts} from "../routes/posts.routes";

export const postsRepositories =
{
    //return all posts
    async allPosts(pagination: PaginationQueryTypeForPosts) : Promise<OutputType<PostsTypes[]>>
    {
        const posts: PostsTypes[] = await postsCollection
            .find({}, {projection: {_id: 0}})
            .sort({[pagination.sortBy]: pagination.sortDirection})
            .skip((pagination.pageNumber - 1) * pagination.pageSize)
            .limit(pagination.pageSize)
            .toArray();

        const countOfPosts = await postsCollection.countDocuments();
        const pageCount = Math.ceil(countOfPosts/pagination.pageSize);

        return {
          page: pagination.pageNumber,
          pagesCount: pageCount === 0 ?  1 : pageCount,
          pageSize: pagination.pageSize,
          totalCount: countOfPosts,
          items: posts
        };
    },

    //create new post
    async createNewPost(newPost: PostsTypes) : Promise<PostsTypes>
    {

        await postsCollection.insertOne({...newPost});
        return newPost;
    },

    //get post by ID
    async getPostById(id: string) : Promise<PostsTypes | null>
    {
        return await postsCollection.findOne({id: id}, {projection :{_id: 0}});

    },

    //update post by ID
    async updatePost(newPost : PostsTypes, id: string) : Promise<boolean>
    {
        const result = await postsCollection.updateOne({id: id}, {
            $set:
            {
                title: newPost.title,
                shortDescription: newPost.shortDescription,
                content: newPost.content,
                blogId: newPost.blogId
            }
        });
        return result.matchedCount === 1;
    },

    //delete post by ID
    async deletePostsById(id: string) : Promise<boolean>
    {
        const isDeleted = await postsCollection.deleteOne({id: id});
        return isDeleted.deletedCount === 1;
    },
};