import React, { useState, useEffect, useRef } from 'react'
import { BsFlag } from 'react-icons/bs'

interface ReportFormProps {
  onSubmit: (reportText: string) => void
}

const ReportForm: React.FC<ReportFormProps> = ({ onSubmit }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [reportText, setReportText] = useState('')
  const formRef = useRef<HTMLDivElement>(null)

  const toggleForm = () => setIsOpen(!isOpen)

  const handleClickOutside = (event: MouseEvent) => {
    if (formRef.current && !formRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleSubmit = () => {
    onSubmit(reportText)
    setIsOpen(false)
  }

  return (
    <div className='relative'>
      <button className='flex items-center gap-2 hover:bg-gray_light' onClick={toggleForm} aria-label='Report'>
        <BsFlag className='text-gray' />
        <span className='text-gray'>Báo cáo</span>
      </button>

      {isOpen && (
        <>
          <div className='fixed inset-0 bg-gray bg-opacity-50 z-40' onClick={toggleForm}></div>
          <div className='fixed inset-0 flex justify-center items-center z-50'>
            <div
              ref={formRef}
              className='relative w-[500px] h-[320px] p-4 bg-gray_light border border-gray rounded-lg shadow-md'
            >
              <button
                className='absolute top-2 right-2 text-red rounded-full border-red border-2'
                onClick={toggleForm}
                aria-label='Close'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
              <h3 className='text-lg font-semibold mb-2'>Báo cáo</h3>
              <textarea
                className='w-full h-[200px] p-2 border resize-none border-gray rounded-lg outline-none overflow-y-scroll'
                placeholder='Nhập lý do báo cáo...'
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
              ></textarea>
              <button className='mt-2 px-4 py-2 bg-red text-white rounded-lg hover:bg-red' onClick={handleSubmit}>
                Gửi Báo Cáo
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ReportForm
