"use client";
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Popup from '@/Components/popup/Popup';
import LoaderSpinner from '@/Components/loader spinner/LoaderSpinner';
import { toast } from 'react-toastify';

export default function AddProject () {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  const [assign, setAssign] = useState(false);
  const [searching, setSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState('');
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    user_id:'',  
    due_date: '',
    openDeadline: false,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login"); 
    }
  }, [loading, user, router]);

  const handleSearchUsers = async (query) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to search users.");
      return;
    }  

    if (query.length < 2) {
      setMatchedUsers([]);
      return;
    }
    setSearching(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/user/search", 
        { email: query },
        {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        }
      );
      if (response.data && response.data.id) {
        setMatchedUsers([response.data]);  
      } else {
        setMatchedUsers(response.data || []); 
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setMatchedUsers([]);
      } else {
        toast.error(err.response?.data?.message||"Error searching for users.");
        setMatchedUsers([]);
      }
    }
    finally{
      setSearching(false)
    }
  };

  const handleSelectUser = (user) => {
    if (!selectedUsers.some((u) => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearchUsers(searchQuery.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id !== userId));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
      toast.error('You must be logged in to add a project.');
      return;
    }

    const updatedFormData = {
      ...formData,
      user_id: user_id,
      due_date: formData.openDeadline ? null : formData.due_date,
      assigned_users: selectedUsers.map(user => user.id),
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/projects', updatedFormData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (response.data.status === 200) {
        setFormData({ name: '', description: '', user_id: '', due_date: '', openDeadline: false });
        toast.success('Project added successfully');
        router.push('/projects');
      } else {
        console.log(response.data.error || 'An error occurred');
      }
    } catch (error) {
      toast.error('Error submitting the form');
    }
  };

  return ( 
    <div className='mt-12 text-prime'>
        <h2 className='sm:text-lg md:text-2xl text-center font-bold mb-4 sm:mt-6 md:mt-0'>Project Details</h2>
        <form onSubmit={handleSubmit} className='w-full md:w-[600px] mx-auto'>
          <div className='h-full flex flex-col gap-4 text-prime'>
            <input type="text" name="name" onChange={handleInputChange} placeholder="Project Title" className='outline-none bg-transparent border border-main rounded focus:border-2 p-2 transition-all'/>
            <textarea name="description" onChange={handleInputChange} placeholder='Description' rows={5} className='outline-none bg-transparent border border-main rounded focus:border-2 p-2 transition-al'></textarea>
            {/* Due Date Section */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={formData.openDeadline}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      openDeadline: e.target.checked,
                      due_date: e.target.checked ? '' : prev.due_date,
                    }))
                  }
                />
                No due date (Open deadline)
              </label>

              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleInputChange}
                disabled={formData.openDeadline}
                className="outline-none bg-transparent border border-main rounded focus:border-2 p-2 transition-al disabled:bg-gray-200"
              />
            </div>

            <p className='hover:font-bold underline cursor-pointer w-fit' onClick={() => setAssign(true)}>Assign a user</p>

            {/* Selected Users Display */}
            <div className="flex flex-wrap gap-2 mb-2 h-14 overflow-auto">
              {selectedUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between bg-prime text-white h-fit px-3 py-1 rounded-full">
                  <span>{user.name}</span>
                  <button onClick={() => handleRemoveUser(user.id)} className="ml-2 text-sm">✖</button>
                </div>
              ))}
            </div>

            <button type="submit" className=' bg-button text-white hover:bg-buttonHover hover:shadow-button hover:font-extrabold py-2 rounded-lg transition-all'>ADD</button>
          </div>
        </form>

        {/* Popup for user search */}
        <Popup trigger={assign} onBlur={() => setAssign(false)}>
          <div className='w-full flex justify-center gap-5 my-4'>
            <input
              type="email"
              placeholder='Search user by email' 
              className='outline-none p-2 border-b-2 border-prime focus:border-designing'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
             {searching && (
                      <LoaderSpinner child={'Searching…'}/>
            )}
          <div className='w-full p-2'>
          {matchedUsers.length === 0 && !searching && searchQuery.length >= 2 && (
            <p className="text-gray-500">No users found</p>
          )}
            { (
              matchedUsers.map((user) => (
                <div key={user.id} className='w-full flex justify-between items-center gap-2 text-lg py-1 hover:bg-box p-2 rounded-lg'>
                  <div className='flex items-center gap-2'>
                  <div className='md:w-9 md:h-9 sm:w-7 sm:h-7 md:text-base sm:text-sm rounded-full bg-testing flex justify-center items-center font-semibold'>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <p>{user.name}</p>
                  </div>
                  <p onClick={() => handleSelectUser(user)} className=' cursor-pointer hover:font-semibold text-button hover:text-buttonHover'>add</p>
                </div>
              ))
            )}
          </div>
        </Popup>
    </div>
  );
}
