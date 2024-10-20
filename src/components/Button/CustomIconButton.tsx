// IconButton.tsx
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'

// Định nghĩa kiểu cho props
interface IconButtonProps {
  icon: IconDefinition // Kiểu cho icon
  text: string // Kiểu cho text
  onClick: () => void // Kiểu cho onClick
}

// Component nhận vào props với kiểu đã định nghĩa
const CustomIconButton: React.FC<IconButtonProps> = ({ icon, text, onClick }) => {
  return (
    <button onClick={onClick}>
      <FontAwesomeIcon icon={icon} className='mr-2' />
      {text}
    </button>
  )
}

export default CustomIconButton
