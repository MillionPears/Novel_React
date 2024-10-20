import { useState, useEffect } from 'react';
import { IAuthorI } from '../types/author';
import authorApiRequest from '../apiRequest/author';

export const useCategoryAuthorInNovel = (novelId: number) => {
    const [authorInNovel, setAuthorInNovel] = useState<IAuthorI>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAuthor = async () => {
        try {
            const response = await authorApiRequest.getAuthorOfNovel(novelId);
            setAuthorInNovel(response.data);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchAuthor();
    }, []);

    return { authorInNovel, loading, error, refetch: fetchAuthor};
};

export const useAuthor = () => {
    const [authors, setAuthors] = useState<IAuthorI[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAuthors = async () => {
        try {
            const response = await authorApiRequest.getAuthor();
            setAuthors(response.data);
            console.log(response.data)
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchAuthors();
    }, []);

    return { authors, loading, error, refetch: fetchAuthors};
};

