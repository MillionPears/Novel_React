import http from "../untils/axiosInstance"

const authorApiRequest ={
    getAuthorOfNovel: async(novelId: number)=>{
        const response = await http.get<any>(
            `/author/novel/${novelId}`
        );
        return response
    },
    getAuthor: async()=>{
        const response = await http.get<any>(
            `/author`
        );
        return response
    },
    deleteAuthor: async(userId: number, authorId: number)=>{
        const response = await http.delete<any>(
            `/author/${userId}`,
            authorId
        );
        return response
    },
    updateAuthor: async(
        authorId: number|undefined,
        firstname: string|undefined, 
        lastname:  string|undefined,
         nickname: string|undefined )=>{
        const response = await http.patch<any>(
            `/author/${authorId}`,
            {authorId,firstname,lastname,nickname}
        );
        return response
    },
}

export default authorApiRequest