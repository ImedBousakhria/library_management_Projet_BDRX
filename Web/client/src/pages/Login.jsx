import React from 'react'
import img from "../assets/login-img.png"

const Login = () => {
  return (
    <div className='flex '>
        <img src={img} className='basis-[50%]' alt="" />
        <div className=' basis-[50%] my-[10rem] gap-4 flex flex-col items-center'>
            <h2 className='text-3xl font-semibold border-b-2 pb-2 border-y-yellow-950 max-h-max'>Welcome Back !</h2>
            <form  className='w-[60%] flex flex-col gap-[2rem]' action="">
              <div className='flex flex-col'>
                <label htmlFor="">Username</label>
                <input type="text" placeholder='ex: ImedBousakhria' className='border-b pb-1 border-yellow-950 outline-none ' />
              </div>

              <div className='flex flex-col'>
                <label htmlFor="">Password</label>
                <input type="text" placeholder='*********' className='border-b pb-1 border-yellow-950 outline-none' />
              </div>

              <button className="w-full bg-yellow-950 px-3 py-2 text-white min-w-max hover:opacity-85">
              Login
            </button>
            </form>
        </div>
    </div>
  )
}

export default Login