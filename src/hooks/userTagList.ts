import { useState, useEffect } from 'react';
import tagApiRequest from '../apiRequest/tag';


export interface TagProps {
    id: number
    name: string
}

export const useTagList = () => {
    const [tags, setTags] = useState<TagProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTags = async () => {
        try {
            setLoading(true);
            const response = await tagApiRequest.getList();
            setTags(response.data);
        } catch (error) {
            setError('Lỗi khi lấy danh sách tag');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

    return { tags, loading, error, refetch: fetchTags };
};

export const useTagListByNovelId = (novelId: number) => {
    const [tagsInNovel, setTagsInNovel] = useState<TagProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchtags = async () => {
            try {
                const response = await tagApiRequest.getTagsByNovelId(novelId);
                setTagsInNovel(response.data);
            } catch (error:any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchtags();
    }, []);

    return { tagsInNovel, loading, error };
};