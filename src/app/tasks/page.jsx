import React from 'react'
import Card from '@/Components/card/Card'
const cards = [
    {
      id: 1,
      title: 'In Progress',
      description: 'doing all my task on time and trackng your tasks',
      status: 'In Progress',
      isImportant: false,
      start_date: '02/3/2023',
      due_date: '09/3/2023'

    },
    {
      id: 2,
      title: 'Pending',
      description: 'doing all my task to have it done on time so i should start',
      status: 'Pending',
      isImportant: false,
      start_date: '02/3/2023',
      due_date: '09/3/2023'

    },
    {
      id: 3,
      title: 'Completed',
      description: 'doing all my task having it completed is the best thing you will see on your task board doing all my task having it completed is the best thing you will see on your task board doing all my task having it completed is the best thing you will see on your task board',
      status: 'Completed',
      isImportant: false,
      start_date: '02/3/2023',
      due_date: '09/3/2023'

    },
    {
      id: 4,
      title: 'Testing',
      description: 'doing all my task',
      status: 'Testing',
      isImportant: false,
      start_date: '02/3/2023',
      due_date: '09/3/2023'
    },
    {
      id: 5,
      title: 'Pending important ',
      description: 'doing all my task',
      status: 'Pending',
      isImportant: true,
      start_date: '02/3/2023',
      due_date: '09/3/2023'

    }
  ]

function page() {
  return (
    <div className='w-full h-full overflow-y-auto bg-secondDark md:p-10 sm:px-0 sm:py-10 border border-[#00334e] rounded-lg'>
     <Card cards={cards}/>
    </div>
  )
}

export default page