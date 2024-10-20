import { useState } from 'react'
import { BiSearchAlt } from 'react-icons/bi'
import { FaCheck, FaLink } from 'react-icons/fa'

import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { RootState } from '../../store/store'
import { useGetReport } from '../../hooks/useReport'
import actionNotification from '../../components/NotificationState/Toast'
import { timeAgo } from '../../store/Time'
import ButtonWithTooltip from '../../components/Button/ButtonWithTooltip '

export default function ManagerReport() {
  const user = useSelector((state: RootState) => state.auth.user)

  const [searchTerm, setSearchTerm] = useState('')
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }
  const { report, refetch, updateReport } = useGetReport()
  const [selectedOption, setSelectedOption] = useState('pending')
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value)
  }
  const stateMap: { [key: string]: string } = {
    processed: 'Đã xử lý',
    pending: 'Đang chờ xử lý'
  }
  const filteredNovels = report.filter((report) => {
    // Kiểm tra nếu báo cáo không có nội dung hoặc nếu nội dung không chứa từ tìm kiếm
    const contentLowerCase = report.content ? report.content.toLowerCase() : ''
    const searchTermLowerCase = searchTerm.toLowerCase()

    return (
      ((selectedOption === 'pending' && report.type === 'pending') ||
        (selectedOption === 'processed' && report.type === 'processed')) &&
      contentLowerCase.includes(searchTermLowerCase)
    )
  })
  function handleProcessed(reportId: number): void {
    if (!user) {
      actionNotification('Bạn cần đăng nhập để thực hiện thao tác này!', 'warning')
    } else {
      updateReport(reportId)
      refetch()
    }
  }

  return (
    <div className='bg-white h-max w-[100%] mx-auto my-6 shadow-[0_2px_8px_rgba(47,43,61,0.2),0_0_transparent,0_0_transparent] rounded-md'>
      <div className='mx-5'>
        <ToastContainer></ToastContainer>
        <div className='h-6'></div>
        <div>
          <div className='flex justify-between'>
            <div className='flex'>
              <div className='border border-gray flex rounded-md items-center p-[2px]'>
                <BiSearchAlt size={25} color='#969696' className='ml-2' />
                <input
                  type='text'
                  placeholder='Tìm kiếm'
                  className='p-2 outline-none'
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            <div className='flex'>
              <div className='border border-gray flex rounded-md items-center mr-4'>
                <select value={selectedOption} onChange={handleChange} className='p-2 outline-none rounded-md'>
                  <option value='pending'>Đang chờ xử lý</option>
                  <option value='processed'>Đã xử lý</option>
                </select>
              </div>
            </div>
          </div>
          <div className='mt-4'>
            <table className='min-w-full bg-white border border-gray'>
              <thead>
                <tr className='bg-gray_light rounded-md'>
                  <th className='border-y border-gray px-3 py-2 text-center'>ID</th>
                  <th className='border-y border-gray px-3 py-2 text-center'>Người đăng</th>
                  <th className='border-y border-gray px-3 py-2 max-w-[450px] text-center truncate'>Truyện</th>
                  <th className='border-y border-gray px-3 py-2 max-w-[450px] text-center truncate'>Bình luận</th>
                  <th className='border-y border-gray px-3 py-2 text-center'>Tiêu đề báo cáo</th>
                  <th className='border-y border-gray px-3 py-2 text-center'>Nội dung báo cáo</th>
                  <th className='border-y border-gray px-3 py-2 text-center '>Thời gian tạo</th>
                  <th className='border-y border-gray px-3 py-2 text-center '>Chức năng</th>
                </tr>
              </thead>
              <tbody>
                {filteredNovels.map((report, index) => (
                  <tr className='hover:bg-gray_hover border-b border-gray' key={report.id}>
                    <td className=' px-3 py-2 text-center'>{report.id}</td>
                    <td className=' px-3 py-2 text-center truncate max-w-[220px] '>{report.username}</td>
                    <td className=' px-3 py-2 text-center'>{report.novelTitle}</td>
                    <td className=' px-3 py-2 text-center'>{report?.commentContent}</td>
                    <td className=' px-3 py-2 text-center'>{report.title}</td>
                    <td className=' px-3 py-2 text-center'>{report.content}</td>
                    <td className=' px-3 py-2 text-center'>{timeAgo(report.createdAt)}</td>
                    <td className='px-3 py-2 text-center border-collapse'>
                      <div className='flex justify-center items-center space-x-2'>
                        {report.type === 'pending' && (
                          <div className='flex flex-wrap'>
                            <Link to={`/novel/${report.novelId}`}>
                              <ButtonWithTooltip
                                title='Liên kết'
                                className='bg-sky_blue_light_500 
                                                            hover:bg-sky_blue_light cursor-pointer text-white font-bold py-2 px-2 mr-0 rounded'
                              >
                                <FaLink />
                              </ButtonWithTooltip>
                            </Link>
                            <ButtonWithTooltip
                              className='bg-[#79e3ab] hover:bg-green text-white font-bold py-2 px-2 mr-0 rounded'
                              title='Xong'
                              onClick={() => handleProcessed(report.id)}
                            >
                              <FaCheck />
                            </ButtonWithTooltip>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className='h-6'></div>
      </div>
    </div>
  )
}
