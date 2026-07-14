"use client";
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Popup from '@/Components/popup/Popup';
import LoaderSpinner from '@/Components/loader spinner/LoaderSpinner';
import { toast } from 'react-toastify';
import { FiTrash2 } from "react-icons/fi";
import { FiFileText, FiZap, FiCalendar, FiUsers } from "react-icons/fi";

export default function AddProject() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  const [assign, setAssign] = useState(false);
  const [searching, setSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState('');
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [generatedTasks, setGeneratedTasks] = useState([]);
  const [generatingTasks, setGeneratingTasks] = useState(false);
  const [creatingProject, setCreatingProject] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    user_id: '',
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
        "/api/user/search",
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
        toast.error(err.response?.data?.message || "Error searching for users.");
        setMatchedUsers([]);
      }
    }
    finally {
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

  const handleDeleteGeneratedTask = (index) => {
    setGeneratedTasks(prev => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateTasks = async () => {
    if (!formData.description.trim()) {
      toast.error("Please enter a project description first");
      return;
    }

    setGeneratingTasks(true);

    try {
      const response = await axios.post(
        "/api/ai/generate-project-tasks",
        {
          description: formData.description,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      setGeneratedTasks(response.data.tasks);
    } catch (error) {
      toast.error("Failed to generate tasks");
      console.log(error);
    } finally {
      setGeneratingTasks(false);
    }
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
    setCreatingProject(true);

    try {
      const response = await axios.post('/api/projects', updatedFormData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (response.data.status === 200) {

        const projectId = response.data.data.id;

        for (const task of generatedTasks) {

          await axios.post(
            "/api/tasks",
            {
              title: task.title,
              description: task.description,
              project_id: projectId,

              // same deadline as project, or null if open deadline
              due_date: formData.openDeadline ? null : formData.due_date,

              progress: 0,
              isImportant: false,
              assigned_users: []
            },
            {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
              }
            }
          );
        }


        setFormData({
          name: '',
          description: '',
          user_id: '',
          due_date: '',
          openDeadline: false
        });

        setGeneratedTasks([]);

        toast.success('Project added successfully');
        router.push('/projects');
      }
      else {
        console.log(response.data.error || 'An error occurred');
      }
    } catch (error) {
      toast.error('Error submitting the form');
    } finally {
      setCreatingProject(false);
    }
  };
  return (
  <div className='mt-12 px-4'>
    <div className='max-w-5xl mx-auto'>

      <div className='mb-8 text-center md:text-left'>
        <h2 className='text-2xl md:text-3xl font-bold text-center text-prime'>New Project</h2>
        {/* <p className='text-gray-500 mt-1'>Fill in the details below, then let AI break it into tasks.</p> */}
      </div>

      <form onSubmit={handleSubmit}>
        <div className='grid md:grid-cols-3 gap-6 items-start'>

          {/* LEFT: main content */}
          <div className='md:col-span-2 flex flex-col gap-6'>

            {/* Basics card */}
            <div className='bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col gap-4'>
              <div className='flex items-center gap-2 text-prime font-semibold'>
                <FiFileText /> Project Basics
              </div>
              <input
                type="text" name="name" onChange={handleInputChange}
                placeholder="Project Title"
                className='outline-none bg-transparent border border-gray-300 rounded-lg focus:border-prime focus:border-2 p-3 transition-all'
              />
              <textarea
                name="description" onChange={handleInputChange}
                placeholder='Description' rows={5}
                className='outline-none bg-transparent border border-gray-300 rounded-lg focus:border-prime focus:border-2 p-3 transition-all'
              />
            </div>

            {/* AI Tasks card */}
            <div className='bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col gap-4'>
              <div className='flex items-center gap-2 text-prime font-semibold'>
                <FiZap /> AI Task Breakdown
              </div>

              <button
                type="button"
                onClick={handleGenerateTasks}
                disabled={!formData.description.trim() || generatingTasks}
                className={`flex items-center justify-center gap-2 rounded-lg p-3 font-semibold border transition-all
  ${!formData.description.trim() || generatingTasks
    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
    : "bg-white text-prime border-prime hover:bg-prime/5"
  }`}
              >
                <FiZap size={16} />
                {generatingTasks ? "Generating..." : "Generate Tasks with AI"}
              </button>

              {generatedTasks.length > 0 && (
                <div className='flex flex-col gap-2 max-h-96 overflow-y-auto pr-1'>
                  {generatedTasks.map((task, index) => (
                    <div key={index} className='flex items-start gap-3 bg-gray-50 rounded-lg p-3'>
                      <div className='w-6 h-6 rounded-full bg-prime text-white text-xs flex items-center justify-center font-bold shrink-0 mt-0.5'>
                        {index + 1}
                      </div>
                      <div className='flex-1'>
                        <h4 className='font-semibold text-prime'>{task.title}</h4>
                        <p className='whitespace-pre-line text-sm text-gray-600 mt-1'>{task.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteGeneratedTask(index)}
                        className='text-red-400 hover:text-red-600 shrink-0'
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: sidebar */}
          <div className='md:col-span-1 flex flex-col gap-6'>

            {/* Schedule card */}
            <div className='bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col gap-3'>
              <div className='flex items-center gap-2 text-prime font-semibold'>
                <FiCalendar /> Schedule
              </div>
              <input
                type="date" name="due_date"
                value={formData.due_date}
                onChange={handleInputChange}
                disabled={formData.openDeadline}
                className='outline-none bg-transparent border border-gray-300 rounded-lg p-2.5 disabled:bg-gray-100 disabled:text-gray-400'
              />
              <label className='flex items-center gap-2 text-sm text-gray-600'>
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
                No due date
              </label>
            </div>

            {/* Team card */}
            <div className='bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col gap-3'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2 text-prime font-semibold'>
                  <FiUsers /> Team
                </div>
                <button
                  type="button"
                  onClick={() => setAssign(true)}
                  className='text-sm text-button hover:text-buttonHover font-medium'
                >
                  + Add
                </button>
              </div>

              {selectedUsers.length === 0 ? (
                <p className='text-sm text-gray-400'>No one assigned yet</p>
              ) : (
                <div className='flex flex-wrap gap-2'>
                  {selectedUsers.map((user) => (
                    <div key={user.id} className='flex items-center gap-2 bg-prime text-white px-3 py-1 rounded-full text-sm'>
                      <span>{user.name}</span>
                      <button onClick={() => handleRemoveUser(user.id)} className='text-xs opacity-80 hover:opacity-100'>✖</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={creatingProject}
              className='w-full bg-button text-white py-3 rounded-lg font-semibold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {creatingProject ? "Creating Project..." : "Add Project"}
            </button>
          </div>

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
        {searching && <LoaderSpinner child={'Searching…'} />}
        <div className='w-full p-2'>
          {matchedUsers.length === 0 && !searching && searchQuery.length >= 2 && (
            <p className="text-gray-500">No users found</p>
          )}
          {matchedUsers.map((user) => (
            <div key={user.id} className='w-full flex justify-between items-center gap-2 text-lg py-1 hover:bg-box p-2 rounded-lg'>
              <div className='flex items-center gap-2'>
                <div className='md:w-9 md:h-9 sm:w-7 sm:h-7 md:text-base sm:text-sm rounded-full bg-testing flex justify-center items-center font-semibold'>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <p>{user.name}</p>
              </div>
              <p onClick={() => handleSelectUser(user)} className='cursor-pointer hover:font-semibold text-button hover:text-buttonHover'>add</p>
            </div>
          ))}
        </div>
      </Popup>
    </div>
  </div>
);
}
