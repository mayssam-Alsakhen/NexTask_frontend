'use client';
import { useState } from 'react';
import axios from 'axios';

const AssignUsers = ({
  task,
  btnlabel,
  removedUserIds,
  setRemovedUserIds,
  addedUserIds,
  setAddedUserIds,
  usersToAddToProject,
  setUsersToAddToProject
}) => {
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [projectUsers, setProjectUsers] = useState(task.project?.users || []);
  const assignedUserIds = task.users.map((u) => u.id) || [];

  if (!task) {
    return <div>Loading task data...</div>;
  }

  const handleRemove = (userId) => {
    if (!removedUserIds.includes(userId)) {
      setRemovedUserIds([...removedUserIds, userId]);
      setAddedUserIds(addedUserIds.filter((id) => id !== userId));
    }
  };

  const handleAdd = (userId) => {
    if (!addedUserIds.includes(userId)) {
      setAddedUserIds([...addedUserIds, userId]);
      setRemovedUserIds(removedUserIds.filter((id) => id !== userId));
    }
  };

  const handleAddToProjectAndTask = async (user) => {
    if (!usersToAddToProject.find((u) => u.id === user.id)) {
      try {
        // Update state manually
        setUsersToAddToProject((prev) => [...prev, user]);
        setAddedUserIds((prev) => [...prev, user.id]);
        setProjectUsers((prev) => [...prev, user]);
      } catch (error) {
        console.error('Error adding user to project:', error);
      }
    }
  };

  const handleSearch = async () => {
    if (!searchEmail) return;
    try {
      const res = await axios.post(
        'http://127.0.0.1:8000/api/user/search',
        { email: searchEmail },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setSearchResults(Array.isArray(res.data) ? res.data : res.data ? [res.data] : []);
    } catch (error) {
      console.error('Search failed', error);
    }
  };

  return (
    <div>
      <h3 className="font-semibold mb-2">Assigned Users</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {task.users.map((user) =>
          !removedUserIds.includes(user.id) && (
            <span key={user.id} className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-2">
              {user.name}
              <button onClick={() => handleRemove(user.id)} className="text-red-500">×</button>
            </span>
          )
        )}
      </div>

      <input
        type="text"
        placeholder="Search user by email"
        value={searchEmail}
        onChange={(e) => setSearchEmail(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        className="border p-2 w-full mb-2"
      />
      <button type='button' onClick={handleSearch} className="bg-gray-800 text-white px-4 py-1 mb-4 rounded">
        Search
      </button>

      {searchResults.map((user) => {
        const isInProject = projectUsers.some((u) => u.id === user.id);
        const isAssigned = assignedUserIds.includes(user.id) && !removedUserIds.includes(user.id);
        const isToBeAssigned = addedUserIds.includes(user.id);

        let buttonLabel = '';
        let onClickAction = null;

        if (!isInProject && !isAssigned && !isToBeAssigned) {
          buttonLabel = btnlabel ||'Add to Project & Assign' ;
          onClickAction = () => handleAddToProjectAndTask(user);
        } else if (isAssigned) {
          buttonLabel = 'Unassign';
          onClickAction = () => handleRemove(user.id);
        } else if (isInProject && isToBeAssigned) {
          buttonLabel = 'Cancel Add';
          onClickAction = () => setAddedUserIds(addedUserIds.filter((id) => id !== user.id));
        } else {
          buttonLabel = 'Assign to Task';
          onClickAction = () => handleAdd(user.id);
        }

        return (
          <div key={user.id} className="flex justify-between items-center border p-2 mb-1 rounded">
            <div>{user.name} ({user.email})</div>
            <button type='button' onClick={onClickAction} className="text-sm bg-blue-600 text-white px-2 py-1 rounded">
              {buttonLabel}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default AssignUsers;
