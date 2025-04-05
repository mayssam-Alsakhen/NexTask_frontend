import { useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import { AiOutlineMore } from "react-icons/ai";
import { IoIosCloseCircleOutline } from "react-icons/io";
import Popup from "../popup/Popup";
import axios from "axios";

const TaskCard = ({ task, updateTask, updateTaskList, card }) => {
  const [taskOpen, setTaskOpen] = useState(false);
  const [editTask, setEditTask] = useState(false);
  const [assignUser, setAssignUser] = useState(false);
  const [del, setDel] = useState(false);
  const [taskDetails, setTaskDetails] = useState(null);
  const [taskDots, setTaskDots] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
    isImportant: "",
  });

  // Set up dragging
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TASK",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  useEffect(() => {
    if (taskOpen) {
      handleTaskClick();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskOpen]);

  // Fetch task details when a task is clicked
  const handleTaskClick = async () => {
    setTaskOpen(true);
    setLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/tasks/${task.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTaskDetails(response.data.task);
    } catch (error) {
      console.error("Error fetching task details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Open edit popup and initialize form data
  const handleEditClick = () => {
    setFormData({
      title: task.title,
      description: task.description,
      due_date: task.due_date,
      isImportant: task.is_important ? "1" : "0",
    });
    setEditTask(true);
    handleTaskClick();
    setTaskOpen(false);
  };

  // Edit task submit handler
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const updatedTask = {
      ...task,
      ...formData,
      assigned_users: selectedUsers.map((user) => user.id),
    };
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/tasks/${task.id}`,
        updatedTask,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      updateTask(updatedTask);
      setEditTask(false);
      setTaskDots(null);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setErrorMessage("You must be an admin to edit this task.");
      } else {
        setErrorMessage("An error occurred while updating the task.");
      }
      console.error("Error updating task:", error);
    }
  };

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

  // Search users handler
  const handleSearchUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to search users.");
      return;
    }
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/user/search",
        { email: searchQuery },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data && response.data.id) {
        setMatchedUsers([response.data]);
      } else {
        setMatchedUsers(response.data || []);
      }
    } catch (error) {
      alert("Error searching users. Please check your API.");
    }
  };

  // Handle adding a user to the task
  const handleSelectUser = (user) => {
    if (!selectedUsers.some((u) => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  // Remove a selected user from the task
  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id !== userId));
  };

  return (
    <div
      ref={drag}
      className={`${card} text-prime p-2 relative rounded-lg shadow-md cursor-pointer ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <p className="font-semibold" onClick={() => setTaskOpen(true)}>
        {task.title}
      </p>
      <p className="text-xs text-gray-500" onClick={() => setTaskOpen(true)}>
        {task.due_date}
      </p>
      <div
        className="flex justify-end"
        onClick={() => setTaskDots(task.id)}
      >
        <AiOutlineMore />
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
      {/* Task details popup */}
      <Popup trigger={taskOpen} onBlur={() => setTaskOpen(false)}>
        {loading ? (
          <p>Loading task details...</p>
        ) : taskDetails ? (
          <div>
            <h2 className="text-lg font-semibold">{taskDetails.title}</h2>
            <p className="text-gray-600">{taskDetails.description}</p>
            <p className="text-sm text-gray-500">
              Due Date: {taskDetails.due_date}
            </p>
            {taskDetails.is_important && (
              <p className="text-red-500 font-semibold">Important</p>
            )}
            <h3 className="mt-4 font-semibold">Assigned Users:</h3>
            {taskDetails.users && taskDetails.users.length > 0 ? (
              <ul className="list-disc pl-5">
                {taskDetails.users.map((user) => (
                  <li key={user.id}>
                    {user.name} ({user.email})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No users assigned</p>
            )}
          </div>
        ) : (
          <p>Error loading task details</p>
        )}
      </Popup>
      {/* Edit task popup */}
      <Popup
        trigger={editTask}
        onBlur={() => {
          setEditTask(false);
          setTaskDots(null);
        }}
      >
        <div>
          <form onSubmit={handleEditSubmit}>
            {errorMessage && (
              <p className="text-red-500">{errorMessage}</p>
            )}
            <div className="flex flex-col gap-3 text-prime">
              <h1 className="text-4xl font-bold">Edit Task</h1>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="outline-none p-2 border-b-2 border-prime focus:border-designing"
                placeholder="Task Title"
              />
              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={(e) =>
                  setFormData({ ...formData, due_date: e.target.value })
                }
                className="outline-none p-2 border-b-2 border-prime focus:border-designing"
              />
              <input
                name="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                className="outline-none p-2 border-b-2 border-prime focus:border-designing"
                placeholder="Description"
              />
              <div className="flex gap-7">
                Important:
                <label>
                  <span className="px-2">Yes</span>
                  <input
                    name="isImportant"
                    type="radio"
                    value="1"
                    checked={formData.isImportant === "1"}
                    onChange={() =>
                      setFormData({ ...formData, isImportant: "1" })
                    }
                  />
                </label>
                <label>
                  <span className="p-2">No</span>
                  <input
                    name="isImportant"
                    type="radio"
                    value="0"
                    checked={formData.isImportant === "0"}
                    onChange={() =>
                      setFormData({ ...formData, isImportant: "0" })
                    }
                  />
                </label>
              </div>
              <p
                className="hover:underline hover:font-bold"
                onClick={() => setAssignUser(true)}
              >
                Assign user
              </p>
              {loading ? (
                <p>Loading assigned user...</p>
              ) : taskDetails ? (
                <div>
                  <div className="flex flex-wrap gap-2 mb-2 h-10 overflow-auto">
                    {taskDetails.users.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center bg-secondDark text-white h-fit px-3 py-1 rounded-full"
                      >
                        <span>{user.name}</span>
                        <button
                          onClick={() => handleRemoveUser(user.id)}
                          className="ml-2 text-sm"
                        >
                          ✖
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              {/* Display Selected Users */}
              <div className="flex flex-wrap gap-2 mb-2 h-10 overflow-auto">
                {selectedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center bg-secondDark text-white h-fit px-3 py-1 rounded-full"
                  >
                    <span>{user.name}</span>
                    <button
                      onClick={() => handleRemoveUser(user.id)}
                      className="ml-2 text-sm"
                    >
                      ✖
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-16">
                <button
                  onClick={() => {
                    setEditTask(false);
                    setTaskDots(null);
                  }}
                  className="w-20 bg-second rounded-lg hover:shadow-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-20 bg-second rounded-lg hover:shadow-lg"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </Popup>
      {/* Assign user popup */}
      <Popup trigger={assignUser} onBlur={() => setAssignUser(false)}>
        <div className="w-full flex justify-center gap-5 my-4">
          <input
            type="email"
            placeholder="search user by email"
            className="outline-none p-2 border-b-2 border-prime focus:border-designing"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="font-bold hover:text-designing hover:shadow-lg bg-prime text-second self-end px-6 py-1 rounded-lg"
            onClick={handleSearchUsers}
          >
            Search
          </button>
        </div>
        <div className="w-full p-2">
          {matchedUsers.length > 0 ? (
            matchedUsers.map((user) => (
              <div
                key={user.id}
                className="w-full flex items-center gap-2 text-lg py-1 cursor-pointer hover:bg-second p-2 rounded-lg"
                onClick={() => handleSelectUser(user)}
              >
                <div className="md:w-9 md:h-9 sm:w-7 sm:h-7 md:text-base sm:text-sm rounded-full bg-blue-300 flex justify-center items-center font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <p>{user.name}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400">No users found</p>
          )}
        </div>
      </Popup>
    </div>
  );
};

export default TaskCard;
