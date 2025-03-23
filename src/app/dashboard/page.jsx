"use client";
import DashboardCards from '@/Components/dashboardCards/DashboardCards'
import ProjectSummary from '@/Components/projectsummary/ProjectSummary'
import TaskSummary from '@/Components/tasksummary/TaskSummary'
import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

function Dashboard() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    console.log("AuthContext - loading:", loading); // Check loading state
    console.log("AuthContext - user:", user); // Check user state

    if (!loading && !user) {
        router.push("/login"); // Redirect to login if not authenticated
    }
}, [loading, user, router]);

if (loading) return <p>Loading...</p>; // Show loading state
if (!user) return null; // Don't render anything if user is not set

  return (
    <div className='w-full h-full flex flex-col gap-y-20 p-3 mt-12'>
      <div className=' flex flex-wrap gap-x-12 gap-y-6 justify-center'>
      <DashboardCards title={"Tasks"} total={20} fpart={"Completed"} fpartnb={6} spart={"Other"} spartnb={14} />
      <DashboardCards title={"Projects"} total={8} fpart={"Completed"} fpartnb={2} spart={"Other"} spartnb={6} />
      <DashboardCards title={"Action Required"} total={4} fpart={"Due soon"} fpartnb={3} spart={"overdue"} spartnb={1} />
      </div>
      <ProjectSummary />
      <TaskSummary />
    </div>
  )
}

export default Dashboard