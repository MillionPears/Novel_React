import { useEffect, useState } from 'react'
import { BiSearchAlt } from 'react-icons/bi'
import { VscDiffRemoved } from 'react-icons/vsc'
import { Link, useParams } from 'react-router-dom'
import { RiAddBoxLine } from 'react-icons/ri'

import { useSelector } from 'react-redux'

import { FaAngleLeft } from 'react-icons/fa6'
import { FiInfo } from 'react-icons/fi'
import { TiTick } from 'react-icons/ti'
import { IoCloseSharp } from 'react-icons/io5'
import { RootState } from '../../store/store'
import { getRoleName } from '../../hooks/useRole'
import { useListPermission, useRolePermission } from '../../hooks/usePermission'
import ButtonWithTooltip from '../../components/Button/ButtonWithTooltip '
import permissionApiRequest from '../../apiRequest/permission'

export default function ManagerRolePermission() {
  const { roleId } = useParams<{ roleId: string }>()
  const user = useSelector((state: RootState) => state.auth.user)

  const [refresh, setRefresh] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }
  if (!roleId) {
    return
  }
  const { roleName } = getRoleName(roleId)
  const { permissions, refetch } = useRolePermission(roleId) // Danh sách quyền của vai trò
  const { permissionsList, loading, error } = useListPermission() // Danh sách quyền

  // Set để kiểm tra nhanh các permission ID có trong permissions
  const permissionIds = new Set(permissions.map((permission) => permission.id))

  const filtered = permissionsList.filter((permission) => {
    return permission.name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  useEffect(() => {
    if (roleId) {
      refetch() // Làm mới danh sách quyền của vai trò khi roleId thay đổi
    }
  }, [roleId, refresh])
  async function handleAddRoleToPermission(permissionId: number) {
    // sai
    try {
      if (user) {
        const response = await permissionApiRequest.addPermissionToRole(user.id, roleId, permissionId)
        setRefresh((prev) => !prev)
      }
    } catch (error) {}
  }
  async function handleRemoveRoleToPermission(permissionId: number) {
    try {
      if (user) {
        const response = await permissionApiRequest.deletePermissionToRole(user.id, roleId, permissionId)
        setRefresh((prev) => !prev)
      }
    } catch (error) {}
  }

  return (
    <div className='bg-white h-max w-[100%] mx-auto my-6 shadow-[0_2px_8px_rgba(47,43,61,0.2),0_0_transparent,0_0_transparent] rounded-md'>
      <div className='mx-5'>
        <div className='h-6'></div>
        <p className='font-bold uppercase text-lg my-3 flex '>
          Role: <p className='ml-3 border-y-[2px] rounded-lg px-2 border-red'>{roleName}</p>
        </p>
        <div>
          <div className='flex justify-between'>
            <div className='flex'>
              <Link to={`/manager/ManagerRole`}>
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
              {roleName === 'SuperAdmin' && (
                <div className='flex mx-1 text-[#FF6A30] p-1 rounded-md gap-1 items-end'>
                  <FiInfo size={25} />
                  <span>SuperAdmin là vai trò cao nhất, cho nên không có bất cứ hành động nào.</span>
                </div>
              )}
            </div>
          </div>
          <div className='mt-4'>
            <table className='min-w-full bg-white border border-gray'>
              <thead>
                <tr className='bg-gray_light rounded-md'>
                  <th className='border-y border-gray px-3 py-2 text-center'>STT</th>
                  <th className='border-y border-gray px-3 py-2 max-w-[450px] text-center truncate'>Tên vai trò</th>
                  <th className='border-y border-gray px-3 py-2 text-center'>Mô tả</th>
                  {roleName === 'SupeAdmin' || (
                    <th className='border-y border-gray px-3 py-2 text-center'>Hành động</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((permission, index) => (
                  <tr className='hover:bg-gray_hover border-b border-gray' key={permission.id}>
                    <td className=' px-3 py-2 text-center'>{index + 1}</td>
                    <td className=' px-3 py-2 text-center truncate max-w-[120px] '>{permission.name}</td>
                    <td className=' px-3 py-2 text-center max-w-[150px]'>{permission.description}</td>
                    {roleName === 'SuperAdmin' ? (
                      <td className='px-3 py-2 text-center border-collapse'>
                        <div className='flex justify-center items-center space-x-1'>
                          {!permissionIds.has(permission.id) ? (
                            // Nếu permission có trong danh sách permissions, chỉ hiển thị nút Xóa quyền
                            <ButtonWithTooltip className='text-red font-bold py-1 px-2 rounded' title='Không sở hữu'>
                              <IoCloseSharp size={23} />
                            </ButtonWithTooltip>
                          ) : (
                            // Nếu không có trong danh sách permissions, chỉ hiển thị nút Thêm quyền
                            <ButtonWithTooltip className='text-green font-bold py-1 px-2 rounded' title='Sở hữu'>
                              <TiTick size={25} />
                            </ButtonWithTooltip>
                          )}
                        </div>
                      </td>
                    ) : (
                      // UPDATE O DAY
                      <td className='px-3 py-2 text-center border-collapse'>
                        <div className='flex justify-center items-center space-x-1'>
                          {permissionIds.has(permission.id) ? (
                            // Nếu permission có trong danh sách permissions, chỉ hiển thị nút Xóa quyền
                            <ButtonWithTooltip
                              className='text-red font-bold py-1 px-2 rounded'
                              title='Xóa quyền'
                              onClick={() => handleRemoveRoleToPermission(permission.id)}
                            >
                              <VscDiffRemoved size={23} />
                            </ButtonWithTooltip>
                          ) : (
                            // Nếu không có trong danh sách permissions, chỉ hiển thị nút Thêm quyền
                            <ButtonWithTooltip
                              className='text-green font-bold py-1 px-2 rounded'
                              title='Thêm quyền'
                              onClick={() => handleAddRoleToPermission(permission.id)}
                            >
                              <RiAddBoxLine size={25} />
                            </ButtonWithTooltip>
                          )}
                        </div>
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
