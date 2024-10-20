import { CreateReport } from "../types/report";
import http from "../untils/axiosInstance"

const reportApiRequest = {
    getReport: async()=>{
        const response = await http.get<any>(
            `/report`
        );
        return response
    },
    addReport: async(data: CreateReport)=>{
        const response = await http.post<any>(
            `/report`,
            data
        );
        return response
    },
     updateReport: async(userId: number|undefined, reportId: number)=>{
        const response = await http.patch<any>(
            `/report`,
            {userId,reportId}
        );
        return response
    },
}
export default reportApiRequest