import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import { useSelector } from 'react-redux'
import IsLoginHeader from './IsLoginHeader'
import { RootState } from '../store/store'
import Sidebar from './Sidebar'

// Định nghĩa routes cho Sidebar
const routes = [
  {
    path: '/dashboard',
    layout: '',
    name: 'Dashboard',
    icon: 'design_app',
    component: () => <div>Dashboard</div>
  },
  {
    path: '/profile',
    layout: '',
    name: 'Profile',
    icon: 'users_single-02',
    component: () => <div>Profile</div>
  },
  {
    path: '/settings',
    layout: '',
    name: 'Settings',
    icon: 'ui-1_settings-gear-63',
    component: () => <div>Settings</div>
  }
  // Các route khác nếu cần
]

function MainLayout() {
  const auth = useSelector((state: RootState) => state.auth)

  return (
    <div className='flex-col min-h-screen'>
      {auth.isLogin ? <IsLoginHeader /> : <Header />}

      <div className='flex flex-row w-full'>
        {/* Sidebar */}
        <div className='w-48 bg-blue-900'>
          {/* Thêm màu nền cho sidebar */}
          <Sidebar backgroundColor='blue-900' routes={routes} />
        </div>

        {/* Nội dung chính */}
        <div className='flex-col w-screen pr-4'>
          {/* Thêm màu nền cho nội dung chính */}
          <Outlet />
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default MainLayout
