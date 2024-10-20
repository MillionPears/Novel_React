import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { BiSearchAlt, BiSolidBookAdd, BiSolidPencil } from 'react-icons/bi'
import { MdDelete } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { RootState } from '../../store/store'
import { useRoleList } from '../../hooks/useRole'
import actionNotification from '../../components/NotificationState/Toast'
import CustomModal from '../../components/Popup/ConfirmPopupModal'
import ButtonWithTooltip from '../../components/Button/ButtonWithTooltip '
import roleApiRequest from '../../apiRequest/role'

export default function ManagerRole() {
  const user = useSelector((state: RootState) => state.auth.user)

  const [searchTerm, setSearchTerm] = useState('')
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }
  const { roles, loading, error, refetch } = useRoleList()

  const filtered = roles.filter((role) => {
    return role.name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const addRoleRef = useRef<HTMLInputElement>(null)
  const addRoleDescriptionRef = useRef<HTMLInputElement>(null)

  const [addRoleName, setAddRole] = useState<string>('')
  const [addRoleState, setAddRoleState] = useState<boolean>(false)

  useEffect(() => {
    if (addRoleRef.current?.value) {
      setAddRole(addRoleRef.current.value)
    }
  })
  function handleAddRoleState(): void {
    setAddRoleState(true)
  }

  function handleSetAddFalse(): void {
    setAddRoleState(false)
    setAddRole('')
  }

  async function handleAddRole(): Promise<void> {
    try {
      if (user) {
        console.log('add user to role')
        const response = await roleApiRequest.addRole(
          user.id,
          addRoleRef.current?.value,
          addRoleDescriptionRef.current?.value
        )
        actionNotification(`Thêm vai trò thành công`, 'success')

        refetch()
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi không xác định.'
        actionNotification(`${errorMessage}`, 'error')
      } else {
        actionNotification(`Đã xảy ra lỗi không xác định.`, 'error')
      }
    }
  }

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null)

  const openModal = (id: number) => {
    setSelectedRoleId(id)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedRoleId(null)
  }
  async function handleRemoveRole() {
    try {
      if (user) {
        const response = await roleApiRequest.deleteRole(user.id, selectedRoleId)
        actionNotification(`Xóa vai trò thành công`, 'success')
        refetch()
        closeModal()
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi không xác định.'
        actionNotification(`${errorMessage}`, 'error')
        closeModal()
      } else {
        actionNotification(`Đăng nhập thất bại.`, 'error')
        closeModal()
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
          onConfirm={handleRemoveRole}
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
              {addRoleState && (
                <div className='flex'>
                  <div className='ml-3 border border-gray flex rounded-md items-center p-[2px]'>
                    <input type='text' placeholder='Tên vai trò' ref={addRoleRef} className='outline-none p-2' />
                  </div>
                  <div className='ml-3 border border-gray flex rounded-md items-center p-[2px]'>
                    <input
                      type='text'
                      placeholder='Tên vai trò'
                      ref={addRoleDescriptionRef}
                      className='outline-none p-2'
                    />
                  </div>

                  <div
                    className='ml-1 border bg-sky_blue_light hover:cursor-pointer text-white font-bold
                                flex rounded-md items-center p-[2px] px-4'
                    onClick={handleAddRole}
                  >
                    Thêm
                  </div>
                  <div
                    className='ml-1 border bg-red hover:cursor-pointer text-white font-bold
                            flex rounded-md items-center p-[2px] px-4'
                    onClick={handleSetAddFalse}
                  >
                    Hủy
                  </div>
                </div>
              )}
              {addRoleState || (
                <ButtonWithTooltip
                  className='ml-4 bg-sky_blue_light_500 hover:bg-sky_blue_light text-white font-bold py-2 px-2 mr-2 rounded'
                  title='Thêm vai trò'
                  onClick={handleAddRoleState}
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
                  <th className='border-y border-gray px-3 py-2 text-center'>ID</th>
                  <th className='border-y border-gray px-3 py-2 max-w-[450px] text-center truncate'>Tên vai trò</th>
                  <th className='border-y border-gray px-3 py-2 text-center'>Mô tả</th>
                  <th className='border-y border-gray px-3 py-2 text-center'>Quyền</th>
                  <th className='border-y border-gray px-3 py-2 text-center '>Chức năng</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((role, index) => (
                  <tr className='hover:bg-gray_hover border-b border-gray' key={role.id}>
                    <td className=' px-3 py-2 text-center'>{role.id}</td>
                    <td className=' px-3 py-2 text-center truncate max-w-[120px] '>{role.name}</td>
                    <td className=' px-3 py-2  max-w-[150px]'>{role.description}</td>
                    <td className='px-3 py-2 text-center max-w-[300px] overflow-x-auto line-clamp-2'>
                      <a
                        href={`/manager/ManagerRolePermission/${role.id}`}
                        className='block bg-sky_blue_light_500 hover:bg-sky_blue_light text-white p-1 rounded-sm'
                      >
                        Xem
                      </a>
                    </td>

                    <td className='px-3 py-2 text-center border-collapse'>
                      <div className='flex justify-center items-center space-x-2'>
                        {role.name != 'SuperAdmin' && (
                          <ButtonWithTooltip
                            className='bg-[#ED9A96] hover:bg-red text-white font-bold py-1 px-2 rounded'
                            title='Xóa truyện'
                            onClick={() => openModal(role.id)}
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
