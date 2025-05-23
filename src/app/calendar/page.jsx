'use client';
import {useContext, useEffect} from 'react'
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Calendar from '@/Components/Calendar/Calendar'

function page() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

   useEffect(() => {
      if (!loading && !user) {
        router.push("/login");
      }
    }, [loading, user, router]);

  return (
    <div className='mt-12 '>
      <Calendar />
    </div>
  )
}

export default page