import http from "../untils/axiosInstance"

const tagApiRequest ={
    getList: async()=>{
        const response = await http.get<any>(
            `/tags`
        );
        return response
    },
    getTagsByNovelId: async(novelId: number)=>{
        const response = await http.get<any>(
            `/tags/novel/${novelId}`
        );
        return response
    },
    deleteTag: async(userId: number,tagId: number)=>{
        const response = await http.delete<any>(
            `/tags/${userId}`,
            tagId
        );
        return response
    },
    addTag: async(userId: number,name: string|undefined)=>{
        const response = await http.post<any>(
            `/tags`,
            {userId,name}
        );
        return response
    },
    editTag: async(editTagId: number|undefined,userId: number,name: string|undefined)=>{
        const response = await http.patch<any>(
            `/tags/${editTagId}`,
            {userId,name}
        );
        return response
    },
}

export default tagApiRequest