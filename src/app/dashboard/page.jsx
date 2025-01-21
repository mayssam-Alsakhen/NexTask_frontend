import DashboardCards from '@/Components/dashboardCards/DashboardCards'
import ProjectSummary from '@/Components/projectsummary/ProjectSummary'
import TaskSummary from '@/Components/tasksummary/TaskSummary'
import React from 'react'

function Dashboard() {
  return (
    <div className='w-full h-full flex flex-col gap-y-20 overflow-y-auto bg-secondDark md:p-10 sm:p-5 border border-[#00334e] rounded-lg'>
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