import React from 'react'
import Link from 'next/link'

export default function AddButton({text, link, textSize}) {
  textSize = textSize || 'base'
  return (
    <div>
<Link href={link}>
        <div className={`py-2 text-${textSize} px-6 rounded-lg text-white bg-button shadow-md hover:bg-[#155A8A] transition cursor-pointer`}>
   {text}
   </div>
   </Link>
   </div>
  )
}