"use client"
import {React, useState} from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function page() {
  const [isHovered, setIsHovered] = useState(false)
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);


  const style = {
    // boxShadow: isHovered?'0 10px 20px rgba(0, 123, 255, 0.5)' : ' 0 5px 15px rgba(0, 123, 255, 0.3)',
    transition: ' transform 0.3s ease, box-shadow 0.3s ease',
    transform: isHovered? 'translateY(-5px)': "",
  }

  return (
    <div className='w-full min-h-[100vh] bg-[url("/landing.jpg")] bg-clip-border bg-cover md:p-6 px-3 py-6 font-serif'>
      <div>
        {/* content */}
        {/* heading */}
        <div className='flex flex-col justify-center items-center lg:text-6xl md:text-5xl sm:text-3xl  mb-10'>Elevate your productivity
          {/* logo */}
          <div className=' flex  items-center '>
            <div>with</div>
            <div className='logo md:p-6 p-2'><Image src="/logo.png" width={400} height={400} /></div>
          </div></div>
        <div className='w-full md:h-48 sm:h-96 md:text-xl flex justify-between md:flex-row sm:flex-col md:my-auto px-0 py-6 sm:my-14'>
          <p className='md:self-center sm:self-start'>Streamline your workflow</p>
          <p className='md:self-satart sm:self-end'>Manage your task easily </p>
          <p className='md:self-center sm:self-start'>Keep it organized</p>
          <p className='md:self-start sm:self-end'>100% Free</p>
        </div>
        {/* start button */}
        <div className='mt-12 flex justify-center items-center md:flex-row sm:flex-col'>
          <p className='px-3 md:text-5xl sm:text-4xl sm:py-2'>ALL IN ONE</p>
          <div className='px-3'>
            <p>what are you waiting for?</p>
            <button  style={style} className={`border-[1px] rounded-lg py-3 my-1 px-9 shadow-[0_5px_15px_rgba(0,123,255,0.3)] hover:shadow-[0_10px_20px_rgba(0,123,255,0.5)] `} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <Link href="/login">
                GET STARTED</Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
