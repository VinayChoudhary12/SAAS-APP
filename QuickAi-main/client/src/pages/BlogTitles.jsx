import React, { useState } from 'react'
import { Sparkles, Hash } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Markdown from 'react-markdown'
import { useAuth } from '@clerk/clerk-react'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitles = () => {

  const blogCategories = [
    'General','Technology','Business','Health',
    'Lifestyle','Education','Travel','Food'
  ]

  const [selectedCategory, setSelectedCategory] = useState('General')
  const [input, setInput] = useState('')

  const [loading,setLoading] =useState('')
  const [content,setContent] =useState('')

  const {getToken} = useAuth()


    const onSubmitHandler = async (e) => {
    e.preventDefault()
    try{
    setLoading(true)
    const prompt = `Generate a blog title for the keyword ${input} in the category ${selectedCategory}`
    const {data } = await axios.post('/api/ai/generate-blog-title',{prompt},{
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
          <Sparkles className="w-6 text-[#8E37EB]" />
          <h1 className="text-lg font-semibold">AI Title Generator</h1>
        </div>

        {/* Input */}
        <div>
          <p className="text-sm text-gray-600 mb-1">Keyword</p>
          <input
            type="text"
            placeholder="The future of artificial intelligence..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Category */}
        <div>
          <p className="text-sm text-gray-600 mb-2">Category</p>
          <div className="flex gap-2 flex-wrap">
            {blogCategories.map((item, index) => (
              <span
                key={index}
                onClick={() => setSelectedCategory(item)}
                className={`text-xs px-4 py-1 border rounded-full cursor-pointer transition
                ${
                  selectedCategory === item
                    ? 'bg-purple-50 text-purple-700 border-purple-300'
                    : 'text-gray-500 border-gray-300'
                }`}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Button */}
        <button
         disabled={loading}
          type="submit"
          className="w-full flex items-center justify-center gap-2 
          bg-gradient-to-r from-[#C341F6] to-[#8E37EB]
          text-white py-2 rounded-lg hover:opacity-90 transition"
        >
          {loading?<span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animated-spin"></span>:<Hash className="w-5 h-5" />}
          Generate Title
        </button>
      </form>

      {/* RIGHT */}
      <div className="flex-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">

        <div className="flex items-center gap-2 mb-4">
          <Hash className="w-5 h-5 text-[#8E37EB]" />
          <h1 className="text-lg font-semibold">Generated Titles</h1>
        </div>

        {
          !content?(

            <div className="flex-1 flex items-center justify-center">
          <div className="text-sm flex flex-col items-center gap-4 text-gray-400 text-center">
            <Hash className="w-10 h-10" />
            <p>
              Enter a keyword and click{" "}
              <span className="font-medium text-gray-600">
                "Generate Title"
              </span>{" "}
              to get started
            </p>
          </div>
        </div>

          ):(
    
          <div className="h-[500px] overflow-y-auto text-sm text-gray-700 leading-7 whitespace-pre-line pr-2">
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

export default BlogTitles