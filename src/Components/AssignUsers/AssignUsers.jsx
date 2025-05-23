'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoaderSpinner from '../loader spinner/LoaderSpinner';

const AssignUsers = ({
  task,
  btnlabel,
  removedUserIds,
  setRemovedUserIds,
  addedUserIds,
  setAddedUserIds,
  usersToAddToProject,
  setUsersToAddToProject,
  input,
  userContainer
}) => {
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [projectUsers, setProjectUsers] = useState(task.project?.users || []);
  const assignedUserIds = task.users.map((u) => u.id) || [];
  const [searching , setSearching] = useState(false);

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
        toast.error('Error adding user to project');
      }
    }
  };

  const handleSearch = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
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
    } catch (err) {
      if (err.response?.status === 404) {
              setSearchResults([]);
            } else {
              toast.error(err.response?.data?.message||"Error searching for users.");
              setSearchResults([]);
            }
    }
    finally{
      setSearching(false);
    }
  };

  useEffect(() => {
      const timer = setTimeout(() => {
        handleSearch(searchEmail.trim());
      }, 400);
      return () => clearTimeout(timer);
    }, [searchEmail]);
  

  return (
    <div>
      <h3 className="font-semibold mb-2">Assign Users</h3>
      <div className={`${userContainer} flex flex-wrap gap-2 mb-6`}>
        {task.users.map((user) =>
          !removedUserIds.includes(user.id) && (
            <span key={user.id} className="bg-box px-3 py-1 rounded-full flex items-center gap-2 mt-4">
              {user.name}
              <button onClick={() => handleRemove(user.id)} className="text-red-500">×</button>
            </span>
          )
        )}
      </div>

          <input
            type="text"
            placeholder="Type at least 2 letters of email..."
            className={`w-full bg-transparent ${input} p-2 border-b-2 border-testing focus:border-buttonHover outline-none`}
            value={searchEmail}
            onChange={e => setSearchEmail(e.target.value)}
          />

          {searching && (
                <LoaderSpinner child={'Searching…'}/>
      )}
      
                {searchResults.length === 0 && !searching && searchEmail.length >= 2 && (
                  <p className="text-gray-500">No users found</p>
                )}

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
          <div key={user.id} className="flex justify-between items-center border border-testing p-2 my-2 rounded">
            <div>{user.name} ({user.email})</div>
            <button type='button' onClick={onClickAction} className="text-sm bg-button hover:bg-buttonHover text-white px-2 py-1 rounded">
              {buttonLabel}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default AssignUsers;
