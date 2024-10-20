// AvatarUpload.js
import { useEffect, useState } from 'react'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

import { useSelector } from 'react-redux'

import { storage } from '../../../store/firebaseConfig'
import { RootState } from '../../../store/store'
import { useUser } from '../../../hooks/useUser'

const AvatarUpload = () => {
  const user = useSelector((state: RootState) => state.auth.user)

  const userId = user?.id.toString() || '0'
  const { uploadAvatarAPI } = useUser()

  const [avatarUrl, setAvatarUrl] = useState('')
  useEffect(() => {
    user && user.avatar ? setAvatarUrl(user.avatar) : console.log('no avatar')
  }, [user])
  const handleChangeAvatar = (event: any) => {
    const file = event.target.files[0]
    if (!file) return

    const storageRef = ref(storage, `avatars/${userId}/${file.name}`)
    const uploadTask = uploadBytesResumable(storageRef, file)
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // You can monitor the upload progress here if needed
      },
      (error) => {
        console.error('Upload failed:', error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const data = {
            id: userId,
            avatar: downloadURL
          }
          setAvatarUrl(downloadURL)
          // user?.avatar = downloadURL
          console.log('File available at', downloadURL)
          uploadAvatarAPI(data)
        })
      }
    )
  }

  return (
    <form className='bg-gray-500 hover:bg-opacity-90 h-32 w-32 rounded-full text-white' method='post' name='avatar'>
      <label className='h-32 flex items-center justify-center cursor-pointer' htmlFor='cmr'>
        <img
          src={avatarUrl}
          alt='Avatar'
          className='h-full w-full rounded-full object-cover'
          style={{ boxShadow: '0px 0px 20px 5px #61e4fc' }}
        />
      </label>
      <input
        type='file'
        className='hidden'
        id='cmr'
        accept='image/png, image/gif, image/jpeg'
        onChange={handleChangeAvatar}
      />
    </form>
  )
}

export default AvatarUpload
