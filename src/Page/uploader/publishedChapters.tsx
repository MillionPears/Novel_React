import { useRef, useState } from 'react'
import { ToastContainer } from 'react-toastify'

import { Link, useParams } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'
import axios from 'axios'
import { FaRegRectangleList } from 'react-icons/fa6'
import { useAddChapters } from '../../hooks/useChapters'
import { useNovel } from '../../hooks/useNovel'
import { IChapterInputI } from '../../types/novel'
import actionNotification from '../../components/NotificationState/Toast'
import ButtonWithTooltip from '../../components/Button/ButtonWithTooltip '
export default function PublishChapter() {
  const { novelId } = useParams<{ novelId: string }>()
  const novelIdNumber = Number(novelId)
  const { propsChapter } = useAddChapters(novelIdNumber)
  const [isInsert, setIsInsert] = useState(false)
  const [isPublish, setIsPublish] = useState(false)
  const titleChapterRef = useRef<HTMLInputElement>(null)
  const indexRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const [contentLength, setContentLength] = useState(0)
  const [contentChapter, setContent] = useState('')

  const handleIsInsertChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsInsert(event.target.checked)
  }
  const countLenghtChapterContent = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = event.currentTarget.value
    setContent(newContent)
    const wordsArray = newContent.trim().split(/\s+/)
    const numberOfWords = wordsArray.filter((word) => word).length
    setContentLength(numberOfWords)
  }
  const handleIsPublishChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsPublish(event.target.checked)
  }
  const { createChapterAPI, loading, error } = useNovel()
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false)
  const upLoadChapter = async () => {
    console.log(isButtonDisabled)
    if (isButtonDisabled) return
    const title = titleChapterRef.current?.value // Cập nhật giá trị state khi có sự thay đổi
    if (!title) {
      alert(`Vui lòng nhập tên CHƯƠNG truyện `)
      setIsButtonDisabled(false)
      return
    }
    if (!contentChapter) {
      alert(`content IS NULL !!! `)
      setIsButtonDisabled(false)
      return
    }
    const data: IChapterInputI = {
      title: title,
      content: contentChapter,
      novelId: novelIdNumber,
      index: Number(indexRef.current?.value),
      isPublish: isPublish,
      chapterLength: contentLength
    }
    console.log(data)
    try {
      const chapter = await createChapterAPI(data)
      setIsButtonDisabled(true)
      if (chapter) {
        actionNotification('upLoadChapter completed successfully!', 'success')
        setTimeout(() => {
          window.location.reload()
        }, 1200)
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi không xác định.'
        actionNotification(`${errorMessage}`, 'error')
      } else {
        actionNotification(`Thêm chương thất bại.`, 'error')
      }
    } finally {
      setTimeout(() => {
        setIsButtonDisabled(false) // Kích hoạt lại nút sau 3 giây
      }, 1701)
    }
    if (error) {
      actionNotification('upLoadChapter Error!', 'error')
      return <div>Error: {error}</div>
    }
  }
  return (
    <div className='bg-white h-max w-[100%] mx-auto my-6 shadow-[0_2px_8px_rgba(47,43,61,0.2),0_0_transparent,0_0_transparent] rounded-md'>
      <ToastContainer />
      {loading && (
        <div
          className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                     z-50 flex items-center justify-center h-52 w-96 bg-gray_hover bg-opacity-50 rounded-lg shadow-md p-4'
        >
          <CircularProgress className='mr-3' />
          Đang tải
        </div>
      )}
      <div className='mx-5'>
        <div className='h-6'></div>

        <div className='flex flex-wrap justify-between items-center space-y-2 mb-2'>
          <a href={`/novel/${novelIdNumber}`}>
            <div className='font-semibold text-lg'>{propsChapter?.novelTitle}</div>
          </a>
          <div className='flex flex-wrap '>
            <Link to={`/uploader/published`}>
              <ButtonWithTooltip
                className='flex items-center gap-2 bg-sky_blue_light_500 hover:bg-sky_blue_light text-white font-semibold py-2 px-6 rounded'
                title=''
              >
                <FaRegRectangleList size={23} /> Truyện
              </ButtonWithTooltip>
            </Link>
            <Link to={`../published/list-chapters/${propsChapter?.novelId}`}>
              <ButtonWithTooltip
                className='flex items-center gap-2 bg-sky_blue_light_500 hover:bg-sky_blue_light text-white font-semibold py-2 px-6 rounded'
                title=''
              >
                <FaRegRectangleList size={23} /> Chương
              </ButtonWithTooltip>
            </Link>
          </div>
        </div>
        <div>{/* Thông báo */}</div>
        <div className='flex gap-3'>
          <div className='flex-1'>
            <div>Số thứ tự chương</div>
            <div
              className='border mx-1 mt-2 border-gray flex rounded-md  p-[2px'
              style={isInsert ? {} : { pointerEvents: 'none', color: 'gray' }}
            >
              <input
                type='number'
                placeholder='0'
                className='ml-1 p-2 w-[100%] outline-none'
                defaultValue={propsChapter?.nextIndex}
                ref={indexRef}
              />
            </div>
          </div>
          <div className='flex-1'>
            <div>Tên chương</div>
            <div className='border mx-1 mt-2 border-gray flex rounded-md p-[2px'>
              <input
                type='text'
                placeholder='Tên chương'
                className='ml-1 p-2 w-[100%] outline-none'
                ref={titleChapterRef}
              />
            </div>
          </div>
        </div>
        {/* checkbox */}
        <div>
          <label>
            <input type='checkbox' className='m-2' checked={isInsert} onChange={handleIsInsertChange} />
            Chèn chương
          </label>

          <label>
            <input type='checkbox' className='m-2' checked={isPublish} onChange={handleIsPublishChange} />
            Xuất bản
          </label>
        </div>
        {/* content chapter */}
        <div className='mt-3'>
          <div>Nội dung chương</div>
          <div className=''>
            <div className=' bg-white rounded-lg rounded-t-lg '>
              <textarea
                className='py-2 px-4 mb-1 w-[100%] focus:ring-0 focus:outline-none rounded-md mt-2 dark:text-white
            border-[1px] border-gray overflow-hidden break-words resize-none text-start h-160 overflow-y-auto'
                name='comments'
                id='comments'
                placeholder=''
                rows={6}
                ref={contentRef}
                onChange={countLenghtChapterContent}
              ></textarea>
            </div>
          </div>
        </div>
        <div className='flex justify-end mb-3'>
          <ButtonWithTooltip title='' onClick={() => upLoadChapter()} className='bg-sky_blue_light text-white'>
            Đăng tải
          </ButtonWithTooltip>
          <ToastContainer />
        </div>
        <div className='mb-3'>Số lượng từ trong chương này: {contentLength} chữ</div>

        {/* <div>Ghi chú: Truyện có thể dán link ảnh, sẽ tự động hiển thị ảnh khi đọc.</div> */}
        <div className='h-6'></div>
      </div>
    </div>
  )
}
