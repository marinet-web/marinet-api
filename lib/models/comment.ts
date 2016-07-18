export interface Comment {
    _id: number;
    userEmail: string;
    userRole: string;
    userName: string;
    hash: string;
    message: string;
    createdAt: Date;
}