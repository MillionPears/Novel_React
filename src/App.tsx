import './App.css'
import CustomRouter from './router/CustomRouter'
import { Route, Routes } from 'react-router-dom'
import history from './router/history'
import LoginForm from './Page/Login'
import MainLayout from './layout/MainLayout'
import HomePage from './Page/Home'

function App() {
  //const userName = useSelector((state: RootState) => state.auth.user);
  //const customUserPath = `/users/${userName}`;
  return (
    <CustomRouter history={history}>
      <Routes>
        <Route path='/login' element={<LoginForm />} />

        <Route element={<MainLayout />}>
          <Route path='/' element={<HomePage />} />
          {/* <Route path='/novel/:novelId' element={<Novel />} /> */}
          {/* <Route path='/novel/:novelId/:chapterId' element={<Chapter />} /> */}
          {/* <Route path='list/:type/:id' element={<ListNovels />} /> */}
          {/* <Route path='list/search/:keyword' element={<SearchNovels />} /> */}
          {/* <Route path="/tag/:tagId" element={<DanhSach/>} /> */}
        </Route>
      </Routes>
    </CustomRouter>
  )
}

export default App
