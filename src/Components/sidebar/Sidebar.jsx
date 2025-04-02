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
        <li><Link href="/dashboard"> <span><MdDashboard className='icons mr-5 text-3xl' /></span> <span>Dashboard</span></Link></li>
        <li><Link href="/projects"> <span><MdOutlineWork className='icons mr-5 text-3xl' /></span><span>Projects</span> </Link></li>
        <li><Link href="/tasks"><span><BsListTask className='icons mr-5 text-3xl' /></span><span>My Tasks</span></Link></li>
        <li><Link href="/important"> <span><RiErrorWarningFill className='icons mr-5 text-3xl'/></span><span>Important</span></Link></li>
        </ul>
      </aside>
      
     
    </div>
  );
}

export default Sidebar;
