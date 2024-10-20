import { useMostFollowNovels } from '../../hooks/useNovel'

import { faStar } from '@fortawesome/free-solid-svg-icons/faStar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faCircleChevronLeft, faCircleChevronRight } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
// Import component placeholder

function HomePage() {
  const { FollowNovels } = useMostFollowNovels()
  const [currentNovelIndex, setCurrentNovelIndex] = useState(0)
  // Hàm để điều chỉnh chỉ số của tiểu thuyết hiện tại
  const nextNovel = () => {
    setCurrentNovelIndex((prevIndex) => (prevIndex + 1) % FollowNovels.length)
  }

  const prevNovel = () => {
    setCurrentNovelIndex((prevIndex) => (prevIndex - 1 + FollowNovels.length) % FollowNovels.length)
  }
  return (
    // Main div
    <div className=''>
      {/* Out Now & Banner */}
      <div className='flex-col '>
        {/* Out now  */}
        <div className='flex justify-between items-center h-10 pb-4 '>
          {/* Tạo hàng với Out Now, ngôi sao, mũi tên trái và mũi tên phải */}
          <div className='flex items-center'>
            <div className='text-sky_blue text-xl font-semibold'>Out Now</div>
            <FontAwesomeIcon
              icon={faStar}
              rotation={90}
              style={{ color: '#74C0FC', marginLeft: '8px', fontSize: '1.5rem' }}
            />
          </div>
          <div className='flex items-center'>
            <FontAwesomeIcon
              icon={faCircleChevronLeft}
              style={{ color: '#74C0FC', marginRight: '16px', fontSize: '1.5rem' }}
            />
            <FontAwesomeIcon icon={faCircleChevronRight} style={{ color: '#74C0FC', fontSize: '1.5rem' }} />
          </div>
        </div>
        {/* Banner */}
        <div className=''>
          {FollowNovels.length > 0 && (
            <div className='flex items-center space-x-4'>
              {' '}
              {/* Sử dụng flex để căn chỉnh ảnh và văn bản */}
              {/* Hiển thị ảnh bìa của novel */}
              <img
                src={FollowNovels[currentNovelIndex].banner} // Đường dẫn đến hình ảnh bìa
                alt={FollowNovels[currentNovelIndex].title} // Văn bản thay thế cho ảnh
                className='w-32 h-48 object-cover rounded' // Các lớp Tailwind CSS để điều chỉnh kích thước và kiểu dáng ảnh
              />
              {/* Hiển thị tiêu đề và mô tả của novel */}
              <div>
                <h2 className='text-xl font-semibold'>{FollowNovels[currentNovelIndex].title}</h2>
                <p className='text-gray-600'>{FollowNovels[currentNovelIndex].description}</p>
                {/* Thêm bất kỳ thông tin nào khác về novel mà bạn muốn hiển thị */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomePage
