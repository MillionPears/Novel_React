import React from 'react'

// Khai báo kiểu dữ liệu cho props
interface StarRatingProps {
  rating: number
  setRating: (rating: number) => void
}

const StarRating: React.FC<StarRatingProps> = ({ rating, setRating }) => {
  const handleClick = (index: number) => {
    setRating(index + 1)
  }

  return (
    <div className='flex items-center'>
      {[...Array(5)].map((_, index) => (
        <svg
          key={index}
          onClick={() => handleClick(index)}
          className={`w-8 h-8 cursor-pointer ${index < rating ? 'text-yellow' : 'text-gray'}`}
          fill='currentColor'
          viewBox='0 0 24 24'
        >
          <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.87L12 17.77l-6.18 3.27L7 14.14 2 9.27l6.91-1.01L12 2z' />
        </svg>
      ))}
    </div>
  )
}

export default StarRating
