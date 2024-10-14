import { FaRegEye } from 'react-icons/fa'
import userIcon from '@/assets/imgs/user-128.svg'
import { NovelFeedCardProps } from '../../types/card'
import { timeAgo } from '../../store/Time'

function NovelFeedCard({ item }: { item: NovelFeedCardProps }) {
  return (
    <div className='mw-[100%] flex gap-x-[20px] border-[#f0f1f2] py-3 border-b-2 lg:flex-row w-[100%]   '>
      <div className='img-preview w-[8%]'>
        <a href={`/novel/${item.id}`}>
          <img
            src={item.image}
            alt=''
            className='w-[100%] h-[100%] 
                    object-cover rounded-[4px] cursor-pointer
                    border-[1px] border-[#e1e1e1] border-solid'
          />
        </a>
      </div>
      <div className='flex flex-col flex-1 '>
        <div>
          <a className='mt-[10px]' href={`/novel/${item.id}`}>
            <p className='hover:text-theme_color text-sm font-semibold text-gray_text cursor-pointer'>{item.title}</p>
          </a>
        </div>
        <div className='flex justify-between items-center mr-4'>
          <div className='flex gap-1'>
            <div className='owner w-[14px] h-[14px]'>
              <img src={userIcon} alt='' className='w-100 rounded-full h-100' />
            </div>
            <div className='flex gap-3  '>
              {item.author.map((author) => (
                <div key={author.id} className='flex hover:underline items-center gap-1 cursor-pointer'>
                  <a href={`/list/author/${author.id}`} className='hover:text-theme_color text-gray_text text-xs'>
                    {author.nickname}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <FaRegEye className='text-[#909399]' />
            <span className='text-gray_text text-xs'>{item.views}</span>
          </div>
        </div>
        <div>
          <p className='text-xs mt-1 italic'>{timeAgo(item.lastChapterCreatedAt)}</p>
        </div>
      </div>
    </div>
  )
}

export default NovelFeedCard
