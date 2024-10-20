
import { useState } from "react";
import viewApiRequest from "../apiRequest/view";

export const useIncrementView = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const incrementView = async (chapterId: number, userId: number) => {
        setLoading(true);
        setError(null);
        try {
            await viewApiRequest.incrementView(chapterId, null, userId);
            console.log("add view success")
        } catch (err) {
            setError('Failed to increment view');
        } finally {
            setLoading(false);
        }
    };

    return { incrementView, loading, error };
};

// Hook để lấy tổng số lượt xem
export const useTotalViews = () => {
    const [totalViews, setTotalViews] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getTotalViews = async (novelId: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await viewApiRequest.getTotalView(novelId);
            setTotalViews(response.data);
        } catch (err) {
            setError('Failed to fetch total views');
        } finally {
            setLoading(false);
        }
    };

    return { totalViews, getTotalViews, loading, error };
};