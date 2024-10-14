import { useGetHistoryUser } from '../../hooks/useHistory'
import { timeAgo } from '../../store/Time'

export default function HistoryCard() {
  const { histories, loading, error, rmHistory, fetchHistories } = useGetHistoryUser()

  if (loading)
    return (
      <div>
        <div className='w-full h-6 mb-2 bg-[#c9d7e9] rounded animate-pulse'></div>
        <div className='w-full h-6 mb-2 bg-[#c9d7e9] rounded animate-pulse'></div>
        <div className='w-full h-6 mb-2 bg-[#c9d7e9] rounded animate-pulse'></div>
        <div className='w-full h-6 mb-2 bg-[#c9d7e9] rounded animate-pulse'></div>
        <div className='w-full h-6 mb-2 bg-[#c9d7e9] rounded animate-pulse'></div>
      </div>
    )
  if (error)
    return (
      <div className=''>
        <div className='w-full h-6 mb-2 bg-[#c9d7e9] rounded animate-pulse'></div>
        <div className='w-full h-6 mb-2 bg-[#c9d7e9] rounded animate-pulse'></div>
        <div className='w-full h-6 mb-2 bg-[#c9d7e9] rounded animate-pulse flex text-center'>
          <div className='w-[30%]'></div>
          <div className='bg-white flex-1'>Có lỗi đã xảy ra, vui lòng thử tải lại trang</div>
          <div className='w-[30%]'></div>
        </div>
        <div className='w-full h-6 mb-2 bg-[#c9d7e9] rounded animate-pulse'></div>
        <div className='w-full h-6 mb-2 bg-[#c9d7e9] rounded animate-pulse'></div>
      </div>
    )

  function handleRemoveHistory(id: number): void {
    rmHistory(id)
    fetchHistories()
    console.log(id)
  }

  return (
    <div className='bg-white border-[1px] border-gray_hover'>
      <div className='max-h-[200px] overflow-y-auto'>
        {' '}
        {/* Giới hạn chiều cao và bật cuộn dọc */}
        {histories?.map((item: any, index: number) => (
          <div key={index} className='grid grid-cols-12 gap-2 mb-2 px-3 py-1 bg-gray_hover'>
            <div className='hidden md:block xl:col-span-2 md:truncate'>
              <span className='text-gray text-xs truncate'>{timeAgo(item.updatedAt)}</span>
            </div>
            <div className='col-span-12 xl:col-span-5 sm:col-span-8 md:col-span-7 sm:truncate content-center '>
              <a href={`/novel/${item.novelId}`} className='text-sm font-semibold hover:text-theme_color truncate'>
                {item.novelTitle}
              </a>
            </div>
            <div className='md:pl-3 col-span-11 xl:col-span-4 lg:col-span-2 sm:col-span-3 md:col-span-2 md:truncate'>
              <a href={`/novel/${item.novelId}/${item.chapterId}`} className='sm:text-xs truncate'>
                {item.chapterTitle}
              </a>
            </div>
            <div className='col-span-1 justify-self-end'>
              <button
                className='outline outline-1 px-2 text-red disabled:bg-gray-500 rounded'
                onClick={() => handleRemoveHistory(item.id)}
              >
                <span className='text-xs'>x</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
