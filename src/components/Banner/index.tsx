import React from 'react'
import { useBanner } from '../../hooks/useNovel'

interface Banner {
  id: string
  title: string
  banner: string
}

function Banner() {
  const { novels, loading, error, refetch: fetchMyPublishedNovels } = useBanner()

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  if (!novels || novels.length === 0) return <p>No data available</p>

  const randomItem = novels[Math.floor(Math.random() * novels.length)]

  if (!randomItem) return <p>No novel found</p>

  return (
    <div className='flex justify-center h-[254] bg-cover items-center'>
      <div className='md:container my-0 mx-auto flex-1'>
        <a href={`/novel/${randomItem.id}`}>
          <img className='w-[1016px]' src={randomItem.banner} alt={randomItem.title} />
        </a>
      </div>
    </div>
  )
}

export default Banner
