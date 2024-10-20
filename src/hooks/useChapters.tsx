import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { IAddChaptersI, IChaptersDetailsI, IChapterWithIndexesI } from '../types/chapter'
import { useIncrementView } from './useView'
import chapterApiRequest from '../apiRequest/chapter'

export const useAddChapters = (novelId: number) => {
  const [propsChapter, setPropsChapter] = useState<IAddChaptersI>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArrChapterOfNovel = async () => {
      try {
        const response = await chapterApiRequest.getChapterPublishOfNovel(novelId)
        setPropsChapter(response.data)
        console.log(response.data.nextIndex)
      } catch (error: any) {
        setError(error.message || 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    fetchArrChapterOfNovel()
  }, [novelId])

  return { propsChapter, loading, error }
}
export interface IArrChaptersDetailsI {
  novelId: number
  publishedOnly: boolean
}

export const useArrChaptersDetails = (data: IArrChaptersDetailsI) => {
  const [ArrChapters, setArrChapters] = useState<IChaptersDetailsI[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchArrChapterOfNovel = useCallback(async () => {
    try {
      setLoading(true)
      let response
      if (data.publishedOnly) {
        response = await chapterApiRequest.getChapterRead(data.novelId)
      } else {
        response = await chapterApiRequest.getChapterAllOfNovel(data.novelId)
      }
      console.log(response.data)
      setArrChapters(response.data)
    } catch (error: any) {
      setError(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [data.novelId, data.publishedOnly])

  useEffect(() => {
    fetchArrChapterOfNovel()
  }, [fetchArrChapterOfNovel])

  return { ArrChapters, loading, error, refetch: fetchArrChapterOfNovel }
}

export const useGetChapterContent = (chapterId: number) => {
  const [chapter, setChapters] = useState<IChapterWithIndexesI>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const user = useSelector((state: RootState) => state.auth.user)
  const { incrementView } = useIncrementView()

  const fetchArrChapterOfNovel = async () => {
    try {
      const response = await chapterApiRequest.getChapterById(chapterId)
      setChapters(response.data)
      if (user) {
        await incrementView(chapterId, user.id)
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchArrChapterOfNovel()
  }, [chapterId])

  return { chapter, loading, error }
}
