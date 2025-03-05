import React from 'react'
import Image from 'next/image';
import logo from "../../../public/logo.png"
import { IoMenu } from "react-icons/io5";


export default function Navbar({handleDrawer}) {
  return (
    <div className='py-1 px-5 flex justify-between bg-slate-600'>
        <span onClick={handleDrawer}><IoMenu className='hover:text-[#0288d1] text-4xl transform transition duration-1000 hover:rotate-[360deg] cursor-pointer'/></span>
        <div className='md:w-fit sm:w-32'><Image src={logo} width={120} height='auto' alt='logo' priority/></div>
      <div className='w-10 h-10 rounded-full bg-blue-300 flex justify-center items-center md:text-2xl sm:text-xl font-semibold'>M</div>
    </div>
       
  )
}
