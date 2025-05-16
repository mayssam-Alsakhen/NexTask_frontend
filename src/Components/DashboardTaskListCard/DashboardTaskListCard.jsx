"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { GoDot } from "react-icons/go"; 
import { CiClock2 } from "react-icons/ci";
import { CiWarning } from "react-icons/ci";
import { TbUserQuestion } from "react-icons/tb";

export default function DashboardTaskListCard({ title, filter }) {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.post("http://127.0.0.1:8000/api/dashboard/tasks/filter",
      { filter },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
    .then((res) => {
      setTasks(res.data);
      console.log("Tasks response", res.data)
    })
    .catch(console.error)
    .finally(() => {
      setLoading(false);
      console.log("filter...." + filter);
    });
  }, [filter]);
  

  const displayTasks = showAll ? tasks : tasks.slice(0, 3);

  return (
    <div className={`lg:w-[350px] w-80  flex flex-col`}>
      <div className={`bg-[url(/BGGG.jpg)] bg-center bg-cover h-32 flex items-center text-main rounded-md p-4 mb-3 border-2 border-[#adccef]`}>
      {title === "Unassigned Tasks" ? (<TbUserQuestion  className=" w-20 h-20 "/>): title ==='Upcoming Tasks'? (<CiClock2 className=" w-20 h-20 " />): (<CiWarning  className=" w-20 h-20 "/>)}
      {/* <IoMdClock className=" w-20 h-20 " /> */}
      <h3 className="text-2xl font-bold">{title}</h3>
      </div>
      <div className="bg-white/60 h-[300px] rounded-md p-6">
      {loading ? (
        <p className="text-center text-gray-500">Loading…</p>
      ) : (
        displayTasks.length === 0 ? ( <div className="text-center text-gray-500">No Tasks</div>):
        <div className=" flex-1 overflow-y-auto max-h-64 space-y-3">
          {displayTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => router.push(`/projects/${task.project_id}/tasks/${task.id}`)}
              className="flex items-center justify-between p-3 bg-[#e8eff9] rounded-lg hover:bg-gray-100 cursor-pointer transition"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1">
                {task.is_important ? (
                  <GoDot className="text-red-500 w-4 h-4"  title="High Priority" />
                ) : (
                  null
                )}
                <h4 className="font-medium truncate">{task.title}</h4>
                </div>
                <p className="text-xs text-gray-500">Due: {task.due_date}</p>
              </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full bg-opacity-70 ${
                    task.category === "Completed"
                      ? "bg-done text-green-800"
                      : task.category === "Pending"
                      ? "bg-pending text-yellow-800"
                      : task.category === "In Progress"
                      ? "bg-progress text-orange-700"
                      :"bg-testing text-blue-800"
                  }`}
                >
                  {task.category}
                </span>
            </div>
          ))}

          {tasks.length > 3 && (
            <button
              onClick={() => setShowAll((v) => !v)}
              className="w-full text-center text-blue-500 hover:underline mt-2"
            >
              {showAll ? "Show less" : `See all (${tasks.length}) →`}
            </button>
          )}
        </div>
      )}
      </div>
    </div>
  );
}
