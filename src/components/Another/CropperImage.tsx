import { ChangeEvent, useEffect, useRef, useState } from 'react'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'

// cắt ảnh theo tỉ lệ đã được định dạng trước
interface CropperImageProps {
  onCropComplete: (croppedImageUrl: string | null) => void // Callback để gửi ảnh đã cắt
  size?: { width: number; height: number } // Tham số kích thước
}

export default function CropperImage({ onCropComplete, size = { width: 300, height: 400 } }: CropperImageProps) {
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const [cropper, setCropper] = useState<Cropper | null>(null)

  useEffect(() => {
    if (imageRef.current && preview) {
      const newCropper = new Cropper(imageRef.current, {
        aspectRatio: size.width / size.height, // Cập nhật aspectRatio theo kích thước mới
        viewMode: 1,
        autoCropArea: 1,
        zoomable: false, // Ngăn chặn việc zoom để giữ kích thước chính xác
        scalable: false // Ngăn chặn việc thay đổi kích thước để giữ kích thước chính xác
      })
      setCropper(newCropper)

      return () => {
        newCropper.destroy()
      }
    }
  }, [preview, size])

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleCrop = () => {
    if (cropper) {
      const croppedCanvas = cropper.getCroppedCanvas({
        width: size.width, // Sử dụng kích thước từ props
        height: size.height
      })
      const croppedImage = croppedCanvas.toDataURL('image/jpeg', 1.0)
      onCropComplete(croppedImage) // Gọi callback để truyền ảnh đã cắt
    }
  }

  return (
    <div className='flex'>
      <div className='flex-1 bg-white h-max w-max'>
        <div className='mb-5'>
          <div className='my-1 mx-1'>Chọn ảnh</div>
          <div className='flex mx-1'>
            <div className='border border-gray flex rounded-md p-[2px] flex-1 mr-2'>
              <input
                type='file'
                accept='image/*'
                onChange={handleFileChange}
                className='ml-1 p-2 w-full outline-none'
              />
            </div>
          </div>
        </div>

        {preview && (
          <div className='mt-5 mx-1'>
            <div className='flex my-1'>
              <div>Ảnh đã chọn</div>
            </div>
            <div className='relative border border-gray rounded-md w-full max-w-[99%] h-72 overflow-hidden'>
              <img ref={imageRef} src={preview} alt='Preview' className='w-full h-full object-contain' />
              <button
                onClick={handleCrop}
                className='absolute top-2 right-2 bg-sky_blue_light text-white px-4 py-2 rounded-md'
              >
                Cắt ảnh
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
