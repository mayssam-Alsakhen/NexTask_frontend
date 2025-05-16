import { use, useContext } from 'react'
import { AuthContext } from '@/context/AuthContext'
import Image from 'next/image'
import { MdAddCard } from "react-icons/md";
import { useRouter } from "next/navigation";
import Dashboard from '../../../public/dashboard.png'
import { MdFormatListBulletedAdd } from "react-icons/md";
import { FaRegCalendarAlt } from "react-icons/fa";

export default function DashboardHeader() {
    const { user } = useContext(AuthContext);
    const router = useRouter();
    return (

        <div className='bg-[url(/BG.jpg)] bg-center bg-cover border-main border shadow-lg rounded-lg px-7 flex md:flex-row flex-col-reverse items-center md:mx-10 lg:h-72 md:h-52'>
            <div className='md:w-2/3 flex flex-col justify-evenly h-full lg:px-10 py-2 '>
                <span className='lg:text-3xl text-xl font-semibold'>Welcome,
                    <span className='text-button font-bold'>{user.name.charAt(0).toUpperCase() + user.name.slice(1).toLowerCase()}
                    </span></span>
                <span className='text-gray-500 text-xs md:text-sm'>What are you going to work on today?</span>
                <div className='flex flex-row flex-wrap mt-5 gap-4 justify-center md:justify-start'>
                    <button className='text-sm flex gap-1 items-center hover:text-button hover:font-semibold' onClick={() => router.push('./addProject')}> <span className='text-xl text-button'><MdAddCard /></span> <span className=''>Create Project</span></button>
                    <button className='text-sm flex gap-1 items-center hover:text-button hover:font-semibold' onClick={() => router.push('./dashboard')}> <span className='text-xl text-button'><MdFormatListBulletedAdd /></span><span className=''>Create Task</span></button>
                    <button className='text-sm flex gap-1 items-center hover:text-button hover:font-semibold' onClick={() => router.push('./calendar')}> <span className='text-xl text-button'><FaRegCalendarAlt /></span ><span className=''>Check Calendar</span></button>
                </div>
            </div>
            <div className='md:w-96 lg:w-auto lg:mt-[-100px] mt-[-40px]'>
                <Image src={Dashboard} alt="Dashboard" width={450} height={500} className='w-full h-full object-cover rounded-lg' />
            </div>

        </div>
    )
}
