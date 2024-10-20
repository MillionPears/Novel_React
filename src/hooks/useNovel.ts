
import { useEffect, useState } from 'react';


import { ICardNovelsI, IChapterInputI, INovelDetailsI, INovelI, INovelInputI, LoaddingListProps, NovelCardFull, NovelFeedCardProps, NovelPublishedProps, UpdateNovelDTO } from '../types/novel';
import http from '../untils/axiosInstance';
import novelApiRequest from '../apiRequest/novel';
import actionNotification from '../components/NotificationState/Toast';
import Banner from '../components/Banner';






export const useNovel = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const createNovelAPI = async (novelData: INovelInputI) => {
        try {
            setLoading(true);
            setError(null);
            const response = await novelApiRequest.createNovel(novelData);
            console.log('Novel created successfully:', response.status);
            setLoading(false);
            return response.data
        } catch (error) {
            console.error('Error creating novel:', error);
            setError('Đã xảy ra lỗi khi tạo tiểu thuyết');
            alert(error)
            setLoading(false);
            throw error;
        }
    };

    const updateNovelAPI = async (novelData: UpdateNovelDTO) => {
        try {
            setLoading(true);
            const response = await novelApiRequest.updateNovel(novelData);
            console.log('Novel update successfully:', response.status);
            actionNotification(`Novel update successfully`, `success`)
            setLoading(false);
            return response.data
        } catch (error) {
            console.error('Error creating novel:', error);
            actionNotification('Đã xảy ra lỗi khi cập nhật tiểu thuyết', 'error');
            setLoading(false);
            throw error;
        }
    };

    const createChapterAPI = async (data: IChapterInputI) => {
        try {
            setLoading(true);
            setError(null);
            const response = await novelApiRequest.createChapter(data);
            console.log('Novel created successfully:', response.data);
            setLoading(false);
            return response.data
        } catch (error) {
            console.error('Error creating novel:', error);
            setError('Đã xảy ra lỗi khi tạo tiểu thuyết');
            alert(error)
            setLoading(false);
            throw error;
        }
    }
    return { createNovelAPI, updateNovelAPI, createChapterAPI, loading, error };
};


export const useBanner = () => {
    const [novels, setNovels] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMyPublishedNovels = async () => {
        try {
            const response = await novelApiRequest.getBannerNovels();
            setNovels(response.data);
        } catch (error: any) {
            setError(error.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyPublishedNovels();
    }, []);

    // Thêm useEffect để theo dõi sự thay đổi của novels
    useEffect(() => {
        console.log('Novels updated:', novels);
    }, [novels]);

    return { novels, loading, error, refetch: fetchMyPublishedNovels };
};

export const useNovelsByPoster = (posterId: any) => {
    const [novels, setNovels] = useState<NovelPublishedProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMyPublishedNovels = async () => {
        if (!posterId) return;

        try {
            const response = await novelApiRequest.getPosterNovels(posterId);
            setNovels(response.data);
            console.log(novels)
        } catch (error: any) {
            setError(error.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {

        fetchMyPublishedNovels();
    }, [posterId]);

    return { novels, loading, error, refetch: fetchMyPublishedNovels };
};

export const useRandomNovels = () => {
    const [randomNovels, setRandomNovels] = useState<ICardNovelsI[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const fetchMyPublishedNovels = async () => {
        try {
            const response = await novelApiRequest.getRandomNovels();
            setRandomNovels(response.data);
        } catch (error: any) {
            setError(error.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchMyPublishedNovels();
    }, []);

    return { randomNovels, loading, error, refetch: fetchMyPublishedNovels };
};

export const useNovelDetails = (novelId: number) => {
    console.log(novelId)
    const [novelDetails, setNovelDetails] = useState<INovelDetailsI>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const fetchMyPublishedNovels = async () => {
            try {
                const response = await novelApiRequest.getNovelsDetail(novelId);
                setNovelDetails(response.data);
            } catch (error: any) {
                setError(error.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchMyPublishedNovels();
    }, [novelId]);

    return { novelDetails, loading, error };
};


// export const useNovelInfor = (novelId: number) => {
//     const [novelInfor, setNovelInfor] = useState<INovelI>();
//     const [loadingInfor, setLoading] = useState(true);
//     const [errorInfor, setError] = useState<string | null>(null);
//     useEffect(() => {
//         const fetchMyPublishedNovels = async () => {
//             try {
//                 const response = await novelApiRequest.getNovelsInfor(novelId);
//                 setNovelInfor(response.data);
//                 console.log(novelInfor)
//                 setLoading(false)
//             } catch (error: any) {
//                 setError(error.message || 'An error occurred');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchMyPublishedNovels();
//     }, []);

//     return { novelInfor, loadingInfor, errorInfor };
// };

export const useLastNovels = () => {
    const [novelsLast, setNovelInfor] = useState<NovelFeedCardProps[]>([]);
    const [loadingInfor, setLoading] = useState(true);
    const [errorInfor, setError] = useState<string | null>(null);
    useEffect(() => {
        const fetchUseLastNovesl = async () => {
            try {
                const response = await novelApiRequest.getLastNovels();
                setNovelInfor(response.data);
                console.log(novelsLast)
                setLoading(false)
            } catch (error: any) {
                setError(error.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchUseLastNovesl();
    }, []);

    return { novelsLast, loadingInfor, errorInfor };
};

export const useListNovels = ({ type, id }: LoaddingListProps) => {
    const [novelsList, setListNovel] = useState<NovelCardFull[]>([]);
    const [loadingList, setLoading] = useState(true);
    const [errorList, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUseLastNovesl = async () => {
            try {
                const response = await novelApiRequest.getListNovels({type,id});
                setListNovel(response.data);
                console.log(novelsList)
                setLoading(false)
            } catch (error: any) {
                setError(error.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchUseLastNovesl();
    }, []);

    return { novelsList, loadingList, errorList };
};
export const useSearchNovels = (keyword: string) => {
    const [novelsList, setListNovel] = useState<NovelCardFull[]>([]);
    const [loadingList, setLoading] = useState(true);
    const [errorList, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSearchNovel = async () => {
            try {
                setLoading(true);
                const response = await novelApiRequest.getSearchNovels(keyword);
                setListNovel(response.data); 
                setLoading(false);
            } catch (error) {
                console.error('Error searching novels:', error);
                setError('Có lỗi xảy ra khi tìm kiếm tiểu thuyết.');
                setLoading(false);
            }
        };

        if (keyword.trim()) { 
            fetchSearchNovel();
        } else {
            setListNovel([]); 
        }
    }, [keyword]); 

    return { novelsList, loadingList, errorList };
};
export const useAllNovel = () => {
    const [novelsAll, setListNovel] = useState<NovelPublishedProps[]>([]);
    const [loadingAll, setLoading] = useState(true);
    const [errorAll, setError] = useState<string | null>(null);

    const fetchUseAllNovesl = async () => {
        try {
            const response = await novelApiRequest.getAllNovels();
            setListNovel(response.data);
            console.log(novelsAll)
            setLoading(false)
        } catch (error: any) {
            setError(error.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchUseAllNovesl();
    }, []);

    return { novelsAll, loadingAll, errorAll, refetch: fetchUseAllNovesl };
};

export const useMostFollowNovels = () => {
    const [FollowNovels, setRandomNovels] = useState<ICardNovelsI[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const fetchMyPublishedNovels = async () => {
            try {
                const response = await novelApiRequest.getMostFollowNovels();
                setRandomNovels(response.data);
            } catch (error: any) {
                setError(error.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchMyPublishedNovels();
    }, []);

    return { FollowNovels, loading, error };
};