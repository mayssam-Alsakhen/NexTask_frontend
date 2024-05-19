"use client"
import React from 'react';
import { MdDashboard } from "react-icons/md";
import { BsListTask } from "react-icons/bs";
import { MdOutlineWork } from "react-icons/md";
import { RiErrorWarningFill } from "react-icons/ri";
import "../sidebar/sidebar.css"
import Link from 'next/link';

function Sidebar({drawerPos,  onDrawerPosChange }) {
  const drawerClass = drawerPos === 1 ? "drawerMin" : drawerPos === 2 ? "drawerOpen" : "";
  const mainClass = drawerPos === 1 ? "mainMin" : drawerPos === 2 ? "mainOpen" : "";

  return (
    <div>
      <aside className={drawerClass}>
        <ul>
         <Link href="/dashboard"> <li><span><MdDashboard className='icons mr-5 text-3xl' /></span> <span>Dashboard</span></li></Link>
         <Link href="/projects"> <li><span><MdOutlineWork className='icons mr-5 text-3xl' /></span><span>Projects</span></li> </Link>
         <Link href="/tasks"> <li><span><BsListTask className='icons mr-5 text-3xl' /></span><span>My Tasks</span></li> </Link>
         <Link href="/important"> <li><span><RiErrorWarningFill className='icons mr-5 text-3xl'/></span><span>Important</span></li> </Link>
        </ul>
      </aside>
      
      <main className={mainClass}>
        {/* Your main content here */}
      </main>
    </div>
  );
}

export default Sidebar;
