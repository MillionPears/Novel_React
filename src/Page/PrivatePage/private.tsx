import PopularCard, { PopularCardProps } from '@/components/Card/Popular'
import React from 'react'
import Banner from '../../components/Banner'

const popularList: Array<PopularCardProps> = [
  {
    image_preview: 'https://images.spiderum.com/sp-thumbnails/f0628740338511eebb663dbe38264265.jpg',
    title: 'Nhiếp Ảnh - Vì Cuộc Sống Đẹp Hơn Bạn Nghĩ',
    brief: 'Mình học chụp ảnh từ năm 23 tuổi. Khi đó không phải vì mình',
    categories: 'QUAN ĐIỂM - TRANH LUẬN',
    avatar: 'https://images.spiderum.com/sp-xs-avatar/ea52570010d411eeaa1b1fd1b5ecd0d3.png'
  },
  {
    image_preview: 'https://images.spiderum.com/sp-thumbnails/ad9ae4e0336f11ee8d41e3678c0b7dd6.png',
    title: '[Tập hiểu sâu]: Vì sao Bạn luôn KHÔNG ỔN?',
    brief:
      'I’m OK - You’re OK, một tựa sách dành cho những ai luôn thấy bản thân Không-Ổn. Đặc biệt, với những ai đã trải qua...',
    categories: 'QUAN ĐIỂM - TRANH LUẬN',
    avatar: 'https://images.spiderum.com/sp-xs-avatar/001befb0738b11e98bc52d654e80e4ac.jpg'
  }
]
function Private() {
  return (
    <div>
      <Banner />
      <div className='container'>
        <div>
          <p className='text-base font-bold py-4'>PHỔ BIẾN TRÊN SPIDERUM</p>
          <div>
            <div className='flex gap-10 flex-wrap'>
              {popularList.map((item: PopularCardProps, index: number) => (
                <PopularCard item={item} key={index.toString()} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Private
