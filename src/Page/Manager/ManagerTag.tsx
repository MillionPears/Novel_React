import { useEffect, useRef, useState } from 'react'
import { BiSearchAlt, BiSolidBookAdd, BiSolidPencil } from 'react-icons/bi'
import { MdDelete } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import axios from 'axios'
import { RootState } from '../../store/store'
import { useTagList } from '../../hooks/userTagList'
import actionNotification from '../../components/NotificationState/Toast'
import ButtonWithTooltip from '../../components/Button/ButtonWithTooltip '
import CustomModal from '../../components/Popup/ConfirmPopupModal'
import tagApiRequest from '../../apiRequest/tag'
// Modal.setAppElement('#root');
export default function ManagerTag() {
  const user = useSelector((state: RootState) => state.auth.user)

  const [searchTerm, setSearchTerm] = useState('')
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }
  const { tags, loading, error, refetch } = useTagList()

  const filtered = tags.filter((category) => {
    return category.name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  // xóa Thẻ
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [tagId, setSelectedTagId] = useState<number | null>(null)

  const openModal = (id: number) => {
    setSelectedTagId(id)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedTagId(null)
  }
  async function handleConfirmDelete() {
    if (tagId !== null) {
      try {
        if (user) {
          await tagApiRequest.deleteTag(user.id, tagId)
          closeModal()
          actionNotification('Xóa thành công', 'success')
          refetch()
        }
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

  const [addTagState, setAddTagState] = useState<boolean>(false)
  const addTagRef = useRef<HTMLInputElement>(null)
  function handleAddTagState(): void {
    setAddTagState(true)
  }

  async function handleAddTag() {
    const tagName = addTagRef.current?.value
    if (tagName !== null) {
      try {
        if (user) {
          const response = await tagApiRequest.addTag(user.id, tagName)
          actionNotification('Thêm thành công', 'success')
          refetch()
          setAddTagState(false)
        }
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
  const [editTagState, setEditTagState] = useState<boolean>(false)
  const [editTagName, setEditTagName] = useState<string>('')
  const [editTagId, setEditTagId] = useState<number>()

  const editTagRef = useRef<HTMLInputElement>(null)

  function handleSetEditFalse(): void {
    setEditTagState(false)
    setAddTagState(false)
  }
  useEffect(() => {
    // Thiết lập giá trị của input khi component được render hoặc khi tagName thay đổi
    if (editTagRef.current) {
      editTagRef.current.value = editTagName
    }
  }, [editTagName])
  const handleEditTagState = (tagId: number, tagName: string): void => {
    setEditTagState(true)
    window.scrollTo(0, 0)
    setEditTagName(tagName)
    setEditTagId(tagId)
  }

  async function handleEditTag() {
    const tagName = editTagRef.current?.value
    console.log(tagName)
    console.log(editTagName)
    if (tagName === editTagName) {
      actionNotification(`Sửa thẻ thất bại, tên thẻ không thay đổi`, 'error')
      return
    }
    if (tagName !== null) {
      try {
        if (user) {
          const response = await tagApiRequest.editTag(editTagId, user.id, tagName)
          actionNotification('Thêm thành công', 'success')
          refetch()
          setEditTagState(false)
        }
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

  return (
    <div className='bg-white h-max w-[100%] mx-auto my-6 shadow-[0_2px_8px_rgba(47,43,61,0.2),0_0_transparent,0_0_transparent] rounded-md'>
      <div className='mx-5'>
        <ToastContainer></ToastContainer>
        <div className='h-6'></div>
        <div>
          <div className='flex justify-between'>
            <div className='flex '>
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
              {addTagState && (
                <div className='flex'>
                  <div className='ml-3 border border-gray flex rounded-md items-center p-[2px]'>
                    <input type='text' placeholder='Tên thẻ' ref={addTagRef} className='outline-none p-2' />
                  </div>
                  <div
                    className='ml-1 border bg-sky_blue_light hover:cursor-pointer text-white font-bold
                                    flex rounded-md items-center p-[2px] px-4'
                    onClick={handleAddTag}
                  >
                    Thêm
                  </div>
                  <div
                    className='ml-1 border bg-red hover:cursor-pointer text-white font-bold
                                flex rounded-md items-center p-[2px] px-4'
                    onClick={handleSetEditFalse}
                  >
                    Hủy
                  </div>
                </div>
              )}
              {editTagState && (
                <div className='flex'>
                  <div className='ml-3 border border-gray flex rounded-md items-center p-[2px]'>
                    <input type='text' placeholder='Tên thẻ' ref={editTagRef} className='outline-none p-2' />
                  </div>
                  <div
                    className='ml-1 border bg-sky_blue_light hover:cursor-pointer text-white font-bold
                                flex rounded-md items-center p-[2px] px-4'
                    onClick={handleEditTag}
                  >
                    Lưu
                  </div>
                  <div
                    className='ml-1 border bg-red hover:cursor-pointer text-white font-bold
                                flex rounded-md items-center p-[2px] px-4'
                    onClick={handleSetEditFalse}
                  >
                    Hủy
                  </div>
                </div>
              )}
              {addTagState || editTagState || (
                <ButtonWithTooltip
                  className='ml-4 bg-sky_blue_light_500 hover:bg-sky_blue_light text-white font-bold py-2 px-2 mr-2 rounded'
                  title='Thêm thẻ'
                  onClick={handleAddTagState}
                >
                  <BiSolidBookAdd size={30} />
                </ButtonWithTooltip>
              )}
            </div>
          </div>
          <div className='mt-4'>
            <table className='min-w-full bg-white border border-gray'>
              <thead>
                <tr className='bg-gray_light rounded-md'>
                  <th className='border-y border-gray px-3 py-2 text-center'>STT</th>
                  <th className='border-y border-gray px-3 py-2 max-w-[450px] text-center truncate'>Tên thẻ</th>
                  <th className='border-y border-gray px-3 py-2 text-center  justify-center'>Chức năng</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((tag, index) => (
                  <tr className='hover:bg-gray_hover border-b border-gray' key={tag.id}>
                    <td className=' px-3 py-2 text-center'>{index + 1}</td>
                    <td className=' px-3 py-2 max-w-[450px] text-center truncate'>{tag.name}</td>
                    <td className=' px-3 py-2 flex flex-wrap justify-center border-collapse'>
                      <ButtonWithTooltip
                        className='bg-sky_blue_light_500 hover:bg-sky_blue_light text-white font-bold py-2 px-2 mr-2 rounded'
                        title='Sửa thẻ'
                        onClick={() => handleEditTagState(tag.id, tag.name)}
                      >
                        <BiSolidPencil />
                      </ButtonWithTooltip>
                      <ButtonWithTooltip
                        className='bg-[#ED9A96] hover:bg-red text-white font-bold py-2 px-2 mr-0 rounded'
                        title='Xóa thẻ'
                        onClick={() => openModal(tag.id)}
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
              onConfirm={handleConfirmDelete}
              onCancel={closeModal}
            />
          </div>
        </div>
        <div className='h-6'></div>
      </div>
    </div>
  )
}
