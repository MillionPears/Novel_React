import { useState, useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import Logo from '@/assets/imgs/wideLogo-Photoroom.png'
import { ToastContainer } from 'react-toastify'
import { useUserPermission } from '../../hooks/usePermission'

export default function Manager() {
  const [activeForm, setActiveForm] = useState<string | null>(null)
  const location = useLocation()
  const { permissions, loading, error } = useUserPermission()

  const hasPermission = (permissionName: string) => {
    return permissions.some((permission) => permission.name === permissionName)
  }

  useEffect(() => {
    const path = location.pathname.split('/').pop()
    switch (path) {
      case 'ManagerAuthor':
        setActiveForm('ManagerAuthor')
        break
      case 'ManagerCategory':
        setActiveForm('ManagerCategory')
        break
      case 'ManagerTag':
        setActiveForm('ManagerTag')
        break
      case 'ManagerUser':
        setActiveForm('ManagerUser')
        break
      case 'ManagerRole':
        setActiveForm('ManagerRole')
        break
      case 'ManagerPublishNovel':
        setActiveForm('ManagerPublishNovel')
        break
      case 'ManagerNovel':
        setActiveForm('ManagerNovel')
        break
      case 'ManagerReport':
        setActiveForm('ManagerReport')
        break
      case 'ManagerUserRole':
        setActiveForm('ManagerUserRole')
        break
      default:
        setActiveForm(null)
    }
  }, [location.pathname])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className='flex h-full w-full bg-[#F7F6F9]'>
      <ToastContainer />

      <div
        className='bg-white w-[260px] min-h-screen px-4 
                shadow-[0_2px_8px_rgba(47,43,61,0.2),0_0_transparent,0_0_transparent] 
                z-[1003] flex-col text-[#292929]
                transition transform ease-in-out'
      >
        <Link to='/'>
          <div className='text-4xl py-5'>
            <img src={Logo} alt='Logo' className='flex ' />
          </div>
        </Link>
        {hasPermission('ManagerAuthor') && (
          <Link to='ManagerAuthor'>
            <div
              className={`py-2 my-1 hover:bg-sky_blue_light hover:text-white rounded-md px-2
                            ${activeForm === 'ManagerAuthor' ? 'font-bold bg-sky_blue_light pl-2 text-white' : 'text-gray_text'}`}
              onClick={() => setActiveForm('ManagerAuthor')}
            >
              Quản Lý Tác giả
            </div>
          </Link>
        )}

        {hasPermission('ManagerCategory') && (
          <Link to='ManagerCategory'>
            <div
              className={`py-2 my-1 hover:bg-sky_blue_light hover:text-white rounded-md px-2
                            ${activeForm === 'ManagerCategory' ? 'font-bold bg-sky_blue_light pl-2 text-white' : 'text-gray_text'}`}
              onClick={() => setActiveForm('ManagerCategory')}
            >
              Quản Lý Thể Loại Truyện
            </div>
          </Link>
        )}

        {hasPermission('ManagerTag') && (
          <Link to='ManagerTag'>
            <div
              className={`py-2 my-1 hover:bg-sky_blue_light hover:text-white rounded-md px-2
                            ${activeForm === 'ManagerTag' ? 'font-bold bg-sky_blue_light pl-2 text-white' : 'text-gray_text'}`}
              onClick={() => setActiveForm('ManagerTag')}
            >
              Quản Lý Thẻ
            </div>
          </Link>
        )}

        {hasPermission('ManagerUser') && (
          <Link to='ManagerUser'>
            <div
              className={`py-2 my-1 hover:bg-sky_blue_light hover:text-white rounded-md px-2
                            ${activeForm === 'ManagerUser' ? 'font-bold bg-sky_blue_light pl-2 text-white' : 'text-gray_text'}`}
              onClick={() => setActiveForm('ManagerUser')}
            >
              Quản Lý Người Dùng
            </div>
          </Link>
        )}

        {hasPermission('ManagerPublishNovel') && (
          <Link to='ManagerPublishNovel'>
            <div
              className={`py-2 my-1 hover:bg-sky_blue_light hover:text-white rounded-md px-2
                            ${activeForm === 'ManagerPublishNovel' ? 'font-bold bg-sky_blue_light pl-2 text-white' : 'text-gray_text'}`}
              onClick={() => setActiveForm('ManagerPublishNovel')}
            >
              Duyệt Xuất Bản Truyện
            </div>
          </Link>
        )}

        {hasPermission('ManagerNovel') && (
          <Link to='ManagerNovel'>
            <div
              className={`py-2 my-1 hover:bg-sky_blue_light hover:text-white rounded-md px-2
                            ${activeForm === 'ManagerNovel' ? 'font-bold bg-sky_blue_light pl-2 text-white' : 'text-gray_text'}`}
              onClick={() => setActiveForm('ManagerNovel')}
            >
              Quản Lý Truyện
            </div>
          </Link>
        )}

        {hasPermission('ManagerReport') && (
          <Link to='ManagerReport'>
            <div
              className={`py-2 my-1 hover:bg-sky_blue_light hover:text-white rounded-md px-2
                            ${activeForm === 'ManagerReport' ? 'font-bold bg-sky_blue_light pl-2 text-white' : 'text-gray_text'}`}
              onClick={() => setActiveForm('ManagerReport')}
            >
              Quản Lý Báo Cáo Vi Phạm
            </div>
          </Link>
        )}
        {hasPermission('ManagerRole') && (
          <Link to='ManagerRole'>
            <div
              className={`py-2 my-1 hover:bg-sky_blue_light hover:text-white rounded-md px-2
                            ${activeForm === 'ManagerRole' ? 'font-bold bg-sky_blue_light pl-2 text-white' : 'text-gray_text'}`}
              onClick={() => setActiveForm('ManagerRole')}
            >
              Quản Lý Vai Trò
            </div>
          </Link>
        )}
      </div>

      <div className='flex-1 h-full w-full'>
        <div
          className='bg-white h-[60px] w-[94%] mx-auto my-4
                    shadow-[0_2px_8px_rgba(47,43,61,0.2),0_0_transparent,0_0_transparent] rounded-md'
        ></div>

        <div className='h-max w-[94%] mx-auto my-6'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
