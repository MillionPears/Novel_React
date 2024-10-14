import { useState, useEffect } from 'react';
import { CategoryProps } from '../types/category';
import categoryApiRequest from '../apiRequest/category';




export const useCategoryList = () => {
    const [categories, setCategories] = useState<CategoryProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const fetchCategories = async () => {
        try {
            const response = await categoryApiRequest.getAll();
            setCategories(response.data);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return { categories, loading, error, refetch: fetchCategories };
};

export const useCategoryListInNovel = (categoryId: number) => {
    const [categoriesInNovel, setCategoriesInNovel] = useState<CategoryProps>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoryApiRequest.getCategoryListInNovels(categoryId);
                setCategoriesInNovel(response.data);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        if (categoryId !== 0) {
            fetchCategories();
        }
    }, []);

    return { categoriesInNovel, loading, error };
};

