import { Link, useParams } from 'react-router-dom'
import { FaAngleLeft } from 'react-icons/fa6'
import { FaAngleRight } from 'react-icons/fa6'

import { useEffect } from 'react'
import history from '../../router/history'
import { ToastContainer } from 'react-toastify'

import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { useIncrementView } from '../../hooks/useView'
import { useGetChapterContent } from '../../hooks/useChapters'
import { addHistory } from '../../hooks/useHistory'
import Loading from '../../components/Loading'
import Banner from '../../components/Banner'
import NovelComments from '../../components/Card/NovelComments'
import ChapterContent from './chapterContent'

export interface IChapterWithIndexesI {
  preIndex: number | null
  nextIndex: number | null
  id: number
  index: number
  title: string
  novelId: number
  novelTitle: string
  content: string
  createdAt: Date
  updatedAt: Date
  isPublish: boolean
}

export default function Chapter() {
  const user = useSelector((state: RootState) => state.auth.user)
  const { novelId, chapterId } = useParams<{ novelId: string; chapterId: string }>()
  const novelIdNumber = Number(novelId)
  const chapterIdNumber = Number(chapterId)
  const { incrementView } = useIncrementView()

  const { chapter, loading, error } = useGetChapterContent(chapterIdNumber)
  useEffect(() => {
    // Cuộn lên đầu trang mỗi khi component được render hoặc khi chapter thay đổi
    if (user) {
      addHistory(user?.id, chapterIdNumber)
      incrementView(chapterIdNumber, user.id)
    }
    window.scrollTo(0, 0)
  }, [chapter])
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' && chapter?.preIndex) {
        history.push(`/novel/${chapter.novelId}/${chapter.preIndex}`)
      } else if (event.key === 'ArrowRight' && chapter?.nextIndex) {
        history.push(`/novel/${chapter.novelId}/${chapter.nextIndex}`)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [chapter, history])
  if (loading)
    return (
      <div>
        <Loading />
      </div>
    )
  if (error) {
  }
  const stylePage = 'bg-[#F0ECE0]'
  const styleContent = `bg-[#EAE4D3] p-5 text-[19px] leading-[24px] min-h-[330px]`

  return (
    <div className={stylePage}>
      <ToastContainer></ToastContainer>
      <Banner></Banner>
      <div className='md:container '>
        <div className='text-sm p-2  '>
          <span className='border-b-[1px] border-[#555555]'>
            {chapter?.novelTitle} / {chapter?.title}
          </span>
        </div>
        <div className='m-5'>
          <Link to={`/novel/${chapter?.novelId}`}>
            <div className='flex justify-center my-3 h-6 text-xl font-black text-[#808080]'>{chapter?.novelTitle}</div>
          </Link>
          <div className='flex text-base text-[#808080] justify-center'>{chapter?.title}</div>
        </div>

        {/* control chapter */}
        <div className='bg-[#EEEEEE] flex text-base font-semibold p-1 text-[#008800]'>
          {/* ../published/list-chapters/ */}
          {chapter?.preIndex !== null ? (
            <Link to={`../novel/${chapter?.novelId}/${chapter?.preIndex}`}>
              <div className='flex-1 '>
                <div className='flex items-center gap-2'>
                  <FaAngleLeft />
                  Chương trước
                </div>
              </div>
            </Link>
          ) : (
            <Link to={`../novel/${chapter?.novelId}`}>
              <div className='flex-1 '>
                <div className='flex items-center gap-2'>
                  <FaAngleLeft />
                  Chương trước
                </div>
              </div>
            </Link>
          )}
          <div className='flex-1 text-center'>
            <Link to={`../novel/${chapter?.novelId}`}>Mục lục</Link>
          </div>

          {chapter?.nextIndex !== null ? (
            <Link to={`../novel/${chapter?.novelId}/${chapter?.nextIndex}`}>
              <div className='flex-1 '>
                <div className='flex items-center justify-end gap-2'>
                  Chương sau
                  <FaAngleRight />
                </div>
              </div>
            </Link>
          ) : (
            <Link to={`../novel/${chapter?.novelId}`}>
              <div className='flex-1 '>
                <div className='flex items-center justify-end gap-2'>
                  Chương sau
                  <FaAngleRight />
                </div>
              </div>
            </Link>
          )}
        </div>
        {/* Content */}
        <div className={styleContent}>
          {loading ? (
            <Loading />
          ) : chapter ? (
            <ChapterContent filePath={`${chapter?.content}`}></ChapterContent>
          ) : (
            <div>
              Error: {error}
              <br />
              <p>Tải chương thất bại, thử rescan, xem trang gốc hoặc liên hệ admin.</p>
            </div>
          )}
        </div>

        {/* control chapter */}
        <div className='bg-[#EEEEEE] flex text-base font-semibold p-1 text-[#008800]'>
          {/* ../published/list-chapters/ */}
          {chapter?.preIndex !== null ? (
            <Link to={`../novel/${chapter?.novelId}/${chapter?.preIndex}`}>
              <div className='flex-1 '>
                <div className='flex items-center gap-2'>
                  <FaAngleLeft />
                  Chương trước
                </div>
              </div>
            </Link>
          ) : (
            <Link to={`../novel/${chapter?.novelId}`}>
              <div className='flex-1 '>
                <div className='flex items-center gap-2'>
                  <FaAngleLeft />
                  Chương trước
                </div>
              </div>
            </Link>
          )}
          <div className='flex-1 text-center'>
            <Link to={`../novel/${chapter?.novelId}`}>Mục lục</Link>
          </div>

          {chapter?.nextIndex !== null ? (
            <Link to={`../novel/${chapter?.novelId}/${chapter?.nextIndex}`}>
              <div className='flex-1 '>
                <div className='flex items-center justify-end gap-2'>
                  Chương sau
                  <FaAngleRight />
                </div>
              </div>
            </Link>
          ) : (
            <Link to={`../novel/${chapter?.novelId}`}>
              <div className='flex-1 '>
                <div className='flex items-center justify-end gap-2'>
                  Chương sau
                  <FaAngleRight />
                </div>
              </div>
            </Link>
          )}
        </div>
        <div className='my-4 mx-auto'>
          <Banner />
        </div>
        <NovelComments novelId={novelIdNumber} />
      </div>
    </div>
  )
}
