import { IAuthorI } from "./author"

export interface NovelFeedCardProps {
    id: number
    title: string
    image: string,
    author: IAuthorI[],
    lastChapterCreatedAt: string,
    views: number
}