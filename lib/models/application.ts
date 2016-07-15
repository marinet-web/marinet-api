export interface Application {
    name: string,
    users: [string],
    query: string,
    createdAt: Date,
    token: string
}