import React, { useState } from 'react'
import { Sparkles, Scissors } from 'lucide-react'
import { useAuth } from '@clerk/clerk-react'
import { toast } from 'react-hot-toast'
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const RemoveObject = () => {

  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [object, setObject] = useState('')
  const [instructions, setInstructions] = useState('')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const { getToken } = useAuth()

  const handleImageUpload = (e) => {
    const file = e.target.files[0]

    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    console.log(image, instructions)

    if (!image) {
      toast.error('Please upload an image')
      return
    }

    try {
      setLoading(true)

      if (object.split(' ').length > 1) {
        toast.error('Please enter only one object name')
        return
      }

      const formData = new FormData()
      formData.append('image', image)
      formData.append('object', object)

      const { data } = await axios.post(
        '/api/ai/remove-image-object',
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
    }

    setLoading(false)
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
          <Sparkles className="w-6 text-orange-500" />
          <h1 className="text-lg font-semibold">Object Remover</h1>
        </div>

        {/* Upload */}
        <div>
          <p className="text-sm text-gray-600 mb-2">Upload Image</p>

          <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-orange-300 rounded-lg p-6 cursor-pointer hover:bg-orange-50 transition">
            <Scissors className="w-8 h-8 text-orange-500 mb-2" />
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
        </div>

        {/* Preview */}
        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-full rounded-lg"
          />
        )}

        {/* Object Input */}
        <div>
          <p className="text-sm text-gray-600 mb-1">
            Describe the Object to remove?
          </p>

          <textarea
            rows={4}
            placeholder="Describe what you want to Remove..."
            value={object}
            onChange={(e) => setObject(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {/* Button */}
        <button
          disabled={loading}
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#417DF6] to-[#8E37EB] text-white py-2 rounded-lg hover:opacity-90 transition"
        >
          {
            loading
              ? <span>Loading...</span>
              : <Scissors className="w-5 h-5" />
          }

          Remove Object
        </button>
      </form>

      {/* RIGHT */}
      <div className="flex-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Scissors className="w-5 h-5 text-orange-500" />
          <h1 className="text-lg font-semibold">Result</h1>
        </div>

        {
          !content ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-sm flex flex-col items-center gap-4 text-gray-400 text-center">
                <Scissors className="w-10 h-10" />
                <p>
                  Upload an image and describe what to remove, then click{" "}
                  <span className="font-medium text-gray-600">
                    Remove Object
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <img
              src={content}
              alt="result"
              className="mt-3 w-full h-full rounded-lg"
            />
          )
        }

      </div>
    </div>
  )
}

export default RemoveObject