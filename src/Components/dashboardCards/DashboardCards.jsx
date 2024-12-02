'use client'
import React from 'react'
import CountUp from 'react-countup';
import Image from 'next/image';
import project from '../../../public/project.svg'
import task from '../../../public/task.svg'
import { MdGroups2 } from "react-icons/md";
import { IoPerson } from "react-icons/io5";
import { MdWork } from "react-icons/md";
import { RiAdminFill } from "react-icons/ri";

function DashboardCards() {
    return (
        <div className='flex lg:flex-row sm:flex-col justify-center gap-14'>
            {/* projects card */}
            <div className=' bg-[#b6c6ff] text-designing lg:w-[47%] sm:w-full min-h-64 rounded-2xl p-3 flex flex-col justify-around'>
              {/* card head projects*/}
               <div className='flex items-center mx-4 mb-7'>
                <div className='w-[80px] h-[80px] bg-second rounded-full flex justify-center items-center bg-opacity-25 mr-3'>
                    <div><Image src={project} width={45} height={45} alt='project'/></div>
                </div>
                <h2 className='text-2xl font-bold'>Projects</h2>
                </div>
                {/* project info */}
                <div className='flex justify-center gap-x-12 gap-y-14 flex-wrap'>
                    {/* first info */}
                    <div className='flex flex-col items-center'>
                        <div className='flex gap-1 items-center'>
                            <span><IoPerson className='text-testingtext' /></span>
                            <span> Personal Projects </span>
                        </div>
                        <p className='font-bold text-4xl'>
                            <CountUp end={25} />
                            </p>
                    </div>
                    {/* second dropdown */}
                    <div className='flex flex-col items-center'>
                        <div className='flex gap-1 items-center'>
                            <span><MdGroups2 className='text-importanttext text-xl' /></span>
                            <span className='cursor-pointer group relative transition-all duration-700 '> Team Projects
                                {/* dropdown */}
                                <div className={`absolute left-0 top-7 w-full text-center rounded-lg bg-second opacity-0 px-1 py-2 transition-all duration-700 transform translate-y-[-80%] group-hover:translate-y-0 group-hover:opacity-100 group-hover:bg-opacity-35`}>
                                    <div className='flex flex-col items-center'>
                                        <div className='flex gap-[2px] items-center'>
                                            <span><MdGroups2 className='text-donetext text-sm' /></span>
                                            <span className='text-donetext text-xs'> Team Player </span>
                                        </div>
                                        <p className='font-bold text-lg'>
                                        <CountUp end={25} />
                                        </p>
                                    </div>
                                    <div className='flex flex-col items-center'>
                                        <div className='flex gap-[2px] items-center'>
                                            <span><RiAdminFill className='text-donetext text-sm' /></span>
                                            <span className='text-donetext text-xs'> Project Admin </span>
                                        </div>
                                        <p className='font-bold text-lg'>
                                        <CountUp end={25} />
                                        </p>
                                    </div>
                                </div>
                            </span>
                        </div>
                        <p className='font-bold text-4xl'><CountUp end={25} /></p>
                    </div>
                    {/* third */}
                    <div className='flex flex-col items-center'>
                        <div className='flex gap-1 items-center'>
                            <span><MdWork className='text-donetext' /></span>
                            <span> Total Projects </span>
                        </div>
                        <p className='font-bold text-4xl'><CountUp end={25} /></p>
                    </div>
                </div>
            </div>

            {/* tasks card */}
            <div className=' bg-[#b6c6ff] text-designing lg:w-[47%] sm:w-full min-h-64 rounded-2xl p-3 flex flex-col justify-around'>
              {/* card head tasks */}
              <div className='flex items-center mx-4 mb-7'>
                <div className='w-[80px] h-[80px] bg-second rounded-full flex justify-center items-center bg-opacity-25 mr-3'>
                <div><Image src={task} width={45} height={45} alt='project'/></div>
                </div>
                <h2 className='text-2xl font-bold'>Tasks</h2>
                </div>
                {/* tasks info */}
                <div className='flex justify-center gap-x-12 gap-y-14 flex-wrap'>
                    {/* pending info */}
                    <div className='flex flex-col items-center'>
                        <div className='flex gap-1 items-center'>
                            <span><IoPerson className='text-pendingtext' /></span>
                            <span className='cursor-pointer group relative transition-all duration-700 text-sm'>Pending 
                            <div className={`absolute left-0 top-7 min-w-full text-center rounded-lg bg-second opacity-0 px-1 py-2 transition-all duration-700 transform translate-y-[-80%] group-hover:translate-y-0 group-hover:opacity-100 group-hover:bg-opacity-35`}>
                                    <div className='flex flex-col items-center text-importanttext'>
                                        <div className='flex gap-[2px] items-center'>
                                            <span><MdGroups2 className='text-sm' /></span>
                                            <span className='text-xs'>Important </span>
                                        </div>
                                        <p className='font-bold'><CountUp end={25} /></p>
                                    </div>
                                    <div className='flex flex-col items-center'>
                                        <div className='flex gap-[2px] items-center'>
                                            <span><RiAdminFill className='text-sm' /></span>
                                            <span className='text-xs '> medium </span>
                                        </div>
                                        <p className='font-bold'><CountUp end={25} /></p>
                                    </div>
                                </div>
                            </span>
                        </div>
                        <p className='font-bold text-4xl'><CountUp end={25} /></p>
                    </div>
                    {/* in progress info */}
                    <div className='flex flex-col items-center'>
                        <div className='flex gap-1 items-center'>
                            <span><MdGroups2 className='text-progresstext text-xl' /></span>
                            <span className='cursor-pointer group relative transition-all duration-700 text-sm'> In Progress
                                {/* dropdown */}
                                <div className={`absolute left-0 top-7 min-w-full text-center rounded-lg bg-second opacity-0 px-1 py-2 transition-all duration-700 transform translate-y-[-80%] group-hover:translate-y-0 group-hover:opacity-100 group-hover:bg-opacity-35`}>
                                    <div className='flex flex-col items-center'>
                                        <div className='flex gap-[2px] items-center text-importanttext'>
                                            <span><MdGroups2 className='text-sm' /></span>
                                            <span className='text-xs'>Important </span>
                                        </div>
                                        <p className='font-bold'><CountUp end={25} /></p>
                                    </div>
                                    <div className='flex flex-col items-center'>
                                        <div className='flex gap-[2px] items-center'>
                                            <span><RiAdminFill className='text-sm' /></span>
                                            <span className='text-xs '> medium </span>
                                        </div>
                                        <p className='font-bold'><CountUp end={25} /></p>
                                    </div>
                                </div>
                            </span>
                        </div>
                        <p className='font-bold text-4xl'><CountUp end={25} /></p>
                    </div>
                    {/* third */}
                    <div className='flex flex-col items-center'>
                        <div className='flex gap-1 items-center'>
                            <span><MdWork className='text-testingtext' /></span>
                            <span className='cursor-pointer group relative transition-all duration-700 text-sm'> Testing
                            {/* dropdown */}
                            <div className={`absolute left-0 top-7 min-w-full text-center rounded-lg bg-second opacity-0 px-1 py-2 transition-all duration-700 transform translate-y-[-80%] group-hover:translate-y-0 group-hover:opacity-100 group-hover:bg-opacity-35`}>
                                    <div className='flex flex-col items-center'>
                                        <div className='flex gap-[2px] items-center text-importanttext'>
                                            <span><MdGroups2 className='text-sm' /></span>
                                            <span className='text-xs'>Important </span>
                                        </div>
                                        <p className='font-bold'><CountUp end={25} /></p>
                                    </div>
                                    <div className='flex flex-col items-center'>
                                        <div className='flex gap-[2px] items-center'>
                                            <span><RiAdminFill className='text-sm' /></span>
                                            <span className='text-xs '> medium </span>
                                        </div>
                                        <p className='font-bold'><CountUp end={25} /></p>
                                    </div>
                                </div>
                            </span>
                        </div>
                        <p className='font-bold text-4xl'><CountUp end={25} /></p>
                    </div>
                    {/* fourth */}
                    <div className='flex flex-col items-center'>
                        <div className='flex gap-1 items-center'>
                            <span><MdWork className='text-donetext' /></span>
                            <span className='cursor-pointer group relative transition-all duration-700 text-sm'> Completed
                            {/* dropdown */}
                            <div className={`absolute left-0 top-7 min-w-full text-center rounded-lg bg-second opacity-0 px-1 py-2 transition-all duration-700 transform translate-y-[-80%] group-hover:translate-y-0 group-hover:opacity-100 group-hover:bg-opacity-35`}>
                                    <div className='flex flex-col items-center'>
                                        <div className='flex gap-[2px] items-center'>
                                            <span><MdGroups2 className='text-importanttext text-sm' /></span>
                                            <span className='text-importanttext text-xs'>Important </span>
                                        </div>
                                        <p className='font-bold'><CountUp end={25} /></p>
                                    </div>
                                    <div className='flex flex-col items-center'>
                                        <div className='flex gap-[2px] items-center'>
                                            <span><RiAdminFill className='text-sm' /></span>
                                            <span className='text-xs '> medium </span>
                                        </div>
                                        <p className='font-bold'><CountUp end={25} /></p>
                                    </div>
                                </div>
                            </span>
                        </div>
                        <p className='font-bold text-4xl'><CountUp end={25} /></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardCards