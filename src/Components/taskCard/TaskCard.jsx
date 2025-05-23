import { useDrag } from "react-dnd";
import TaskProgressEditor from "../TaskProgressEditor/TaskProgressEditor"; 
import { FaRegComment } from "react-icons/fa";
import Link from "next/link";

const TaskCard = ({ task, updateTaskList, card }) => {

  // Set up dragging
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
      </div>
      </div>

    </div>
  );
};

export default TaskCard;
