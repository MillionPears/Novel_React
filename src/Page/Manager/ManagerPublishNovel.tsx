import axios from 'axios'
import { useState } from 'react'
import { BiSearchAlt, BiSolidPencil } from 'react-icons/bi'
import { FaEye } from 'react-icons/fa6'
import { MdDelete, MdRocketLaunch } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { RootState } from '../../store/store'
import { useAllNovel } from '../../hooks/useNovel'
import actionNotification from '../../components/NotificationState/Toast'
import { timeAgo } from '../../store/Time'
import ButtonWithTooltip from '../../components/Button/ButtonWithTooltip '
import CustomModal from '../../components/Popup/ConfirmPopupModal'
import novelApiRequest from '../../apiRequest/novel'

export default function ManagerPublishNovel() {
  const user = useSelector((state: RootState) => state.auth.user)

  const { novelsAll, refetch } = useAllNovel()

  const [searchTerm, setSearchTerm] = useState('')
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const [selectedOption, setSelectedOption] = useState('')
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value)
  }

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [novelId, setNovelId] = useState<number>(0)

  const openModal = (id: number) => {
    setNovelId(id)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setNovelId(0)
  }
  // lọc các truyện chỉ pending
  const filteredNovels = novelsAll.filter((novel) => {
    const matchesSearchTerm = novel.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesState = novel.state === 'pending'
    return matchesSearchTerm && matchesState
  })
  const handleChangeState = async () => {
    try {
      const state = 'ongoing'
      const response = await novelApiRequest.updateNovelState(novelId, state)
      actionNotification('Đã duyệt thành công', 'success')
      refetch()
      closeModal()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi không xác định.'
        actionNotification(`${errorMessage}`, 'error')
      } else {
        actionNotification(`Duyệt thất bại!!!`, 'error')
      }
    }
  }

  return (
    <div className='bg-white h-max w-[100%] mx-auto my-6 shadow-[0_2px_8px_rgba(47,43,61,0.2),0_0_transparent,0_0_transparent] rounded-md'>
      <div className='mx-5'>
        <ToastContainer></ToastContainer>
        <CustomModal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          title='Xác nhận xóa'
          onConfirm={handleChangeState}
          onCancel={closeModal}
        />
        <div className='h-6'></div>
        <div>
          <div className='flex justify-between'>
            <div className='flex'>
              <div className='border border-gray flex rounded-md items-center p-[2px]'>
                <BiSearchAlt size={25} color='#969696' className='ml-2' />
                <input
                  type='text'
                  placeholder='Tìm kiếm'
                  className='p-2 outline-none'
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>
          <div className='mt-4 overflow-x-auto'>
            <table className='min-w-full bg-white border border-gray'>
              <thead>
                <tr className='bg-gray_light rounded-md'>
                  <th className='border-y border-gray px-3 py-2 text-center'>ID</th>
                  <th className='border-y border-gray px-3 py-2 max-w-[450px] text-center truncate'>Tên truyện</th>
                  <th className='border-y border-gray px-3 py-2 text-center'>Người đăng</th>
                  <th className='border-y border-gray px-3 py-2 text-center'>Số chương</th>
                  <th className='border-y border-gray px-3 py-2 text-center '>Thời gian tạo</th>
                  <th className='border-y border-gray px-3 py-2 text-center '>Chức năng</th>
                </tr>
              </thead>
              <tbody>
                {filteredNovels.map((novel, index) => (
                  <tr className='hover:bg-gray_hover border-b border-gray' key={novel.id}>
                    <td className=' px-3 py-2 text-center'>{novel.id}</td>
                    <td className=' px-3 py-2 text-center truncate max-w-[220px] '>{novel.title}</td>
                    <td className=' px-3 py-2 text-center'>{novel.posterName}</td>
                    <td className=' px-3 py-2 text-center'>{novel.chapters}</td>
                    <td className=' px-3 py-2 text-center'>{timeAgo(novel.createdAt)}</td>
                    <td className='px-3 py-2 text-center border-collapse'>
                      <div className='flex justify-center items-center space-x-2'>
                        <ButtonWithTooltip
                          className='bg-sky_blue_light_500 hover:bg-sky_blue_light text-white font-bold py-2 px-2 mr-2 rounded'
                          title='Xem trước'
                        >
                          <a href={`/novel/${novel.id}`} className='flex items-center'>
                            <FaEye />
                          </a>
                        </ButtonWithTooltip>
                        <ButtonWithTooltip
                          className='bg-[#e7bd6f] hover:bg-[#FFA500] text-white font-bold py-2 mr-2 px-2 rounded'
                          title='Xuất bản'
                          onClick={() => openModal(novel.id)}
                        >
                          <MdRocketLaunch />
                        </ButtonWithTooltip>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className='h-6'></div>
      </div>
    </div>
  )
}
