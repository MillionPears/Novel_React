import { IAuthorI } from "./author";

export interface NovelBookMark {
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
    bookmarkId: number
}