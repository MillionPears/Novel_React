export interface IChaptersDetailsI {
    id: number;
    title: string;
    content: string
    novelId: number;
    createdAt: string;
    updatedAt: string;
    index: number;
    isPublish: boolean;
    chapterLength: number;
    views: number
}

export interface IAddChaptersI {
    novelId: number,
    novelTitle: string,
    nextIndex: number
}

export interface IChapterWithIndexesI {
    preIndex: number | null;
    nextIndex: number | null;
    id: number;
    index: number;
    title: string;
    novelId: number;
    novelTitle: string
    content: string;
    createdAt: Date;
    updatedAt: Date;
    isPublish: boolean;
}