'use client'
import React from 'react'
import { useState , useEffect} from 'react'
import axios from 'axios'

export default function page() {
    const [formData, setFormData]     = useState({
        title: task.title,
        description: task.description,
        due_date: task.due_date,
        category: task.category,
        isImportant: task.is_important ? '1' : '0'
      });

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const payload = {
          ...formData,
          assigned_users: selectedUsers.map(u => u.id)
        };
        try {
          const res = await axios.put(
            `http://127.0.0.1:8000/api/tasks/${task.id}`,
            payload,
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );
          const t = res.data.task;
          // ensure users exist
          if (!t.users) t.users = selectedUsers;
          updateTask(t);
          onClose();
        } catch (err) {
          setErrorMessage(
            err.response?.status === 403
              ? 'You must be an admin to edit this task.'
              : 'Failed to update the task.'
          );
        }
      };
    
  return (
    <div className='text-baseText mt-12 px-6'>
        page

        <form onSubmit={handleEditSubmit} className="flex flex-col gap-4 mt-4 text-baseText">
          {/* {errorMessage && <p className="text-red-500">{errorMessage}</p>} */}
          <input
            type="text"
            value={formData.title}
            onChange={e=>setFormData({...formData,title:e.target.value})}
            className="p-2 border-b-2 outline-none"
            placeholder="Title"
          />
          <input
            type="date"
            value={formData.due_date}
            onChange={e=>setFormData({...formData,due_date:e.target.value})}
            className="p-2 border-b-2 outline-none"
          />
          <textarea
            value={formData.description}
            onChange={e=>setFormData({...formData,description:e.target.value})}
            className="p-2 border-b-2 outline-none"
            placeholder="Description"
          />
          <select
            value={formData.category}
            onChange={e=>setFormData({...formData,category:e.target.value})}
            className="p-2 border-b-2 outline-none"
          >
            <option value="">Select category</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Test">Test</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Assigned Users Chips */}
          <div>
            <h4 className="font-semibold">Assigned Users:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map(u=>(
                <div
                  key={u.id}
                  className="bg-gray-200 text-sm px-3 py-1 rounded-full flex items-center gap-2"
                >
                  {u.name}
                  <button type="button" onClick={()=>handleRemoveUser(u.id)}>✖</button>
                </div>
              ))}
            </div>
            <p
              className="text-blue-600 font-semibold cursor-pointer hover:underline w-fit"
              onClick={()=>setAssignUser(true)}
            >
              + Assign User
            </p>
          </div>

          {/* Save/Cancel */}
          <div className="flex justify-end gap-4 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              Save
            </button>
          </div>
        </form>

    </div>
  )
}

