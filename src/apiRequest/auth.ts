import { avatarUpdate } from "../types/auth";
import http from "../untils/axiosInstance"

const authApiRequest ={
    login: async(email: string, password: string)=>{
        const response = await http.post<any>(
            `/auth/login`,
            {email,password}
        );
        return response
    },
    getUser: async() => {
        const response= await http.get<any>(
            `/auth/getUser`
        );
        return response
    },
    register: async(email: string, password: string) =>{
        const response = await http.post<any>(
            `/auth/register`,
            {email,password}
        );
        return response
    },
    uploadAvatar: async(data: avatarUpdate)=>{
        const response = await http.post<any>(
            '/auth/avatar',
            data
        );
        return response
    },
    getListUseByAdmin: async(userId: number) =>{
        const response = await http.get<any>(
            `/auth/user/${userId}`
        );
        return response
    },
    blockUser:async(userId: number,userBlockId:number) =>{
        const response = await http.patch<any>(
            `/auth/block`,
            {userId,userBlockId}
        );
        return response
    },
    getUserName: async(userId: string) =>{
        const response = await http.get<any>(
            `/auth/name/${userId}`
        );
        return response
    },
    addUserToRole:  async(userId: number, userIdAdd: string|undefined, roleIdAdd: number)=>{
        const response = await http.post<any>(
            `/role/addUserToRole/${userId}`,
            {userIdAdd,roleIdAdd}
        );
        return response
    },
    deleteUserToRole: async(userId: number, userIdRm: string|undefined, roleId: number)=>{
        const response = await http.delete<any>(
            `/role/removeUserToRole/${userId}`,
            {userIdRm,roleId}
        );
        return response
    },
}

export default authApiRequest