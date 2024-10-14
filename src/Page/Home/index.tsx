import React from 'react'

import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'

import { TbReload } from 'react-icons/tb'
import Banner from '../../components/Banner'
import NewFeed from '../../components/Home/NewFeed'
import HistoryCard from '../../components/Card/HistoryCard'
import NovelCard from '../../components/Card/NovelCard'
import { RootState } from '../../store/store'
import { useMostFollowNovels, useRandomNovels } from '../../hooks/useNovel'
import { ICardNovelsI } from '../../types/novel'
// Import component placeholder

function HomePage() {
  const { randomNovels, loading, error, refetch } = useRandomNovels()
  const { FollowNovels } = useMostFollowNovels()
  const auth = useSelector((state: RootState) => state.auth)

  // if (loading) return <LoadingPlaceholder />; // Show loading placeholder
  // if (error) return <div>Error: {error}</div>;

  function handlerReloadRandomNovel(): void {
    refetch()
  }

  return (
    <div className='bg-[#FCFCFA]'>
      <Banner />
      <ToastContainer />
      <div className='md:container'>
        {auth.isLogin ? (
          <div>
            <p className='text-base text-theme_color font-semibold py-4 mx-2'>TRUYỆN VỪA ĐỌC</p>
            <HistoryCard />
          </div>
        ) : (
          <div />
        )}

        <div>
          <p className='text-base text-theme_color font-semibold py-4 mx-2'>BTV ĐỀ CỬ</p>
          <div>
            <div className='flex gap-10 flex-wrap'>
              {FollowNovels.map((item: ICardNovelsI, index: number) => (
                <NovelCard item={item} key={index.toString()} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className='my-10'>
        <Banner />
      </div>
      <div className='md:container mx-2'>
        <div className='flex py-4'>
          <p className='text-base font-semibold text-theme_color border-r-[1px] border-r-solid border-r-[#e1e1e1] pe-2'>
            TRUYỆN NGẪU NHIÊN
          </p>
          <div className='text-sky_blue_light hover:text-sky_blue mx-2'>
            <TbReload size={24} onClick={handlerReloadRandomNovel} />
          </div>
        </div>
        <div>
          <div className='my-2'>
            <div className='flex gap-10 flex-wrap'>
              {randomNovels.map((item: ICardNovelsI, index: number) => (
                <NovelCard item={item} key={index.toString()} />
              ))}
            </div>
          </div>
        </div>
        <NewFeed />
      </div>
    </div>
  )
}

export default HomePage
