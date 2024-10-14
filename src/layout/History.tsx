import React, { useState } from 'react'
import { addHistory } from '../hooks/useHistory'

const HistoryComponent: React.FC = () => {
  const [userId, setUserId] = useState<number>(1) // Thay đổi giá trị theo nhu cầu
  const [chapterId, setChapterId] = useState<number>(1) // Thay đổi giá trị theo nhu cầu
  const [message, setMessage] = useState<string>('')

  const handleAddHistory = async () => {
    try {
      await addHistory(userId, chapterId)
      setMessage('Đã thêm lịch sử đọc mới.')
    } catch (error) {
      setMessage('Có lỗi xảy ra.')
    }
  }

  return (
    <div>
      <button onClick={handleAddHistory}>Thêm lịch sử đọc</button>
      <p>{message}</p>
    </div>
  )
}

export default HistoryComponent
