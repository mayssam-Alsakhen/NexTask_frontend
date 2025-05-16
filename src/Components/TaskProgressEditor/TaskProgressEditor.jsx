import { useEffect, useState } from "react";
import axios from "axios";
import { checkIfUserIsAdmin } from "../utils/checkAdmin";

export default function TaskProgressEditor({ task, projectId }) {
  const [canEdit, setCanEdit] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [progress, setProgress] = useState(task.progress || 0);
  const currentUserId = localStorage.getItem("user_id");

  useEffect(() => {
    const check = async () => {
      const isAdmin = await checkIfUserIsAdmin(projectId);
      const isAssigned = task.users?.some((user) => user.id == currentUserId);
      setCanEdit(isAdmin || isAssigned);
    };
    check();
  }, [projectId, task.users, currentUserId]);

  const handleSave = async () => {
    setIsEditing(false);
    try {
      await axios.patch(`http://127.0.0.1:8000/api/tasks/${task.id}/progress`, {
        progress,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (err) {
      console.error("Update failed:", err.message);
    }
  };

  return (
    
    <div className="cursor-pointer" onClick={() => canEdit && setIsEditing(true)} >
      <p className="text-xs text-right">{progress}%</p>
      <div className="mb-2 w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-200 h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {isEditing && (
        <input
          type="numeric"
          placeholder="Progress"
          min="0"
          max="100"
          step="1"
          value={progress}
          onChange={(e) => setProgress(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          className="w-full z-50"
        />
      )}
    </div>
  );
}
