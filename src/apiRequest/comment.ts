import http from "../untils/axiosInstance"

const commentApiRequest={
    getCommentOfNovel: async(novelId: number) =>{
        const response = await http.get<any>(
            `/comment/novel/${novelId}`
        );
        return response
    },
    addComment: async(novelId: number,content:string,userId: number, parentId: number|undefined) =>{
        const response = await http.post<any>(
            `/comment`,
            {novelId,content,userId,parentId}
        );
        return response
    },
}
export default commentApiRequest