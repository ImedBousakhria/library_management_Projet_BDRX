import React from 'react'
import read from '../assets/read.svg'
import { FaSearch } from "react-icons/fa";


const Home = () => {
  return (
    <div className=''>
      <div className='absolute w-full top-20 bg-yellow-950'>
        <div className='text-white py-2 px-20 flex items-center w-full justify-between'>
          <div className='flex gap-2'>
            <img src={read} alt="" />
            <h2 className='font-medium font-frank text-2xl italic'>Find Your Favorite Book</h2>
          </div>

          <div className="flex items-center px-2 py-2 w-full max-w-sm bg-white rounded-full border-2 border-yellow-950 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
          <input
            type="text"
            placeholder="Type in the book title ..."
            className="w-full outline-none text-sm text-black placeholder-gray-400"
          />
          <FaSearch className="text-gray-500" size={18} />
        </div>

        </div>
      </div>
      </div>
)}

export default Home