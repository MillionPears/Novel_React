import { IAuthorI } from "./author";

export interface IGetHistoryUserI {
    id: number;
    novelId: number;
    novelTitle: string;
    novelImage: string;
    novelDescription: string;
    novelState: string
    author: IAuthorI[];
    chapterId: number;
    chapterTitle: string;
    createdAt: Date;
    updatedAt: Date;
    userId: number;
}