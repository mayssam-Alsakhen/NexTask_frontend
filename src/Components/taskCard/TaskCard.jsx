import { useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import { MdMoreVert } from "react-icons/md";
import CommentsSection from "../CommentsSection/CommentsSection";
import TaskProgressEditor from "../TaskProgressEditor/TaskProgressEditor"; 
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaRegComment } from "react-icons/fa";
import Popup from "../popup/Popup";
import axios from "axios";
import Link from "next/link";

const TaskCard = ({ task, updateTaskList, card }) => {
  const [del, setDel] = useState(false);
  const [taskDots, setTaskDots] = useState(null);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  const [isAdmin, setIsAdmin] = useState(false);
  const [usersLoading, setUsersLoading] = useState(true);
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!task?.project_id) return;
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/projects/${task.project_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        
        const currentUserId = localStorage.getItem("user_id");
        const currentUser = response.data.data.users?.find(
          user => user.id == currentUserId
        );
        
        setIsAdmin(currentUser?.pivot?.is_admin === 1);
      } catch (error) {
        console.error("Admin check failed:", error?.response?.status, error?.message);
            setIsAdmin(false);
      } 
      finally {
        setUsersLoading(false);
      }
    };

    checkAdminStatus();
  }, [task.project_id]);

  // Set up dragging
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TASK",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  // Delete task handler
  const handleTaskDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/tasks/${task.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Task deleted successfully!");
      updateTaskList(task.id);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setErrorMessage("You must be an admin to edit this task.");
      } else {
        setErrorMessage("An error occurred while updating the task.");
      }
      console.error("Error updating task:", error);
    }
  };

  return (
    <div
      ref={drag}
      className={`${card} bg-white text-baseText p-2 relative rounded-lg shadow-md cursor-pointer ${
        isDragging ? "opacity-50" : ""
      }`}
    >
        <Link key={task.id}
    href={`/projects/${task.project_id}/tasks/${task.id}`}>
      <p className="font-semibold" 
      >
        {task.title}
      </p>
      <p className="text-xs text-gray-500" 
      >
        {task.due_date}
      </p>
      </Link>
      {/* Progress bar */}
<TaskProgressEditor task={task} projectId={task.project.id} />
<div className="flex justify-between items-center">
  <span className={`${task.category=='Completed'?'bg-done':task.category=='In Progress'?'bg-progress':task.category=='Pending'?'bg-pending':'bg-testing'} rounded-full text-sm px-2`}>{task.category}</span>
      <div
        className="flex justify-end items-center gap-2">
          <Link href={`/projects/${task.project_id}/tasks/${task.id}`}>
        <FaRegComment/>
        </Link>
        {!usersLoading && isAdmin && (
          <MdMoreVert onClick={() => setTaskDots(task.id)}/>
        )}
      </div>
      </div>
    
      {taskDots === task.id && (
        <div
          className="bg-white rounded-lg shadow-md p-2 z-10 absolute bottom-0 right-0 text-start"
          style={{ display: taskDots ? "block" : "none" }}
        >
          <span
            className="text-end text-lg cursor-pointer flex items-center justify-end"
            onClick={() => {
              setTaskDots(null);
            }}
          >
            <IoIosCloseCircleOutline />
          </span>
          <p
            className="hover:bg-second cursor-pointer p-1 rounded-lg"
            onClick={handleEditClick}
          >
            Edit
          </p>
          <p
            className="hover:bg-second cursor-pointer p-1 rounded-lg"
            onClick={() => setDel(true)}
          >
            Delete
          </p>
        </div>
      )}
      {/* Delete confirmation popup */}
      <Popup trigger={del} onBlur={() => setDel(false)}>
        <div className="text-prime text-xl font-bold p-4">
          <p>Are you sure you want to delete this Task</p>
          <div className="flex justify-center gap-16 mt-10">
            <button
              onClick={() => setDel(false)}
              className="w-20 bg-second rounded-lg hover:shadow-lg"
            >
              No
            </button>
            <button
              onClick={handleTaskDelete}
              className="w-20 bg-second rounded-lg hover:shadow-lg"
            >
              Yes
            </button>
          </div>
        </div>
      </Popup>
    </div>
  );
};

export default TaskCard;
