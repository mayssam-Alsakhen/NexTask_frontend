import React from 'react'
import Image from 'next/image';
import logo from "../../../public/logo.png"
import { IoMenu } from "react-icons/io5";


export default function Navbar({handleDrawer}) {
  return (
    <div className='py-1 px-6 flex justify-between items-center bg-[#2C5A89] text-white fixed top-0 w-full z-50'>
      
        <span onClick={handleDrawer}><IoMenu className='hover:text-[#0288d1] text-4xl transform transition duration-1000 hover:rotate-[360deg] cursor-pointer'/></span>
        <div className='md:w-fit sm:w-32'><Image src={logo} width={120} height='auto' alt='logo' priority/></div>
      <div className='w-9 h-9 rounded-full bg-blue-300 flex justify-center items-center text-xl font-semibold'>M</div>
    </div>
       
  )
}
