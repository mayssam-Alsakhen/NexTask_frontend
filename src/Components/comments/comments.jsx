import React from 'react'
import Image from 'next/image'
import send from "../../../public/send.svg"
import delte from '../../../public/delete.svg'



export default function Comments() {
  return (
    <div className=' bg-black bg-opacity-35 rounded-lg py-5 px-1'>
        <div className='flex justify-around items-center'>
            <input type="text" placeholder='comment...' className=' outline-none rounded-2xl p-2 md:w-52 sm:w-44' />
            <div className='cursor-pointer'><Image src={send} width={20} height={20} alt='send'/></div>
        </div>
        <div className='mt-5'>
            <div className='bg-slate-100 mx-3 p-2 rounded-lg text-left max-w-full'>
        <div className=' flex justify-end '><Image src={delte} width={20} height={20} alt='delete' /></div>
            <p className=' '>here are the comments</p>
            </div>
        </div>

        
    </div>
  )
}
