import { useEffect, useState } from "react";
import axios from "axios";
import Popup from "../popup/Popup";
import { IoPersonAddOutline } from "react-icons/io5";
import { IoMdMore } from "react-icons/io";

const ProjectUsersSection = ({ projectId }) => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [addUser, setAddUser] = useState(false);
  const[userDots, setUserDots] = useState(null);
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
        { email: searchQuery }, // Sending the searchQuery as email to the API
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

  const handleRemoveUser = async (userId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in.");
      return;
    }
    try {
      await axios.delete(`http://127.0.0.1:8000/api/projects/${projectId}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      alert("User removed successfully!");
      setUsers(users.filter(user => user.id !== userId)); // Remove user from state
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
    <div className="mt-5 ">
      <div className="flex items-center justify-between mb-2">
      <h3 className="text-lg font-semibold">Project Team</h3>
      <span className="text-2xl cursor-pointer px-2" onClick={()=> setAddUser(true)}><IoPersonAddOutline /></span>
      </div>
      <ul>
        {users.length > 0 ? (
          users.map((user) => (
            <li key={user.id} className="flex justify-between items-center p-1 bg-white bg-opacity-30 rounded-lg shadow mb-2 relative">
               <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-second rounded-full flex justify-center items-center">{user.name.charAt(0).toUpperCase()}</div>
              <div>
              <p className="">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
              </div>
                </div>
             <div className="px-2 flex items-center gap-3">
                <span className="text-gray-600">{getUserTaskCount(user.id)} tasks</span>
                {user.pivot?.is_admin ? (
                  <span className="text-green-600 font-bold">Admin</span>
                ) : (
                  <span className="text-gray-600">Member</span>
                  
                )}
                <span className="cursor-pointer" onClick={() => setUserDots(userDots === user.id ? null : user.id)}> <IoMdMore /></span>
                {userDots === user.id && (
                <div className="bg-white rounded-lg shadow-md p-2 z-10 absolute top-0 right-0" style={{display: userDots ? 'block' : 'none'}}>
                <span className="block text-end text-xl h-5 cursor-pointer" onClick={()=>setUserDots(null)}>x</span>  
                {user.pivot?.is_admin ? (
                  <p className="hover:bg-second cursor-pointer p-1 rounded-lg" onClick={() => handleSetMember(user.id)}>Set as member</p>
                ) : (
                  <p className="hover:bg-second cursor-pointer p-1 rounded-lg" onClick={() => handleSetAdmin(user.id)}>Set as admin</p>
                )}
                <p className="hover:bg-second cursor-pointer p-1 rounded-lg" onClick={() => handleRemoveUser(user.id)}>Remove member</p>
                </div>
                )}
              </div>
            </li>
          ))
        ) : (
          <p>No users assigned to this project.</p>
        )}
      </ul>
      <Popup trigger={addUser} onBlur={() => setAddUser(false)}>
      <div className='w-full flex justify-center gap-5 my-4'>
        <input type="email" placeholder='search user by email' 
        className=' outline-none p-2 border-b-2 border-prime focus:border-designing '
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button 
        className='font-bold hover:text-designing hover:shadow-lg bg-prime text-second self-end px-6 py-1 rounded-lg'
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
        <span className="cursor-pointer px-2"  onClick={() => handleAddUserToProject(user.email)}>add</span>
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
