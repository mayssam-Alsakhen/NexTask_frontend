import React from 'react'
import Calendar from '@/Components/Calendar/Calendar'

function page() {
  return (
    <div className='w-full h-full  overflow-y-auto bg-secondDark p-10 border-2  border-designing rounded-lg'>
      <Calendar />
    </div>
  )
}

export default page