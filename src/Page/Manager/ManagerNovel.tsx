import { useState } from 'react'
import { BiSearchAlt, BiSolidImageAdd } from 'react-icons/bi'
import { MdDelete } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { RootState } from '../../store/store'
import { useAllNovel } from '../../hooks/useNovel'
import actionNotification from '../../components/NotificationState/Toast'
import CustomModal from '../../components/Popup/ConfirmPopupModal'
import ButtonWithTooltip from '../../components/Button/ButtonWithTooltip '
import novelApiRequest from '../../apiRequest/novel'
import { timeAgo } from '../../store/Time'

export default function ManagerNovel() {
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
  const stateMap: { [key: string]: string } = {
    ongoing: 'Còn tiếp',
    completed: 'Hoàn thành',
    paused: 'Tạm dừng',
    deleted: 'Đã xóa',
    unpublished: 'Chưa xuất bản',
    pending: 'Đang chờ duyệt'
  }
  const filteredNovels = novelsAll.filter((novel) => {
    if (selectedOption === '') {
      // Khi selectedOption trống, loại trừ các tiểu thuyết có trạng thái 'deleted'
      return novel.state !== 'deleted' && novel.title.toLowerCase().includes(searchTerm.toLowerCase())
    } else {
      // Khi selectedOption không trống, kiểm tra trạng thái của tiểu thuyết
      return (
        (novel.state === selectedOption || (selectedOption === 'deleted' && novel.state === 'deleted')) &&
        novel.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
  })
  // State to deleted
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [novelId, setSelectedNovelId] = useState<number>(0)

  const [typeDelete, setTypeDelete] = useState<string | null>(null)
  const openModal = (id: number, type: string) => {
    setSelectedNovelId(id)
    setTypeDelete(type)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedNovelId(0)
  }

  const handleConfirmDelete = async () => {
    try {
      if (user && typeDelete === 'XoaTamThoi') {
        const state = 'deleted'
        closeModal()
        const response = await novelApiRequest.updateNovelState(novelId, state)
        console.log('Xóa truyện thành công', response.status)
        refetch()
      } else if (user && typeDelete === 'XoaVinhVien') {
        closeModal()
        const response = await novelApiRequest.deleteNovel(novelId, user.id)
        actionNotification('Xóa vĩnh viễn truyện thành công', 'success')
        refetch()
      }
    } catch (error) {
      console.error('Lỗi xóa truyện:', error)
      actionNotification('Xóa vĩnh viễn truyện thất bại', 'error')
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
          onConfirm={handleConfirmDelete}
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
            <div className='flex'>
              <div className='border border-gray flex rounded-md items-center mr-4'>
                <select value={selectedOption} onChange={handleChange} className='p-2 outline-none rounded-md'>
                  <option value=''>Tất cả</option>
                  <option value='unpublished'>Chưa xuất bản</option>
                  <option value='pending'>Chờ phê duyệt</option>
                  <option value='ongoing'>Còn tiếp</option>
                  <option value='completed'>Hoàn thành</option>
                  <option value='paused'>Tạm dừng</option>
                  <option value='deleted'>Đã xóa</option>
                </select>
              </div>
            </div>
          </div>
          <div className='mt-4'>
            <table className='min-w-full bg-white border border-gray'>
              <thead>
                <tr className='bg-gray_light rounded-md'>
                  <th className='border-y border-gray px-3 py-2 text-center'>ID</th>
                  <th className='border-y border-gray px-3 py-2 max-w-[450px] text-center truncate'>Tên truyện</th>
                  <th className='border-y border-gray px-3 py-2 text-center'>Người đăng</th>
                  <th className='border-y border-gray px-3 py-2 text-center'>Trạng thái</th>
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
                    <td className='px-3 py-2 text-center'>{stateMap[novel.state] || 'Không xác định'}</td>
                    <td className=' px-3 py-2 text-center'>{novel.chapters}</td>
                    <td className=' px-3 py-2 text-center'>{timeAgo(novel.createdAt)}</td>
                    <td className='px-3 py-2 text-center border-collapse'>
                      <div className='flex justify-center items-center space-x-2'>
                        <Link to={`../AddBanner/${novel.id}`}>
                          <ButtonWithTooltip
                            className='bg-sky_blue_light_500 hover:bg-sky_blue_light text-white font-bold py-1 px-2 rounded'
                            title='Thêm Banner'
                          >
                            <BiSolidImageAdd />
                          </ButtonWithTooltip>
                        </Link>
                        {novel.state === 'deleted' ? (
                          <div
                            className='bg-[#ED9A96] hover:bg-red cursor-pointer text-white font-bold py-2 px-2 mr-0 rounded'
                            onClick={() => openModal(novel.id, 'XoaVinhVien')}
                          >
                            Xóa vĩnh viễn
                          </div>
                        ) : (
                          <ButtonWithTooltip
                            className='bg-[#ED9A96] hover:bg-red text-white font-bold py-2 px-2 mr-0 rounded'
                            title='Xóa truyện (tạm thời)'
                            onClick={() => openModal(novel.id, 'XoaTamThoi')} // Đảm bảo đây là một hàm
                          >
                            <MdDelete />
                          </ButtonWithTooltip>
                        )}
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
