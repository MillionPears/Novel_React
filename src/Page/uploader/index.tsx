import Logo from '@/assets/imgs/wideLogo-Photoroom.png'
import { useEffect, useState, useRef } from 'react'
import { GoSidebarCollapse, GoSidebarExpand } from 'react-icons/go'
import { IoMdClose } from 'react-icons/io'
import { Link, Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

export default function Uploader() {
  const [activeForm, setActiveForm] = useState<string | null>(null)
  const [sideBarState, setSideBarState] = useState<boolean>(true)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const [isSmallScreen, setIsSmallScreen] = useState(window.matchMedia('(max-width: 640px)').matches)
  const handleSetting = (formName: string) => {
    setActiveForm(formName)
    if (isSmallScreen) {
      setSideBarState(false)
    }
  }
  const handleResize = () => {
    setIsSmallScreen(window.innerWidth < 640)
  }
  useEffect(() => {
    const path = location.pathname.split('/').pop()
    switch (path) {
      case 'published':
        setActiveForm('Published')
        break
      case 'new-novel':
        setActiveForm('NewNovel')
        break
      case 'statistic':
        setActiveForm('Statistic')
        break
      case 'report-handle':
        setActiveForm('ReportHandle')
        break
      case 'things-to-know':
        setActiveForm('ThingsToKnow')
        break
      default:
        setActiveForm(null)
    }
  }, [location.pathname])

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.matchMedia('(max-width: 640px)').matches)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    // Cập nhật trạng thái sidebarState dựa trên kích thước màn hình khi component mount
    if (isSmallScreen) {
      setSideBarState(false)
    }

    // Thêm sự kiện lắng nghe resize
    window.addEventListener('resize', handleResize)

    // Xóa sự kiện lắng nghe khi component unmount
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [isSmallScreen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSideBarState(false)
      }
    }
    if (isSmallScreen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    // Xóa sự kiện lắng nghe khi component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isSmallScreen])

  const handleChangeSideBarState = (): void => {
    setSideBarState(!sideBarState)
  }

  return (
    <div className='flex h-full w-full bg-[#F7F6F9]'>
      <ToastContainer />
      {sideBarState && isSmallScreen && (
        <div className='fixed inset-0 z-50 bg-gray bg-opacity-50' onClick={() => setSideBarState(false)}></div>
      )}
      {sideBarState && !isSmallScreen && (
        <div
          className={`bg-white w-[260px] min-h-screen px-4 
                shadow-[0_2px_8px_rgba(47,43,61,0.2),0_0_transparent,0_0_transparent] 
                z-[1003] flex-col text-[#292929]
                transition transform ease-in-out`}
        ></div>
      )}

      {sideBarState && (
        <div
          ref={sidebarRef}
          className={`bg-white w-[260px] min-h-screen px-4 fixed
                    shadow-[0_2px_8px_rgba(47,43,61,0.2),0_0_transparent,0_0_transparent]
                    z-[1003] flex-col text-[#292929]
                    transition transform ease-in-out`}
        >
          {isSmallScreen && (
            <div className='absolute top-4 right-4 cursor-pointer' onClick={() => setSideBarState(false)}>
              <IoMdClose color='#DD2C00' size={20} />
            </div>
          )}
          <Link to={'/'}>
            <div className='text-4xl py-5'>
              <img src={Logo} alt='Logo' className='flex' />
            </div>
          </Link>

          <Link to='published'>
            <div
              className={`py-2 my-1 hover:bg-sky_blue_light hover:text-white rounded-md px-2
                            ${activeForm === 'Published' ? 'font-bold bg-sky_blue_light pl-2 text-white' : 'text-gray_text'}`}
              onClick={() => handleSetting('Published')}
            >
              Truyện Đã đăng
            </div>
          </Link>

          <Link to='new-novel'>
            <div
              className={`py-2 my-1 hover:bg-sky_blue_light hover:text-white rounded-md px-2
                            ${activeForm === 'NewNovel' ? 'font-bold bg-sky_blue_light pl-2 text-white' : 'text-gray_text'}`}
              onClick={() => handleSetting('NewNovel')}
            >
              Thêm mới
            </div>
          </Link>

          <Link to='things-to-know'>
            <div
              className={`py-2 my-1 hover:bg-sky_blue_light hover:text-white rounded-md px-2
                            ${activeForm === 'ThingsToKnow' ? 'font-bold bg-sky_blue_light pl-2 text-white' : 'text-gray_text'}`}
              onClick={() => handleSetting('ThingsToKnow')}
            >
              Kiến thức cơ bản
            </div>
          </Link>
        </div>
      )}

      <div className='flex-1 h-full w-full'>
        <div
          className='bg-white h-[60px] w-[94%] mx-auto my-4
                    shadow-[0_2px_8px_rgba(47,43,61,0.2),0_0_transparent,0_0_transparent] rounded-md'
        >
          <div className='h-full flex items-center ml-5'>
            {sideBarState ? (
              <GoSidebarCollapse size={25} onClick={handleChangeSideBarState} />
            ) : (
              <GoSidebarExpand size={25} onClick={handleChangeSideBarState} />
            )}
          </div>
        </div>

        <div className='h-max w-[94%] mx-auto my-6'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
