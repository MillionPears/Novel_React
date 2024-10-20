import { useState } from 'react'
import { BiSearchAlt, BiSolidBookAdd } from 'react-icons/bi'

import { Link } from 'react-router-dom'

import { useSelector } from 'react-redux'

import history from '../../router/history'
import { ToastContainer } from 'react-toastify'
import { RootState } from '../../store/store'
import { useUserList } from '../../hooks/useUser'
import { useUserPermission } from '../../hooks/usePermission'
import actionNotification from '../../components/NotificationState/Toast'
import ButtonWithTooltip from '../../components/Button/ButtonWithTooltip '
import authApiRequest from '../../apiRequest/auth'

export default function ManagerUser() {
  const user = useSelector((state: RootState) => state.auth.user)

  const [searchTerm, setSearchTerm] = useState('')
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }
  const { users, loading, error, refreshUserList } = useUserList()
  const { permissions } = useUserPermission()
  const isUserRolePermission = permissions.some((permission) => permission.name.includes('UserRole'))
  const filtered = users.filter((user) => {
    return user.username.toLowerCase().includes(searchTerm.toLowerCase())
  })

  async function handleCheckboxChange(userBlockId: number): Promise<void> {
    if (user) {
      try {
        const response = await authApiRequest.blockUser(user.id, userBlockId)
        refreshUserList()
        actionNotification(`Chuyển trạng thái block người dùng thành công`, 'success')
      } catch (error: any) {
        actionNotification(error.message, 'error')
        actionNotification(`Chuyển trạng thái block người dùng thất bại`, 'error')
      }
    } else {
      actionNotification('Người dùng chưa đăng nhập', 'error')
      history.push(`/login`)
    }
  }

  return (
    <div className='bg-white h-max w-[100%] mx-auto my-6 shadow-[0_2px_8px_rgba(47,43,61,0.2),0_0_transparent,0_0_transparent] rounded-md'>
      <div className='mx-5'>
        <div className='h-6'></div>
        <div>
          <ToastContainer></ToastContainer>
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
              <Link to={`add-category/`}>
                <ButtonWithTooltip
                  className='ml-4 bg-sky_blue_light_500 hover:bg-sky_blue_light text-white font-bold py-2 px-2 mr-2 rounded'
                  title='Thêm thể loại'
                >
                  <BiSolidBookAdd size={30} />
                </ButtonWithTooltip>
              </Link>
            </div>
          </div>
          <div className='mt-4'>
            <table className='min-w-full bg-white border border-gray'>
              <thead>
                <tr className='bg-gray_light rounded-md'>
                  <th className='border-y border-gray px-3 py-2 text-center'>ID</th>
                  <th className='border-y border-gray px-3 py-2 max-w-[450px] text-center truncate'>Người dùng</th>
                  <th className='border-y border-gray px-3 py-2 text-center'>Email</th>
                  <th className='border-y border-gray px-4 py-2 text-center'>Bị cấm</th>
                  <th className='border-y border-gray px-4 py-2 text-center'>Xác nhận email</th>
                  {isUserRolePermission && (
                    <th className='border-y border-gray px-3 py-2 text-center  justify-center'>Vai trò</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((user, index) => (
                  <tr className='hover:bg-gray_hover border-b border-gray' key={user.id}>
                    <td className=' px-3 py-2 text-center'>{user.id}</td>
                    <td className=' px-3 py-2 max-w-[450px] text-center truncate'>{user.username}</td>
                    <td className=' px-3 py-2 text-center max-w-[450px]'>{user.email}</td>
                    <td className='px-4 py-2 text-center'>
                      <input
                        type='checkbox'
                        checked={user.blacklist}
                        onChange={() => handleCheckboxChange(user.id)}
                        className='mx-auto'
                      />
                    </td>
                    <td className='px-4 py-2 justify-center text-center'>
                      {user.confirmed ? (
                        <p className='text-[#34A853] font-bold'>YES</p>
                      ) : (
                        <p className='text-[#EA4335] font-bold'>NO</p>
                      )}
                    </td>
                    {isUserRolePermission && (
                      <td className=' px-3 py-2 flex flex-wrap justify-center border-collapse'>
                        <a
                          href={`/manager/ManagerUserRole/${user.id}`}
                          className='block bg-sky_blue_light_500 hover:bg-sky_blue_light text-white p-1 rounded-sm'
                        >
                          Xem
                        </a>
                      </td>
                    )}
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
