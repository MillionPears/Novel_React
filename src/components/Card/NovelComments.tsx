import { useRef, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import actionNotification from '../NotificationState/Toast'
import { ToastContainer } from 'react-toastify'

import { HiOutlineChatBubbleLeftEllipsis } from 'react-icons/hi2'

import ReportForm from '../Another/ReportForm'

import { RootState } from '../../store/store'
import { timeAgo } from '../../store/Time'
import { useGetReport } from '../../hooks/useReport'
import { useUserPermission } from '../../hooks/usePermission'
import commentApiRequest from '../../apiRequest/comment'
import { Comment } from '../../types/comment'

export default function NovelComments({ novelId }: { novelId: number }) {
  const user = useSelector((state: RootState) => state.auth.user)
  const commentRef = useRef<HTMLTextAreaElement>(null)
  const replyRef = useRef<HTMLTextAreaElement>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [replyContent, setReplyContent] = useState<string>('')
  const [showReplyInput, setShowReplyInput] = useState<number | null>(null)
  const [refresh, setRefresh] = useState<boolean>(false)
  const { addReport } = useGetReport()
  const [commentId, setCommentId] = useState<number>()
  const { permissions } = useUserPermission()
  const hasNoCommentPermission = permissions.some((permission) => permission.name.includes('NoComment'))

  // Fetch comments on component mount
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await commentApiRequest.getCommentOfNovel(novelId)
        if (Array.isArray(response.data)) {
          setComments(response.data)
        } else {
          console.error('Dữ liệu bình luận không phải là mảng:', response.data)
          setComments([])
        }
      } catch (error) {
        console.error('Lỗi khi lấy bình luận:', error)
        setComments([])
      }
    }
    fetchComments()
  }, [novelId, refresh])

  const handleAddComment = async (type: 'parent' | 'reply', parentId?: number) => {
    if (!user) {
      actionNotification('Bạn chưa đăng nhập', 'warning')
      return
    }

    const content = type === 'parent' ? commentRef.current?.value.trim() : replyContent.trim()

    if (!content) {
      actionNotification('Bạn chưa nhập bình luận.', 'warning')
      return
    }

    try {
      const response = await commentApiRequest.addComment(novelId, content, user.id, parentId)

      if (type === 'parent' && commentRef.current) {
        commentRef.current.value = ''
        setReplyContent('')
      }

      if (type === 'reply' && replyRef.current) {
        replyRef.current.value = ''
      }

      setRefresh((prev) => !prev) // Toggle refresh state to trigger useEffect

      actionNotification('Bình luận của bạn đã được gửi!', 'success')
    } catch (error) {
      console.error('Lỗi khi gửi bình luận:', error)
      actionNotification('Có lỗi xảy ra khi gửi bình luận. Vui lòng thử lại.', 'error')
    }
  }

  const handleReplyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyContent(e.target.value)
  }

  const handleShowReplyInput = (commentId: number) => {
    setShowReplyInput((prev) => (prev === commentId ? null : commentId))
  }

  const handleFocusTextarea = () => {
    replyRef.current?.focus()
  }

  const handleReport = (reportText: string) => {
    if (!user) {
      actionNotification('Bạn phải đăng nhập để thực hiện hành động này', 'warning')
    } else {
      const data = {
        title: `Báo cáo comment id: ${novelId}`,
        novelId,
        commentId: commentId,
        userId: user.id,
        content: reportText
      }
      addReport(data)
      console.log('Báo cáo:', reportText)
    }
  }

  function handleSetCommentId(commentId: number): void {
    setCommentId(commentId)
  }

  return (
    <div>
      <ToastContainer />
      <div className='relative border-x-[2px] border-x-gray_light p-3 bg-white rounded-b-lg'>
        <div className='bg-white rounded-lg rounded-t-lg m-2'>
          <textarea
            disabled={hasNoCommentPermission}
            className={`${!hasNoCommentPermission ? '' : 'bg-gray_hover text-gray cursor-not-allowed'}  p-4 mb-2 w-full focus:ring-0 focus:outline-none rounded-md mt-2 dark:text-white
                        border-[1px] border-gray overflow-hidden break-words resize-none text-start h-40 overflow-y-auto`}
            placeholder='Nhập bình luận. Cảnh báo: nghiêm cấm vô não chửi bậy, chửi liên quan đến thể loại truyện, mô típ của truyện, bối cảnh của truyện. Nghiêm cấm bình luận chống lại nhà nước, danh nhân lịch sử, người vi phạm sẽ bị khóa tài khoản tùy mức độ.'
            ref={commentRef}
            rows={6}
          />
        </div>
        <div className='absolute bottom-[45px] right-[35px]'>
          <button
            disabled={hasNoCommentPermission}
            className='bg-gold text-white border-gold border-[1px] rounded-md p-1 px-2'
            onClick={() => handleAddComment('parent')}
          >
            Gửi
          </button>
        </div>
      </div>
      <div className='mt-6'>
        {comments.map((comment) => (
          <div key={comment.id} className='comment'>
            <div className='p-4 border-[0.5px] border-gray_light mb-4 rounded-lg bg-white'>
              <div className='flex gap-3 justify-between'>
                <div className='flex gap-3'>
                  <img
                    src={comment.userAvatar || 'https://via.placeholder.com/30'}
                    className='h-8 w-8 rounded-full shadow-custom-blue'
                    alt={comment.username + "'s avatar"}
                  />
                  <p className='self-center'>
                    <strong>{comment.username}</strong>
                  </p>
                  <p className='text-xs self-center'>{timeAgo(comment.createdAt)}</p>
                </div>
                <div className=''>...</div>
              </div>
              <p className='my-4'>{comment.content}</p>
              <div className='text-gray flex gap-1'>
                <div
                  className='hover:underline flex  hover:bg-gray_light gap-1'
                  onClick={() => handleShowReplyInput(comment.id)}
                >
                  <HiOutlineChatBubbleLeftEllipsis size={15} className='self-center' />
                  <p className='text-sm'>{comment.replies.length} Trả lời</p>
                </div>
                <div onClick={() => handleSetCommentId(comment.id)} className='h-1 ml-2 text-sm'>
                  <ReportForm onSubmit={handleReport} />
                </div>
              </div>
              {showReplyInput === comment.id && (
                <div className='pl-14 mt-5'>
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className='p-4 border-[0.5px] border-gray_light mb-2 rounded-lg bg-gray_light'>
                      <div className='flex gap-3'>
                        <img
                          src={reply.userAvatar || 'https://via.placeholder.com/30'}
                          className='h-8 w-8 rounded-full shadow-custom-blue'
                          alt={reply.username + "'s avatar"}
                        />
                        <p className='self-center'>
                          <strong>{reply.username}</strong>
                        </p>
                        <p className='text-xs self-center'>{timeAgo(reply.replyCreatedAt)}</p>
                      </div>
                      <p className='my-2'>{reply.content}</p>
                      <div className='text-gray flex gap-1'>
                        <div className='hover:underline flex gap-1' onClick={handleFocusTextarea}>
                          <HiOutlineChatBubbleLeftEllipsis size={15} className='self-center' />
                          <p className='text-sm'>Trả lời</p>
                        </div>
                        <div className='h-1 ml-2 text-sm'>
                          <ReportForm onSubmit={handleReport} />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className='relative'>
                    <textarea
                      disabled={hasNoCommentPermission}
                      className={`${!hasNoCommentPermission ? '' : 'bg-gray_hover text-gray cursor-not-allowed'} 
                                            p-3 mb-2 w-full focus:ring-0 focus:outline-none rounded-md mt-2 
                                            dark:text-white border-[1px] border-gray overflow-hidden 
                                            break-words resize-none text-start h-15 overflow-y-auto"`}
                      placeholder='Trả lời bình luận'
                      ref={replyRef}
                      onChange={handleReplyChange}
                    />
                    <button
                      className='absolute bottom-[20px] right-4 bg-gold text-white
                                             border-gold border-[1px] rounded-md p-1 px-2'
                      onClick={() => handleAddComment('reply', comment.id)}
                    >
                      Gửi
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className='h-4'></div>
    </div>
  )
}
