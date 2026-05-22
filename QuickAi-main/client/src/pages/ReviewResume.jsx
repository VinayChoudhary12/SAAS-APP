import React, { useState } from 'react'
import { Sparkles, FileText } from 'lucide-react'
import axios from 'axios'
import Markdown from 'react-markdown'
import { useAuth } from '@clerk/clerk-react'
import { toast } from 'react-toastify'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const ReviewResume = () => {

  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState("")
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const { getToken } = useAuth()

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setFileName(selectedFile.name)
    }
  }

  // const onSubmitHandler = async (e) => {
  //   e.preventDefault()
  //   console.log(file)

  //   try{

  //     setLoading(true)

  //     const formData = new FormData()
  //     formData.append('resume', input)

  //     const { data } = await axios.post(
  //       '/api/ai/resume-review',
  //       formData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${await getToken()}`
  //         }
  //       }
  //     )

  //     if (data.success) {
  //       setContent(data.content)
  //     } else {
  //       toast.error(data.message)
  //     }

  //   } catch (error) {
  //     toast.error(data.message)
  //   }
  //   setLoading(false)
  // }


  const onSubmitHandler = async (e) => {
  e.preventDefault()

  if (!file) {
    toast.error("Please upload a resume")
    return
  }

  try {

    setLoading(true)

    const formData = new FormData()

    // Corrected here
    formData.append('resume', file)

    const { data } = await axios.post(
      '/api/ai/resume-review',
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

    // Corrected here
    toast.error(
      error.response?.data?.message || error.message
    )

  } finally {

    setLoading(false)

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
          <Sparkles className="w-6 text-indigo-600" />
          <h1 className="text-lg font-semibold">Resume Review</h1>
        </div>

        {/* Upload */}
        <div>
          <p className="text-sm text-gray-600 mb-2">Upload Resume</p>

          <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-indigo-300 rounded-lg p-6 cursor-pointer hover:bg-indigo-50 transition">
            <FileText className="w-8 h-8 text-indigo-500 mb-2" />
            <p className="text-sm text-gray-500">
              Click to upload your resume (PDF, DOC)
            </p>

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* File Preview */}
        {fileName && (
          <div>
            <p className="text-sm text-gray-600 mb-2">Selected File</p>
            <div className="p-3 border rounded-lg text-sm text-gray-700 bg-gray-50">
              {fileName}
            </div>
          </div>
        )}

        {/* Button */}
        <button

          type="submit"
          className="w-full flex items-center justify-center gap-2 
          bg-gradient-to-r from-indigo-500 to-blue-500
          text-white py-2 rounded-lg hover:opacity-90 transition"
        >
          {
            loading?<span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>:
           <FileText className="w-5 h-5" />
          }
          Review Resume
        </button>
      </form>

      {/* RIGHT */}
      <div className="flex-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-indigo-600" />
          <h1 className="text-lg font-semibold">Analysis Result</h1>
        </div>

        {/* Empty State */}

        {
          !content?(
           
             <div className="flex-1 flex items-center justify-center">
          <div className="text-sm flex flex-col items-center gap-4 text-gray-400 text-center">
            <FileText className="w-10 h-10" />
            <p>
              Upload your resume and click{" "}
              <span className="font-medium text-gray-600">
                "Review Resume"
              </span>{" "}
              to get feedback
            </p>
          </div>
        </div>

          ):(
            <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600">
              <div className="reset-tw">
                <Markdown>{content}</Markdown>
              </div>
            </div>
          )
        }
       

      </div>
    </div>
  )
}

export default ReviewResume
