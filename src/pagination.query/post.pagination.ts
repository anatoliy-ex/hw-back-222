export type PaginationQueryTypeForPostsAndComments = {
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageNumber: number,
    pageSize: number,
}

export const getPaginationFromQueryPostsAndComments = (query: any): PaginationQueryTypeForPostsAndComments => {

    const pageNumber = parseInt(query.pageNumber, 10);
    const pageSize = parseInt(query.pageSize, 10);
    const sortDirection = query.sortDirection === 'asc' ? 'asc' : 'desc';

    return {
        sortBy: query.sortBy ?? 'createdAt',
        sortDirection,
        pageNumber: isNaN(pageNumber) ? 1 : pageNumber,
        pageSize: isNaN(pageSize) ? 10 : pageSize,
    };
}