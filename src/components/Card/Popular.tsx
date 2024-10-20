import userIcon from '@/assets/imgs/user-128.svg'

import { FaRegEye } from 'react-icons/fa'
import { NovelCardFull } from '../../types/novel'

function PopularCard({ item }: { item: NovelCardFull }) {
  return (
    <div className='mw-[100%] flex gap-x-[20px] lg:flex-row sm:flex-row lg:w-[47%] sm:w-[100%]'>
      <a className='img-preview sm:w-[27%] cursor-pointer w-[20%]' href='/'>
        <img src={item.image} alt='' className='w-[100%] object-cover rounded-[4px]' />
      </a>
      <div className='flex flex-col justify-between flex-1'>
        <div>
          <a className='' href='/'>
            <p className='text-base font-semibold line-clamp-2 hover:text-theme_color'>{item.title}</p>
            <p
              className='text-sm font-medium text-gray 
                        mt-1 md:line-clamp-3 sm:line-clamp-3 line-clamp-1'
            >
              {item.description}
            </p>
          </a>
        </div>

        <a href={`/list/category/${item.categoryId}`} className='flex mt-1'>
          <p
            className='border border-theme_color-300 
                    rounded-md cursor-pointer p-1 text-xs font-medium text-dark_gold'
          >
            {item.categoryName}
          </p>
        </a>

        <div className='flex justify-between items-center'>
          <div>
            {item.author.map((author) => (
              <a key={author.id} className='flex items-center' href={`/list/author/${author.id}`}>
                <div className='owner w-[20px] h-[20px]'>
                  <img src={userIcon} alt='User Icon' className='w-100 rounded-full h-100' />
                </div>
                <p className='text-sm ml-2 cur font-semibold hover:text-theme_color'>{author.nickname}</p>
              </a>
            ))}
          </div>

          <div className='flex items-center gap-2'>
            <FaRegEye className='text-[#909399]' />
            <span className='text-gray_text text-xs'>{item.views}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PopularCard
