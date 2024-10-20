import http from "../untils/axiosInstance"

const historyApiRequest ={
    createHistory: async (userId: number, chapterId: number)=>{
        const response = await http.post<any>(
            `/history/add`,
            {userId,chapterId}
        );
        return response
    },
    getHistoryUser: async(userId: number) => {
        const response = await http.get<any>(
            `/history/${userId}`
        );
        return response
    },
    deleteHistory: async(id: number) => {
        const response = await http.delete<any>(
            `/history/remove/${id}`
        );
        return response
    },
}

export default historyApiRequest