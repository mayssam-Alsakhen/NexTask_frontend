import React from 'react'
import Image from 'next/image';
import logo from "../../../public/logo.png"
import UserDropdown from '../user dropdown/UserDropdown';
import Link from 'next/link';


export default function Navbar({handleDrawer}) {
  return (
    <div className='py-1 px-4 grid grid-cols-3 bg-[#2C5A89] text-white fixed top-0 w-full z-50'>
      
        {/* <span onClick={handleDrawer}><IoMenu className='hover:text-[#0288d1] text-4xl transform transition duration-1000 hover:rotate-[360deg] cursor-pointer'/></span> */}
        <div className='flex gap-5 items-center'>
        {/* <div className='md:w-fit sm:w-32'><Image src={logo} width={100} height='auto' alt='logo' priority/></div> */}
        <ul className='flex gap-5 text-sm texwwt-white '>
        <li><Link href="/dashboard"> <span className='hover:text-second'>Dashboard</span></Link></li>
        <li><Link href="/projects"><span>Projects</span> </Link></li>
        <li><Link href="/tasks"><span>My Tasks</span></Link></li>
        <li><Link href="/important"><span>Important</span></Link></li>
        </ul>
        </div>
        <div className='md:w-fit sm:w-32 justify-self-center'><Image src={logo} width={120} height='auto' alt='logo' priority/></div>
      {/* <div className='w-8 h-8 rounded-full bg-blue-300 flex justify-center items-center text-xl font-semibold justify-self-end'>M</div>
      <UserDropdown /> */}
     <div className='justify-self-end'>
  <UserDropdown />
</div>
    </div>
       
  )
}
