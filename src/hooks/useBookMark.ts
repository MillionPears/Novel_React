import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import bookMarkApiRequest from "../apiRequest/bookMark";
import { NovelBookMark } from "../types/novelBookMark";
import { RootState } from "../store/store";
import actionNotification from "../components/NotificationState/Toast";

// Hàm removeBookmark dùng chung
const removeBookmark = async (
    bookmarkId: number,
    onSuccess: () => void
) => {
    try {
        const response = await bookMarkApiRequest.delete(bookmarkId);
        actionNotification("Đã bỏ cất giữ", "success");
        onSuccess(); // Thực hiện callback để cập nhật lại dữ liệu
    } catch (error) {
        actionNotification("Bỏ cất giữ thất bại, vui lòng thao tác lại.", "error");
    }
};

// Hook useBookmark
export function useBookmark(novelId: number) {
    const user = useSelector((state: RootState) => state.auth.user);
    const [idBookmark, setIdBookmark] = useState<number>(0);

    const fetchCheckBookmark = async () => {
        try {
            if (user) {
                const response = await bookMarkApiRequest.checkBookmark(user.id, novelId);
                setIdBookmark(response.data);
            }
        } catch (error: any) {
            console.log(error?.message);
        }
    };

    useEffect(() => {
        fetchCheckBookmark();
    }, [novelId, user]);

    
    
    const addBookmark = async () => {
        try {
            if (user) {
                const response = await bookMarkApiRequest.add(user.id, novelId);
                console.log(response);
                actionNotification("Cất giữ thành công.", "success");
                fetchCheckBookmark(); // Cập nhật lại trạng thái bookmark
            }
        } catch (error) {
            actionNotification("Cất giữ thất bại, vui lòng thử lại.", "error");
        }
    };

    const rmBookmark = async (id: number) => {
        await removeBookmark(id, fetchCheckBookmark); // Sử dụng hàm removeBookmark chung
    };

    return { idBookmark, refetch: fetchCheckBookmark, addBookmark, rmBookmark };
}

// Hook useGetBookmark
export default function useGetBookmark() {
    const user = useSelector((state: RootState) => state.auth.user);
    const [loading, setLoading] = useState(true);
    const [bookmark, setBookmark] = useState<NovelBookMark[]>([]);
    const [error, setError] = useState<string | null>(null);
    const getAllBookMark = async () => {
        if (!user) return;

        try {
            const response = await bookMarkApiRequest.getAll(user.id);
            setBookmark(response.data);
            console.log(response.data);
        } catch (error) {
            actionNotification("Tải danh sách thất bại, vui lòng thử lại.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllBookMark();
    }, [user]); // Gọi lại getAll khi user thay đổi

    const removeBookmarkFromList = async (bookmarkId: number) => {
        await removeBookmark(bookmarkId, getAllBookMark); // Sử dụng hàm removeBookmark chung
    };

    return { bookmark, loading,error, refetch: getAllBookMark, removeBookmark: removeBookmarkFromList };
}
