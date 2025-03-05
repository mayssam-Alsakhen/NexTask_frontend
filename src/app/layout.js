
"use client"
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/Components/sidebar/Sidebar";
import React ,{ useState } from "react";
import Navbar from "@/Components/Navbar/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { usePathname } from 'next/navigation'

const inter = Inter({ subsets: ["latin"] });
export default function RootLayout({ children }) {
// const router =useRouter();
const pathname = usePathname()

  const [drawerPos, setDrawerPos] = useState(0);

  const handleDrawerPosChange = () => {
    setDrawerPos(drawerPos === 2 ? 0 : drawerPos + 1);
  };

  return (
    <AuthProvider>
    <html lang="en">
      <body className={inter.className}>
      {(pathname !== '/login' && pathname!=='/' )&& <Navbar handleDrawer={handleDrawerPosChange}/>}
        {/* <Navbar handleDrawer={handleDrawerPosChange}/> */}
        <div className="flex justify-between h-full">
          <Sidebar drawerPos={drawerPos} onDrawerPosChange={setDrawerPos}/>  
          <div className={` ${pathname==='/'? 'px-0 top-0':'px-5 top-20'}  transition-all duration-500 ease-in-out ${drawerPos==2? "xl:w-[82%] lg:w-[7%]": drawerPos==1? "w-[95%]": "w-full"}`}>
        {children}
          </div>
        </div>
        </body>
    </html>
    </AuthProvider>
  );
}
