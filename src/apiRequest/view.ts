import http from "../untils/axiosInstance"

const viewApiRequest ={
    incrementView: async(chapterId: number,data: null, userId: number) =>{ 
        const response = await http.post<any>(  // dangerousZone
            `/view/increment/${chapterId}`,
            data,
            {userId}
        );
        return response
    },
    getTotalView: async(novelId: number) =>{
        const response = await http.get<any>(
            `/view/total/${novelId}`
        );
        return response
    }
}

export default viewApiRequest