import axios from "axios";
import { toast } from "react-toastify";

export const checkIfUserIsAdmin = async (projectId) => {
  console.log("checkIfUserIsAdmin called for projectId:", projectId); 
  try {
    const token = localStorage.getItem("token");
    const currentUserId = localStorage.getItem("user_id");
    console.log("Token:", token);
    console.log("User ID:", currentUserId);

    const res = await axios.get(
      `http://127.0.0.1:8000/api/projects/${projectId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log('API response:', res);
    
    const projectUsers = res.data.data.users;
    const user = projectUsers.find((u) => u.id == currentUserId);
    return user?.pivot?.is_admin === 1;
  } catch (error) {
    toast.error("Admin check failed:", error.message);
    
    return false;
    
  }
};
