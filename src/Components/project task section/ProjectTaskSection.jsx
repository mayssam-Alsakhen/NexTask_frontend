import { useEffect, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import Popup from "../popup/Popup";
import { useDrag, useDrop } from "react-dnd";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";

const TaskCard = ({ task }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TASK",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`bg-white p-2 rounded-lg shadow-md cursor-move ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <p className="font-semibold">{task.title}</p>
      <p className="text-sm text-gray-500">{task.description}</p>
    </div>
  );
};

const CategoryColumn = ({ category, taskList, onTaskDrop }) => {
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
        className={`text-lg font-semibold py-2 ${
          category === "Pending"
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
        className={`flex flex-col gap-2 p-4 ${
          category === "Pending"
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
          taskList.map((task) => <TaskCard key={task.id} task={task} />)
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
  const [isImportant, setIsImportant] = useState("No");

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
