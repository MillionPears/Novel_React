import { useSelector } from 'react-redux'

import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { storage } from '../../store/firebaseConfig'
import history from '../../router/history'
import { ToastContainer } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { INovelI, UpdateNovelDTO } from '../../types/novel'
import { RootState } from '../../store/store'
import { useNovel } from '../../hooks/useNovel'
import actionNotification from '../../components/NotificationState/Toast'
import CropperImage from '../../components/Another/CropperImage'
import ButtonWithTooltip from '../../components/Button/ButtonWithTooltip '

export const defaultImage = 'https://static.sangtacvietcdn.xyz/img/bookcover256.jpg'

export default function AddBanner() {
  const { novelId } = useParams<{ novelId: string }>()
  const novelIdNumber = Number(novelId)

  const [croppedImage, setCroppedImage] = useState<string | null>(null)
  const [novel, setNovel] = useState<INovelI | undefined>()
  const user = useSelector((state: RootState) => state.auth.user)
  const { updateNovelAPI } = useNovel()

  // CropperImage
  const handleCropComplete = (croppedImageUrl: string | null) => {
    setCroppedImage(croppedImageUrl)
  }

  const [imageUrl, setImageUrl] = useState('')
  const urlToBlob = async (url: string): Promise<Blob> => {
    const response = await fetch(url)
    return await response.blob()
  }
  const handleUpdateButtonClick = async () => {
    try {
      let finalImageUrl = imageUrl // Khởi tạo finalImageUrl với giá trị hiện tại của imageUrl

      // Tải ảnh lên Firebase Storage nếu có ảnh croppedImage
      if (croppedImage) {
        const croppedImageBlob = await urlToBlob(croppedImage)
        const storageRef = ref(storage, `imageBanner/${novelIdNumber}/imageCover`)
        const uploadTask = uploadBytesResumable(storageRef, croppedImageBlob)

        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              // Theo dõi tiến trình tải lên ở đây (tuỳ chọn)
            },
            (error) => {
              console.error('Tải ảnh thất bại:', error)
              actionNotification('Ảnh quảng bá đã thêm thất bại!', 'error')
              reject(error) // Hủy bỏ Promise nếu có lỗi
            },
            async () => {
              finalImageUrl = await getDownloadURL(uploadTask.snapshot.ref)
              actionNotification('Ảnh quảng bá đã thêm thành công!', 'success')
              resolve() // Hoàn thành Promise khi tải lên thành công
            }
          )
        })
      }

      // Cập nhật thông tin truyện
      const updateData: UpdateNovelDTO = {
        id: novelIdNumber,
        banner: finalImageUrl || '' // Sử dụng finalImageUrl
      }

      const novelResult = await updateNovelAPI(updateData)
      actionNotification('Cập nhật truyện thành công!', 'success')

      setTimeout(() => {
        history.push('/manager/ManagerNovel')
      }, 2000)
    } catch (error) {
      console.error('Cập nhật truyện thất bại:', error)
      actionNotification('Cập nhật truyện thất bại!', 'error')
    }
  }

  return (
    <div className=''>
      {/* content */}
      <ToastContainer />
      <div className='lg:flex gap-5 '>
        {/* Form them novel */}
        <div
          className='flex-1 bg-white  h-full w-full p-6 mb-6
                shadow-[0_2px_8px_rgba(47,43,61,0.2),0_0_transparent,0_0_transparent] rounded-md'
        >
          {/* <CropperImage onCropComplete={handleCropComplete} /> */}

          <CropperImage onCropComplete={handleCropComplete} size={{ width: 1000, height: 250 }} />

          {croppedImage && (
            <div className='mt-5'>
              <div className='my-1'>Ảnh đã cắt</div>
              <div className='bg-gray_light border border-gray rounded-md p-2 w-full max-w-[99%] h-72 overflow-hidden'>
                <img src={croppedImage} alt='Cropped' className='w-full h-full object-contain' />
              </div>
            </div>
          )}
          <div className='flex justify-end'>
            {' '}
            {/* Sử dụng flexbox và justify-end để đưa nút bên cùng phải */}
            <ButtonWithTooltip
              className='bg-[#FF6A30] mt-2 hover:bg-red 
                         text-white font-bold py-2 px-2 mr-2 rounded'
              onClick={handleUpdateButtonClick}
              title=''
            >
              Tiếp theo
            </ButtonWithTooltip>
          </div>
        </div>
      </div>

      {/* content */}
      <div className='h-6'></div>
    </div>
  )
}
