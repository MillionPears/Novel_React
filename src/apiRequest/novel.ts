import { IChapterInputI, INovelInputI, LoaddingListProps, UpdateNovelDTO } from "../types/novel";
import http from "../untils/axiosInstance"

const novelApiRequest = {
    getNovelIdbyNovelName: async (tiltle: string) =>{
        const response = await http.get<any>(
            `novel/getIdByName`,
            {tiltle}
        );
        return response
    },
    createNovel: async (novelData: INovelInputI) =>{
        const response = await http.post<any>(
            `/novel`,
            novelData
        );
        return response
    },
    updateNovel: async (novelData: UpdateNovelDTO) => {
    const { id, ...updateData } = novelData;
    const response = await http.put<any>(
        `/novel/${novelData.id}`,
        updateData
    );
    return response;
    },
    createChapter: async (chapterData: IChapterInputI) =>{
        const response = await http.post<any>(
            `/chapter`,
            chapterData
        );
        return response
    },
    getBannerNovels: async () =>{
        const response = await http.get<any>(
            `/novel/banner/a`,
        );
        return response
    },
    getPosterNovels: async (posterId:any) =>{
        const response = await http.get<any>(
            `/novel/me/${posterId}`
        );
        return response
    },
    getRandomNovels: async () =>{
        const response = await http.get<any>(
            `/novel/random/6`,
            
        );
        return response
    },
    getNovelsDetail: async (novelId: number) =>{
        const response = await http.get<any>(
            `/novel/${novelId}`
            
        );
        return response
    },
    // getNovelsInfor: async (novelId: number) =>{
    //     const response = await http.get<any>(
    //         `/novel/id/${novelId}`,
    //         {novelId}
            
    //     );
    //     return response
    // },
    getLastNovels: async () =>{
        const response = await http.get<any>(
            `/novel/getLast`,
            
        );
        return response
    },
    getListNovels: async ({ type, id }: LoaddingListProps) =>{
        const response = await http.get<any>(
            `/novel/${type}/${id}`
        );
        return response
    },
    getSearchNovels: async (keyword: string) =>{
        const response = await http.get<any>(
            `/novel/search`,
            {keyword}
        );
        return response
    },
    getAllNovels: async () =>{
        const response = await http.get<any>(
            `/novel`
        );
        return response
    },
    getMostFollowNovels: async () =>{
        const response = await http.get<any>(
            `/novel/follow/6`
        );
        return response
    },
    uploadNovelImage: async(data: {novelId: number|undefined, image: string})=>{
         const response = await http.put<any>(
            `/novel/image`,
            data
        );
        return response
    },
    updateNovelState: async(novelId: number, state: string)=>{
         const response = await http.put<any>(
            `/novel/state/${novelId}`,
            {state}
        );
        return response
    },
    deleteNovel: async(novelId: number, userId: number)=>{
         const response = await http.delete<any>(
            `/novel/${novelId}`,
            {userId}
        );
        return response
    },
    getByTypeName: async (type:string, id:string) =>{
        const response = await http.get<any>(
            `/${type}/name/${id}`
        );
        return response
    },
    getByAuthName: async ( id:string) =>{
        const response = await http.get<any>(
            `/auth/name/${id}`
        );
        return response
    },
}

export default novelApiRequest