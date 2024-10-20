import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useListNovels } from '../../hooks/useNovel'
import Banner from '../../components/Banner'
import PopularCard from '../../components/Card/Popular'
import { NovelCardFull } from '../../types/novel'
import novelApiRequest from '../../apiRequest/novel'

export default function ListNovels() {
  const { type, id } = useParams<{ type: string; id: string }>()
  const [typeName, setTypeName] = useState<string>('')
  if (!type || !id) {
    return <div>Invalid parameters</div>
  }

  const { novelsList, loadingList, errorList } = useListNovels({ type, id })

  useEffect(() => {
    const fetchTypeName = async () => {
      if (type !== 'poster') {
        try {
          const response = await novelApiRequest.getByTypeName(type, id)
          setTypeName(response.data) // Lưu giá trị vào state
        } catch (error) {
          console.error('Error fetching type name:', error)
        }
      } else {
        try {
          const response = await novelApiRequest.getByAuthName(id)
          setTypeName(`được đăng bởi ${response.data}`) // Lưu giá trị vào state
        } catch (error) {
          console.error('Error fetching type name:', error)
        }
      }
    }

    if (type && id) {
      fetchTypeName()
    }
  }, [type, id])

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
      <div className='my-12'>
        <Banner></Banner>

        <div className='md:container mt-3'>
          <div className='mt-4'>
            <div className='w-[30%]'></div>
            <div className='bg-white flex-1'>Có lỗi đã xảy ra, vui lòng thử tải lại trang</div>
            <div className='w-[30%]'></div>
          </div>
        </div>
      </div>
    )

  return (
    <div>
      <Banner></Banner>
      <div className='md:container'>
        <p className='text-base text-theme_color font-semibold py-4 mx-2 uppercase'>TRUYỆN {typeName}</p>

        <div className='flex gap-10 flex-wrap mx-2 mb-4'>
          {novelsList.map((item: NovelCardFull, index: number) => (
            <PopularCard item={item} key={index.toString()} />
          ))}
          {novelsList.length < 1 && (
            <div className='text-center text-gray my-5'>Không có truyện nào thuộc thể loại này để hiển thị.</div>
          )}
        </div>
      </div>
    </div>
  )
}

/// sai het, 1: troongs, them tham so: category? tag? novel? author? poster? => be =>
