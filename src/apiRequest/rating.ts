import http from "../untils/axiosInstance"

const ratingApiRequest ={
    getRatingOfNovel: async(novelId: number)=>{
        const response = await http.get<any>(
            `/rating/novel/${novelId}`
        );
        return response
    },
    addRating: async(novelId: number, userId: number, content: string|undefined,ratingPoint: number)=>{
        const response = await http.post<any>(
            '/rating',
            {novelId,userId,content,ratingPoint}
        );
        return response 
    },
    voteRating: async(ratingId: number, userId: number, interactionType: string)=>{
        const response = await http.post<any>(
            '/rating/vote',
            {ratingId,userId,interactionType}
        );
        return response 
    },
}
export default ratingApiRequest