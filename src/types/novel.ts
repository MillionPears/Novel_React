import { IAuthorI } from "./author";

export interface IChapterInputI {
    title: string,
    content: string,
    novelId: number,
    index: number,
    isPublish: boolean;
    chapterLength: number;
}
export interface ICardNovelsI {
    id: number,
    title: string,
    image: string,
    banner: string,
    state: string,
    description: string,
    categoryId: number,
    categoryName: string
    posterId: string,
    posterName: string,
    posterAvatar: string,
    author: IAuthorI[]
}

export interface ITagI {
    id: number;
    name: string;
}

export interface INovelDetailsI {
    id: number;
    title: string;
    image: string;
    state: string;
    description: string;
    categoryId: number;
    categoryName: string;
    author: IAuthorI[]
    posterId: number;
    posterName: string;
    posterAvatar: string;
    createdAt: string;
    updatedAt: string;
    chapter0: number;
    countChaptersPublishedInLast7Days: number;
    views: number;
    numberOfNominations: number;
    numberSavedBookmark: number;
    tags: ITagI[];
}
export interface UpdateNovelDTO {
    id: number
    title?: string;
    image?: string;
    banner?: string;
    state?: string;
    description?: string;
    posterId?: number;
    tagsId?: number[]
    categoryId?: number
}

export interface INovelI{
    id: number
    title: string
    image: string
    banner: string | null
    state: string
    description: string
    posterId: number
    createdAt: string
    updatedAt: string
    categoryId: number
}

export interface INovelInputI {
    data: {
        title: string;
        image: string;
        banner: string | null
        state: string;
        description: string;
        posterId: number;
        categoryId: number;
    };
    authorNameInInput: string | null;
    tagsId: number[];
}
export interface NovelPublishedProps {
    id: number,
    title: string,
    state: string,
    createdAt: string,
    updatedAt: string,
    chapters: number,
    posterId: number,
    posterName: string
}
export interface NovelFeedCardProps {
    id: number
    title: string
    image: string,
    author: IAuthorI[],
    lastChapterCreatedAt: string,
    views: number
}
export interface NovelCardFull {
    id: number
    title: string
    image: string,
    description: string
    categoryId: number
    categoryName: string
    posterId: number
    posterName: string
    tags: ITagI[]
    author: IAuthorI[]
    createdAt: string
    views: string
}

export interface LoaddingListProps { //list/category:categoryId
    type: string // category
    id: string // categoryname
}

export interface NovelFollow {
    id: string;
    title: string;
    image: string;
    banner: string;
    state: string;
    description: string;
    updatedAt: string;
    categoryId: string;
    categoryName: string;
    posterId: string;
    posterName: string;
    posterAvatar: string;
    author: IAuthorI[];
    followId: number
}



