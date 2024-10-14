import React from 'react'
import wideLogo from '../assets/imgs/wideLogo.png'

import Appstore from '@/assets/imgs/appstore-badge.svg'
import Chplay from '@/assets/imgs/ggplay-badge.svg'

function Footer() {
  return (
    <div className='py-10 border-t-[1px] border-t-[#e1e1e1] border-t-solid'>
      <div className='container'>
        <div className='flex justify-between lg:items-center lg:flex-row xs:flex-col xs:items-start gap-y-2'>
          <div className='flex lg:items-center lg:flex-row xs:flex-col gap-x-10 xs:items-start gap-y-2'>
            <div className='h-[30px] w-[130px] '>
              <img src={wideLogo} alt='' className='object-cover ' />
            </div>
            <div className='flex gap-x-3'>
              <p className='text-xs text-gray_text cursor-pointer font-semibold'>LIÊN HỆ</p>
              <p className='text-xs text-gray_text cursor-pointer font-semibold'>ĐIỀU KIỆN SỬ DỤNG</p>
            </div>
          </div>
          <div className='flex lg:items-center gap-2 xs:flex-col xs:items-start lg:flex-row'>
            <div className='flex items-center gap-2 '>
              {/* <a href="#">
                                <img src={Appstore} alt="" width={135} height={41} />
                            </a> */}
              {/* <a href='#'>
                <img src={Chplay} alt='' width={135} height={41} />
              </a> */}
            </div>
          </div>
        </div>
        <div className='py-10 border-t-[1px] border-t-[#e1e1e1] border-t-solid mt-6'>
          <div className='flex justify-between gap-x-10 flex-wrap gap-y-4'>
            <div className='xs:w-[100%] lg:w-1/3'>
              <p className='text-xs text-gray font-semibold'>Công ty ....</p>
              <p className='text-xs text-gray'>Trực thuộc Công ty .... Việt Nam</p>
              <p className='text-xs text-gray'>Người chịu trách nhiệm nội dung: Nguyễn Văn Thịnh</p>
              <p className='text-xs text-gray'>Giấy phép .....</p>
            </div>
            <div className='xs:w-[100%] lg:w-1/4'>
              <p className='text-xs text-gray font-semibold'>Liên hệ hợp tác</p>
              <p className='text-xs text-gray'>Email: zettournguyen@gmail.com</p>
              <p className='text-xs text-gray'>Điện thoại: ........</p>
            </div>
            <div className='xs:w-[100%] lg:w-1/3'>
              <p className='text-xs text-gray font-semibold'>© Copyright 2024 - 2025</p>
              <p className='text-xs text-gray'>Email: zettournguyen@gmail.com</p>
              <p className='text-xs text-gray'>Điện thoại: ....</p>
              <p className='text-xs text-gray'>
                ..............................................................................
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
