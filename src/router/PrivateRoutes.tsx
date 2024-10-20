import { useLayoutEffect } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { RootState } from '../store/store'
import Loading from '../components/Loading'

const PrivateRoutes = () => {
  const auth = useSelector((state: RootState) => state.auth)
  return (
    <>
      {auth.isLoading ? (
        <div className='w-[100vw] h-[100vh] flex items-center justify-center'>
          <Loading />
        </div>
      ) : auth.isLogin ? (
        <Outlet />
      ) : (
        <Navigate to='/login' />
      )}
    </>
  )
}

export default PrivateRoutes
