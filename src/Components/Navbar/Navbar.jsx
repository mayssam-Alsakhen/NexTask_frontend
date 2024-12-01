import React from 'react'
import Image from 'next/image';
import logo from "../../../public/logo.png"
import { IoMenu } from "react-icons/io5";


export default function Navbar({handleDrawer}) {
  return (
    <div className='py-3 px-5 flex justify-between'>
        <span onClick={handleDrawer}><IoMenu className=' hover:text-[#0288d1] text-4xl transform transition duration-1000 hover:rotate-[360deg] cursor-pointer'/></span>
        <dir><Image src={logo} width={170} height={170}/></dir>
      <div className='w-14 h-14 rounded-full  bg-purple-400 flex justify-center items-center text-2xl font-semibold'>M</div>
    </div>
       
  )
}
