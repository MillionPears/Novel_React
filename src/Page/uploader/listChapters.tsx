import { useEffect, useRef, useState } from 'react'
import { BiSolidPencil } from 'react-icons/bi'
import { MdDelete } from 'react-icons/md'

import { FaEye } from 'react-icons/fa'

import { Link, useParams } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { IoMdCloseCircle } from 'react-icons/io'
import { storage } from '../../store/firebaseConfig'
import axios from 'axios'
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage'
import { useAddChapters, useArrChaptersDetails } from '../../hooks/useChapters'
import actionNotification from '../../components/NotificationState/Toast'
import ButtonWithTooltip from '../../components/Button/ButtonWithTooltip '
import CustomModal from '../../components/Popup/ConfirmPopupModal'
import chapterApiRequest from '../../apiRequest/chapter'

export default function ListChaptersInNovel() {
  const { novelId } = useParams<{ novelId: string }>()
  const novelIdNumber = Number(novelId)
  const { propsChapter } = useAddChapters(novelIdNumber)
  const data = {
    novelId: novelIdNumber,
    publishedOnly: false
  }
  const { ArrChapters, loading, error, refetch } = useArrChaptersDetails(data)

  const [chapters, setChapters] = useState(ArrChapters)
  const [isPopupOpen, setPopupOpen] = useState(false)
  const [contentChapter, setContent] = useState('')
  const [contentLength, setContentLength] = useState(0)
  const [chapterTitle, setChapterTitle] = useState('')

  const [contentUrl, setContentUrl] = useState('')
  const [selectedId, setSelectedId] = useState<number>(0)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [novelIdSelected, setSelectedNovelId] = useState<number | null>(null)
  const openPopup = async (id: number, title: string, content: string) => {
    setChapterTitle(title)
    setPopupOpen(true)
    console.log(content)
    setSelectedId(id)
    setContentUrl(content)
    try {
      // Tạo reference đến tệp trong Firebase Storage
      const fileRef = ref(storage, content)
      // Lấy URL tải xuống
      console.log('Download filePath:', content)
      const url = await getDownloadURL(fileRef)
      // Fetch nội dung tệp
      console.log('Download URL:', url)
      const response = await axios.get(url, { responseType: 'text' })
      // const text = await response.text();
      setContent(response.data)
    } catch (err) {
      actionNotification('Đã xảy ra lỗi, vui lòng liên hệ admin để xử lý sớm. Xin cảm ơn', 'error')
      console.error(err)
    }
  }
  const closePopup = () => setPopupOpen(false)
  useEffect(() => {
    setChapters(ArrChapters)
  }, [ArrChapters])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  const updateChapterStatus = async (id: number, isPublish: boolean): Promise<boolean> => {
    try {
      const result = await chapterApiRequest.updateChapterStatus(id, isPublish)
      if (result.status === 200) {
        actionNotification('Cập nhật thành công', 'success')
        return true // Trả về true khi thành công
      } else {
        actionNotification('Cập nhật thất bại', 'error')
        return false // Trả về false khi thất bại
      }
    } catch (error) {
      console.error('Có lỗi xảy ra khi cập nhật trạng thái:', error)
      actionNotification('Cập nhật thất bại', 'error')
      return false // Trả về false khi có lỗi
    }
  }

  const updateChapter = async (id: number, contentUrl: string): Promise<boolean> => {
    try {
      // update content to firebase storage
      const blob = new Blob([contentChapter], { type: 'text/plain' })

      // Tạo tham chiếu đến tệp trên Firebase Storage
      const storageRef = ref(storage, contentUrl)

      // Tải Blob lên Firebase Storage
      const snapshot = await uploadBytes(storageRef, blob)
      console.log('Tệp đã được tải lên thành công!', snapshot)
      const result = await chapterApiRequest.updateChapter(id, chapterTitle)
      setPopupOpen(false)
      setTimeout(() => {
        refetch()
      }, 1400)
      if (result.status === 200) {
        actionNotification('Cập nhật thành công', 'success')
        return true // Trả về true khi thành công
      } else {
        actionNotification('Cập nhật thất bại', 'error')
        return false // Trả về false khi thất bại
      }
    } catch (error) {
      console.error('Có lỗi xảy ra khi cập nhật trạng thái:', error)
      actionNotification('Cập nhật thất bại', 'error')
      return false // Trả về false khi có lỗi
    }
  }

  const handleCheckboxChange = async (id: number) => {
    const chapterToUpdate = chapters.find((chapter) => chapter.id === id)
    if (chapterToUpdate) {
      const updatedChapter = { ...chapterToUpdate, isPublish: !chapterToUpdate.isPublish }
      const success = await updateChapterStatus(id, updatedChapter.isPublish)
      if (success) {
        const updatedChapters = chapters.map((chapter) => (chapter.id === id ? updatedChapter : chapter))
        setChapters(updatedChapters) // Cập nhật trạng thái của các chương
      }
    }
  }

  // edit chapter
  const countLenghtChapterContent = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = event.currentTarget.value
    setContent(newContent)
    const wordsArray = newContent.trim().split(/\s+/)
    const numberOfWords = wordsArray.filter((word) => word).length
    setContentLength(numberOfWords)
  }
  //
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChapterTitle(event.target.value)
  }

  async function handleDeleteChapter(): Promise<void> {
    if (novelIdSelected !== null) {
      try {
        await chapterApiRequest.deleteChapter(novelIdSelected)
        closeModal()
        refetch()
        actionNotification('Xóa thành công', 'success')
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi không xác định.'
          actionNotification(`${errorMessage}`, 'error')
        } else {
          actionNotification(`Thêm thất bại!!!\n Đã xảy ra lỗi không xác định.`, 'error')
        }
      }
    }
  }

  const openModal = (id: number) => {
    setSelectedNovelId(id)
    setIsModalOpen(true)
  }
  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedNovelId(null)
  }
  return (
    <div className='bg-white h-max w-[100%] mx-auto my-6 shadow-[0_2px_8px_rgba(47,43,61,0.2),0_0_transparent,0_0_transparent] rounded-md'>
      <ToastContainer />

      <div className='mx-5'>
        <div className='h-6'></div>
        <div>
          <div className='flex justify-between items-center'>
            <a href={`/novel/${novelIdNumber}`}>
              <div className='font-semibold text-lg'>{propsChapter?.novelTitle}</div>
            </a>

            <div>
              <Link to={`/uploader/published`}>
                <ButtonWithTooltip
                  className='bg-sky_blue_light_500 hover:bg-sky_blue_light text-white font-semibold py-2 px-6 rounded'
                  title=''
                >
                  Danh sách truyện
                </ButtonWithTooltip>
              </Link>
              <Link to={`../published/add-chapter/${propsChapter?.novelId}`}>
                <ButtonWithTooltip
                  className='bg-sky_blue_light_500 hover:bg-sky_blue_light text-white font-semibold py-2 px-6 rounded'
                  title=''
                >
                  Thêm chương mới
                </ButtonWithTooltip>
              </Link>
            </div>
          </div>
          <div className='mt-4'>
            <table className='min-w-full bg-white border border-gray'>
              <thead>
                <tr className='bg-gray_light rounded-md'>
                  <th className='border-y border-gray px-4 py-2 text-center'>Số thứ tự</th>
                  <th className='border-y border-gray  px-4 py-2 text-center'>Tên chương</th>
                  <th className='border-y border-gray px-4 py-2 text-center'>Xuất bản</th>
                  <th className='border-y border-gray px-4 py-2 text-center'>Độ dài</th>
                  <th className='border-y border-gray px-4 py-2 text-center'>Lượt đọc</th>
                  <th className='border-y border-gray px-4 py-2 text-center'>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {chapters.map((chapter) => (
                  <tr className='hover:bg-gray_hover border-b border-gray border-collapse' key={chapter.id}>
                    <td className='px-4 py-2 text-center'>{chapter.index}</td>
                    <td className='px-4 py-2 max-w-[350px] text-center'>{chapter.title}</td>
                    <td className='px-4 py-2 text-center'>
                      <input
                        type='checkbox'
                        checked={chapter.isPublish}
                        onChange={() => handleCheckboxChange(chapter.id)}
                        className='mx-auto'
                      />
                    </td>
                    <td className='px-4 py-2 text-center'>{chapter.chapterLength}</td>
                    <td className='px-4 py-2 text-center'>{chapter.views}</td>
                    <td className='px-4 py-2 text-center'>
                      <ButtonWithTooltip
                        className='bg-sky_blue_light_500 hover:bg-sky_blue_light text-white font-bold py-2 px-2 mr-2 rounded'
                        title='Xem'
                      >
                        <a href={`/novel/${novelIdNumber}/${chapter.id}`} className='flex items-center'>
                          <FaEye />
                        </a>
                      </ButtonWithTooltip>
                      <ButtonWithTooltip
                        className='bg-sky_blue_light_500 hover:bg-sky_blue_light text-white font-bold py-2 px-2 mr-2 rounded'
                        title='Sửa chương'
                        onClick={() => openPopup(chapter.id, chapter.title, chapter.content)}
                      >
                        <BiSolidPencil />
                      </ButtonWithTooltip>
                      <ButtonWithTooltip
                        className='bg-[#ED9A96] hover:bg-red text-white font-bold py-2 px-2 mr-2 rounded'
                        title='Xóa chương'
                        onClick={() => openModal(chapter.id)}
                      >
                        <MdDelete />
                      </ButtonWithTooltip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <CustomModal
              isOpen={isModalOpen}
              onRequestClose={closeModal}
              title='Xác nhận xóa'
              onConfirm={handleDeleteChapter}
              onCancel={closeModal}
            />
          </div>
          <div className='flex justify-between items-center mt-4'>
            <div className='font-semibold text-lg'>{propsChapter?.novelTitle}</div>
            <div>
              <Link to={`/uploader/published`}>
                <ButtonWithTooltip
                  className='bg-sky_blue_light_500 hover:bg-sky_blue_light text-white font-semibold py-2 px-6 rounded'
                  title=''
                >
                  Danh sách truyện
                </ButtonWithTooltip>
              </Link>
              <Link to={`../published/add-chapter/${propsChapter?.novelId}`}>
                <ButtonWithTooltip
                  className='bg-sky_blue_light_500 hover:bg-sky_blue_light text-white font-semibold py-2 px-6 rounded'
                  title=''
                >
                  Thêm chương mới
                </ButtonWithTooltip>
              </Link>
            </div>
          </div>
        </div>

        <div className='h-6'></div>

        {/* popup form edit chapter */}
        {isPopupOpen && (
          <div className='fixed inset-0 bg-gray bg-opacity-50 flex items-center justify-center'>
            <div className='bg-white p-6 rounded-lg shadow-lg w-[720px] h-[500px] relative'>
              <form
                className='h-full'
                // onSubmit={handleSubmit}
              >
                <div className='mb-4'>
                  <label htmlFor='input1' className='block text-gray-700'>
                    Tên chương
                  </label>
                  <input
                    type='text'
                    id='input1'
                    name='input1'
                    value={chapterTitle}
                    onChange={handleChange}
                    className='mt-1 p-2 border border-gray-300 outline-none  rounded w-full'
                  />
                </div>
                <div className=' bg-white rounded-lg rounded-t-lg '>
                  <label htmlFor='input1' className='block text-gray-700'>
                    Nội dung chương
                  </label>

                  <textarea
                    className='py-2 px-4 mb-1 w-[100%] focus:ring-0 focus:outline-none rounded-md mt-2 dark:text-white
            border-[1px] border-gray overflow-hidden break-words resize-none text-start h-[300px] overflow-y-auto'
                    name='comments'
                    id='comments'
                    placeholder=''
                    rows={6}
                    value={contentChapter}
                    onChange={countLenghtChapterContent}
                  ></textarea>
                </div>
                <div className='flex justify-between'>
                  <div className='mb-3'>Số lượng từ: {contentLength} chữ</div>

                  <div className='space-x-3'>
                    <button
                      type='button'
                      className='bg-sky_blue_light ml-2 text-white px-2 py-1 rounded-md'
                      onClick={() => updateChapter(selectedId, contentUrl)}
                    >
                      Cập nhật
                    </button>
                    <button className='bg-red text-white px-2 py-1 rounded-md' onClick={closePopup}>
                      Hủy
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
