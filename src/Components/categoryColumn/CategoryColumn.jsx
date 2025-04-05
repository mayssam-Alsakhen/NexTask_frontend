import { useDrop } from "react-dnd";
import TaskCard from '../taskCard/TaskCard';

const CategoryColumn = ({
  mainClass,
  category,
  cardDir,
  card,
  taskList,
  onTaskDrop,
  updateTask,
  updateTaskList,
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "TASK",
    drop: (item) => onTaskDrop(item.id, category),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));
console.log("mainClass:", mainClass);
  return (
    <div ref={drop} className={`${mainClass}`}>
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
        className={`flex ${cardDir} p-4 ${
          category === "Pending"
            ? "bg-pending"
            : category === "In Progress"
            ? "bg-progress"
            : category === "Test"
            ? "bg-testing"
            : category === "Completed"
            ? "bg-done"
            : ""
        } bg-opacity-30 h-full`}
      >
        {taskList.length > 0 ? (
          taskList.map((task) => (
            <TaskCard
            card={`${card}`}
              key={task.id}
              task={task}
              updateTask={updateTask}
              updateTaskList={updateTaskList}
            />
          ))
        ) : (
          <p className="text-sm text-gray-500">No tasks</p>
        )}
      </div>
    </div>
  );
};

export default CategoryColumn;
