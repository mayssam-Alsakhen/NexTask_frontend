import { useEffect, useState } from "react";
import axios from "axios";
import Popup from "../popup/Popup";
import { IoPersonAddOutline, IoPersonRemoveOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import LoaderSpinner from "../loader spinner/LoaderSpinner";

const ProjectUsersSection = ({ projectId }) => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [removeUser, setRemoveUser] = useState(null);
  const [addUser, setAddUser] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const fetchProjectUsers = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        const data = await res.json();
        setUsers(data.data.users || []);
        setTasks(data.data.tasks || []);
      } catch (err) {
        toast.error("Failed to fetch project data.");
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchProjectUsers();
  }, [projectId]);

  const handleSearchUsers = async (query) => {
    if (query.length < 2) {
      setMatchedUsers([]);
      return;
    }
    setSearching(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://127.0.0.1:8000/api/user/search",
        { email: query },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const payload = res.data;
      setMatchedUsers(
        payload.id ? [payload] : Array.isArray(payload) ? payload : []
      );
    } catch (err) {
      if (err.response?.status === 404) {
        setMatchedUsers([]);
      } else {
        toast.error(err.response?.data?.message||"Error searching for users.");
        setMatchedUsers([]);
      }
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearchUsers(searchQuery.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleAddUserToProject = async (email) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://127.0.0.1:8000/api/projects/${projectId}/add-user`,
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("User added successfully!");
      const newUser = matchedUsers.find(u => u.email === email);
      if (newUser) setUsers(prev => [...prev, newUser]);
      setMatchedUsers([]);
      setAddUser(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding user.");
    }
  };

  const handleRemoveUser = async () => {
    if (!removeUser) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://127.0.0.1:8000/api/projects/${projectId}/users/${removeUser}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("User removed!");
      setUsers(prev => prev.filter(u => u.id !== removeUser));
      setRemoveUser(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error removing user.");
    }
  };

  const handleSetAdmin = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://127.0.0.1:8000/api/projects/${projectId}/users/${id}/admin`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Granted admin privileges.");
      setUsers(prev => prev.map(u => u.id === id ? { ...u, pivot: { ...u.pivot, is_admin: 1 } } : u));
    } catch (err) {
      toast.error(err.response?.data?.message||"Error setting admin.");
    }
  };

  const handleSetMember = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://127.0.0.1:8000/api/projects/${projectId}/remove-admin/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Revoked admin privileges.");
      setUsers(prev => prev.map(u => u.id === id ? { ...u, pivot: { ...u.pivot, is_admin: 0 } } : u));
    } catch (err) {
      toast.error(err.response?.data?.message||"Error revoking admin.");
    }
  };

  const isCurrentUserAdmin = () => {
    const me = localStorage.getItem("user_id");
    const found = users.find(u => u.id == me);
    return found?.pivot?.is_admin === 1;
  };

  const isUserInProject = (id) => users.some(u => u.id === id);
  const getUserTaskCount = (id) => tasks.filter(t => t.users?.some(u => u.id === id)).length;

  if (loadingUsers) return <p>Loading users...</p>;

  return (
    <div className="mt-7 mb-2 ">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg">Team Members</h3>
        {isCurrentUserAdmin() && (
          <IoPersonAddOutline
            className="text-2xl cursor-pointer"
            onClick={() => setAddUser(true)}
          />
        )}
      </div>

      <div className="max-h-[220px] overflow-auto">
        <ul className="min-w-[700px] md:px-3">
          {users.length === 0 && <p>No users assigned.</p>}
          {users.map(u => (
            <li
              key={u.id}
              className="flex justify-between items-center border border-button mb-2 px-3 py-[0.5px] rounded-lg"
            >
              <div className="flex items-center gap-4 w-72">
                <div className="w-10 h-10 bg-testing rounded-full flex items-center justify-center">
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p>{u.name}</p>
                  <p className="text-sm text-gray-500">{u.email}</p>
                </div>
              </div>
              <span className="font-bold">
                {getUserTaskCount(u.id)} {getUserTaskCount(u.id) > 1 ? "tasks" : "task"}
              </span>
              <span
                onClick={() => {
                  isCurrentUserAdmin()? u.pivot?.is_admin ? handleSetMember(u.id) : handleSetAdmin(u.id) : null;
                }}
               className="bg-testing w-20 text-center px-2 py-1 rounded text-sm cursor-pointer hover:bg-main hover:text-white hover:font-bold transition-all duration-200">
                {u.pivot?.is_admin ? "Admin" : "Member"}
              </span>
              {isCurrentUserAdmin() && (
                <div className="flex gap-2">
                  <IoPersonRemoveOutline
                    className="cursor-pointer text-xl text-red-500"
                    onClick={() => setRemoveUser(u.id)}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <Popup trigger={removeUser !== null} onBlur={() => setRemoveUser(null)}>
        <div className="p-4">
          <p className="mb-4">Remove this user from the project?</p>
          <div className="flex justify-around">
            <button
              className="px-4 py-2 bg-gray-200 rounded"
              onClick={() => setRemoveUser(null)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded"
              onClick={handleRemoveUser}
            >
              Remove
            </button>
          </div>
        </div>
      </Popup>

      <Popup trigger={addUser} onBlur={() => setAddUser(false)}>
        <div className="p-4 flex flex-col items-center gap-4">
          <input
            type="email"
            placeholder="Type at least 2 letters of email..."
            className="w-[300px] p-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />

         {searching && (
          <LoaderSpinner child={'Searching…'}/>
)}


          {matchedUsers.length === 0 && !searching && searchQuery.length >= 2 && (
            <p className="text-gray-500">No users found</p>
          )}
          {matchedUsers.map(u => (
            <div
              key={u.id}
              className="w-[300px] p-2 bg-white border rounded mb-2 hover:bg-gray-50"
            >
              <p>{u.name}</p>
              <p className="text-sm text-gray-600">{u.email}</p>
              <button
                onClick={() => handleAddUserToProject(u.email)}
                disabled={isUserInProject(u.id)}
                className={`mt-2 w-full py-1 rounded ${
                  isUserInProject(u.id)
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-button text-white hover:bg-buttonHover"
                }`}
              >
                {isUserInProject(u.id) ? "Already in project" : "Add to project"}
              </button>
            </div>
          ))}
        </div>
      </Popup>
    </div>
  );
};

export default ProjectUsersSection;
