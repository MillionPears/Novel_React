import { useParams } from 'react-router-dom'

import { useState } from 'react'
import Banner from '../../components/Banner'
import NoverDetailsCard from '../../components/Card/NovelDetail'
import NovelDetailsChapters from '../../components/Card/NovelDetailsChapters'
import NovelRating from '../../components/Card/NovelRating'
import NovelComments from '../../components/Card/NovelComments'

function Novel() {
  const { novelId } = useParams<{ novelId: string }>()
  const [selectedTab, setSelectedTab] = useState('comments')
  const novelIdNumber = Number(novelId)
  if (isNaN(novelIdNumber)) {
    return <div>Error: Invalid novel ID</div>
  }

  // useEffect(() => {
  //     // Cuộn lên đầu trang mỗi khi component được mount
  //     window.scrollTo(0, 0);
  // }, []);
  return (
    <div className='bg-gray_hover'>
      <Banner />
      <div className='md:container mt-6 '>
        <div className='mt-3 bg-white rounded-lg'>
          <NoverDetailsCard novelId={+novelIdNumber} />
        </div>
        <div className=''>
          <NovelDetailsChapters novelId={+novelIdNumber} />
        </div>
        <div className='bg-white py-4'>
          <Banner />
        </div>
        <div className='text-lg flex bg-[#E4DECE]'>
          <div
            className={`cursor-pointer px-4 py-1 ${selectedTab === 'comments' ? 'bg-[#B78A28] text-white' : ''}`}
            onClick={() => setSelectedTab('comments')}
          >
            BÌNH LUẬN
          </div>
          <div
            className={`cursor-pointer px-4 py-1 ${selectedTab === 'rating' ? 'bg-[#B78A28] text-white' : ''}`}
            onClick={() => setSelectedTab('rating')}
          >
            Đánh giá - Review
          </div>
        </div>
        {selectedTab === 'comments' && <NovelComments novelId={novelIdNumber} />}
        {selectedTab === 'rating' && <NovelRating novelId={novelIdNumber} />}
      </div>
    </div>
  )
}

export default Novel
