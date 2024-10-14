import http from "../untils/axiosInstance";

const bookMarkApiRequest ={
    
    checkBookmark: async(userId: number, novelId:number) => {
        const response = await http.get<any>(
            `/bookmark/check/`,
            {userId, novelId}
        );
         return response;
    },
    add: async (userId: number, novelId: number) => {
        const response = await http.post<any>(
            `/bookmark/add`,
            { userId, novelId } // Dữ liệu gửi lên server
        );

        return response; // Trả về dữ liệu từ phản hồi
    },
    delete: async(id:number) => {
        const response = await http.delete<any>(
            `/bookmark/delete/${id}`,
            {id}
        );
        return response;
    },
    getAll: async(userId:number) =>{
        const response = await http.get<any>(
            `/bookmark/all/${userId}`,
            {userId}
        );
        return response
    }

}

export default bookMarkApiRequest;
