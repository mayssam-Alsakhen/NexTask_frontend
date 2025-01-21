'use client'
import React from 'react'
import '../projectsummary/projectsummary.css'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// table data
const projects = [
  {id:1, Name: 'web', manager:'Mayssam', due_date:'23/5/2024', status:'In Progress'},
  {id:2, Name: 'web', manager:'Mayssam', due_date:'23/5/2024', status:'Pending'},
  {id:3, Name: 'web', manager:'Mayssam', due_date:'23/5/2024', status:'In Progress'},
  {id:4, Name: 'web', manager:'Mayssam', due_date:'23/5/2024', status:'Completed'},
  {id:5, Name: 'web', manager:'Mayssam', due_date:'23/5/2024', status:'Testing'},
]
//chart data
const data = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 150 },
  { name: 'Group D', value: 200 },
];
// colors
const COLORS = ['#c97bfa', '#edee63', '#64c8f7', '#94f6a4'];

// label custemization
const RADIAN = Math.PI / 180;                            
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" style={{}}>
      {`${(percent * 100).toFixed(0)}%`}
      {/* {data[index].name} */}
    </text>
  );
};

function ProjectSummary() {
  return (
    // flex lg:flex-row sm:flex-col items-center gap-x-10 gap-y-10
    <div className='flex sm:flex-col gap-10 lg:flex-row'>
          <div className='lg:w-[60%] sm:w-full text-prime bg-[#b5c5ff] md:p-5 sm:py-2 rounded-lg overflow-auto h-[420px]'>
        <table className='rwd-table w-full overflow-hidden'>
            <thead>
                <tr>
                <th>Project Title</th>
                <th>Task Count</th>
                <th>Completed Tasks</th>
                {/* <th>Status</th> */}
                </tr>
            </thead>
            <tbody>
              {projects.map((project)=>(
                <tr key={project.id}>
                <td data-th="Project Name">{project.Name}</td>
                <td data-th="Project Manager">{project.manager}</td>
                <td data-th="Due Date">{project.due_date}</td>
                {/* <td data-th="Status"><p className={` whitespace-nowrap text-center text-sm p-1 sm:inline-block md:block rounded-full w-24 ${project.status=='Pending'?'bg-pending': project.status=='In Progress'? 'bg-progress':project.status=='Testing'?'bg-testing': project.status=='Completed'?'bg-done':''}`}>{project.status}</p></td> */}
                </tr>
                ))} 
            </tbody>
        </table>
        </div>
        {/* chart */}
        <div className='lg:w-[40%] h-[400px] md:w-full sm:w-[300px] flex justify-center self-center'>
        <ResponsiveContainer width="100%" height='100%'>
          <PieChart>
             <Tooltip />
            <Pie  data={data}
        cx="50%"
        cy="50%"
        label={renderCustomizedLabel}
        labelLine={false}
        outerRadius='100%'
        fill="#8884d8"
        dataKey="value"
        paddingAngle={0}>
           {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
            </Pie>
          {/* <Tooltip /> */}
          </PieChart>
        </ResponsiveContainer>
        </div>
    </div>
  )
}

export default ProjectSummary