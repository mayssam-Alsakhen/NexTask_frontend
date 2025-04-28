import { useDrop } from "react-dnd";
import TaskCard from '../taskCard/TaskCard';

const CategoryColumn = ({
  heading,
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
  return (
    <div ref={drop} className={`${mainClass} rounded-lg`}>
      <h4
        className={`text-lg font-semibold py-1 text-white ${heading}
        `}
      >
        {category}
      </h4>

      <div
        className={`flex ${cardDir} px-4 pb-12 h-full `}
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
