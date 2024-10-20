export interface Report{
    id: string
    title: string;
    novelId: number;
    commentId: number | null;
    userId: number;
    type: string;
    content: string;
    createdAt: Date | null;
}
export interface CreateReport {
    title: string;
    novelId: number;
    commentId?: number | null;
    userId: number;
    content: string;
}

export interface IReportI {
    id: number;
    title: string;
    content: string;
    type: string;
    createdAt: string;
    userId: number;
    username: string;
    novelId: number;
    novelTitle: string;
    commentId?: number | null;
    commentContent: string | null;
}