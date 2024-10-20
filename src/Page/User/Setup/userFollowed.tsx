import { Link } from 'react-router-dom'

import { useState } from 'react'
import { BiSearchAlt } from 'react-icons/bi'

import Banner from '../../../components/Banner'
import { convertTo24Hour } from '../../../store/Time'
import { useGetFollow } from '../../../hooks/useFollow'

export default function FollowedPage() {
  const { bookmark, loading, error, removeBookmark, refetch } = useGetFollow()
  const [searchTerm, setSearchTerm] = useState('')
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }
  const filtered = bookmark.filter((bookmark) => {
    return bookmark.title.toLowerCase().includes(searchTerm.toLowerCase())
  })
  if (loading) {
    return <div className='w-full h-6 bg-[#c9d7e9] rounded animate-pulse'></div>
  }

  if (error) {
    return <div className='text-red'>Có lỗi xảy ra: {error}</div>
  }

  function handleRmBookmark(bookmarkId: number) {
    removeBookmark(bookmarkId)
    refetch()
  }

  return (
    <div>
      <Banner></Banner>
      <div className='md:container mt-5'>
        <div className='border border-gray flex rounded-md items-center p-[2px] mb-2'>
          <BiSearchAlt size={25} color='#969696' className='ml-2' />
          <input
            type='text'
            placeholder='Tìm kiếm'
            className='p-2 outline-none w-full'
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        {Array.isArray(bookmark) && bookmark.length > 0 ? (
          filtered.map((item) => (
            <div key={item.id} className='flex gap-5 hover:bg-gray_hover border-b-2 border-[#f0f1f2] py-3'>
              <div className='w-[12%]'>
                <a href={`/novel/${item.id}`}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className='w-full h-full first-letter:object-cover rounded border border-[#e1e1e1] cursor-pointer'
                  />
                </a>
              </div>
              <div className='flex flex-col flex-1'>
                <a href={`/novel/${item.id}`} className=''>
                  <p className='font-semibold  text-lg hover:text-theme_color cursor-pointer'>{item.title}</p>
                </a>
                <div className='flex items-center mt-1'>
                  <div className='flex flex-wrap gap-3'>
                    {item.author.map((author) => (
                      <div key={author.id} className='flex justify-between hover:underline items-center'>
                        <Link to={`/author/${author.id}`} className='flex items-center'>
                          <p className='hover:text-theme_color'>{author.nickname}</p>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
                <div className='text-sm my-1'>Cập nhật vào lúc {convertTo24Hour(item.updatedAt)}</div>
                <div>
                  <button
                    onClick={() => handleRmBookmark(item.followId)}
                    className='p-1 px-2 text-red border-[1px] bottom-0'
                  >
                    Bỏ theo dõi
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>Không có dữ liệu để hiển thị.</div>
        )}
      </div>
    </div>
  )
}
