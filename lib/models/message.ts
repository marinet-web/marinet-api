export interface Message{
    id: string;
    count: number;
    message: string;
    exception: string;
    level: string;
    application: string;
    createdAt: Date;
}