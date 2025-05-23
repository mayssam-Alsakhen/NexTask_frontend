import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import AddTaskForm from "../AddTaskForm/AddTaskForm";
import axios from "axios";
import CategoryColumn from '@/Components/categoryColumn/CategoryColumn';
import Popup from "../popup/Popup";
import { IoIosAddCircleOutline } from "react-icons/io";
import { checkIfUserIsAdmin } from "../utils/checkAdmin";
import { toast } from "react-toastify";
import LoaderSpinner from "../loader spinner/LoaderSpinner";

const ProjectTaskSection = ({ projectId, api, title, addIcon}) => {
  const [tasks, setTasks] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [addTask, setAddTask] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");  
  const [isAdmin, setIsAdmin] = useState(false);

  // Update a single task
  const updateTask = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  // Remove a task from the list
  const updateTaskList = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  // check if user is admin
  useEffect(() => {
    if (!projectId) {
      return;
    }
    const checkAdminStatus = async () => {
      const result = await checkIfUserIsAdmin(projectId);
      setIsAdmin(result);
    };
    checkAdminStatus();
  }, [projectId]);


  // Fetch tasks from the API when the component mounts or refresh changes
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `${api}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setTasks(response.data.tasks);
      } catch (error) {
        toast.error(error.response?.data?.message||'Error fetching tasks')
        
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [projectId, refresh]);

  // Handle pre-filtered status from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("selectedStatus");
    if (stored) {
      setSelectedStatus(stored); // Apply to actual filter
      localStorage.removeItem("selectedStatus");
    }
  }, []);

  // Categorize tasks for the Kanban board
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

  // Handle drag and drop task category change
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
      toast.error(error.response?.data?.message ||"Error updating task category");
    }
  };

  if (loading) return <div className="flex justify-center mt-10"><LoaderSpinner child={'Loading...'}/></div>;

  const handleFilterChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-full">
        {/* Header with title and add task button */}
        <div className="flex justify-between items-center mb-2 text-prime">
          <h3 className="text-lg text-button font-semibold">{title}</h3>
          <span className="flex items-center gap-3 text-2xl cursor-pointer">
            <div>
              <select
                value={selectedStatus}
                onChange={handleFilterChange}
                className="text-base p-1 rounded-md outline-none"
              >
                <option value="all">All Tasks</option>
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Done</option>
                <option value="test">Testing</option>
              </select>
            </div>

            {isAdmin && (
              <button onClick={() => setAddTask(true)} className={addIcon}>
                <IoIosAddCircleOutline/>
              </button>
            )}
          </span>
        </div>
          
        {/* Kanban board with categorized tasks */}
        {selectedStatus==='all'? 
        <div className="flex gap-3 text-center overflow-x-auto ">
          {Object.entries(categorizedTasks).map(
            ([category, taskList]) => (
              <CategoryColumn
              mainClass={`lg:w-[25%]  bg-main min-w-60 lg:h-[80vh] h-[75vh] overflow-y-hidden`}
                cardDir={`flex-col gap-2 overflow-y-auto`}
                key={category}
                category={category}
                taskList={taskList}
                onTaskDrop={handleTaskDrop}
                updateTask={updateTask}
                updateTaskList={updateTaskList}
              />
            )
          )}
        </div>
        :
        <div className="flex gap-4 text-center">
                <CategoryColumn
                heading={'hidden'}
                  mainClass={`w-full`}
                  cardDir={`flex-row justify-center overflow-hidden h-full flex-wrap gap-5`} 
                  card={` md:w-56 sm:w-60 h-28`}
                  key={selectedStatus}
                  category={selectedStatus}
                  taskList={tasks.filter(task => task.category?.toLowerCase() === selectedStatus)}
                  onTaskDrop={handleTaskDrop}
                  updateTask={updateTask}
                  updateTaskList={updateTaskList}
                  />
        </div>
        }

        {/* Popup for adding a new task */}
        <Popup trigger={addTask} onBlur={() => setAddTask(false)}>
<AddTaskForm
    projectId={projectId}
    onTaskCreated={(newTask) => {
      setTasks((prev) => [...prev, newTask]);
      setRefresh((prev) => !prev);
    }}
  />
        </Popup>
      </div>
    </DndProvider>
  );
};

export default ProjectTaskSection;
