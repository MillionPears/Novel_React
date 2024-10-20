import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { BiSearchAlt, BiSolidPencil } from 'react-icons/bi'
import { MdDelete } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { useAuthor } from '../../hooks/useAuthor'
import actionNotification from '../../components/NotificationState/Toast'
import ButtonWithTooltip from '../../components/Button/ButtonWithTooltip '
import CustomModal from '../../components/Popup/ConfirmPopupModal'
import authorApiRequest from '../../apiRequest/author'

export default function ManagerAuthor() {
  const user = useSelector((state: RootState) => state.auth.user)

  const [searchTerm, setSearchTerm] = useState('')
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }
  const { authors, refetch } = useAuthor()

  const filtered = authors.filter((author) => {
    return author.nickname.toLowerCase().includes(searchTerm.toLowerCase())
  })

  // xoa / thong bao confirm
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [authorId, setSelectedAuthorId] = useState<number | null>(null)

  const openModal = (id: number) => {
    setSelectedAuthorId(id)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedAuthorId(null)
  }
  async function handleConfirmDelete() {
    if (authorId !== null) {
      try {
        if (user) {
          await authorApiRequest.deleteAuthor(user.id, authorId)
          closeModal()
          actionNotification('Xóa thành công', 'success')
          refetch()
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi không xác định.'
          actionNotification(`${errorMessage}`, 'error')
          closeModal()
        } else {
          actionNotification(`Thêm thất bại!!!\n Đã xảy ra lỗi không xác định.`, 'error')
        }
      }
    }
  }

  const [addAuthorState, setAddAuthorState] = useState<boolean>(false)

  const [editAuthorState, setEditAuthorState] = useState<boolean>(false)
  const [editAuthorLastName, setEditAuthorLastName] = useState<string>('')
  const [editAuthorFirstName, setEditAuthorFirstName] = useState<string>('')
  const [editAuthorNickname, setEditAuthorNickname] = useState<string>('')
  const [editAuthorId, setEditAuthorId] = useState<number>()

  const editAuthorFirstNameRef = useRef<HTMLInputElement>(null)
  const editAuthorLastNameRef = useRef<HTMLInputElement>(null)
  const editAuthorNicknameRef = useRef<HTMLInputElement>(null)

  function handleSetEditFalse(): void {
    setEditAuthorState(false)
    setAddAuthorState(false)
  }
  useEffect(() => {
    // Thiết lập giá trị của input khi component được render hoặc khi AuthorName thay đổi
    if (editAuthorFirstNameRef.current) {
      editAuthorFirstNameRef.current.value = editAuthorFirstName
    }
    if (editAuthorLastNameRef.current) {
      editAuthorLastNameRef.current.value = editAuthorLastName
    }
    if (editAuthorNicknameRef.current) {
      editAuthorNicknameRef.current.value = editAuthorNickname
    }
  }, [editAuthorNickname, editAuthorFirstName, editAuthorLastName])

  const handleEditAuthorState = (authorId: number, firstname: string, lastname: string, nickname: string): void => {
    setEditAuthorState(true)
    window.scrollTo(0, 0)
    setEditAuthorId(authorId)
    setEditAuthorLastName(lastname)
    setEditAuthorFirstName(firstname)
    setEditAuthorNickname(nickname)
  }

  async function handleEditAuthor() {
    const nickname = editAuthorNicknameRef.current?.value
    if (nickname !== null) {
      try {
        if (user) {
          const response = await authorApiRequest.updateAuthor(
            editAuthorId,
            editAuthorFirstNameRef.current?.value,
            editAuthorLastNameRef.current?.value,
            nickname
          )
          actionNotification('Sửa thành công', 'success')
          refetch()
          setEditAuthorState(false)
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi không xác định.'
          actionNotification(`${errorMessage}`, 'error')
        } else {
          actionNotification(`Sửa thất bại!!!\n Đã xảy ra lỗi không xác định.`, 'error')
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
              {editAuthorState && !addAuthorState && (
                <div className='flex'>
                  <div className='ml-3 border border-gray flex rounded-md items-center p-[2px]'>
                    <input type='text' placeholder='Họ' ref={editAuthorLastNameRef} className='outline-none p-2' />
                  </div>
                  <div className='ml-3 border border-gray flex rounded-md items-center p-[2px]'>
                    <input type='text' placeholder='Tên' ref={editAuthorFirstNameRef} className='outline-none p-2' />
                  </div>
                  <div className='ml-3 border border-gray flex rounded-md items-center p-[2px]'>
                    <input
                      type='text'
                      placeholder='Nickname'
                      ref={editAuthorNicknameRef}
                      className='outline-none p-2'
                    />
                  </div>
                  <div
                    className='ml-1 border bg-sky_blue_light hover:cursor-pointer text-white font-bold
                                flex rounded-md items-center p-[2px] px-4'
                    onClick={handleEditAuthor}
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
            </div>
          </div>
          <div className='mt-4'>
            <table className='min-w-full bg-white border border-gray'>
              <thead>
                <tr className='bg-gray_light rounded-md'>
                  <th className='border-y border-gray px-3 py-2 text-center'>STT</th>
                  <th className='border-y border-gray px-3 py-2 max-w-[450px] text-center truncate'>Họ và tên</th>
                  <th className='border-y border-gray px-3 py-2 text-center'>Nickname</th>
                  <th className='border-y border-gray px-3 py-2 text-center '>Số truyện sở hữu</th>
                  <th className='border-y border-gray px-3 py-2 text-center  justify-center'>Chức năng</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((author, index) => (
                  <tr className='hover:bg-gray_hover border-b border-gray' key={author.id}>
                    <td className=' px-3 py-2 text-center'>{index + 1}</td>
                    <td className=' px-3 py-2 max-w-[450px] text-center truncate'>
                      {author.firstname || 'trống'} {author.lastname || ''}
                    </td>
                    <td className=' px-3 py-2 text-center max-w-[450px]'>{author.nickname}</td>
                    <td className=' px-3 py-2 text-center max-w-[450px]'>{author.novelCount}</td>
                    <td className=' px-3 py-2 flex flex-wrap justify-center border-collapse'>
                      <ButtonWithTooltip
                        className='bg-sky_blue_light_500 hover:bg-sky_blue_light text-white font-bold py-2 px-2 mr-2 rounded'
                        title='Sửa truyện'
                        onClick={() =>
                          handleEditAuthorState(author.id, author.firstname, author.lastname, author.nickname)
                        }
                      >
                        <BiSolidPencil />
                      </ButtonWithTooltip>
                      {author.novelCount > 0 || (
                        <ButtonWithTooltip
                          className='bg-[#ED9A96] hover:bg-red text-white font-bold py-2 px-2 mr-0 rounded'
                          title='Xóa truyện'
                          onClick={() => openModal(author.id)}
                        >
                          <MdDelete />
                        </ButtonWithTooltip>
                      )}
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
