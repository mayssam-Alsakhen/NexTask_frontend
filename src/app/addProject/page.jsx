import React from 'react'

export default function 

() {
  return (
    <div className='w-full h-full  overflow-y-auto bg-secondDark p-10 border-2 border-designing rounded-lg'>
    <div className=' w-full h-full flex justify-center items-center'>
       <div class="w-96 sm:h-[370px] md:h[450px] py-8 px-12 bg-slate-600 bg-opacity-40 text-prime ">
        <h2 className='text-second sm:text-lg md:text-2xl text-center font-bold'>Add Your Project Details</h2>
    <form action="" className='h-full'>
      <div className='h-full flex flex-col justify-evenly'>
      <input type="text" placeholder="Project Title" className=' outline-none p-2 bg-slate-600 text-white'/>
      <textarea name="" id="" placeholder='description' rows={5} className=' p-2 outline-none bg-slate-600 text-white'></textarea>
      <button type="submit" className='shadow-button hover:shadow-hoverButton hover:font-extrabold bg-second py-2 rounded-lg'> ADD</button>
      </div>
    </form>
  </div>
    </div>
    </div>
  )
}
