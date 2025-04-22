import axios from "axios";

export const checkIfUserIsAdmin = async (projectId) => {
  try {
    const token = localStorage.getItem("token");
    const currentUserId = localStorage.getItem("user_id");

    const res = await axios.get(
      `http://127.0.0.1:8000/api/projects/${projectId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const projectUsers = res.data.data.users;
    const user = projectUsers.find((u) => u.id == currentUserId);
    return user?.pivot?.is_admin === 1;
  } catch (error) {
    console.error("Admin check failed:", error.message);
    return false;
  }
};
