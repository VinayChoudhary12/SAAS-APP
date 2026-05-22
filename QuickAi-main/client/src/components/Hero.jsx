
import React from 'react'
import Button from './Button.jsx'
import { assets } from "../assets/assets"
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-6 sm:px-16 xl:px-32 bg-[url('/gradientBackground.png')] bg-cover bg-no-repeat">

      <div className="max-w-5xl text-center space-y-6">

        {/* HEADING */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl font-bold leading-tight">
          Create Amazing Content <br />
          with <span className="text-primary">AI Tools</span>
        </h1>

        {/* DESCRIPTION */}
        <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
          Transform your content creation with our suite of premium AI tools. 
          Write articles, generate images, and enhance your workflow effortlessly.
        </p>

        {/* BUTTONS */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <button
            onClick={() => navigate('/ai')}
            className="bg-primary text-white px-8 sm:px-10 py-3 rounded-xl font-medium shadow-md hover:scale-105 active:scale-95 transition"
          >
            Start Creating Now
          </button>

          <button className="bg-white text-gray-800 px-8 sm:px-10 py-3 rounded-xl border border-gray-300 font-medium shadow-sm hover:scale-105 active:scale-95 transition">
            Watch Demo
          </button>
        </div>

        {/* TRUST SECTION */}
        <div className="flex items-center justify-center gap-3 mt-6 text-gray-500 text-sm">
          <img src={assets.user_group} className="h-8 sm:h-10" alt="users" />
          <span>Trusted by 10k+ people</span>
        </div>

      </div>
    </div>
  )
}

export default Hero
