export interface QueryResult<T> {
    currentPage: number;
    suggestions: [string];
    totalPages: number;
    totalSize: number;
    data: [T];
    sort: number;
}