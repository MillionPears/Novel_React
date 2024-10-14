import http from "../untils/axiosInstance";

const permissionApiRequest ={
    getPermissionOfUser: async(userId: number) => {
        const response = await http.get<any>(
            `/role/${userId}`,
            {userId}
        );
        return response
    },
    getListPermission: async(userId: number) => {
        const response = await http.get<any>(
            `/role/permission-list/${userId}`,
            {userId}
        );
        return response
    },
    getPermissionOfRole: async(userId: number) => {
        const response = await http.get<any>(
            `/role/permission/${userId}`,
            {userId}
        );
        return response
    },
}
export default permissionApiRequest