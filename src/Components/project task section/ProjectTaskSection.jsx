import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";
import CategoryColumn from '@/Components/categoryColumn/CategoryColumn';
import Popup from "../popup/Popup";
import { IoIosAddCircleOutline } from "react-icons/io";
import TaskCard from "../taskCard/TaskCard";

const ProjectTaskSection = ({ projectId, statusFilter }) => {
  const [tasks, setTasks] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [addTask, setAddTask] = useState(false);
  const [loading, setLoading] = useState(true);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isImportant, setIsImportant] = useState();
  const [selectedStatus, setSelectedStatus] = useState("all");


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

  useEffect(() => {
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
      console.error("Error updating task category:", error);
      // Optionally revert category change if error occurs
    }
  };

  // Add a new task handler
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

  const handleFilterChange = (event) => {
    setSelectedStatus(event.target.value);
  };
  

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-full">
        {/* Header with title and add task button */}
        <div className="flex justify-between items-center mb-4 text-prime">
          <h3 className="text-lg font-semibold">Project Tasks</h3>
          <span className="flex items-center gap-3 text-2xl cursor-pointer">
            <div>
              <select
                value={selectedStatus}
                onChange={handleFilterChange}
                className="text-base p-1 rounded-md outline-none"
              >
                <option value="all">All Tasks</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
                <option value="testing">Testing</option>
              </select>
            </div>
            <button onClick={() => setAddTask(true)}>
              <IoIosAddCircleOutline/>
            </button>
          </span>
        </div>
          
        {/* Kanban board with categorized tasks */}
        {selectedStatus==='all'? 
        <div className="flex gap-4 text-center overflow-x-auto">
          {Object.entries(categorizedTasks).map(
            ([category, taskList]) => (
              <CategoryColumn
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
        <TaskCard key={tasks.id} task={tasks.filter((task) => task.category === selectedStatus)} updateTask={updateTask} updateTaskList={updateTaskList} />}

        {/* Popup for adding a new task */}
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
            <select
              onChange={(e) => setIsImportant(e.target.value)}
              className="w-full p-2 my-2 border-b-2 border-prime focus:border-designing outline-none"
            >
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
