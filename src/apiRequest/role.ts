import { getRoleName } from "../hooks/useRole";
import http from "../untils/axiosInstance"

const roleApiRequest ={
    getAll: async(userId: number)=>{
        const response = await http.get<any>(
            `/role/all/${userId}`  
        );
        return response
    },
    getRoleName: async(roleId: string) =>{
        const response = await http.get<any>(
            `/role/name/${roleId}`  
        );
        return response
    },
    getRoleOfUser: async(userId: number) =>{
        const response = await http.get<any>(
            `/role/user/${userId}`  
        );
        return response
    },
    addRole: async(userId: number,rolename: string|undefined, description: string|undefined) =>{
        const response = await http.post<any>(
            `/role/addRole/${userId}` ,
            {rolename,description} 
        );
        return response
    },
    deleteRole: async(userId: number,roleId:number|null) => {
        const response = await http.post<any>(
            `/role/removeRole/${userId}` ,
            {roleId} 
        );
        return response
    },
}
export default roleApiRequest