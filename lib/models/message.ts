export interface Message{
    id: string;
    count: number;
    message: string;
    type: string;
    application: string;
    hash: string;
    createdAt: Date;
}