import Header from './Header'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'

import { useSelector } from 'react-redux'
import IsLoginHeader from './IsLoginHeader'
import { RootState } from '../store/store'

// const isLogin  = authSlice
// const auth = useSelector((state: RootState) => state.auth)
// auth.isLogin ?

function MainLayout() {
  const auth = useSelector((state: RootState) => state.auth)
  return (
    <div className=''>
      {auth.isLogin ? <IsLoginHeader /> : <Header />}
      <Outlet />
      <Footer />
    </div>
  )
}

export default MainLayout
