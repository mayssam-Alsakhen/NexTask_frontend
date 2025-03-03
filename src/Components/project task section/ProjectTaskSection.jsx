import { useEffect, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { AiOutlineMore } from "react-icons/ai";
import Popup from "../popup/Popup";
import { useDrag, useDrop } from "react-dnd";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { IoIosCloseCircleOutline } from "react-icons/io";
import axios from "axios";


const TaskCard = ({ task, updateTask }) => {
  const [taskOpen, setTaskOpen] = useState(false);
  const [editTask, setEditTask] = useState(false);
  const [assignUser, setAssignUser] = useState(false);
  const [taskDetails, setTaskDetails] = useState(null);
  const [taskDots, setTaskDots] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
    isImportant: "",
  });

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
  }, [taskOpen]);

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

  const handleEditClick = () => {
    setFormData({
      title: task.title,
      description: task.description,
      due_date: task.due_date,
      isImportant: task.is_important ? "1" : "0",
    });
    setEditTask(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:8000/api/tasks/${task.id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    const updatedTask = {
      ...task,
      ...formData,
    };

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

  return (
    <div
      ref={drag}
      className={`bg-white p-2 relative rounded-lg shadow-md cursor-pointer ${isDragging ? "opacity-50" : ""
        }`}
    >
      <p className="font-semibold"  onClick={() => setTaskOpen(true)}>{task.title}</p>
      <p className="text-xs text-gray-500"  onClick={() => setTaskOpen(true)}>{task.due_date}</p>
      <div className="flex justify-end" onClick={(event) => {
        event.stopPropagation();
        setTaskDots(task.id);
      }}> <AiOutlineMore /> </div>
      {taskDots === task.id && (
        <div className="bg-white rounded-lg shadow-md p-2 z-10 absolute bottom-0 right-0 text-start" style={{ display: taskDots ? 'block' : 'none' }}>
          <span className=" text-end text-lg cursor-pointer flex items-center justify-end "
          onClick={() => {
            setTaskDots(null);
          }}> <IoIosCloseCircleOutline />
          </span>

          <p className="hover:bg-second cursor-pointer p-1 rounded-lg" 
           onClick={() => {
            handleEditClick();
          }}>Edit</p>
          <p className="hover:bg-second cursor-pointer p-1 rounded-lg" >Delete</p>
        </div>
      )}
      <Popup trigger={taskOpen} onBlur={() => setTaskOpen(false)}>
        {loading ? (
          <p>Loading task details...</p>
        ) : taskDetails ? (
          <div>
            <h2 className="text-lg font-semibold">{taskDetails.title}</h2>
            <p className="text-gray-600">{taskDetails.description}</p>
            <p className="text-sm text-gray-500">Due Date: {taskDetails.due_date}</p>
            {taskDetails.is_important ? (
              <p className="text-red-500 font-semibold">Important</p>
            ) : null}
            <h3 className="mt-4 font-semibold">Assigned Users:</h3>
            {taskDetails.users && taskDetails.users.length > 0 ? (
              <ul className="list-disc pl-5">
                {taskDetails.users.map((user) => (
                  <li key={user.id}>{user.name} ({user.email})</li>
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
      <Popup trigger={editTask} onBlur={() => setEditTask(false)}>
        <div>
                     <form onSubmit={handleEditSubmit}>
                     {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                       <div className="flex flex-col gap-3 text-prime">
                         <h1 className="text-4xl font-bold ">Edit Task</h1>
                         <input
                           type="text"
                           name="title"
                           value={formData.title}
                           onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                           className=' outline-none p-2 border-b-2 border-prime focus:border-designing '
                           placeholder="Task Title"
                         />
                         <input
                         type="date"
                           name="due_date"
                           value={formData.due_date}
                           onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                           className=' outline-none p-2 border-b-2 border-prime focus:border-designing '
                           placeholder="Due Date"
                         />
                         <input
                           name="description"
                           value={formData.description}
                           onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                           className=' outline-none p-2 border-b-2 border-prime focus:border-designing '
                           placeholder="Description"
                         />
                         <div className="flex gap-7"> Important: 
                         <label  >
                          <span className="px-2">Yes</span>
                         <input
                            name="isImportant"
                            type="radio"
                            value="1"
                           checked={formData.isImportant === "1"}
                           onChange={() => setFormData({ ...formData, isImportant: "1" })}
                            />
                            
                            </label>
                            <label >
                              <span className="p-2">No</span>
                         <input
                            name="isImportant"
                            type="radio"
                            value="0"
                            checked={formData.isImportant === "0"}
                            onChange={() => setFormData({ ...formData, isImportant: "0" })}
                            />
                            </label>
                            </div>
                            <p className="hover:underline hover:font-bold" onClick={()=> setAssignUser(true)}>Assign user</p>
                     <div className="flex justify-center gap-16"> 
                       <button onClick={() => {setEditTask(false), setTaskDots(null)}} className="w-20 bg-second rounded-lg hover:shadow-lg">Cancel</button>
                       <button type="submit" className="w-20 bg-second rounded-lg hover:shadow-lg">Save</button>
                     </div>                </div>
                     </form>
                   </div>
      </Popup>
      <Popup trigger={assignUser} onBlur={() => setAssignUser(false)}>
        assigned user
          </Popup>
    </div>
  );
};

const CategoryColumn = ({ category, taskList, onTaskDrop, updateTask }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "TASK",
    drop: (item) => onTaskDrop(item.id, category),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div ref={drop} className="lg:w-72 min-w-56">
      <h4
        className={`text-lg font-semibold py-2 ${category === "Pending"
            ? "bg-pending"
            : category === "In Progress"
              ? "bg-progress"
              : category === "Test"
                ? "bg-testing"
                : category === "Completed"
                  ? "bg-done"
                  : ""
          }`}
      >
        {category}
      </h4>
      <div
        className={`flex flex-col gap-2 p-4 ${category === "Pending"
            ? "bg-pending"
            : category === "In Progress"
              ? "bg-progress"
              : category === "Test"
                ? "bg-testing"
                : category === "Completed"
                  ? "bg-done"
                  : ""
          } bg-opacity-30`}
      >
        {taskList.length > 0 ? (
          taskList.map((task) => <TaskCard key={task.id} task={task} updateTask={updateTask} />)
        ) : (
          <p className="text-sm text-gray-500">No tasks</p>
        )}
      </div>
    </div>
  );
};

const ProjectTaskSection = ({ projectId }) => {
  const [tasks, setTasks] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [addTask, setAddTask] = useState(false);
  const [loading, setLoading] = useState(true);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isImportant, setIsImportant] = useState();

  const updateTask = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };
  

  useEffect(() => {
    console.log("Fetching tasks..."); 

    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/tasks?project_id=${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setTasks(response.data.tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [projectId, refresh]);

  const categorizedTasks = {
    Pending: [],
    "In Progress": [],
    Test: [],
    Completed: [],
  };

  tasks.forEach((task) => {
    if (categorizedTasks[task.category]) {
      categorizedTasks[task.category].push(task);
    }
  });

  const handleTaskDrop = async (taskId, newCategory) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, category: newCategory } : task
      )
    );

    try {
      await axios.put(
        `http://127.0.0.1:8000/api/tasks/${taskId}`,
        { category: newCategory },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error updating task category:", error);

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, category: prevTasks.find(t => t.id === taskId).category } : task
        )
      );
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/tasks",
        {
          project_id: projectId,
          title: taskTitle,
          description: taskDescription,
          due_date: dueDate,
          isImportant: isImportant,
          assigned_users: [],
          category: "Pending",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 201) {
        setTasks([...tasks, response.data.task]);
        setAddTask(false);
        setTaskTitle("");
        setTaskDescription("");
        setDueDate("");
        setIsImportant("No");
        setRefresh((prev) => !prev);
      } else {
        console.error("Error adding task:", response.data);
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  if (loading) return <p>Loading tasks...</p>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <div className="flex justify-between items-center">
          <h3 className="text-xl mb-5">Project Tasks</h3>
          <span
            className="text-2xl cursor-pointer px-2"
            onClick={() => setAddTask(true)}
          >
            <IoIosAddCircleOutline />
          </span>
        </div>
        <div className="flex justify-between gap-4 text-center overflow-auto">
          {Object.entries(categorizedTasks).map(([category, taskList]) => (
            <CategoryColumn
              key={category}
              category={category}
              taskList={taskList}
              onTaskDrop={handleTaskDrop}
              updateTask={updateTask}
            />
          ))}
        </div>
        <Popup trigger={addTask} onBlur={() => setAddTask(false)}>
          <form onSubmit={handleAddTask}>
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Task Title"
              className="w-full p-2 my-2 border-b-2 border-prime focus:border-designing outline-none"
            />
            <input
              type="text"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="Task Description"
              className="w-full p-2 my-2 border-b-2 border-prime focus:border-designing outline-none"
            />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 my-2 border-b-2 border-prime focus:border-designing outline-none"
            />
            <select name="" className="w-full p-2 my-2 border-b-2 border-prime focus:border-designing outline-none" onChange={(e) => setIsImportant(e.target.value)}>
              <option value="">Important</option>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
            <button
              type="submit"
              className="w-full bg-prime text-second p-2 rounded-lg mt-2"
            >
              Add Task
            </button>
          </form>
        </Popup>
      </div>
    </DndProvider>
  );
};

export default ProjectTaskSection;
