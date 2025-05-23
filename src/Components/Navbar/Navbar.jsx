  import {useState} from 'react'
  import Image from 'next/image';
  import logo from "../../../public/logo.png"
  import { IoMdMenu } from "react-icons/io";
  import { IoClose } from "react-icons/io5";
  import UserDropdown from '../user dropdown/UserDropdown';
  import Link from 'next/link';
  import { usePathname } from 'next/navigation';


  export default function Navbar() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    return (
      <div>
      <div className='py-1 px-4 grid grid-cols-3 bg-main text-white fixed top-0 w-full z-50'>
                <div className='lg:flex gap-5 items-center hidden'>
          <ul className='flex gap-5 text-sm text-white '>
          <li className={`px-3 py-1 rounded transition-all duration-200 ${
  pathname === '/dashboard' ? 'bg-gray-200 text-main font-bold' : 'hover:bg-gray-100 hover:text-main'
}`}><Link href="/dashboard"> <span>Dashboard</span></Link></li>
          <li className={`px-3 py-1 rounded transition-all duration-200 ${
  pathname === '/projects' ? 'bg-gray-200 text-main font-bold' : 'hover:bg-gray-100 hover:text-main'
}`}><Link href="/projects"><span>Projects</span> </Link></li>
          <li className={`px-3 py-1 rounded transition-all duration-200 ${
  pathname === '/tasks' ? 'bg-gray-200 text-main font-bold' : 'hover:bg-gray-100 hover:text-main'
}`}><Link href="/tasks"><span className=' whitespace-nowrap'>My Tasks</span></Link></li>
          <li className={`px-3 py-1 rounded transition-all duration-200 ${
  pathname === '/calendar' ? 'bg-gray-200 text-main font-bold' : 'hover:bg-gray-100 hover:text-main'
}`}><Link href="/calendar"><span>Calendar</span></Link></li>
          </ul>
          </div>
          <div className='lg:hidden text-2xl flex items-center'>
            {open? <IoClose onClick={() => setOpen(false)} /> : <IoMdMenu onClick={() => setOpen(true)}/>}
          </div>
          <div className='md:w-fit sm:w-32 justify-self-center'><Image src={logo} width={120} height='auto' alt='logo' priority/></div>
      <div className='justify-self-end'>
    <UserDropdown />
  </div>
      </div>
      <div className={`bg-white text-prime p-5 w-64 z-50 fixed top-10 h-[100vh] left-0 transition-transform duration-300 ease-in-out transform lg:hidden ${
  open ? 'translate-x-0' : '-translate-x-full'
}`}>
  <ul className='flex flex-col gap-5 text-sm font-semibold'>
    <li className={`px-3 py-1 rounded transition-all duration-200 ${
  pathname === '/dashboard' ? 'bg-gray-200 text-main font-bold' : 'hover:bg-gray-100 hover:text-main'
}`}><Link href="/dashboard"> <span>Dashboard</span></Link></li>
    <li className={`px-3 py-1 rounded transition-all duration-200 ${
  pathname === '/projects' ? 'bg-gray-200 text-main font-bold' : 'hover:bg-gray-100 hover:text-main'
}`}><Link href="/projects"><span>Projects</span> </Link></li>
    <li className={`px-3 py-1 rounded transition-all duration-200 ${
  pathname === '/tasks' ? 'bg-gray-200 text-main font-bold' : 'hover:bg-gray-100 hover:text-main'
}`}><Link href="/tasks"><span>My Tasks</span></Link></li>
    <li className={`px-3 py-1 rounded transition-all duration-200 ${
  pathname === '/calendar' ? 'bg-gray-200 text-main font-bold' : 'hover:bg-gray-100 hover:text-main'
}`}><Link href="/calendar"><span>Calendar</span></Link></li>
  </ul>
</div>

      </div>
    )
  }
