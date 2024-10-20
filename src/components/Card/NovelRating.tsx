import { useRef, useState, useEffect } from 'react'
import { FaRegFlag, FaStar } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import actionNotification from '../NotificationState/Toast'
import { BiSolidDownvote, BiSolidUpvote } from 'react-icons/bi'

import { RootState } from '../../store/store'
import { useUserPermission } from '../../hooks/usePermission'
import { timeAgo } from '../../store/Time'
import StarRating from '../Another/StarRating'
import { RatingDetails } from '../../types/rating'
import ratingApiRequest from '../../apiRequest/rating'

export default function NovelRating({ novelId }: { novelId: number }) {
  const user = useSelector((state: RootState) => state.auth.user)
  const ratingContentRef = useRef<HTMLTextAreaElement>(null)
  const [ratings, setRatings] = useState<RatingDetails[]>([])
  const [ratingPoint, setRatingPoint] = useState(5)
  const { permissions } = useUserPermission()
  const hasNoReviewPermission = permissions.some((permission) => permission.name.includes('NoReview'))
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRatingPoint(parseFloat(event.target.value))
  }
  // Fetch ratings on component mount
  const fetchRatings = async () => {
    try {
      const response = await ratingApiRequest.getRatingOfNovel(novelId)
      if (Array.isArray(response.data)) {
        setRatings(response.data)
      } else {
        console.error('Dữ liệu đánh giá không phải là mảng:', response.data)
        setRatings([])
      }
    } catch (error) {
      console.error('Lỗi khi lấy đánh giá:', error)
      setRatings([])
    }
  }
  useEffect(() => {
    fetchRatings()
  }, [novelId])

  const handleAddRating = async (parentId?: number) => {
    if (!user) {
      actionNotification('Bạn chưa đăng nhập', 'warning')
      return
    }
    try {
      const response = await ratingApiRequest.addRating(novelId, user.id, ratingContentRef.current?.value, ratingPoint)
      fetchRatings()
      actionNotification('Đánh giá của bạn đã được gửi!', 'success')
    } catch (error) {
      console.error('Lỗi khi gửi đánh giá:', error)
      actionNotification('Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.', 'error')
    }
  }

  const hasVotedUp = (ratingId: number) => {
    if (user) {
      return ratings.some((rating) => rating.userId === user.id && rating.id === ratingId && rating.type_vote === 'up')
    }
  }
  const hasVotedDown = (ratingId: number) => {
    if (user) {
      return ratings.some(
        (rating) => rating.userId === user.id && rating.id === ratingId && rating.type_vote === 'down'
      )
    }
  }
  async function handleVoteRating(interactionType: string, ratingId: number): Promise<void> {
    if (!user) {
      actionNotification('Bạn chưa đăng nhập', 'warning')
      return
    }
    try {
      const response = await ratingApiRequest.voteRating(ratingId, user.id, interactionType)
      fetchRatings()
      actionNotification('Đánh giá của bạn đã được gửi!', 'success')
    } catch (error) {
      console.error('Lỗi khi gửi đánh giá:', error)
      actionNotification('Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.', 'error')
    }
  }

  return (
    <div>
      <ToastContainer />
      <div className='relative border-x-[2px] border-x-gray_light p-3 bg-white rounded-b-lg'>
        <div className='p-2 '>
          <div className='w-full flex flex-col mt-2 py-1 border-[2px] bg-gray_light border-gray_light items-center rounded-xl'>
            <StarRating rating={ratingPoint} setRating={setRatingPoint} />
          </div>
        </div>
        <div className='bg-white rounded-lg rounded-t-lg m-2'>
          <textarea
            disabled={hasNoReviewPermission}
            className='p-4 mb-1 w-full focus:ring-0 focus:outline-none rounded-md mt-2 dark:text-white
                        border-[1px] border-gray overflow-hidden break-words resize-none text-start h-40 overflow-y-auto'
            placeholder='Hướng dẫn review:
Truyện hay ở điểm nào? Nhân vật chính như thế nào?
Bố cục thế giới như nào? (lớn hay nhỏ?, một thế giới?, nhiều thế giới?, nhiều tầng? ...)
Cốt truyện như nào? (logic?, sảng văn?, bố cục nhiều lớp?, quay xe liên tục? ...)
'
            ref={ratingContentRef}
            rows={6}
          />
        </div>
        <div className='flex justify-center'>
          <button
            disabled={hasNoReviewPermission}
            className='bg-gold text-white border-gold border-[1px]  rounded-md p-[6px] px-3'
            onClick={() => handleAddRating()}
          >
            Gửi đánh giá
          </button>
        </div>
      </div>
      <div className='mt-6'>
        {ratings.map((rating) => (
          <div key={rating.id} className='rating'>
            <div className='p-4 border-[0.5px] border-gray_light mb-4 rounded-lg bg-white'>
              <div className='flex gap-3 justify-between'>
                <div className='flex gap-3'>
                  <img
                    src={rating.userAvatar || 'https://via.placeholder.com/30'}
                    className='h-8 w-8 rounded-full shadow-custom-blue'
                    alt={rating.username + "'s avatar"}
                  />
                  <p className='self-center'>
                    <strong>{rating.username}</strong>
                  </p>
                  <div className='flex gap-1 justify-center self-center'>
                    <FaStar size={20} color='#FACC15' />
                    <div>{rating.ratingPoint}</div>
                  </div>
                  <p className='text-xs self-center'>{timeAgo(rating.updatedAt)}</p>
                </div>
                <div className=''>...</div>
              </div>
              <p className='my-4'>{rating.ratingContent}</p>
              <div className='text-gray flex gap-1'>
                <div className='flex'>
                  <BiSolidUpvote
                    onClick={() => handleVoteRating('up', rating.id)}
                    size={20}
                    className={`cursor-pointer ${hasVotedUp(rating.id) ? 'text-[#35e03b]' : 'text-gray'} `}
                  />
                  <div
                    className={`mx-1 font-bold rounded-full border-[2px] px-[7px] ${rating.rating_vote > 0 ? 'text-[#35e03b]' : 'text-red'}`}
                  >
                    {rating.rating_vote}
                  </div>

                  <BiSolidDownvote
                    onClick={() => handleVoteRating('down', rating.id)}
                    size={20}
                    className={`cursor-pointer ${hasVotedDown(rating.id) ? 'text-[#35e03b]' : 'text-gray'} `}
                  />
                </div>
                <div className='hover:underline flex gap-1'>
                  <FaRegFlag size={15} className='ml-3 self-center' />
                  <p className='text-sm'>Báo cáo vi phạm</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='h-4'></div>
    </div>
  )
}
