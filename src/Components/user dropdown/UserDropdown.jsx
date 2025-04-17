"use client";
import React, { useState, useEffect, useRef } from "react";
import EditProfilePopup from "../edit profile popup/EditProfilePopup";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function UserDropdown() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [editPopup, setEditPopup] = useState(false);
  const dropdownRef = useRef(null);

  const router = useRouter();

  const togglePopup = () => {
    setEditPopup(!editPopup);
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://127.0.0.1:8000/api/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data); // Adjust if your response format is different
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
        const token = localStorage.getItem("token");
        await axios.post("http://127.0.0.1:8000/api/logout", {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        localStorage.removeItem("token");
        router.push("/login");
      } catch (error) {
        console.error("Logout failed:", error);
        // Still remove token just in case
        localStorage.removeItem("token");
        router.push("/login");
      }
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitial = () => {
    if (!user || !user.name) return "?";
    return user.name.charAt(0).toUpperCase();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="w-8 h-8 rounded-full bg-blue-300 flex justify-center items-center text-xl font-semibold cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {getInitial()}
      </div>
      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow text-black z-50">
          <ul className="text-sm">
            <li className="px-4 py-2 border-b border-r-gray-200 hover:bg-gray-100 cursor-pointer">
                <div className="flex flex-col">
                   <p> {user.name}</p> 
                   <p className="text-gray-500">{user.email}</p>  
                </div>
            </li>
            <li
  onClick={togglePopup}
  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
>
  Edit Profile
</li>
            <li
              onClick={handleLogout}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              Logout
            </li>
          </ul>
        </div>
      )}
 <EditProfilePopup trigger={editPopup} onBlur={togglePopup} />
    </div>
  );
}
