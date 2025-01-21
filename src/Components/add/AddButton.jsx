import React from 'react'
import Link from 'next/link'

export default function AddButton({text, link}) {
  return (
    <div>
<Link href={link}>
        <div className=" lg:w-[350px] md:w-[400px] sm:w-[230px] sm:h-[70px] md:h-[300px] flex justify-center items-center rounded-2xl bg-slate-500 bg-opacity-20 border-2 border-slate-400 border-solid cursor-pointer text-xl">
   {text}
   </div>
   </Link>
   </div>
  )
}