import React, { useState } from 'react'
import { Sparkles, ImageIcon, Eraser } from 'lucide-react'
import axios from 'axios'
import { useAuth, useUser } from '@clerk/clerk-react'
import { toast } from 'react-hot-toast'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const RemoveBackground = () => {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const { getToken } = useAuth()

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (!image) {
      toast.error('Please upload an image')
      return
    }

    try {
      setLoading(true)

      const formData = new FormData()
      formData.append('image', image)

      const { data } = await axios.post(
        '/api/ai/remove-image-background',
        formData,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`
          }
        }
      )

      if (data.success) {
        setContent(data.content)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]

    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6">
      {/* LEFT */}
      <form
        onSubmit={onSubmitHandler}
        className="flex-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5"
      >
        {/* Heading */}
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 text-[#ff4938]" />
          <h1 className="text-lg font-semibold">Background Remover</h1>
        </div>

        {/* Upload */}
        <div>
          <p className="text-sm text-gray-600 mb-2">Upload Image</p>

          <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-lg p-6 cursor-pointer hover:bg-blue-50 transition">
            <ImageIcon className="w-8 h-8 text-blue-500 mb-2" />

            <p className="text-sm text-gray-500">
              Click to upload or drag & drop
            </p>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          <p className="text-xs text-gray-500 font-light mt-1">
            Supports JPG, PNG, and other image formats
          </p>
        </div>

        {/* Preview */}
        {preview && (
          <div>
            <p className="text-sm text-gray-600 mb-2">Preview</p>

            <img
              src={preview}
              alt="preview"
              className="w-full max-h-60 object-contain rounded-lg border"
            />
          </div>
        )}

        {/* Button */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 rounded-lg hover:opacity-90 transition"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Eraser className="w-5 h-5" />
          )}

          Remove Background
        </button>
      </form>

      {/* RIGHT */}
      <div className="flex-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Eraser className="w-5 h-5 text-[#FF4938]" />
          <h1 className="text-lg font-semibold">Result</h1>
        </div>

        {/* Result */}
        {!content ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-sm flex flex-col items-center gap-4 text-gray-400 text-center">
              <ImageIcon className="w-10 h-10" />

              <p>
                Upload an image and click{' '}
                <span className="font-medium text-gray-600">
                  "Remove Background"
                </span>{' '}
                to get started
              </p>
            </div>
          </div>
        ) : (
          <img
            src={content}
            alt="result"
            className="mt-3 w-full h-full object-contain"
          />
        )}
      </div>
    </div>
  )
}

export default RemoveBackground