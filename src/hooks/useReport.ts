

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import actionNotification from "../components/NotificationState/Toast";
import { CreateReport, IReportI } from "../types/report";
import reportApiRequest from "../apiRequest/report";



export function useGetReport() {
    const user = useSelector((state: RootState) => state.auth.user);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [report, setReport] = useState<IReportI[]>([]);

    const getAll = async () => {
        if (!user) return;

        try {
            const response = await reportApiRequest.getReport();
            setReport(response.data);
            console.log(response.data)
        } catch (error) {
            actionNotification('Tải thất bại, vui lòng thao tác lại.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAll();
    }, []); // Chỉ gọi getAll khi user thay đổi

    const addReport = async (data: CreateReport) => {
        try {
            const response = await reportApiRequest.addReport( data);
            actionNotification("Đã báo cáo thành công", "success")
        } catch (error) {
            actionNotification("Báo cáo thất bại", "error")
        }
    }

    const updateReport = async (reportId: number) => {
        try {
            const response = await reportApiRequest.updateReport(user?.id, reportId );    
            actionNotification("Đã chuyển thành Đã xử lý", "success")
        } catch (error) {
            actionNotification("Không thể chuyển trạng thái", "error")
        }
    }

    return { report, loading, error, refetch: getAll, updateReport, addReport };
}