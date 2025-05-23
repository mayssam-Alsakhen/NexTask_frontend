'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { FaRegComment } from "react-icons/fa6";
import { FaArrowRightLong } from "react-icons/fa6";
import HalfPieChart from '@/Components/utils/HalfPieChart';
import { checkIfUserIsAdmin } from '@/Components/utils/checkAdmin';
import axios from 'axios';
import CommentsSection from '@/Components/CommentsSection/CommentsSection';
import Popup from '@/Components/popup/Popup';
import { toast } from 'react-toastify';

const TaskPage = () => {
  const { id, taskId } = useParams();
  const [task, setTask] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [Delete, setDelete] = useState(false)
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [comments, setComments] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const taskData = response.data.task;
        const projectData = response.data.project;
  
        setTask(taskData);
        setProject(projectData);
  
        // Check if user is admin after fetching project
        const adminStatus = await checkIfUserIsAdmin(projectData.id);
        setIsAdmin(adminStatus);
      } catch (err) {
        setError('Error fetching data.');
        console.error(err);
      } finally {
        setLoading(false); // Finish loading everything
      }
    };
  
    if (taskId) fetchTask();
  }, [taskId]);

  const handleEditClick = () => {
    router.push(`/projects/${project.id}/tasks/${taskId}/edit`);
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-baseText">Loading task details...</p>
      </div>
    );
  } 

  const handleTaskDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/tasks/${task.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success('Task deleted successfully!')
    }catch(err){
      console.error("Error updating task:", error);
    } 
  }


  if (error) return <p>{error}</p>;
  if (!task || !project) return <p>Task or Project not found.</p>;

  return (
    <div className="mt-8 md:mt-12 gap-6 text-baseText flex">
      <div className={`md:w-2/3 w-full md:border-r border-gray-400 md:px-4 px-2 sm:py-2 md:py-0 h-[90vh] overflow-y-auto md:block sm:${comments?'hidden':'block'}`}>
      <div className='flex justify-between items-center my-1 md:my-0'>
        {task.is_important? (<span className='font-semibold text-red-500 text-xs'>High Priority</span>): <div></div>}
      {isAdmin && (
        <div className="flex justify-end gap-3">
          <button onClick={handleEditClick} className="flex items-center gap-1 px-1 md:py-1 md:px-3 text-sm text-button border border-button rounded hover:bg-button hover:text-white transition"
          > <FaEdit /></button>
          <button className="flex items-center gap-1 px-1 md:py-1 md:px-3 text-sm text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-white transition"
          onClick={()=>setDelete(true)}
          > <MdDelete /></button>
        </div>
      )}
      </div>
      <div className='flex justify-between items-center md:mb-3 mb-5 '>
      <div className='flex items-center gap-1'>
      <h1 className="md:text-2xl text-lg font-bold text-button">{task.title}</h1>
      <span className={`${task.category=='Completed'?'bg-done':task.category=='In Progress'?'bg-progress':task.category=='Pending'?'bg-pending':'bg-testing'} text-baseText rounded-full md:text-sm text-xs px-2 md:px-3 py-[0.5px]`}>{task.category}</span>
        </div>
        <p className="text-gray-500 " onClick={()=>router.push(`/projects/${project.id}`)}>{project.name}</p>
      </div>
      <div className="flex justify-between flex-wrap items-end my-5 border-b border-gray-300 p-2 md:mx-4 text-xs md:text-base">
      <p className="md:mt-2 text-gray-500">Due Date: {task.due_date}</p>
      <div className="w-full md:w-56 mt-5 md:mt-0 "><HalfPieChart value={task.progress}/></div>
      </div>
      <p className="text-gray-600 min-h-20">{task.description}</p>
      <div className="mt-4">
        <h3 className="font-semibold text-lg">Assigned Users:</h3>
        {task.users.length > 0 ? (
           <ul className='flex flex-wrap gap-4 overflow-y-auto'>
           {task.users.map(user => (
             <li key={user.id} className='my-1 px-3 py-1 flex flex-col bg-main text-gray-100 rounded-full text-sm'>{user.name} <span className=' text-xs text-gray-200 mt-[-3px]'>{user.email}</span></li>
           ))}
         </ul>
        ):<p className="text-gray-500 text-sm text-center mt-5">No users assigned to this task yet.</p>}
       
      </div>
      </div>
      <div className={`w-full md:w-1/3 p-4 h-[93vh] overflow-y-auto md:translate-x-0 bg-[#f1f6ff] ${comments?'sm:translate-x-0' : 'sm:translate-x-full'} right-0 bottom-0 fixed transition-transform duration-300 ease-in-out`}>
        <CommentsSection taskId={taskId} />
      </div>
        <button className='fixed bottom-2 right-2 z-50 text-2xl bg-main text-white rounded-full p-2 md:hidden' onClick={()=>setComments(!comments)}>{comments? <FaArrowRightLong /> :<FaRegComment/>} </button>

          {/* Delete confirmation popup */}
                <Popup trigger={Delete} onBlur={() => setDelete(false)}>
                  <div className="text-prime text-xl font-bold p-4">
                    <p>Are you sure you want to delete this Task</p>
                    <div className="flex justify-center gap-16 mt-10">
                      <button
                        onClick={() => setDel(false)}
                        className="w-20 bg-second rounded-lg hover:shadow-lg"
                      >
                        No
                      </button>
                      <button
                        onClick={()=>{handleTaskDelete(), router.push(`/projects/${id}`)}}
                        className="w-20 bg-second rounded-lg hover:shadow-lg"
                      >
                        Yes
                      </button>
                    </div>
                  </div>
                </Popup>
    </div>
  );
};

export default TaskPage;
