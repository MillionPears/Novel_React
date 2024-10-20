import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { BiSearchAlt, BiSolidBookAdd, BiSolidPencil } from 'react-icons/bi'
import { MdDelete } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { RootState } from '../../store/store'
import actionNotification from '../../components/NotificationState/Toast'
import ButtonWithTooltip from '../../components/Button/ButtonWithTooltip '
import { useCategoryList } from '../../hooks/userCategoryList'
import CustomModal from '../../components/Popup/ConfirmPopupModal'
import categoryApiRequest from '../../apiRequest/category'

export default function ManagerCategory() {
  const user = useSelector((state: RootState) => state.auth.user)

  const [searchTerm, setSearchTerm] = useState('')
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }
  const { categories, loading, error, refetch } = useCategoryList()

  const filtered = categories.filter((category) => {
    return category.name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  // xoa / thong bao confirm
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [categoryId, setSelectedCategoryId] = useState<number | null>(null)

  const openModal = (id: number) => {
    setSelectedCategoryId(id)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedCategoryId(null)
  }
  async function handleConfirmDelete() {
    if (categoryId !== null) {
      try {
        if (user) {
          await categoryApiRequest.deleteCategoryOfUser(user.id, categoryId)
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

  const [addCategoryState, setAddCategoryState] = useState<boolean>(false)
  const addCategoryNameRef = useRef<HTMLInputElement>(null)
  const addCategoryDescripRef = useRef<HTMLInputElement>(null)

  function handleAddCategoryState(): void {
    setAddCategoryState(true)
  }

  async function handleAddCategory() {
    const categoryName = addCategoryNameRef.current?.value
    const categoryDescription = addCategoryDescripRef.current?.value
    if (categoryName !== null && categoryDescription !== null) {
      try {
        if (user) {
          const response = await categoryApiRequest.addCategory(user.id, categoryName, categoryDescription)
          actionNotification('Thêm thành công', 'success')
          refetch()
          setAddCategoryState(false)
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi không xác định.'
          actionNotification(`${errorMessage}`, 'error')
        } else {
          actionNotification(`Thêm thất bại!!!\n Đã xảy ra lỗi không xác định.`, 'error')
        }
      }
    } else {
      actionNotification('Chưa điền đủ nội dung', 'warning')
    }
  }
  const [editCategoryState, setEditCategoryState] = useState<boolean>(false)
  const [editCategoryName, setEditCategoryName] = useState<string>('')
  const [editCategoryDescription, setEditCategoryDescription] = useState<string>('')
  const [editCategoryId, setEditCategoryId] = useState<number>()

  const editCategoryNameRef = useRef<HTMLInputElement>(null)
  const editCategoryDescripRef = useRef<HTMLInputElement>(null)

  function handleSetEditFalse(): void {
    setEditCategoryState(false)
    setAddCategoryState(false)
  }
  useEffect(() => {
    // Thiết lập giá trị của input khi component được render hoặc khi CategoryName thay đổi
    if (editCategoryNameRef.current) {
      editCategoryNameRef.current.value = editCategoryName
    }
    if (editCategoryDescripRef.current) {
      editCategoryDescripRef.current.value = editCategoryDescription
    }
  }, [editCategoryName])

  const handleEditCategoryState = (categoryId: number, categoryName: string, description: string): void => {
    setEditCategoryState(true)
    window.scrollTo(0, 0)
    setEditCategoryDescription(description)
    setEditCategoryName(categoryName)
    setEditCategoryId(categoryId)
  }

  async function handleEditCategory() {
    const categoryName = editCategoryNameRef.current?.value
    if (categoryName !== null) {
      try {
        if (user) {
          const response = await categoryApiRequest.updateCategory(
            editCategoryId,
            user.id,
            categoryName,
            editCategoryDescripRef.current?.value
          )
          actionNotification('Thêm thành công', 'success')
          refetch()
          setEditCategoryState(false)
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
              {addCategoryState && (
                <div className='flex'>
                  <div className='ml-3 border border-gray flex rounded-md items-center p-[2px]'>
                    <input
                      type='text'
                      placeholder='Tên thể loại'
                      ref={addCategoryNameRef}
                      className='outline-none p-2'
                    />
                  </div>
                  <div className='ml-3 border border-gray flex rounded-md items-center p-[2px]'>
                    <input type='text' placeholder='Mô tả' ref={addCategoryDescripRef} className='outline-none p-2' />
                  </div>

                  <div
                    className='ml-1 border bg-sky_blue_light hover:cursor-pointer text-white font-bold
                                    flex rounded-md items-center p-[2px] px-4'
                    onClick={handleAddCategory}
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
              {editCategoryState && !addCategoryState && (
                <div className='flex'>
                  <div className='ml-3 border border-gray flex rounded-md items-center p-[2px]'>
                    <input type='text' placeholder='Tên thẻ' ref={editCategoryNameRef} className='outline-none p-2' />
                  </div>
                  <div className='ml-3 border border-gray flex rounded-md items-center p-[2px]'>
                    <input type='text' placeholder='Mô tả' ref={editCategoryDescripRef} className='outline-none p-2' />
                  </div>
                  <div
                    className='ml-1 border bg-sky_blue_light hover:cursor-pointer text-white font-bold
                                flex rounded-md items-center p-[2px] px-4'
                    onClick={handleEditCategory}
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
              {addCategoryState || editCategoryState || (
                <ButtonWithTooltip
                  className='ml-4 bg-sky_blue_light_500 hover:bg-sky_blue_light text-white font-bold py-2 px-2 mr-2 rounded'
                  title='Thêm thể loại'
                  onClick={handleAddCategoryState}
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
                  <th className='border-y border-gray px-3 py-2 max-w-[450px] text-center truncate'>Tên thể loại</th>
                  <th className='border-y border-gray px-3 py-2 text-center'>Mô tả</th>
                  <th className='border-y border-gray px-3 py-2 text-center  justify-center'>Chức năng</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((category, index) => (
                  <tr className='hover:bg-gray_hover border-b border-gray' key={category.id}>
                    <td className=' px-3 py-2 text-center'>{index + 1}</td>
                    <td className=' px-3 py-2 max-w-[450px] text-center truncate'>{category.name}</td>
                    <td className=' px-3 py-2 text-center max-w-[450px]'>{category.description}</td>
                    <td className=' px-3 py-2 flex flex-wrap justify-center border-collapse'>
                      <ButtonWithTooltip
                        className='bg-sky_blue_light_500 hover:bg-sky_blue_light text-white font-bold py-2 px-2 mr-2 rounded'
                        title='Sửa truyện'
                        onClick={() => handleEditCategoryState(category.id, category.name, category.description)}
                      >
                        <BiSolidPencil />
                      </ButtonWithTooltip>
                      <ButtonWithTooltip
                        className='bg-[#ED9A96] hover:bg-red text-white font-bold py-2 px-2 mr-0 rounded'
                        title='Xóa truyện'
                        onClick={() => openModal(category.id)}
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
