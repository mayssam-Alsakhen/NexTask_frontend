'use client';
import React, { useContext, useEffect } from 'react'
import Card from '@/Components/card/Card'
import { AuthContext } from '@/context/AuthContext';
import ProjectTaskSection from '@/Components/project task section/ProjectTaskSection';
import { useRouter } from 'next/navigation';
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
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login"); // Redirect only after checking authentication
    }
  }, [loading, user, router]);

  if (loading) return <p>Loading...</p>;
  if (!user) return null; // Prevent rendering before redirection

  return (
    <div className='w-full h-full overflow-y-auto bg-secondDark md:p-10 sm:px-0 sm:py-10 border border-[#00334e] rounded-lg'>
     <Card cards={cards}/>
     <ProjectTaskSection api={'http://127.0.0.1:8000/api/tasks'}/>
    </div>
  )
}

export default page