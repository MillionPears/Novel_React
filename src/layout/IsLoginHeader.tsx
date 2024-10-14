import { GoSearch } from 'react-icons/go'
import { BiLogoFacebook } from 'react-icons/bi'
import { IoMdNotificationsOutline } from 'react-icons/io'
import wideLogo from '../assets/imgs/wideLogo.png'
import { Link, useNavigate } from 'react-router-dom'
import { FaBookOpen, FaExclamation, FaRegCheckCircle } from 'react-icons/fa'
import { useEffect, useRef, useState } from 'react'

import { useSelector } from 'react-redux'

import { useUserPermission } from '../hooks/usePermission'
import { MdError } from 'react-icons/md'

import { ToastContainer } from 'react-toastify'
import { RootState } from '../store/store'
import novelApiRequest from '../apiRequest/novel'
import useNotification from '../hooks/useNotification'
import axiosInstance from '../untils/axiosInstance'

export interface INotificationI {
  id: number
  title: string
  type: string // Có thể là 'success', 'error', 'info', v.v.
  content: string
  createdAt: Date | null
  userId: number
}

function IsLoginHeader() {
  const user = useSelector((state: RootState) => state.auth.user)
  const avatarUrl = user && user.avatar ? user.avatar : 'https://staticvn.sangtacvietcdn.xyz/img/useravatar/default.png'
  const [isInputVisible, setIsInputVisible] = useState<boolean>(false)
  const inputSearchRef = useRef<HTMLInputElement | null>(null)
  const { permissions, loading, error } = useUserPermission()
  const [menuNavigateNotification, setMenuNavigateNotification] = useState<boolean>(false)
  const { notifications, fetchNotifications, changeStateIsSeen } = useNotification()
  const [notificationElements, setNotificationElements] = useState<JSX.Element[]>([])
  const navigate = useNavigate()
  // notification
  const toggleOverlayNotification = () => {
    setMenuNavigateNotification(!menuNavigateNotification)
    fetchNotifications()
    changeStateIsSeen()
  }

  //search
  const handleSearchIconClick = () => {
    setIsInputVisible(!isInputVisible)
    if (inputSearchRef.current) {
      inputSearchRef.current.focus()
    }
  }

  const isAdminPermission = permissions.some((permission) => permission.name.includes('Manager'))
  const hasNoPosterPermission = permissions.some((permission) => permission.name.includes('NoPost'))
  // nav
  const [menuNavigate2, setMenuNavigate2] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null) // Sử dụng useRef để tham chiếu đến phần tử menu

  const toggleOverlay = () => {
    setMenuNavigate2(!menuNavigate2)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setMenuNavigate2(false)
    }
  }

  const handleSearch = async () => {
    const query = inputSearchRef.current?.value.trim()
    if (query) {
      navigate(`/list/search/${encodeURIComponent(query)}`)
    }
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      await axiosInstance.post('/auth/logout', { accessToken })
      localStorage.clear()
      window.location.reload()
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const getNovelIdByName = async (title: string): Promise<number | null> => {
    try {
      const response = await novelApiRequest.getNovelIdbyNovelName(title)
      return response.data
    } catch (error) {
      console.error('Error fetching novel by ID:', error)
      return null
    }
  }

  const extractNovelId = async (content: string) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')
    const strongElements = doc.querySelectorAll('strong')

    if (strongElements.length > 0) {
      if (content.includes('tại Truyện') && strongElements[1].textContent) {
        const novelName = strongElements[1].textContent.trim()
        const novelId = await getNovelIdByName(novelName)
        return novelId || 0
      } else {
        const novelName = strongElements[0].textContent?.trim() || ''
        const novelId = await getNovelIdByName(novelName)
        return novelId || 0
      }
    }
    return null
  }

  const fetchNotificationElements = async () => {
    const reversedNotifications = notifications.slice().reverse()

    const elements = await Promise.all(
      reversedNotifications.map(async (notification) => {
        const novelName = await extractNovelId(notification.content)

        return (
          <li
            key={notification.id}
            className={`flex ${!novelName && !notification.title.includes('có thể') ? 'text-red' : 'text-[#008800]'} items-start border-b p-2 ${
              notification.type === 'unseen' ? 'bg-gray_hover' : notification.type === 'seen' ? 'bg-white' : ''
            }`}
          >
            {notification.type === 'success' ? (
              <FaRegCheckCircle size={25} className='mr-2 mt-1' />
            ) : notification.type === 'error' ? (
              <MdError size={25} className='mr-2 mt-1' />
            ) : (
              <IoMdNotificationsOutline size={25} className='mr-2 ' />
            )}
            <a href={`${novelName ? `/novel/${novelName}` : '#'}`}>
              <div className='flex flex-wrap'>
                <p className='text-sm underline p-1'>{notification.title}</p>
                <p
                  className={`border-[1px] ${notification.title.includes('có thể') ? 'border-green' : 'border-red'} ml-2 text-sm p-1 bg-white rounded-full`}
                >
                  {notification.type}
                </p>
              </div>
              <div dangerouslySetInnerHTML={{ __html: notification.content }} />
              <small>
                {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : 'Không có ngày'}
              </small>
            </a>
          </li>
        )
      })
    )

    setNotificationElements(elements)
  }

  useEffect(() => {
    fetchNotificationElements()
  }, [notifications])

  return (
    <div className='py-[8px]'>
      <ToastContainer />
      <div className='md:container h-[48px] flex items-center justify-between'>
        <div className='flex items-center'>
          <Link to={'/'}>
            <div className='flex items-center h-[40px]'>
              <div className='h-[25px]'>
                <img src={wideLogo} alt='' className='object-cover h-[30px]' />
              </div>
            </div>
          </Link>
          <div className='flex items-center border-l-[0.1px] text-[#606266] ml-[16px] pl-[8px] border-gray_light'>
            <Link to={'/'}>
              <div className=' flex items-center justify-center h-[32px] w-[32px] mr-[8px]'>
                <BiLogoFacebook size={20} />
              </div>
            </Link>
            <Link to={'/'}>
              <div className='hidden lg:flex items-center justify-center text-[12px] text-[#92400E] font-sans font-medium bg-[#FFF7ED] rounded-full px-[10px] py-[4px]'>
                <div className='mr-2'>
                  <FaBookOpen />
                </div>
                Kho truyện chữ
              </div>
            </Link>
          </div>
        </div>
        <div className='flex items-center justify-end'>
          <div
            className='mr-[20px] w-[40px] h-[40px]  flex items-center justify-center text-[#969696] hover:bg-gray_light cursor-pointer'
            onClick={handleSearchIconClick}
          >
            <GoSearch size={20} />
          </div>
          {/* noti  */}
          <div
            className='mr-[20px] w-[40px] h-[40px] flex items-center justify-center text-[#969696] hover:bg-gray_light cursor-pointer relative'
            onClick={toggleOverlayNotification}
          >
            <div className='relative'>
              <IoMdNotificationsOutline size={20} />
              {notifications.some((noti) => noti.type === 'unseen') && (
                <div className='absolute bottom-3 left-4 text-red'>
                  <FaExclamation size={12} />
                </div>
              )}
            </div>
            {menuNavigateNotification && (
              <div
                className='absolute top-[44px] left-[-425px] max-h-[380px] min-h-[50px] overflow-y-scroll right-0 bg-white text-gray_text p-2'
                style={{ boxShadow: '0px 0px 20px 5px #61e4fc' }}
              >
                <ul>
                  {notificationElements.length === 0 && (
                    <div>
                      <strong>Bạn không có thông báo.</strong>
                      <br />
                    </div>
                  )}
                  {notificationElements}
                </ul>
              </div>
            )}
          </div>
          <div className='flex cursor-pointer mr-[16px] items-center' onClick={toggleOverlay}>
            <div className='rounded-full flex items-center relative' ref={menuRef}>
              <img className='h-[40px] w-[40px] rounded-full mr-2' src={avatarUrl} alt='' />
              {menuNavigate2 && (
                <div
                  className='absolute top-[44px] left-[-125px] right-0 bg-white text-gray_text p-2'
                  style={{ boxShadow: '0px 0px 20px 5px #61e4fc' }}
                >
                  <ul>
                    <div className='py-3 cursor-text text-center border-b border-gray'>{user?.username}</div>
                    <Link to={'/user/account'}>
                      <li className='py-3 px-1 hover:bg-[#efefef]'>Thông tin cá nhân</li>
                    </Link>
                    {isAdminPermission && (
                      <Link to={'/manager/ManagerCategory'}>
                        <li className='py-3 px-1 text-red hover:bg-[#efefef]'>Quản lý</li>
                      </Link>
                    )}
                    {!hasNoPosterPermission && (
                      <Link to={'/uploader/published'}>
                        <li className='py-3 px-1 border-gray border-t hover:bg-[#efefef]'>Đăng truyện</li>
                      </Link>
                    )}
                    <li className='py-3 px-1 hover:bg-[#efefef]'>
                      <a href='/user/bookmark'>Truyện đánh dấu</a>
                    </li>
                    <li className='py-3 px-1 hover:bg-[#efefef]'>
                      <a href='/user/follow'>Truyện theo dõi</a>
                    </li>
                    <li className='py-3 px-1 hover:bg-[#efefef]'>
                      <a href=''>Truyện đã đăng</a>
                    </li>
                    <li onClick={handleLogout} className='py-3 px-1 border-gray border-t hover:bg-[#efefef] text-red'>
                      Đăng xuất
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className='md:container '>
        {isInputVisible && (
          <div className='mt-2 flex border border-gray items-center pl-4' onKeyDown={handleInputKeyDown}>
            <input
              type='text'
              ref={inputSearchRef}
              className='w-[100%] p-2 border-0 border-gray z-10 outline-none'
              placeholder='Tìm kiếm tên truyện, tác giả...'
            />
            <div className='hover:bg-gray_hover p-2 px-3'>
              <GoSearch size={22} onClick={handleSearch} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default IsLoginHeader
