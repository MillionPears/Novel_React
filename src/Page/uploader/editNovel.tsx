import { useParams } from 'react-router-dom'

import { useEffect, useRef, useState } from 'react'
import { BiSolidBookAdd } from 'react-icons/bi'
import { TbInfoCircleFilled } from 'react-icons/tb'
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai'
import history from '../../router/history'
import { useSelector } from 'react-redux'

import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'

import { BsPersonAdd } from 'react-icons/bs'
import { useNovel, useNovelDetails } from '../../hooks/useNovel'
import { useCategoryList } from '../../hooks/userCategoryList'
import { TagProps, useTagList } from '../../hooks/userTagList'
import { RootState } from '../../store/store'
import CropperImage from '../../components/Another/CropperImage'
import ButtonWithTooltip from '../../components/Button/ButtonWithTooltip '
import actionNotification from '../../components/NotificationState/Toast'
import { UpdateNovelDTO } from '../../types/novel'
import { storage } from '../../store/firebaseConfig'

export default function EditNovel() {
  const { novelId } = useParams<{ novelId: string }>()
  const novelIdNumber = Number(novelId)

  const { novelDetails, loading, error } = useNovelDetails(novelIdNumber)
  const { categories } = useCategoryList()
  const { tags } = useTagList()
  const user = useSelector((state: RootState) => state.auth.user)

  const [selectedTag, setSelectedTag] = useState<TagProps[]>([])
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined)
  const [croppedImage, setCroppedImage] = useState<string | null>(null)
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false)
  const novelNameRef = useRef<HTMLInputElement>(null)
  const authorNameRef = useRef<HTMLInputElement>(null)
  const introductionRef = useRef<HTMLTextAreaElement>(null)
  const [stateNovel, setStateNovel] = useState<string>(novelDetails?.state || '') // Giá trị mặc định

  const stateOptions: { [key: string]: string } = {
    ongoing: 'Còn tiếp',
    completed: 'Hoàn thành',
    paused: 'Tạm dừng',
    deleted: 'Đã xóa',
    unpublished: 'Chưa xuất bản',
    pending: 'Đang chờ duyệt'
  }
  const stateOptionsPublished: { [key: string]: string } = {
    ongoing: 'Còn tiếp',
    completed: 'Hoàn thành',
    paused: 'Tạm dừng'
  }
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const { updateNovelAPI } = useNovel()

  useEffect(() => {
    if (selectedTag.length > 5) {
      setIsFormVisible(false)
    }
    if (novelDetails) {
      setStateNovel(novelDetails.state)
      setSelectedTag(novelDetails.tags.map((tag) => tag))
      setCategoryId(novelDetails.categoryId)
    }
  }, [novelDetails])
  if (novelDetails) {
    if (user?.id != novelDetails.posterId) {
      return <div>error</div>
    }
  }
  useEffect(() => {
    if (imageUrl) {
      handleUpdateButtonClick()
    }
  }, [imageUrl])

  const handleAddTag = () => {
    if (isFormVisible) {
      setIsFormVisible(false)
    } else {
      setIsFormVisible(true)
    }
  }

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoryId = parseInt(event.target.value)
    setCategoryId(selectedCategoryId)
  }
  const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedState = event.target.value
    setStateNovel(selectedState)
    console.log(selectedState) // In giá trị để kiểm tra
  }

  const handleSelectTag = (tag: TagProps) => {
    setSelectedTag((prevSelectedTag) =>
      prevSelectedTag.find((selected) => selected.id === tag.id) ? prevSelectedTag : [...prevSelectedTag, tag]
    )
  }
  const handleOk = () => {
    setIsFormVisible(false)
  }

  const handleRemoveTag = (id: number) => {
    setSelectedTag((prevSelectedTag) => prevSelectedTag.filter((tag) => tag.id !== id))
  }
  const idString = user?.id.toString() || '0' // Ép kiểu sang chuỗi và xử lý giá trị null
  const posterId: number = parseInt(idString)
  const handleUpdateButtonClick = async () => {
    try {
      let finalImageUrl = imageUrl // Khởi tạo finalImageUrl với giá trị hiện tại của imageUrl

      // Tải ảnh lên Firebase Storage nếu có ảnh croppedImage
      if (croppedImage) {
        const croppedImageBlob = await urlToBlob(croppedImage)
        const storageRef = ref(storage, `imageCover/${novelIdNumber}/imageCover`)
        const uploadTask = uploadBytesResumable(storageRef, croppedImageBlob)

        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              // Theo dõi tiến trình tải lên ở đây (tuỳ chọn)
            },
            (error) => {
              console.error('Tải ảnh thất bại:', error)
              actionNotification('Ảnh bìa đã thêm thất bại!', 'error')
              reject(error) // Hủy bỏ Promise nếu có lỗi
            },
            async () => {
              finalImageUrl = await getDownloadURL(uploadTask.snapshot.ref)
              actionNotification('Ảnh bìa đã thêm thành công!', 'success')
              resolve() // Hoàn thành Promise khi tải lên thành công
            }
          )
        })
      }

      // Cập nhật thông tin truyện
      const updateData: UpdateNovelDTO = {
        id: novelIdNumber,
        title: novelNameRef.current?.value || '',
        image: finalImageUrl || novelDetails?.image || '', // Sử dụng finalImageUrl
        state: stateNovel,
        description: introductionRef.current?.value || '',
        posterId: posterId,
        tagsId: novelDetails?.tags.map((tag) => tag.id) || [],
        categoryId: categoryId
      }

      const novelResult = await updateNovelAPI(updateData)
      actionNotification('Cập nhật truyện thành công!', 'success')

      history.push('/uploader/published')
    } catch (error) {
      console.error('Cập nhật truyện thất bại:', error)
      actionNotification('Cập nhật truyện thất bại!', 'error')
    }
  }

  const handleCropComplete = (croppedImageUrl: string | null) => {
    setCroppedImage(croppedImageUrl)
  }
  const urlToBlob = async (url: string): Promise<Blob> => {
    const response = await fetch(url)
    return await response.blob()
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  function handleAddAuthor(): void {
    throw new Error('Function not implemented.')
  }

  return (
    <div>
      <div className='flex gap-5'>
        <div
          className='flex-1 bg-white h-max w-max p-6
                    shadow-[0_2px_8px_rgba(47,43,61,0.2),0_0_transparent,0_0_transparent] rounded-md'
        >
          <div>
            <div className='flex mx-1 font-bold text-lg p-2 rounded-md gap-2'>Cập nhật truyện</div>
            <div className='mb-5'>
              <div className='my-1 mx-1'>Tên truyện</div>
              <div className='flex mx-1'>
                <div className='border border-gray flex rounded-md p-[2px] flex-1 mr-2'>
                  <input
                    type='text'
                    placeholder='Tên truyện'
                    className='ml-1 p-2 w-[100%] outline-none'
                    ref={novelNameRef}
                    defaultValue={novelDetails?.title}
                    required
                  />
                </div>
              </div>
            </div>

            <div className='mb-5'>
              <div className='my-1 mx-1'>Tác giả/Bút danh</div>
              {novelDetails?.author.map((author) => (
                <div className='border mx-1 mb-2 border-gray flex rounded-md p-[2px]'>
                  <input
                    type='text'
                    placeholder='Để trống nếu bạn là tác giả và lấy username của bạn làm tên tác giả'
                    className='ml-1 p-2 w-[100%] outline-none'
                    ref={authorNameRef}
                    defaultValue={author.nickname}
                  />
                </div>
              ))}

              <ButtonWithTooltip
                className='mx-1 bg-sky_blue_light_500 hover:bg-sky_blue_light text-white font-bold py-2 px-2 mr-2 rounded'
                title='Thêm tác giả'
                onClick={handleAddAuthor}
              >
                <BsPersonAdd size={25} />
              </ButtonWithTooltip>
            </div>
            <div className='mb-5'>
              <div className='my-1 mx-1'>Trạng thái</div>
              <div className='border mx-1 border-gray flex rounded-md p-[2px]'>
                {novelDetails?.state === 'ongoing' ? (
                  <select
                    onChange={handleStateChange}
                    value={stateNovel || novelDetails?.state || ''}
                    className='ml-1 w-full outline-none p-2 max-h-40 overflow-y-auto'
                  >
                    {Object.entries(stateOptionsPublished).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className='ml-1 p-2'>{stateOptions[novelDetails?.state || ''] || ''}</div>
                )}
              </div>
            </div>

            <div className='mb-5 mx-1'>
              <div className='my-1'>Thể loại chính</div>
              <div className='border border-gray flex rounded-md p-[2px]'>
                <select
                  onChange={handleCategoryChange}
                  defaultValue=''
                  className='ml-1 w-full outline-none p-2 max-h-40 overflow-y-auto'
                >
                  <option className='font-semibold' key={novelDetails?.categoryId} value={novelDetails?.categoryName}>
                    {novelDetails?.categoryName}
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className='mb-5 mx-1'>
              {selectedTag.length > 5 && (
                <div className='flex bg-[#FF6A30] text-white p-2 rounded-md gap-2'>
                  <TbInfoCircleFilled size={25} />
                  <span>Một truyện chỉ có 5 tag</span>
                </div>
              )}
              <div className='my-1'>Tag</div>
              <div className='flex'>
                <div className='flex-1 border flex-wrap border-gray flex rounded-md p-[2px] mr-2 max-h-28 max-w-[616.212px] min-h-[50px] overflow-y-auto'>
                  {selectedTag.slice(0, 5).map((tag) => (
                    <div className='flex items-center rounded-3xl bg-gray_light border mx-[5px] my-1 p-2' key={tag.id}>
                      {tag.name}
                      <button className='ml-2 text-red-500' onClick={() => handleRemoveTag(tag.id)}>
                        <AiOutlineClose />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  className='bg-sky_blue_light_500 hover:bg-sky_blue_light text-white font-bold py-2 px-2 mr-2 rounded'
                  onClick={handleAddTag}
                >
                  <BiSolidBookAdd />
                </button>
              </div>

              {isFormVisible && (
                <div className='mt-4 p-4 border rounded-md'>
                  <h3 className='mb-2'>Chọn Tag</h3>
                  <div className='max-h-40 overflow-y-auto'>
                    {tags.map((tag) => (
                      <div
                        className='cursor-pointer rounded-sm bg-gray_light border mx-2 p-2 my-1 flex justify-between items-center'
                        key={tag.id}
                        onClick={() => handleSelectTag(tag)}
                      >
                        {tag.name}
                        {selectedTag.find((t) => t.id === tag.id) && <AiOutlineCheck className='text-red ml-2' />}
                      </div>
                    ))}
                  </div>
                  <button
                    className='mt-4 bg-sky_blue_light_500 hover:bg-sky_blue_light text-white font-bold py-2 px-4 rounded'
                    onClick={handleOk}
                  >
                    OK
                  </button>
                </div>
              )}
            </div>
            <div className='bg-white rounded-lg rounded-t-lg mx-1'>
              <div>Giới thiệu</div>
              <textarea
                className='py-2 px-3 mb-4 w-[100%] focus:ring-0 focus:outline-none rounded-md mt-1 dark:text-white
                                border-[1px] border-gray break-words resize-none text-start h-160 overflow-y-auto'
                name='comments'
                id='comments'
                placeholder=''
                defaultValue={novelDetails?.description}
                ref={introductionRef}
                rows={6}
              ></textarea>
            </div>
          </div>

          <div className='flex justify-end mt-3'>
            <ButtonWithTooltip
              className='bg-[#FF6A30] hover:bg-red text-white font-bold py-2 px-2 mr-2 rounded'
              onClick={handleUpdateButtonClick}
              title=''
            >
              Cập nhật
            </ButtonWithTooltip>
          </div>
        </div>

        <div className='flex-1 bg-white max-w-[485.825px] p-6 shadow-[0_2px_8px_rgba(47,43,61,0.2),0_0_transparent,0_0_transparent] rounded-md overflow-y-auto'>
          <CropperImage onCropComplete={handleCropComplete} size={{ width: 300, height: 400 }} />
          {croppedImage && (
            <div className='mt-5'>
              <div className='my-1'>Ảnh đã cắt</div>
              <div className='bg-gray_light border border-gray rounded-md p-2 w-full max-w-[99%] h-72 overflow-hidden'>
                <img src={croppedImage} alt='Cropped' className='w-full h-full object-contain' />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className='h-6'></div>
    </div>
  )
}
