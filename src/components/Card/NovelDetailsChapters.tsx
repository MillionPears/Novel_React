import { NoverDetailsCardProps } from './NovelDetail'
import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { IoIosArrowDown } from 'react-icons/io'
import { IoIosArrowUp } from 'react-icons/io'
import { useArrChaptersDetails } from '../../hooks/useChapters'

export default function NovelDetailsChapters({ novelId }: NoverDetailsCardProps) {
  const [showAll, setShowAll] = useState(false)
  const publishedOnly = true // cái này chỉ lấy ispublish = true
  const { ArrChapters, loading, error } = useArrChaptersDetails({ novelId, publishedOnly })
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  const numberOfShowItem = 12
  const displayedChapters = showAll ? ArrChapters : ArrChapters.slice(0, numberOfShowItem) // 6 hàng, 1 hàng 3 cái

  //
  return (
    <div className='bg-white'>
      <div className='bg-[#E4DECE] text-sm px-4 py-1'>CHƯƠNG MỚI</div>
      <div className=' border-x-[2px] border-x-gray_light px-3 text-sm'>
        {ArrChapters.slice(-3)
          .reverse()
          .map((chapter) => (
            <a href={`${novelId}/${chapter.id}`} key={chapter.id}>
              <div className='flex justify-between border-b-[2px] border-b-gray_light p-2 hover:bg-gray_hover '>
                <div>{chapter.title}</div>
                <div>{formatDistanceToNow(new Date(chapter.updatedAt), { addSuffix: true, locale: vi })}</div>
              </div>
            </a>
          ))}
      </div>

      <div className='bg-[#E4DECE] text-sm px-4 py-1'>MỤC LỤC</div>
      <div>
        <div className='flex-wrap grid grid-cols-3 border-x-[2px] border-x-gray_light px-3 text-sm'>
          {displayedChapters.map((chapter) => (
            <a href={`${novelId}/${chapter.id}`} key={chapter.id}>
              <div
                className='p-2 py-3 hover:bg-gray_hover
                             hover:border-b-sky_blue_light hover:border-b-[1px] truncate'
              >
                {chapter.title}
              </div>
            </a>
          ))}
        </div>
        {/* 6 hàng, 1 hàng 3 cái */}
        {ArrChapters.length > numberOfShowItem && (
          <div className='flex justify-center p-1 bg-[#ECEAEA]'>
            <button onClick={() => setShowAll(!showAll)} className='flex items-center gap-0.5  hover:underline'>
              {showAll ? <IoIosArrowUp /> : <IoIosArrowDown />}
              {showAll ? 'Thu gọn' : 'Mở rộng'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
