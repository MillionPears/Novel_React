import http from "../untils/axiosInstance"

const chapterApiRequest ={
    getChapterPublishOfNovel: async(novelId: number) =>{
        const response = await http.get<any>(
            `/chapter/publish/${novelId}`
        );
        return response
    },
    getChapterRead: async(novelId: number) =>{
        const response = await http.get<any>(
            `/chapter/novelRead/${novelId}`
        );
        return response
    },
     getChapterAllOfNovel: async(novelId: number) =>{
        const response = await http.get<any>(
            `/chapter/novelAll/${novelId}`
        );
        return response
    },
     getChapterById: async(chapterId: number) =>{
        const response = await http.get<any>(
            `/chapter/${chapterId}`
        );
        return response
    },
    updateChapterStatus: async(id: number, isPublish: boolean) =>{
        const response = await http.put<any>(
            `chapter/${id}`,
            {isPublish}
        );
        return response
    },
    updateChapter: async(id: number, title: string) =>{
        const response = await http.put<any>(
            `chapter/${id}`,
            {title}
        );
        return response
    },
    deleteChapter: async(id: number) =>{
        const response = await http.delete<any>(
            `chapter/${id}`
        );
        return response
    },
}

export default chapterApiRequest