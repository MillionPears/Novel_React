import http from "../untils/axiosInstance"

const followApiRequest ={
    getCheckFollow: async( userId: number,novelId: number)=>{
        const response = await http.get<any>(
            `/follow/check/`,
            {userId,novelId}
        );
        return response
    },
    addFollow: async(userId: number,novelId: number) =>{
        const response = await http.post<any>(
            `/follow/add`,
            {userId,novelId}
        );
        return response
    },
    unFollow: async(id: number)=>{
         const response = await http.delete<any>(
            `/follow/delete/${id}`
        );
        return response
    },
    getAllByUserId: async(userId: number) =>{
         const response = await http.get<any>(
            `/follow/all/${userId}`
        );
        return response
    },
    deleleBookMark: async(bookmarkId: number)=>{
        const response = await http.delete<any>(
            `/follow/delete/${bookmarkId}`
        );
        return response
    }
}
export default followApiRequest