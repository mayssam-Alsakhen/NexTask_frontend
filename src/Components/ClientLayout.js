"use client";

// import Sidebar from "@/Components/sidebar/Sidebar";
// import Navbar from "@/Components/Navbar/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import React, { useState, Suspense, lazy } from "react";

const Sidebar = lazy(() => import("@/Components/sidebar/Sidebar"));
const Navbar = lazy(() => import("@/Components/Navbar/Navbar"));


export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const [drawerPos, setDrawerPos] = useState(0);

  const handleDrawerPosChange = () => {
    setDrawerPos(drawerPos === 2 ? 0 : drawerPos + 1);
  };

  return (
    <AuthProvider>
      <div className="flex justify-between h-full">
        {(pathname !== "/login" && pathname !== "/") && (
          <Suspense fallback={<div>Loading Navbar...</div>}>
          <Navbar handleDrawer={handleDrawerPosChange} />
        </Suspense>
        )}
         <Suspense fallback={<div>Loading Sidebar...</div>}>
            {/* <Sidebar drawerPos={drawerPos} onDrawerPosChange={setDrawerPos} /> */}
          </Suspense>
        <div
          className={`transition-all duration-500 ease-in-out ${
            drawerPos === 2
              ? "xl:w-[82%] lg:w-[7%]"
              : drawerPos === 1
              ? "w-[95%]"
              : "w-full"
          }`}
        >
          {children}
        </div>
      </div>
    </AuthProvider>
  );
}
