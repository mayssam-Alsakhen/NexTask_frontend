"use client"
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/Components/sidebar/Sidebar";
import React ,{ useState } from "react";
import Navbar from "@/Components/Navbar/Navbar";


const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "NexTask",
//   description: "task manager too can help a person or a team to manage the work easily ",
// };

export default function RootLayout({ children }) {
  const [drawerPos, setDrawerPos] = useState(0);

  const handleDrawerPosChange = () => {
    setDrawerPos(drawerPos === 2 ? 0 : drawerPos + 1);
  };

  return (
    <html lang="en">
      {/* <Head>
        <title>nextask</title>
      </Head> */}
      <body className={inter.className}>
        <Navbar handleDrawer={handleDrawerPosChange}/>
        <div className="pt-11 flex justify-between h-full">
          <Sidebar drawerPos={drawerPos} onDrawerPosChange={setDrawerPos}/>  
          <div className={`
            px-5
           absolute right-0 bottom-3 top-20
            transition-all duration-500 ease-in-out ${drawerPos==2? "xl:w-[82%] lg:w-[7%]": drawerPos==1? "w-[90%]": "w-full"}`}>
        {children}
          </div>
        </div>
        </body>
    </html>
  );
}
