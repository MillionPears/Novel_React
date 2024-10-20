import http from "../untils/axiosInstance";

const permissionApiRequest ={
    getPermissionOfUser: async(userId: number) => {
        const response = await http.get<any>(
            `/role/${userId}`
        );
        return response
    },
    getListPermission: async(userId: number) => {
        const response = await http.get<any>(
            `/role/permission-list/${userId}`
        );
        return response
    },
    getPermissionOfRole: async(userId: number) => {
        const response = await http.get<any>(
            `/role/permission/${userId}`
        );
        return response
    },
    addPermissionToRole: async(userId: number, roleId:string|undefined,permissionId:number) => {
        const response = await http.post<any>(
            `/role/addPermissionToRole/${userId}`,
            {roleId,permissionId}
        );
        return response
    },
    deletePermissionToRole: async(userId: number, roleId:string|undefined,permissionId:number) => {
        const response = await http.delete<any>(
            `/role/removePermissionToRole/${userId}`,
             {roleId,permissionId}
        );
        return response
    },
}
export default permissionApiRequest