import { useDrop } from "react-dnd";
import TaskCard from '../taskCard/TaskCard';

const CategoryColumn = ({
  category,
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

  return (
    <div ref={drop} className="lg:w-[300px] min-w-56 h-[75vh] overflow-y-hidden">
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
        className={`flex flex-col gap-2 p-4 overflow-auto ${
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
