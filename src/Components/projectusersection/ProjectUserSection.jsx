import { useEffect, useState, } from "react";
import axios from "axios";
import Popup from "../popup/Popup";
import { LiaEdit } from "react-icons/lia";
import { IoPersonAddOutline } from "react-icons/io5";
import { IoPersonRemoveOutline } from "react-icons/io5";

const ProjectUsersSection = ({ projectId }) => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [removeUser, setRemoveUser] = useState(null);
  const [addUser, setAddUser] = useState(false);
  const [userDots, setUserDots] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProjectUsers = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/projects/${projectId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await response.json();
        setUsers(data.data.users || []);
        setTasks(data.data.tasks || []);
      } catch (error) {
        console.error("Error fetching project users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectUsers();
  }, [projectId]);

  const handleSearchUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to search users.");
      return;
    }
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/user/search",
        { email: searchQuery },
        {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        }
      );

      console.log("Response Data search:", response.data);


      if (response.data && response.data.id) {
        setMatchedUsers([response.data]);
      } else {
        setMatchedUsers(response.data || []);
      }

    } catch (error) {
      console.error("API error:", error.response ? error.response.data : error.message);
      alert(error.response?.data?.message || "Error searching users. Please check your API.");
    }
  };

  const handleAddUserToProject = async (userEmail) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to add users.");
      return;
    }
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/projects/${projectId}/add-user`,
        { email: userEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("User added successfully!");
      setUsers([...users, matchedUsers.find(user => user.email === userEmail)]);
      setMatchedUsers([]); // Clear search results after adding
      setAddUser(false); // Close popup
    } catch (error) {
      console.error("API error:", error.response ? error.response.data : error.message);
      alert(error.response?.data?.message || "Error adding user. Please try again.");
    }
  };
  // Function to check if the current user is an admin
  const isCurrentUserAdmin = () => {
    const currentUserId = localStorage.getItem("user_id");
    const currentUserInProject = users.find(user => user.id == currentUserId);
    return currentUserInProject?.pivot?.is_admin === 1;
  };

  const handleRemoveUser = async () => {
    if (!removeUser) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://127.0.0.1:8000/api/projects/${projectId}/users/${removeUser}`, {
        headers: { Authorization: `Bearer ${token}` },
      });


      alert("User removed successfully!");
      setUsers(prevUsers => prevUsers.filter(user => user.id !== removeUser));
      setRemoveUser(null);
    } catch (error) {
      console.error("Error removing user:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Error removing user.");
    }
  };

  const handleSetAdmin = async (userId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in.");
      return;
    }
    try {
      await axios.put(`http://127.0.0.1:8000/api/projects/${projectId}/users/${userId}/admin`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserDots(null);
      alert("User is now an admin!");
      setUsers(users.map(user => user.id === userId ? { ...user, pivot: { ...user.pivot, is_admin: 1 } } : user));
    } catch (error) {
      console.error("Error setting admin:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Error setting user as admin.");
    }
  };

  const handleSetMember = async (userId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in.");
      return;
    }
    try {
      await axios.put(`http://127.0.0.1:8000/api/projects/${projectId}/remove-admin/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserDots(null);
      alert("User is now a member!");
      setUsers(users.map(user => user.id === userId ? { ...user, pivot: { ...user.pivot, is_admin: 0 } } : user));
    } catch (error) {
      console.error("Error setting member:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Error setting user as member.");
    }
  };
  if (loading) return <p>Loading users...</p>;

  const getUserTaskCount = (userId) => {
    return tasks.filter(task => task.users?.some(u => u.id === userId)).length;
  };
  return (
    <div className="mt-7">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg ">Team Members</h3>
        {isCurrentUserAdmin() &&
        <span className="text-2xl cursor-pointer px-2 flex gap-x-2">
   <IoPersonAddOutline onClick={() => setAddUser(true)} />
</span>
}
      </div>
      <div className="overflow-auto max-h-[220px]">
        <ul
          className="lg:px-10 sm:px-2 p-3 min-w-[700px]"
        // className={`${openUsers? "h-auto":"h-28"} overflow-y-auto`}
        >
          {users.length > 0 ? (
            users.map((user) => (
              <li key={user.id} className="flex justify-between items-center px-3 py-1 border-2 mb-3 rounded-lg border-main hover:bg-blue-100">
                <div className="flex items-center gap-4 min-w-[300px]">
                  <div className="w-10 h-10 bg-white rounded-full flex justify-center items-center">{user.name.charAt(0).toUpperCase()}</div>
                  <div>
                    <p className="">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <span className="text-baseText font-bold">{getUserTaskCount(user.id)} {getUserTaskCount(user.id) > 1 ? 'tasks' : 'task'} </span>
                {user.pivot?.is_admin ? (
                  <span className="bg-main  p-1 w-24 text-center text-sm mr-2">Admin</span>
                ) : (
                  <span className="bg-main p-1 w-24 text-center text-sm mr-2">Member</span>

                )}
                {isCurrentUserAdmin() && (
                <div className="px-2 flex items-center gap-2">
                  <span className="cursor-pointer text-2xl " onClick={() => { user.pivot?.is_admin ? handleSetMember(user.id) : handleSetAdmin(user.id) }}><LiaEdit title={user.pivot?.is_admin ? "set as member" : "set as admin"} /></span>
                  <span className="cursor-pointer text-2xl text-red-500 hover:text-red-700" onClick={() => setRemoveUser(user.id)}><IoPersonRemoveOutline title="remove user" /></span>
                  {userDots === user.id && (
                    <div className="bg-white rounded-lg shadow-md p-2 z-10 absolute top-0 right-0" style={{ display: userDots ? 'block' : 'none' }}>
                      {user.pivot?.is_admin ? (
                        <p className="hover:bg-second cursor-pointer p-1 rounded-lg" onClick={() => handleSetMember(user.id)}>Set as member</p>
                      ) : (
                        <p className="hover:bg-second cursor-pointer p-1 rounded-lg" onClick={() => handleSetAdmin(user.id)}>Set as admin</p>
                      )}
                    </div>
                  )}
                </div>
                )}
                <Popup trigger={removeUser !== null } onBlur={() => setShowPopup(false)}>
                  <div className="text-prime text-xl font-bold p-4">
                    <p>Are you sure you want to remove user from this project</p>
                    <div className="flex justify-center gap-16 mt-10">
                      <button onClick={() => setRemoveUser(null)} className="w-20 bg-second rounded-lg hover:shadow-lg">No</button>
                      <button onClick={()=> handleRemoveUser()} className="w-20 bg-second rounded-lg hover:shadow-lg">Yes</button>
                    </div>
                  </div>
                </Popup>
              </li>
            ))
          ) : (
            <p>No users assigned to this project.</p>
          )}
        </ul>
      </div>
      <Popup trigger={addUser} onBlur={() => setAddUser(false)}>
        <div className='w-full flex justify-center gap-5 my-4'>
          <input type="email" placeholder='search user by email'
            className=' outline-none p-2 border-b-2 border-prime focus:border-button '
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className='font-bold hover:text-button hover:shadow-lg bg-prime text-second self-end px-6 py-1 rounded-lg'
            onClick={handleSearchUsers}
          >Search</button>
        </div>
        <div className='w-full p-2'>
          {matchedUsers.length > 0 ? (
            matchedUsers.map((user) => (
              <div key={user.id} className='w-full justify-between flex items-center text-lg py-1 hover:bg-second p-2 rounded-lg'>
                <div className="flex items-center gap-2">
                  <div className='md:w-9 md:h-9 sm:w-7 sm:h-7 md:text-base sm:text-sm rounded-full bg-blue-300 flex justify-center items-center font-semibold'>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <p>{user.name}</p>
                </div>
                <span className="cursor-pointer px-2" onClick={() => handleAddUserToProject(user.email)}>add</span>
              </div>
            ))
          ) : (
            <p className='text-center text-gray-400'>No users found</p>
          )}
        </div>
      </Popup>
    </div>
  );
};

export default ProjectUsersSection;
