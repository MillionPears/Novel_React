// src/components/NoverDetailsCard.tsx
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { useNovelDetails } from '../../hooks/useNovel'

import actionNotification from '../NotificationState/Toast'
import { BsStar, BsBookmark, BsFlag } from 'react-icons/bs'
import { FaBookmark, FaBookOpen } from 'react-icons/fa'
import { IoIosNotifications } from 'react-icons/io'

import { RootState } from '../../store/store'
import { useBookmark } from '../../hooks/useBookMark'
import { useFollow } from '../../hooks/useFollow'
import EscapedNewLineToLineBreakTag from '../Another/escapedNewLineToLineBreakTag'
import { defaultImage } from '../../Page/uploader/newNovel'
import ReportForm from '../Another/ReportForm'
import { useGetReport } from '../../hooks/useReport'

export interface NoverDetailsCardProps {
  novelId: number
}

export default function NoverDetailsCard({ novelId }: NoverDetailsCardProps) {
  const user = useSelector((state: RootState) => state.auth.user)
  const { novelDetails, loading, error } = useNovelDetails(novelId)
  const { idBookmark, refetch, addBookmark, rmBookmark } = useBookmark(novelId)
  const { idFollow, refetchFollow, follow, unfollow } = useFollow(novelId)
  const { addReport } = useGetReport()
  useEffect(() => {
    refetch()
    refetchFollow()
  }, [idBookmark, idFollow])

  if (loading) return <div>Loading...</div>
  if (!novelDetails) return <div>Error: {error}</div>

  const imageCover = novelDetails?.image || defaultImage

  const stateMap: { [key: string]: string } = {
    ongoing: 'Còn tiếp',
    completed: 'Hoàn thành',
    paused: 'Tạm dừng',
    deleted: 'Đã xóa',
    unpublished: 'Chưa xuất bản',
    pending: 'Đang chờ duyệt'
  }

  const warningAction = () => {
    actionNotification('Vui lòng đăng nhập, sau đó thực hiện lại thao tác', 'warning')
  }

  const handleBookmark = () => {
    if (user) {
      if (idBookmark !== 0) {
        rmBookmark(idBookmark)
      } else {
        addBookmark()
      }
      refetch()
    } else {
      warningAction()
    }
  }

  const handleFollow = () => {
    if (user) {
      if (idFollow !== 0) {
        unfollow(idFollow)
      } else {
        follow()
      }
      refetch()
    } else {
      warningAction()
    }
  }

  const handleReport = (reportText: string) => {
    if (!user) {
      actionNotification('Bạn phải đăng nhập để thực hiện hành động này', 'warning')
    } else {
      const data = {
        title: `Báo cáo truyện: ${novelDetails.title}`,
        novelId,
        userId: user.id,
        content: reportText
      }
      addReport(data)
      console.log('Báo cáo:', reportText)
    }
  }

  return (
    <div>
      <div className='flex'>
        <div className='flex flex-col items-center justify-center'>
          <img className='w-44 object-cover rounded-[4px]' src={imageCover} alt='novel title' />
          <div className='p-2 hover:bg-gray_light'>
            <ReportForm onSubmit={handleReport} />
          </div>{' '}
          {/* Add ReportForm here */}
        </div>

        <div className='flex-col mt-1 gap-6 ml-4'>
          <div className='font-semibold text-lg'>{novelDetails?.title}</div>
          <div className='flex'>
            {novelDetails.author.map((author, index) => (
              <React.Fragment key={author.id}>
                <Link to={`/author/${author.id}`}>
                  <div className='text-gray hover:text-red'>{author.nickname}</div>
                </Link>
                {index < novelDetails.author.length - 1 && <span className='text-gray mr-3'>, </span>}
              </React.Fragment>
            ))}
          </div>
          <div className='flex mt-3 gap-6'>
            <Link to={`${novelDetails?.chapter0}`}>
              <div className='flex border rounded-md border-gold bg-gold text-white py-1 px-2'>
                <FaBookOpen className='self-center mr-2' />
                Đọc truyện
              </div>
            </Link>
            {idBookmark !== 0 ? (
              <div
                className='flex border rounded-md border-gold bg-gold cursor-pointer text-white py-1 px-2'
                onClick={handleBookmark}
              >
                <FaBookmark className='self-center mr-2' />
                Cất giữ
              </div>
            ) : (
              <div
                className='flex border rounded-md border-gray_text cursor-pointer py-1 px-2'
                onClick={handleBookmark}
              >
                <FaBookmark className='self-center mr-2' />
                Cất giữ
              </div>
            )}
            {idFollow !== 0 ? (
              <div
                onClick={handleFollow}
                className='flex border rounded-md border-gold bg-gold text-white cursor-pointer py-1 px-2'
              >
                <IoIosNotifications size={23} className='self-center mr-1' />
                Theo dõi
              </div>
            ) : (
              <div onClick={handleFollow} className='flex border rounded-md border-gray_text cursor-pointer py-1 px-2'>
                <IoIosNotifications size={23} className='self-center mr-1' />
                Theo dõi
              </div>
            )}
            <div className='flex border rounded-md cursor-pointer border-gray_text py-1 px-2'>
              <BsStar className='self-center mr-2' />
              Đánh giá
            </div>
          </div>
          <div className='flex mt-3'>
            <div className='border-gray border-r-[1px] pr-4'>
              <div className='text-center font-bold'>{novelDetails?.countChaptersPublishedInLast7Days}</div>
              <div>Chương/tuần</div>
            </div>
            <div className='border-gray border-r-[1px] px-4'>
              <div className='text-center font-bold'>{novelDetails?.views}</div>
              <div>Lượt đọc</div>
            </div>
            <div className='border-gray border-r-[1px] px-4'>
              <div className='text-center font-bold'>{novelDetails?.numberSavedBookmark}</div>
              <div>Cất giữ</div>
            </div>
            <div className='px-4'>
              <div className='text-center font-bold'>{novelDetails?.numberOfNominations}</div>
              <div>Đánh giá</div>
            </div>
          </div>
          <div className='flex'>
            <div className='mt-6 border rounded-md border-gold text-gold text-sm p-1 mr-4'>
              {stateMap[novelDetails.state]}
            </div>
            <a href={`/list/category/${novelDetails?.categoryId}`}>
              <div className='mt-6 border rounded-md border-red text-red text-sm p-1 mr-4'>
                {novelDetails?.categoryName}
              </div>
            </a>
            {novelDetails?.tags.map((tag) => (
              <a href={`/list/tag/${tag.id}`} key={tag.id}>
                <div key={tag.id} className='mt-6 border rounded-md border-[#047857] text-[#047857] text-sm p-1 mr-4'>
                  {tag.name}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className='bg-[#E4DECE] text-sm px-4 py-1'>GIỚI THIỆU</div>
      <div className='border-x-[2px] border-x-gray_light p-3'>
        <EscapedNewLineToLineBreakTag string={novelDetails?.description || ''} />
      </div>
      <a href={`/list/poster/${novelDetails.posterId}`}>
        <div className='bg-[#E4DECE] text-sm uppercase px-4 py-1'>Người đăng</div>
        <div className='flex border-x-[2px] border-x-gray_light p-3'>
          <img className='h-[60px] w-[60px]rounded-full shadow-custom-blue' src={novelDetails.posterAvatar} alt='' />
          <div className='ml-3 self-center'>{novelDetails.posterName}</div>
        </div>
      </a>
    </div>
  )
}
