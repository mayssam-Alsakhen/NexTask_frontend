'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { checkIfUserIsAdmin } from '@/Components/utils/checkAdmin';
import axios from 'axios';

const TaskPage = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

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
  if (error) return <p>{error}</p>;
  if (!task || !project) return <p>Task or Project not found.</p>;

  return (
    <div className="mt-12 px-6 text-baseText">
      {isAdmin && (
        <div>
          <button onClick={handleEditClick}>Edit</button>
          <button>Delete</button>
        </div>
      )}
      <h1 className="text-2xl font-bold mb-2">{task.title}</h1>
      <p className="text-gray-600">{task.description}</p>
      <p className="mt-2">Due: {task.due_date}</p>
      <p>Status: {task.category}</p>
      <p>Progress: {task.progress}%</p>

      <div className="mt-4">
        <h2 className="text-xl font-semibold">Project: {project.name}</h2>
        <p className="text-gray-500">Project created by: {project.users[0]?.name}</p>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold">Assigned Users:</h3>
        <ul>
          {task.users.map(user => (
            <li key={user.id}>{user.name} ({user.email})</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TaskPage;
