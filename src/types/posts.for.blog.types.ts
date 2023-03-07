export type postsViewTypesForBlog = {
    pagesCount: string,
    pageSize: string,
    totalCount: string,
    items: [
        {
            id: string,
            title: string,
            shortDescription: string,
            content: string,
            blogId:	string,
            blogName: string,
            createdAt: string,
        }
    ]
};