import { IoBan } from 'react-icons/io5'

import { useEffect, useState } from 'react'
import { BiSearchAlt } from 'react-icons/bi'
import { FaAngleLeft } from 'react-icons/fa'
import { FiInfo } from 'react-icons/fi'
import { RiAddBoxLine } from 'react-icons/ri'
import { VscDiffRemoved } from 'react-icons/vsc'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import actionNotification from '../../components/NotificationState/Toast'
import { useRoleList, useUserRole } from '../../hooks/useRole'
import ButtonWithTooltip from '../../components/Button/ButtonWithTooltip '
import { RootState } from '../../store/store'
import authApiRequest from '../../apiRequest/auth'

export default function ManagerUserRole() {
  const { userId } = useParams<{ userId: string }>()
  const user = useSelector((state: RootState) => state.auth.user)

  const [refresh, setRefresh] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  if (!userId) {
    return
  }
  const [userName, setUserName] = useState<string>('')
  const getUserName = async () => {
    try {
      const response = await authApiRequest.getUserName(userId)
      setUserName(response.data)
    } catch (error) {
      actionNotification('Không thể lấy username!', 'error')
    }
  }
  getUserName()

  const { userRoles, refetch } = useUserRole(+userId) // Danh sách quyền của vai trò
  const { roles, loading, error } = useRoleList() // Danh sách quyền

  // Set để kiểm tra nhanh các role ID có trong roles
  const userRoleIds = new Set(userRoles)

  const filtered = roles.filter((role) => {
    return role.name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  useEffect(() => {
    if (userId) {
      refetch() // Làm mới danh sách quyền của vai trò khi userId thay đổi
    }
  }, [userId, refresh])
  async function handleAddUserToRole(roleId: number) {
    try {
      if (user) {
        console.log('add user to role')
        const response = await authApiRequest.addUserToRole(user.id, userId, roleId)
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
  async function handleRemoveUserToRole(roleId: number) {
    try {
      if (user) {
        const response = await authApiRequest.deleteUserToRole(user.id, userId, roleId)
        actionNotification(`Xóa vai trò thành công`, 'success')

        refetch()
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi không xác định.'
        actionNotification(`${errorMessage}`, 'error')
      } else {
        actionNotification(`Đăng nhập thất bại.`, 'error')
      }
    }
  }

  return (
    <div className='bg-white h-max w-[100%] mx-auto my-6 shadow-[0_2px_8px_rgba(47,43,61,0.2),0_0_transparent,0_0_transparent] rounded-md'>
      <div className='mx-5'>
        <div className='h-6'></div>
        <p className='font-bold uppercase text-lg my-3 flex '>
          Username: <p className='ml-3 border-y-[2px] rounded-lg px-2 border-red'>{userName}</p>
        </p>
        <div>
          <div className='flex justify-between'>
            <div className='flex'>
              <Link to={`/manager/ManagerUser`}>
                <ButtonWithTooltip
                  className='bg-sky_blue_light_500 hover:bg-sky_blue_light text-white font-bold py-2 px-2 mr-2 rounded'
                  title='Quay vế'
                >
                  <FaAngleLeft size={30} />
                </ButtonWithTooltip>
              </Link>
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
              {/* { roleName==="SuperAdmin" && */}
              <div className='flex mx-1 text-[#FF6A30] p-1 rounded-md gap-1 items-end'>
                <FiInfo size={25} />
                <span>SuperAdmin là vai trò cao nhất, cho nên không có bất cứ hành động nào.</span>
              </div>
              {/* } */}
            </div>
          </div>
          <div className='mt-4'>
            <table className='min-w-full bg-white border border-gray'>
              <thead>
                <tr className='bg-gray_light rounded-md'>
                  <th className='border-y border-gray px-3 py-2 text-center'>STT</th>
                  <th className='border-y border-gray px-3 py-2 max-w-[450px] text-center truncate'>Tên vai trò</th>
                  <th className='border-y border-gray px-3 py-2 text-center'>Mô tả</th>
                  {/* {roleName === "SuperAdmin" ||  */}
                  <th className='border-y border-gray px-3 py-2 text-center'>Hành động</th>
                  {/* } */}
                </tr>
              </thead>
              <tbody>
                {filtered.map((role, index) => (
                  <tr className='hover:bg-gray_hover border-b border-gray' key={role.id}>
                    <td className=' px-3 py-2 text-center'>{index + 1}</td>
                    <td className=' px-3 py-2 text-center truncate max-w-[120px] '>{role.name}</td>
                    <td className=' px-3 py-2 text-center max-w-[150px]'>{role.description}</td>
                    <td className='px-3 py-2 text-center border-collapse'>
                      {role.name === 'SuperAdmin' || (
                        <div className='flex justify-center items-center'>
                          {userRoleIds.has(role.id) ? (
                            // Nếu role có trong danh sách roles, chỉ hiển thị nút Xóa quyền
                            <ButtonWithTooltip
                              className='text-red font-bold  rounded'
                              title='Xóa quyền'
                              onClick={() => handleRemoveUserToRole(role.id)}
                            >
                              <VscDiffRemoved size={23} />
                            </ButtonWithTooltip>
                          ) : (
                            // Nếu không có trong danh sách roles, chỉ hiển thị nút Thêm quyền
                            <ButtonWithTooltip
                              className='text-green font-bold rounded'
                              title='Thêm quyền'
                              onClick={() => handleAddUserToRole(role.id)}
                            >
                              <RiAddBoxLine size={25} />
                            </ButtonWithTooltip>
                          )}
                        </div>
                      )}

                      {role.name === 'SuperAdmin' && (
                        <div className='flex justify-center items-center '>
                          <ButtonWithTooltip className='text-red font-bold rounded' title='NoAccess'>
                            <IoBan size={23} />
                          </ButtonWithTooltip>
                        </div>
                      )}
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
