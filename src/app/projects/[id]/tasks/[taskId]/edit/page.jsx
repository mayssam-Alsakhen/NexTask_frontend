'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AssignUsers from '@/Components/AssignUsers/AssignUsers';

const EditTaskPage = () => {
  const { id, taskId } = useParams();
  const router = useRouter();
  const [addedUserIds, setAddedUserIds] = useState([]);
  const [removedUserIds, setRemovedUserIds] = useState([]);
const [usersToAddToProject, setUsersToAddToProject] = useState([]);
  const [task, setTask] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    due_date: '',
    category: '',
    progress: 0,
    isImportant: '',
    assigned_users: [],
  });

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const taskData = res.data.task;
        setTask(taskData);
        setForm({
          title: taskData.title,
          description: taskData.description,
          due_date: taskData.due_date,
          category: taskData.category,
          progress: taskData.progress,
          isImportant: taskData.is_important,
          assigned_users: taskData.users.map((u) => u.id),
        });
      } catch (error) {
        console.error('Failed to fetch task', error);
      }
    };

    if (taskId) fetchTask();
  }, [taskId]);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task) return;
    try {
      const token = localStorage.getItem('token');
  
      // Step 1: Start with existing user IDs
      let updatedAssignedUserIds = task.users.map((user) => user.id);
  
      // Step 2: Remove the ones marked for removal
      updatedAssignedUserIds = updatedAssignedUserIds.filter(
        (userId) => !removedUserIds.includes(userId)
      );
  
      // Step 3: Add new users to the project if needed
      for (const user of usersToAddToProject) {
        await axios.post(
          `http://127.0.0.1:8000/api/projects/${id}/add-user`,
          { email: user.email },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
  
      // Step 4: Add users to task (including newly added to project)
      updatedAssignedUserIds = [...new Set([...updatedAssignedUserIds, ...addedUserIds])];
  
      // Step 5: Submit task update
      await axios.put(
        `http://127.0.0.1:8000/api/tasks/${taskId}`,
        {
          title: form.title,
          description: form.description,
          due_date: form.due_date,
          category: form.category,
          isImportant: form.isImportant,
          assigned_users: updatedAssignedUserIds,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Step 6: Submit progress update separately
    await axios.patch(
      `http://127.0.0.1:8000/api/tasks/${taskId}/progress`,
      {
        progress: Number(form.progress),
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  
      router.push(`/projects/${id}/tasks/${taskId}`);
    } catch (error) {
      console.error('Task update failed:', error);
    }
  };
  if (!task) {
    return <p className="p-4">Loading task...</p>; 
  }
   
  return ( 
    <div className=" mt-12 px-4 flex gap-6 text-prime">
      <form onSubmit={handleSubmit} className="w-2/3 space-y-4 h-[90vh] overflow-y-auto p-4 md:py-0 border-r md:border-gray-400">
      <h2 className="text-2xl font-bold">Edit Task</h2>
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full p-2 border" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border" />
        <input type="date" name="due_date" value={form.due_date} onChange={handleChange} className="w-full p-2 border" />
        <select name="category" value={form.category} onChange={handleChange} className="w-full p-2 border">
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Testing">Testing</option>
          <option value="Completed">Completed</option>
        </select>
        <input type="number" name="progress" value={form.progress} onChange={handleChange} min="0" max="100" className="w-full p-2 border" />
        <div className="flex gap-2">
  <label className="flex items-center gap-2">
    <input
      type="radio"
      name="isImportant"
      value="1"
      checked={form.isImportant === 1}
      onChange={(e) =>
        setForm((prev) => ({
          ...prev,
          isImportant: parseInt(e.target.value),
        }))
      }
    />
    Important
  </label>
  <label className="flex items-center gap-2">
    <input
      type="radio"
      name="isImportant"
      value="0"
      checked={form.isImportant === 0}
      onChange={(e) =>
        setForm((prev) => ({
          ...prev,
          isImportant: parseInt(e.target.value),
        }))
      }
    />
    Not Important
  </label>
</div>
        <button type="submit" className="bg-main text-white px-4 py-2 rounded">Update Task</button>
      </form>
      {/*  */}
      <div className="w-1/3 p-4">
 {/* here assign user component should be */}
 <AssignUsers
  task={task}
  projectId={id}
  removedUserIds={removedUserIds}
  setRemovedUserIds={setRemovedUserIds}
  addedUserIds={addedUserIds}
  setAddedUserIds={setAddedUserIds}
  usersToAddToProject={usersToAddToProject}
  setUsersToAddToProject={setUsersToAddToProject}
/>

</div>

    </div>
  );
};

export default EditTaskPage;
