import React, { useState, useEffect } from 'react'
import { ref, getDownloadURL } from 'firebase/storage'
import { storage } from '../../store/firebaseConfig'

import axios from 'axios'
import EscapedNewLineToLineBreakTag from '../../components/Another/escapedNewLineToLineBreakTag'

const ChapterContent: React.FC<{ filePath: string }> = ({ filePath }) => {
  const [content, setContent] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFileContent = async () => {
      try {
        // Tạo reference đến tệp trong Firebase Storage
        const fileRef = ref(storage, filePath)
        // Lấy URL tải xuống
        console.log('Download filePath:', filePath)
        const url = await getDownloadURL(fileRef)
        // Fetch nội dung tệp
        console.log('Download URL:', url)
        const response = await axios.get(url, { responseType: 'text' })
        // const text = await response.text();
        setContent(response.data)
      } catch (err) {
        setError('Đã xảy ra lỗi, vui lòng liên hệ admin để xử lý sớm. Xin cảm ơn')
        console.error(err)
      }
    }

    fetchFileContent()
  }, [filePath])

  if (error) {
    return <div>{error}</div>
  }

  if (content === null) {
    return <div>Đang tải nội dung, vui lòng chờ giây lát...</div>
  }

  return <EscapedNewLineToLineBreakTag string={content} />
}

export default ChapterContent
