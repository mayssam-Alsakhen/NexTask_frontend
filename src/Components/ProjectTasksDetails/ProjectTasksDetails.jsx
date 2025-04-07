// "use client";
import { useRouter } from "next/navigation";

const ProjectTasksDetails = ({ borderColor, taskCount, handleNavigate, statusTitle }) => {
    const router = useRouter();
    

    return (
      <div 
        className={`w-40  h-20 bg-white border-b-[12px] ${borderColor} flex flex-col items-center p-3 hover:shadow-lg hover:-translate-y-1 cursor-pointer relative group transition-transform overflow-hidden`} 
        onClick={handleNavigate}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-in-out"></div>
        <p className="text-lg font-bold">{statusTitle}</p>
        <p className="font-medium">{taskCount} Task{taskCount !== 1 ? 's' : ''}</p>
        {/* Hover effect */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-white font-bold">See All Tasks</span>
        </div>
      </div>
    );
  };
  
  export default ProjectTasksDetails;
  