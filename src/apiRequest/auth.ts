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
    }
}

export default authApiRequest