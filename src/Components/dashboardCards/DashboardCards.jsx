'use client'
import React from 'react'
import CountUp from 'react-countup';
import { MdGroups2 } from "react-icons/md";
import { RiAdminFill } from "react-icons/ri";

function DashboardCards({title, total, fpart, fpartnb, spart, spartnb}) {
    return (
        <div className='flex lg:flex-row sm:flex-col justify-center gap-14'>
            {/* tasks card */}
            <div className=' bg-[#0077b6] text-white lg:w-[380px] md:w-[320px] sm:w-64 md:h-[300px] sm:h-60 rounded-2xl flex flex-col justify-around'>
              {/* card head tasks */}
              <div className='flex flex-col gap-y-7 items-center mx-4 '>
                <h2 className='md:text-4xl font-bold sm:text-2xl'>{title}</h2>
                <p className='font-bold text-4xl'><CountUp end={total} /></p>
                </div>
                {/* tasks info */}
                <div className='flex justify-around  gap-x-10 flex-wrap'>
                    {/* pending info */}
                    <div className='flex flex-col items-center'>
                        <div className='flex gap-1 items-center'>
                            <span className='cursor-pointer group relative transition-all duration-700 text-lg'>{fpart} 
                                {/* hover */}
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
                                {/*  */}
                            </span>
                        </div>
                        <p className='font-bold text-2xl'><CountUp end={fpartnb} /></p>
                    </div>
                    {/* in progress info */}
                    <div className='flex flex-col items-center'>
                        <div className='flex gap-1 items-center'>
                            {/* <span><MdGroups2 className='text-progresstext text-xl' /></span> */}
                            <span className='cursor-pointer group relative transition-all duration-700 text-lg'> {spart}
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
                        <p className='font-bold text-2xl'><CountUp end={spartnb} /></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardCards