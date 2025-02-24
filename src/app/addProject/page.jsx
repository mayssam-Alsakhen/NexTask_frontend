"use client";
import React from 'react'
import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Popup from '@/Components/popup/Popup';

export default function AddProject () {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  const [assign, setAssign] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    user_id:'',  
  });
  
  const handleSearchUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to search users.");
      return;
    }  
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/user/search", 
        { email: searchQuery }, // Sending the searchQuery as email to the API
        {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        }
      );
  
      console.log("Response Data search:", response.data);
      
      
      if (response.data && response.data.id) {
        setMatchedUsers([response.data]);  
      } else {
        setMatchedUsers(response.data || []); 
      }
  
    } catch (error) {
      alert("Error searching users. Please check your API.");
    }
  };

  const handleSelectUser = (user) => {
    if (!selectedUsers.some((u) => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]); // Add user
    }
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id !== userId)); // Remove user
  };
  

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login"); // Redirect only after checking authentication
    }
  }, [loading, user, router]);

  if (loading) return <p>Loading...</p>;
  if (!user) return null; // Prevent rendering before redirection
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,  
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const user_id = localStorage.getItem("user_id");
  
    if (!user_id) {
      alert('You must be logged in to add a project.');
      return;
    }
  
    const updatedFormData = {
      ...formData,
      user_id: user_id,
      assigned_users: selectedUsers.map(user => user.id),
    };
  
    try {
      console.log("Sending data:", updatedFormData);
      const response = await axios.post('http://127.0.0.1:8000/api/projects', updatedFormData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      });
  
      console.log("Response from backend:", response);  // Log the entire response
  
      // Check if response is successful
      if (response.data.status === 200) {
        setFormData({ title: '', description: '', user_id: user_id });
        alert('Project added successfully');
        // Redirect to the projects page using router.push
        router.push('/projects');
      } else {
        console.error("Error:", response.data.error || 'An error occurred');
        alert(response.data.error || 'An error occurred');
      }
    } catch (error) {
      console.error("Error during the API request:", error);  // Log the error details
      alert('Error submitting the form');
    }
  };
  
  return (
    <div className='w-full h-full overflow-y-auto bg-secondDark p-10 border-2 border-designing rounded-lg'>
    <div className=' w-full h-full flex justify-center items-center'>
       <div className="w-[420px] sm:h-[370px] md:h-[450px] py-8 px-12 bg-slate-600 bg-opacity-40 text-prime ">
        <h2 className='text-second sm:text-lg md:text-2xl text-center font-bold mb-4'>Add Your Project Details</h2>
    <form onSubmit={handleSubmit} className='h-full'>
      <div className='h-full flex flex-col gap-3'>
      <input type="text" name="name" onChange={handleInputChange} placeholder="Project Title" className=' outline-none p-2 bg-slate-600 text-white'/>
      <textarea name="description" onChange={handleInputChange} placeholder='description' rows={5} className=' p-2 outline-none bg-slate-600 text-white'></textarea>
    <p className='font-bold hover:underline cursor-pointer w-fit text-second' onClick={() => setAssign(true)}>Assign a user</p>
      {/* Selected Users Display */}
  <div className="flex flex-wrap gap-2 mb-2 h-14 overflow-auto">
    {selectedUsers.map((user) => (
      <div key={user.id} className="flex items-center bg-secondDark text-white h-fit px-3 py-1 rounded-full">
        <span>{user.name}</span>
        <button onClick={() => handleRemoveUser(user.id)} className="ml-2 text-sm">✖</button>
      </div>
    ))}
  </div>
      <button type="submit" className='shadow-button hover:shadow-hoverButton hover:font-extrabold bg-second py-2 rounded-lg'>ADD</button>
      </div>
    </form>
    <Popup trigger={assign} onBlur={() => setAssign(false)}>
      <div className='w-full flex justify-center gap-5 my-4'>
        <input type="email" placeholder='search user by email' 
        className=' outline-none p-2 border-b-2 border-prime focus:border-designing '
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button 
        className='font-bold hover:text-designing hover:shadow-lg bg-prime text-second self-end px-6 py-1 rounded-lg'
        onClick={handleSearchUsers}
        >Search</button>
      </div>
      <div className='w-full p-2'>
  {matchedUsers.length > 0 ? (
    matchedUsers.map((user) => (
      <div key={user.id} className='w-full flex items-center gap-2 text-lg py-1 cursor-pointer hover:bg-second p-2 rounded-lg' onClick={() => handleSelectUser(user)}>
        <div className='md:w-9 md:h-9 sm:w-7 sm:h-7 md:text-base sm:text-sm rounded-full bg-blue-300 flex justify-center items-center font-semibold'>
          {user.name.charAt(0).toUpperCase()}
        </div>
        <p>{user.name}</p>
      </div>
    ))
  ) : (
    <p className='text-center text-gray-400'>No users found</p>
  )}
</div>
    </Popup>
  </div>
    </div>
    </div>
  )
}
