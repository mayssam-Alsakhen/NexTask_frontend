'use client';
import React, { useContext, useEffect } from 'react'
import { AuthContext } from '@/context/AuthContext';
import ProjectTaskSection from '@/Components/project task section/ProjectTaskSection';
import { useRouter } from 'next/navigation';
import LoaderSpinner from '@/Components/loader spinner/LoaderSpinner';

function page() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) return <div className='flex justify-center mt-20'> <LoaderSpinner child='Loading...' /> </div>;
  if (!user) return null; // Prevent rendering before redirection

  return (
    <div className='lg:mt-10 mt-12 p-2'>
     <ProjectTaskSection api={'http://127.0.0.1:8000/api/tasks'} title='My Tasks' addIcon='hidden'/>
    </div>
  )
}

export default page