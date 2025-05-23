"use client";
import ProjectOverviewSection from '@/Components/ProjectOverviewSection/ProjectOverviewSection'
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import DashboardHeader from '@/Components/Dashboard header/DashboardHeader';
import DashboardTaskListCard from '@/Components/DashboardTaskListCard/DashboardTaskListCard';
import TaskStatusChart from '@/Components/task status chart/TaskStatusChart';
import UserActivityFeed from '@/Components/UserActivityFeed/UserActivityFeed';
import CompletedTasksChart from '@/Components/CompletedTasksChart/CompletedTasksChart';
import ProjectStatusDonut from '@/Components/ProjectStatusDonut/ProjectStatusDonut';
import { toast } from 'react-toastify';

function Dashboard() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/dashboard/summary', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => setSummary(res.data))
      .catch((err) => {
        toast.error("Error fetching dashboard summary");
      });
  }, []);

  useEffect(() => {
    console.log("AuthContext - loading:", loading); // Check loading state
    console.log("AuthContext - user:", user); // Check user state

    if (!loading && !user) {
        router.push("/login"); // Redirect to login if not authenticated
    }
}, [loading, user, router]);

if (loading || !summary) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div className=' w-full h-full flex flex-col gap-y-10 p-3 lg:mt-20 mt-12'>
      <div><DashboardHeader/></div>
      <div className=' flex flex-wrap gap-x-12 gap-y-6 justify-center'>
      <DashboardTaskListCard
        title="Upcoming Tasks" // 7 days
        filter="upcoming_tasks"
      />
      <DashboardTaskListCard
        title="Due Today or Overdue"
        filter="due_or_overdue"
      />
      <DashboardTaskListCard
        title="Unassigned Tasks"
        filter="unassigned_tasks"
      />
      </div>
      <div className='lg:mx-12 md:mx-7 mx-0'>
        <UserActivityFeed userId={user.id} />
        </div>
      <div className='flex flex-wrap gap-6 justify-center'>
      <ProjectOverviewSection />
      <ProjectStatusDonut/>
      </div>
      <div className='flex flex-wrap gap-6 justify-center'>
        <TaskStatusChart/>
      <CompletedTasksChart/>
      </div>
    </div>
  )
}

export default Dashboard