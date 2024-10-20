import http from "../untils/axiosInstance"

const notificationApiRequest={
    getNotificatonOfUser: async (userId:number) =>{
        const response = await http.get<any>(
            `/notification/${userId}`
        );
        return response
    },
    updateStateIsSeen: async (userId:number) =>{
        const response = await http.post<any>(
            `/notification/${userId}`,
            null
        );
        return response
    },
    add: async (data:any) =>{
        const response = await http.post<any>(
            `/notification`,
            data
        );
        return response
    },
    addPublicNotification: async (senderId: number,data:any) =>{
        const response = await http.post<any>(
            `/notification/admin/${senderId}`,
            data
        );
        return response
    },
}

export default notificationApiRequest