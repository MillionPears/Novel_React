import { useState } from 'react'
import { useSelector } from 'react-redux'

import AvatarUpload from './Upload'
import { toast, ToastContainer } from 'react-toastify'
import { RootState } from '../../../store/store'
// const userName = useSelector((state: RootState) => state.auth.user)

function AccountPage() {
  const user = useSelector((state: RootState) => state.auth.user)
  const [days, setDays] = useState([...Array(31).keys()].map((day) => day + 1))
  const months = [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12'
  ]
  const years = [...Array(50).keys()].map((year) => year + 1970)
  // change style change password form
  const [formStyle, setFormStyle] = useState({
    maxHeight: '0',
    overflow: 'hidden',
    transition: 'max-height 0.5s ease-in-out'
  })
  const changeHeight = () => {
    setFormStyle((prevStyle) => ({
      ...prevStyle,
      maxHeight: prevStyle.maxHeight === '0' ? '325px' : '0',
      overflow: prevStyle.maxHeight === '0' ? 'visible' : 'hidden'
    }))
  }
  const [gender, setGender] = useState(user ? user.gender : 2)

  const ConfirmClick = () => {
    toast('Wow so easy!')
  }

  return (
    <div className='md:container'>
      <div className='mb-6'>
        <div className='mt-10 flex '>
          <ToastContainer />

          <AvatarUpload></AvatarUpload>
          {/* ============================================ */}

          <div className='px-8 flex-1'>
            <div className='flex-row'>
              <div className='flex-1'>
                <span>TÊN HIỂN THỊ</span>
                <input
                  type='text'
                  className='text-base h-10 px-2 w-full mb-4 border border-gray outline-none rounded'
                  defaultValue={user ? user.username : ''}
                />
              </div>
              <div className='flex-1'>
                <span>EMAIL</span>
                <input
                  type='text'
                  className='text-base h-10 px-2 w-full mb-4 border border-gray outline-none rounded'
                  defaultValue={user ? user.email : ''}
                />
              </div>
            </div>

            <div className='flex-row gap-10'>
              <div className='flex-1'>
                <span>NGÀY SINH</span>
                <div className='flex gap-2 '>
                  <select
                    name='day'
                    id='day'
                    className='text-base h-10 px-2 w-full mb-4 border border-gray outline-none rounded'
                  >
                    {days.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                  <select
                    name='month'
                    id='month'
                    className='text-base h-10 px-2 w-full mb-4 border border-gray outline-none rounded'
                  >
                    {months.map((month, index) => (
                      <option key={index} value={index + 1}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <select
                    name='year'
                    id='year'
                    className='text-base h-10 px-2 w-full mb-4 border border-gray outline-none rounded'
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className='flex-1'>
                <span>GIỚI TÍNH</span>
                <div className='flex justify-between'>
                  <div className='flex gap-4 mt-2'>
                    <div className='flex gap-1'>
                      <input
                        type='radio'
                        name='radioGender'
                        className='checked:border-sky_blue_light'
                        id='radioGender1'
                        checked={gender === 1}
                        onChange={() => setGender(1)}
                      />
                      <label htmlFor='radioGender1' className='cursor-pointer self-center'>
                        Nam
                      </label>
                    </div>
                    <div className='flex gap-1'>
                      <input
                        type='radio'
                        name='radioGender'
                        className='checked:text-sky_blue_light'
                        id='radioGender2'
                        checked={gender === 0}
                        onChange={() => setGender(0)}
                      />
                      <label htmlFor='radioGender2' className='cursor-pointer self-center'>
                        Nữ
                      </label>
                    </div>
                    <div className='flex gap-1'>
                      <input
                        type='radio'
                        name='radioGender'
                        className='checked:text-sky_blue_light'
                        id='radioGender3'
                        checked={gender === 2}
                        onChange={() => setGender(2)}
                      />
                      <label htmlFor='radioGender3' className='cursor-pointer self-center'>
                        Không biết
                      </label>
                    </div>
                  </div>
                  <div>
                    <div
                      className='bg-sky_blue_light_500 hover:bg-theme_color 
                    cursor-pointer text-white 
                    shadow-md shadow-gray rounded-lg p-2 px-4'
                      onClick={ConfirmClick}
                    >
                      Sửa
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='flex justify-end'>
          <div
            className='bg-gray_light cursor-pointer text-gray_text
           shadow-md shadow-gray rounded-lg p-2 px-4 hidden'
          >
            Hủy
          </div>
          <div
            className='bg-theme_color cursor-pointer text-white
           shadow-md shadow-gray rounded-lg p-2 px-4 hidden'
          >
            Lưu
          </div>
        </div>
        {/* display name, date,... */}

        {/* change pass */}
        <div className='flex justify-items-center mt-3 px-8 '>
          <button
            type='button'
            onClick={changeHeight}
            className='shadow-md rounded-full p-2 w-full bg-gray_light bg-opacity-70 
            hover:bg-sky_blue_light hover:text-white font-bold'
          >
            Đổi mật khẩu
          </button>
        </div>
        <form style={formStyle} className=' px-8'>
          {/* Rest of your form content... */}
          <div className='mt-4 '>
            <span>MẬT KHẨU CŨ</span>
            <input
              type='text'
              className='text-base h-10 px-2 w-full mb-4 border border-gray outline-none rounded '
              required
              placeholder='****************'
            />
          </div>
          <div className=''>
            <span>MẬT KHẨU MỚI</span>
            <input
              type='text'
              className='text-base h-10 px-2 w-full mb-4 border border-gray outline-none rounded'
              required
              placeholder='****************'
            />
          </div>
          <div className=''>
            <span>NHẬP LẠI MẬT KHẨU MỚI</span>
            <input
              type='text'
              className='text-base h-10 px-2 w-full mb-4 border border-gray outline-none rounded'
              required
              placeholder='****************'
            />
          </div>
          <div className='flex justify-items-center mx-4'>
            <button onClick={changeHeight} className='rounded-full p-2 w-full bg-sky_blue_light bg-opacity-70 '>
              Xac nhan
            </button>
          </div>
        </form>

        {/* SỐ CHỨNG MINH THƯ ĐỊA CHỈ SỐ ĐIỆN THOẠI */}
        {/* <div className="mt-10 px-8">
          <div className="flex gap-10">
            <div className="flex-1">
              <span>SỐ CHỨNG MINH THƯ</span>
              <input
                type="text"
                className="text-base h-10 px-2 w-full mb-4 border border-gray outline-none rounded"
              />
            </div>
            <div className="flex-1">
              <span>SỐ ĐIỆN THOẠI</span>
              <input
                type="text"
                className="text-base h-10 px-2 w-full mb-4 border border-gray outline-none rounded"
              />
            </div>
          </div>

          <div className="flex gap-10">
            <div className="flex-1">
              <span>ĐỊA CHỈ</span>
              <input
                type="text"
                className="text-base h-10 px-2 w-full mb-4 border border-gray outline-none rounded"
              />
            </div>
          </div>
        </div> */}

        {/* darkmode,... */}
        <div className='flex justify-between gap-10 mt-2 px-8 bg-white'>
          {/* hang 1 */}
          <div className='flex-1 '>
            <div className='flex justify-between mb-2'>
              <label htmlFor=''>Số lượng người tôi theo dõi</label>
              <div className=''>
                <input
                  type='checkbox'
                  className='appearance-none focus:outline-none checked:bg-sky_blue_light h-6 w-10 bg-gray bg-opacity-10 
                rounded-full before:inline-block border-gray border p-0.5
                before:rounded-full before:bg-white 
                before:h-4  before:w-4 before:border before:border-gray
                checked:before:translate-x-full 
                shadow-inner transition-all duration-300 before:ml-0.5'
                />
              </div>
            </div>

            <div className='flex justify-between'>
              <label htmlFor=''>Số lượng người theo dõi tôi</label>
              <div className=''>
                <input
                  type='checkbox'
                  className='appearance-none focus:outline-none checked:bg-sky_blue_light h-6 w-10 bg-gray bg-opacity-10 
                rounded-full before:inline-block border-gray border p-0.5
                before:rounded-full before:bg-white 
                before:h-4  before:w-4 before:border before:border-gray
                checked:before:translate-x-full 
                shadow-inner transition-all duration-300 before:ml-0.5'
                />
              </div>
            </div>
          </div>
          {/* hang 2 */}
          <div className='flex-1'>
            <div className='flex justify-between mb-2'>
              <label htmlFor=''>Bình luận đã gửi</label>
              <div className=''>
                <input
                  type='checkbox'
                  className='appearance-none focus:outline-none checked:bg-sky_blue_light h-6 w-10 bg-gray bg-opacity-10 
                rounded-full before:inline-block border-gray border p-0.5
                before:rounded-full before:bg-white 
                before:h-4  before:w-4 before:border before:border-gray
                checked:before:translate-x-full 
                shadow-inner transition-all duration-300 before:ml-0.5'
                />
              </div>
            </div>

            <div className='flex justify-between'>
              <label htmlFor=''>Darkmode</label>
              <div className=''>
                <input
                  type='checkbox'
                  className='appearance-none focus:outline-none checked:bg-sky_blue_light h-6 w-10 bg-gray bg-opacity-10 
                rounded-full before:inline-block border-gray border p-0.5
                before:rounded-full before:bg-white 
                before:h-4  before:w-4 before:border before:border-gray
                checked:before:translate-x-full 
                shadow-inner transition-all duration-300 before:ml-0.5'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default AccountPage
