import React, { useEffect, useState } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'
import { Heart } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const Community = () => {


  const [creations, setCreations] = useState([])
  const [loading, setLoading] = useState(true)

  const { user } = useUser()
  const { getToken } = useAuth()

  const fetchCreations = async () => {

    try {

      setLoading(true)

      const token = await getToken()

      const { data } = await axios.get(
        '/api/user/get-publish-creations',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      console.log(data)

      if (data.success) {

        // Only show image creations
        const imageCreations = data.creations.filter(
          (item) =>
            item.type === 'image' &&
            item.content
        )

        setCreations(imageCreations)

      } else {
        toast.error(data.message)
      }

    } catch (error) {

      console.log(error)

      toast.error(
        error.response?.data?.message || error.message
      )

    } finally {
      setLoading(false)
    }
  }

  ////////like handler////////

  const toggleLike = async (id) => {

  try {

    const token = await getToken()

    const { data } = await axios.post(
      '/api/user/toggle-like-creations',
      { id },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (data.success) {

      setCreations((prev) =>
        prev.map((item) => {

          if (item.id === id) {

            const likes = item.likes || []

            const alreadyLiked =
              likes.includes(user?.id)

            return {
              ...item,
              likes: alreadyLiked
                ? likes.filter(
                    (like) => like !== user?.id
                  )
                : [...likes, user?.id]
            }
          }

          return item
        })
      )

    } else {
      toast.error(data.message)
    }

  } catch (error) {

    console.log(error)

    toast.error(
      error.response?.data?.message || error.message
    )
  }
}
///////////////////////////////////////
  useEffect(() => {

    if (user) {
      fetchCreations()
    }

  }, [user])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <span
          className="
          w-10 h-10 rounded-full border-4
          border-purple-500 border-t-transparent
          animate-spin
        "
        ></span>
      </div>
    )
  }

  return (

    <div className='flex-1 h-full flex flex-col gap-4 p-6'>

      <h1 className='text-2xl font-bold'>
        Community Creations
      </h1>

      <div className='bg-white w-full rounded-xl p-4 min-h-screen'>

        {
          creations.length === 0 ? (

            <div className='flex justify-center items-center h-96'>
              <p className='text-gray-500 text-sm'>
                No published creations found
              </p>
            </div>

          ) : (

            <div className='flex flex-wrap'>

              {
                creations.map((creation) => (

                  <div
                    key={creation.id}
                    className='w-full sm:w-1/2 lg:w-1/3 p-3'
                  >

                    <div
                      className='
                      relative overflow-hidden rounded-2xl
                      shadow-md hover:shadow-2xl
                      transition-all duration-300 group
                    '
                    >

                      <img
                        src={creation.content}
                        alt={creation.prompt}
                        className='
                        w-full h-72 object-cover
                        group-hover:scale-110
                        transition-transform duration-500
                      '
                      />

                      <div
                        className='
                        absolute inset-0
                        bg-gradient-to-b
                        from-transparent to-black/80
                        opacity-0 group-hover:opacity-100
                        transition-all duration-300
                        flex flex-col justify-end p-4
                      '
                      >

                        <p className='text-white text-sm mb-2'>
                          {creation.prompt}
                        </p>

                        <div className='flex items-center justify-between'>

                          <span className='text-white text-sm'>
                            {creation.likes?.length || 0} Likes
                          </span>

                          <Heart
  onClick={() => toggleLike(creation.id)}
  className={`w-5 h-5 cursor-pointer transition-all ${
    creation.likes?.includes(user?.id)
      ? 'fill-red-500 text-red-500'
      : 'text-white'
  }`}
/>

                        </div>

                      </div>

                    </div>

                  </div>

                ))
              }

            </div>

          )
        }

      </div>

    </div>
  )
}

export default Community