import React from 'react'
import AddButton from '@/Components/add/AddButton'

function page() {
  return (
    <div className='w-full h-full  overflow-y-auto bg-secondDark p-10  border-2 border-designing rounded-lg'>
<AddButton text={"Add A New Project"} link={"/addProject"}/>
    </div>
  )
}

export default page