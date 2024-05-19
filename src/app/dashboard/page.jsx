import DashboardCards from '@/Components/dashboardCards/DashboardCards'
import ProjectSummary from '@/Components/projectsummary/ProjectSummary'
import React from 'react'

function Dashboard() {
  return (
    <div className='w-full h-full flex flex-col gap-y-20 overflow-y-auto bg-secondDark md:p-10 sm:p-5 border border-[#00334e] rounded-lg'>
      <DashboardCards/>
      <ProjectSummary/>
    </div>
  )
}

export default Dashboard