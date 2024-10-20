import { useParams } from 'react-router-dom'
import Banner from '../../components/Banner'
import PopularCard from '../../components/Card/Popular'
import { NovelCardFull } from '../../types/novel'
import { useSearchNovels } from '../../hooks/useNovel'

export default function SearchNovels() {
  const { keyword } = useParams<{ keyword: string }>()
  if (!keyword) {
    return <div>Invalid parameters</div>
  }
  const { novelsList, loadingList, errorList } = useSearchNovels(keyword)

  if (loadingList)
    return (
      <div className='my-12'>
        <Banner></Banner>

        <div className='md:container mt-3'>
          <div className='mt-4'>
            <div className='w-[49.4%] h-[30px] bg-[#c9d7e9] rounded animate-pulse'></div>
          </div>
          <div className='flex flex-wrap gap-3 mt-3'>
            <div className='w-[49.4%] h-[170px] bg-[#c9d7e9] rounded animate-pulse'></div>
            <div className='w-[49.4%] h-[170px] bg-[#c9d7e9] rounded animate-pulse'></div>
            <div className='w-[49.4%] h-[170px] bg-[#c9d7e9] rounded animate-pulse'></div>
            <div className='w-[49.4%] h-[170px] bg-[#c9d7e9] rounded animate-pulse'></div>
          </div>
        </div>
      </div>
    )
  if (errorList)
    return (
      <section className='my-12'>
        <Banner />
        <div className='md:container mt-3'>
          <div className='mt-4'>
            <div className='w-[30%]'></div>
            <div className='bg-white flex-1'>Có lỗi đã xảy ra, vui lòng thử tải lại trang</div>
            <div className='w-[30%]'></div>
          </div>
        </div>
      </section>
    )

  return (
    <div>
      <Banner></Banner>
      <div className='md:container'>
        <p className='text-base text-theme_color font-semibold py-4 mx-2 uppercase'>Tìm truyện: {keyword}</p>

        {novelsList.length > 0 && (
          <div className='flex gap-10 flex-wrap mx-2 mb-4'>
            {novelsList.map((item: NovelCardFull, index: number) => (
              <PopularCard item={item} key={index.toString()} />
            ))}
            {novelsList.length < 1 && (
              <div className='text-center text-gray my-5'>Không có truyện nào thuộc thể loại này để hiển thị.</div>
            )}
          </div>
        )}
        {novelsList.length === 0 && <div>Không có truyện nào liên quan để hiển thị.</div>}
      </div>
    </div>
  )
}
