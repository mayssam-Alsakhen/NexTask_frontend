import React from 'react'
import { IoMenu } from "react-icons/io5";


export default function Navbar({handleDrawer}) {
  return (
    <div>
        <span onClick={handleDrawer}><IoMenu className=' hover:text-[#0288d1] text-4xl transform transition duration-1000 hover:rotate-[360deg]'/></span>

    </div>
       
  )
}
