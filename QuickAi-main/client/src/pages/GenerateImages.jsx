import React, { useState } from 'react'
import { Sparkles, Image } from 'lucide-react'
import { useAuth } from '@clerk/clerk-react'
import axios from 'axios'
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
const GenerateImages = () => {

  const imageStyle = [
    'Realistic', 'Ghibli style','Anime style','Cartoon style',
    'Fantasy style','Portrait style'
  ]

  const [selectedStyle, setSelectedStyle] = useState('Realistic')
  const [input, setInput] = useState('')
  const [publish, setPublish] = useState(false)

  
  const [loading,setLoading] =useState(false)
  const [content,setContent] =useState('')


  const {getToken} = useAuth()
   

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    console.log(input, selectedStyle, publish)
    try{
  setLoading(true);
  const prompt = `Generate an image of ${input} in the style ${selectedStyle}`
  
   const {data} = await axios.post('/api/ai/generate-image',{prompt,publish},{
      headers:{Authorization:`Bearer ${await getToken()}`}})
 
      if(data.success){
        setContent(data.content)
      }else{
        toast.error(data.message)
      }
    }catch(error){
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
          <Sparkles className="w-6 text-green-600" />
          <h1 className="text-lg font-semibold">AI Image Generator</h1>
        </div>

        {/* Input */}
        <div>
          <p className="text-sm text-gray-600 mb-1">Describe Your Image</p>
          <textarea
            rows={4}
            placeholder="Describe what you want to see..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {/* Style */}
        <div>
          <p className="text-sm text-gray-600 mb-2">Style</p>

          <div className="flex gap-2 flex-wrap">
            {imageStyle.map((item, index) => (
              <span
                key={index}
                onClick={() => setSelectedStyle(item)}
                className={`text-xs px-4 py-1 border rounded-full cursor-pointer transition
                ${
                  selectedStyle === item
                    ? 'bg-green-50 text-green-700 border-green-300'
                    : 'text-gray-500 border-gray-300'
                }`}
              >
                {item}
              </span>
            ))}
          </div>

          {/* Toggle */}
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">Make this image Public</p>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={publish}
                onChange={(e) => setPublish(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-green-500 transition"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
            </label>
          </div>
        </div>

        {/* Button */}
        <button
        disabled={loading}
          type="submit"
          className="w-full flex items-center justify-center gap-2 
          bg-gradient-to-r from-green-500 to-emerald-500
          text-white py-2 rounded-lg hover:opacity-90 transition"
        >{loading?<span
        className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin">
        </span>:<Image className="w-5 h-5" />
        }
        
          Generate Image
        </button>
      </form>

      {/* RIGHT */}
      <div className="flex-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Image className="w-5 h-5 text-green-600" />
          <h1 className="text-lg font-semibold">Generated Images</h1>
        </div>


        {
          !content?(

 <div className="flex-1 flex items-center justify-center">
          <div className="text-sm flex flex-col items-center gap-4 text-gray-400 text-center">
            <Image className="w-10 h-10" />
            <p>
              Enter a prompt and click{" "}
              <span className="font-medium text-gray-600">
                "Generate Image"
              </span>{" "}
              to get started
            </p>
          </div>
        </div>
          ):(
            <div className='mt-3 h-full'>
              <img src={content} alt="image" className="w-full h-full"/>
            </div>
          )
        }

        {/* Empty State */}
       

      </div>
    </div>
  )
}

export default GenerateImages