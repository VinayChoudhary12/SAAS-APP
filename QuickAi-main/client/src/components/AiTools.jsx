import React from 'react'
import { AiToolsData } from '../assets/assets'
import { useNavigate } from "react-router-dom"
import { useUser } from '@clerk/clerk-react'

const AiTools = () => {

  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <section className="min-h-screen px-4 sm:px-20 flex flex-col items-center justify-center bg-gray-50">

      {/* HEADER */}
      <div className='text-center max-w-2xl mx-auto'>
        <h2 className='text-3xl sm:text-4xl font-bold text-gray-800'>
          Powerful AI Tools
        </h2>
        <p className='text-gray-500 mt-3'>
          Create, enhance and optimize your content with cutting-edge AI technology.
        </p>
      </div>

      {/* CARDS */}
      <div className="flex flex-wrap mt-12 justify-center gap-6 w-full">

        {AiToolsData.map((tool, index) => (

          <div
            key={index}
            onClick={() => user && navigate(tool.path)}
            className="p-6 sm:p-8 max-w-xs w-full rounded-2xl bg-white shadow-md border border-gray-100 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 cursor-pointer"
          >

            {/* ICON */}
            <div
              className="w-12 h-12 flex items-center justify-center rounded-xl text-white"
              style={{ backgroundColor: tool.bgColor || "#6366F1" }}
            >
              <tool.Icon className="w-6 h-6" />
            </div>

            {/* TITLE */}
            <h3 className="mt-6 mb-2 text-lg font-semibold text-gray-800">
              {tool.title}
            </h3>

            {/* DESCRIPTION */}
            <p className="text-gray-500 text-sm">
              {tool.description}
            </p>

          </div>

        ))}

      </div>

    </section>
  )
}

export default AiTools