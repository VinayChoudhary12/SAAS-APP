import React from 'react'
import { useClerk, useUser } from '@clerk/clerk-react'
import {
  House, SquarePen, Hash, Image, Eraser,
  Scissors, FileText, Users, LogOut
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: "/ai", label: 'Dashboard', Icon: House },
  { to: '/ai/write-article', label: 'Write Article', Icon: SquarePen },
  { to: '/ai/blog-titles', label: 'Blog Titles', Icon: Hash },
  { to: '/ai/generate-images', label: 'Generate Images', Icon: Image },
  { to: '/ai/remove-background', label: 'Remove Background', Icon: Eraser },
  { to: '/ai/remove-object', label: 'Remove Object', Icon: Scissors },
  { to: '/ai/review-resume', label: 'Review Resume', Icon: FileText },
  { to: '/ai/community', label: 'Community', Icon: Users },
]

const Sidebar = ({ sidebar, setSideBar }) => {
  const { signOut, openUserProfile } = useClerk()
  const { user } = useUser()

  return (
    <div
      className={`w-60 bg-white border-r border-gray-200 flex flex-col justify-between 
      max-sm:absolute top-14 bottom-0 z-50
      transform ${sidebar ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}
      transition-all duration-300 ease-in-out`}
    >

      {/* TOP */}
      <div className="my-7 w-full">
        <img
          src={user?.imageUrl}
          alt=""
          className="w-12 h-12 rounded-full mx-auto object-cover"
        />
        <h1 className="mt-2 text-center font-medium">
          {user?.fullName || "User"}
        </h1>

        <div className="mt-5 px-2 space-y-1">
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/ai'}
              onClick={() => setSideBar(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition
                ${
                  isActive
                    ? 'bg-gradient-to-r from-[#3C1FF6] to-[#9234EA] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {/* BOTTOM */}
      <div className="w-full border-t border-gray-200 p-4 px-6 flex items-center justify-between">
        
        {/* PROFILE */}
        <div
          onClick={openUserProfile}
          className="flex gap-2 items-center cursor-pointer"
        >
          <img
            src={user?.imageUrl}
            alt=""
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <h1 className="text-sm font-medium">
              {user?.fullName || "User"}
            </h1>
            <p className="text-xs text-gray-500">Free Plan</p>
          </div>
        </div>

        {/* LOGOUT */}
        <LogOut
          onClick={(e) => {
            e.stopPropagation()
            signOut()
          }}
          className="w-5 text-gray-400 hover:text-gray-700 transition cursor-pointer"
        />
      </div>
    </div>
  )
}

export default Sidebar