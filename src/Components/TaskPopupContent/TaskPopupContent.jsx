'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Popup from '../popup/Popup';
import CommentsSection from '../CommentsSection/CommentsSection';

export default function TaskPopupContent({ task, onClose, updateTask }) {
  const [isAdmin, setIsAdmin]       = useState(false);
  const [assignUser, setAssignUser] = useState(false);
  const [activeTab, setActiveTab]   = useState('details');
  const [formData, setFormData]     = useState({
    title: task.title,
    description: task.description,
    due_date: task.due_date,
    category: task.category,
    isImportant: task.is_important ? '1' : '0'
  });
  const [selectedUsers, setSelectedUsers] = useState(task.users || []);
  const [errorMessage, setErrorMessage]   = useState('');
  const [searchQuery, setSearchQuery]     = useState('');
  const [matchedUsers, setMatchedUsers]   = useState([]);

  // Admin check
  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/projects/${task.project_id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => {
      const me = res.data.data.users.find(u => u.id == localStorage.getItem('user_id'));
      if (me?.pivot?.is_admin === 1) setIsAdmin(true);
    })
    .catch(console.error);
  }, [task]);

  // Reset when task changes
  useEffect(() => {
    setFormData({
      title: task.title,
      description: task.description,
      due_date: task.due_date,
      category: task.category,
      isImportant: task.is_important ? '1' : '0'
    });
    setSelectedUsers(task.users || []);
  }, [task]);

  const handleSearchUsers = async () => {
    try {
      const { data } = await axios.post(
        'http://127.0.0.1:8000/api/user/search',
        { email: searchQuery },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setMatchedUsers(Array.isArray(data) ? data : [data]);
    } catch (e) { console.error(e); }
  };

  const handleSelectUser = (u) => {
    if (!selectedUsers.some(x => x.id === u.id)) {
      const upd = [...selectedUsers, u];
      setSelectedUsers(upd);
    }
    setAssignUser(false);
  };

  const handleRemoveUser = (id) => {
    setSelectedUsers(selectedUsers.filter(u => u.id !== id));
  };

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
    <div className="w-full">
      {/* Tabs */}
      <div className="flex justify-center gap-6 mb-6 text-gray-500 font-semibold">
        <span
          className={`cursor-pointer hover:text-blue-600 ${activeTab==='details'?'text-blue-600':''}`}
          onClick={()=>setActiveTab('details')}
        >
          Details
        </span>
        <span
          className={`cursor-pointer hover:text-blue-600 ${activeTab==='comments'?'text-blue-600':''}`}
          onClick={()=>setActiveTab('comments')}
        >
          Comments
        </span>
        {isAdmin && (
          <span
            className={`cursor-pointer hover:text-blue-600 ${activeTab==='edit'?'text-blue-600':''}`}
            onClick={()=>setActiveTab('edit')}
          >
            Edit
          </span>
        )}
      </div>

      {/* Details */}
      {activeTab==='details' && (
        <div className="space-y-2 text-baseText">
          <h2 className="text-lg font-bold">{task.title}</h2>
          <p>{task.description}</p>
          <p className="text-sm text-gray-500">Due: {task.due_date}</p>
          <p className="text-sm text-gray-500">Category: {task.category}</p>
          {task.is_important && <p className="text-red-600 font-semibold">Important</p>}
          <h4 className="mt-4 font-semibold">Assigned Users</h4>
          {selectedUsers.length
            ? <ul className="list-disc ml-5">
                {selectedUsers.map(u => (
                  <li key={u.id}>{u.name} ({u.email})</li>
                ))}
              </ul>
            : <p className="text-gray-400">No users assigned</p>
          }
        </div>
      )}

      {/* Comments */}
      {activeTab==='comments' && <CommentsSection taskId={task.id}/>}

      {/* Edit Form */}
      {activeTab==='edit' && isAdmin && (
        <form onSubmit={handleEditSubmit} className="flex flex-col gap-4 mt-4 text-baseText">
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
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
      )}

      {/* Assign User Popup */}
      <Popup trigger={assignUser} onBlur={()=>setAssignUser(false)}>
        <div className="w-full flex justify-center gap-5 my-4 text-baseText">
          <input
            type="email"
            placeholder="search user by email"
            className="outline-none p-2 border-b-2 border-prime focus:border-designing"
            value={searchQuery}
            onChange={e=>setSearchQuery(e.target.value)}
          />
          <button
            className="font-bold hover:text-designing hover:shadow-lg bg-prime text-second self-end px-6 py-1 rounded-lg"
            onClick={handleSearchUsers}
          >
            Search
          </button>
        </div>
        <div className="w-full p-2">
          {matchedUsers.length
            ? matchedUsers.map(u=>(
                <div
                  key={u.id}
                  className="w-full flex items-center gap-2 text-lg py-1 cursor-pointer hover:bg-second p-2 rounded-lg"
                  onClick={()=>handleSelectUser(u)}
                >
                  <div className="md:w-9 md:h-9 sm:w-7 sm:h-7 md:text-base sm:text-sm rounded-full bg-blue-300 flex justify-center items-center font-semibold">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <p>{u.name}</p>
                </div>
              ))
            : <p className="text-center text-gray-400">No users found</p>
          }
        </div>
      </Popup>
    </div>
  );
}
