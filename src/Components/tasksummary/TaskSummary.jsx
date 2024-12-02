'use client'
import { differenceInDays, parse } from 'date-fns';
import React, { useState } from 'react'
import { BarChart, Bar, PieChart, Pie,  XAxis, Cell, YAxis, Tooltip, ResponsiveContainer,CartesianGrid, LineChart, Line, Legend } from 'recharts';
const cards = [
  {
    id: 1,
    title: 'In Progress',
    descretion: 'doing all my task',
    status: 'In Progress',
    isImportant: true,
    start_date: '2024-06-28',
    due_date: '2024-06-28'

  },
  {
    id: 2,
    title: 'Pending',
    descretion: 'doing all my task to have it done on time so i should start',
    status: 'Pending',
    isImportant: true,
    start_date: '2024-06-28',
    due_date: '2024-06-28'

  },
  {
    id: 3,
    title: 'Completed',
    descretion: 'doing all my task having it completed is the best thing you will see on your task board doing all my task having it completed is the best thing you will see on your task board doing all my task having it completed is the best thing you will see on your task board',
    status: 'Completed',
    isImportant: false,
    start_date: '2024-06-28',
    due_date: '2024-06-28'

  },
  {
    id: 4,
    title: 'Testing',
    descretion: 'doing all my task',
    status: 'Testing',
    isImportant: false,
    start_date: '2024-06-283',
    due_date: '2024-06-28'

  },
  {
    id: 5,
    title: 'Pending',
    descretion: 'doing all my task to have it done on time so i should start',
    status: 'Pending',
    isImportant: false,
    start_date: '2024-06-28',
    due_date: '2024-06-01'

  },
  {
    id: 6,
    title: 'Pending',
    descretion: 'doing all my task to have it done on time so i should start',
    status: 'Pending',
    isImportant: false,
    start_date: '2024-06-28',
    due_date: '2024-05-28'

  },
  {
    id: 7,
    title: 'Pending',
    descretion: 'doing all my task to have it done on time so i should start',
    status: 'Pending',
    isImportant: true,
    start_date: '2024-06-23',
    due_date: '2024-06-28'

  },
  {
    id: 8,
    title: 'Completed',
    descretion: 'doing all my task having it completed is the best thing you will see on your task board doing all my task having it completed is the best thing you will see on your task board doing all my task having it completed is the best thing you will see on your task board',
    status: 'Completed',
    isImportant: false,
    start_date: '2024-05-28',
    due_date: '2024-05-22'

  },
  {
    id: 9,
    title: 'In Progress',
    descretion: 'doing all my task',
    status: 'In Progress',
    isImportant: true,
    start_date: '2024-06-28',
    due_date: '2024-05-30'

  },
  {
    id: 10,
    title: 'In Progress',
    descretion: 'doing all my task',
    status: 'In Progress',
    isImportant: false,
    start_date: '2024-05-28',
    due_date: '2024-05-28'

  },
]
// calculte the difference date  for due soon
export const dateDifferenceFromCurrent = (databaseDate) => {
  const databaseDateFormat = 'yyyy-MM-dd';
  const parsedDatabaseDate = parse(databaseDate, databaseDateFormat, new Date());
  const currentDate = new Date();

  return differenceInDays(parsedDatabaseDate, currentDate);
};


// Function to filter tasks ending in less than 8 days and still in "Pending" or "In Progress" status
const filterTasks = (cards) => {
  return cards.filter((card) => {
    const daysLeft = dateDifferenceFromCurrent(card.due_date);
    return (daysLeft <= 8 && daysLeft >= 0) && (card.status === 'Pending' || card.status === 'In Progress');
  });
};
// Prepare data for the BiaxialLineChart
const prepareBiaxialLineChartData = (filterTasks) => {
  return filterTasks.map((task) => ({
    title: task.title,
    remaining_days: dateDifferenceFromCurrent(task.due_date),
    task_time: Math.abs(dateDifferenceFromCurrent(task.start_date) - dateDifferenceFromCurrent(task.due_date)),
    status: task.status,
  }));
};

// Use prepareBiaxialLineChartData to get the data for the BiaxialLineChart
const filteredTasks = filterTasks(cards);
const biaxialLineChartData = prepareBiaxialLineChartData(filteredTasks);


// Donut chart 
const prepareChartData = (cards) => {
  const totalTasks = cards.filter(card => (card.status === 'Pending' || card.status === 'In Progress') &&!card.isImportant).length;
  const importantTasks = cards.filter(card => (card.status === 'Pending' || card.status === 'In Progress') && card.isImportant).length;

  return [
    { name: 'Tasks', value: totalTasks, color: '#E5F0FF' },
    { name: 'Important Tasks', value: importantTasks, color: '#f8acb9' },
  ];
};
const importantData = prepareChartData(cards);


// Custom label component
const CustomLabel = ({ cx, cy }) => {
  const totalTasks = cards.filter(card => card.status === 'Pending' || card.status === 'In Progress').length;
  const importantTasks = cards.filter(card => (card.status === 'Pending' || card.status === 'In Progress') && card.isImportant).length;
  const percentage = ((importantTasks / totalTasks) * 100).toFixed(2);

  return (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" className="text-4xl" fill='white'>
      {`${percentage}%`}
    </text>
  );
};

// Function to calculate status counts all tasks
const calculateStatusCounts = (cards) => {
  const statusCounts = cards.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {});
  return Object.keys(statusCounts).map(status => ({
    name: status,
    value: statusCounts[status],
  }));
};
// Prepare data for the bar chart
const statusData = calculateStatusCounts(cards);
// colors
const COLORS = ['#c97bfa', '#edee63', '#64c8f7', '#94f6a4'];

function TaskSummary() {
  const [overview, setoverview] = useState(0);
  const date='2024-05-20';
  const diff = dateDifferenceFromCurrent(date); 
  return (
    <div className='flex lg:flex-row sm:flex-col items-center gap-10'>
      <div className='lg:w-[60%] sm:w-full text-prime bg-[#b6c6ff] md:p-7 sm:py-2 rounded-lg overflow-auto h-[400px]'>
        <div className='sm:hidden md:flex text-lg font-bold flex justify-around border-b border-prime py-4'>
          <p className={`cursor-pointer hover:text-designing ${overview == 0 ? ' text-designing border-b border-designing' : ''}`} onClick={() => setoverview(0)}>All</p>
          <p className={`cursor-pointer hover:text-designing ${overview == 1 ? ' text-designing border-b border-designing' : ''}`} onClick={() => setoverview(1)}>Important</p>
          <p className={`cursor-pointer hover:text-designing ${overview == 2 ? ' text-designing border-b border-designing' : ''}`} onClick={() => setoverview(2)}>Due Soon</p>
          {/* <p className={`cursor-pointer hover:text-designing ${overview == 3 ? ' text-designing border-b border-designing' : ''}`} onClick={() => setoverview(3)}>pending</p> */}
        </div>
        <div className='sm:block md:hidden border-b border-prime py-4'>
        <select value={overview} onChange={(e) => setoverview(parseInt(e.target.value))} className={`text-designing font-bold text-lg bg-second bg-opacity-40 px-3 py-2 ml-4 outline-none rounded-2xl cursor-pointer`}>
        <option value={0}>All</option>
        <option value={1}>Important</option>
        <option value={2}>Due Soon</option>
        <option value={3}>Pending</option>
      </select></div>
        {/* 
         <div className={`absolute left-0 top-7 min-w-full text-center rounded-lg bg-second opacity-0 px-1 py-2 transition-all duration-700 transform translate-y-[-80%] group-hover:translate-y-0 group-hover:opacity-100 group-hover:bg-opacity-35`}>
                                    <div className='flex flex-col items-center'>
                                        <div className='flex gap-[2px] items-center text-importanttext'>
                                            <span><MdGroups2 className='text-sm' /></span>
                                            <span className='text-xs'>Important </span>
                                        </div>
                                        <p className='font-bold'><CountUp end={25} /></p>
                                    </div>
                                    <div className='flex flex-col items-center'>
                                        <div className='flex gap-[2px] items-center'>
                                            <span><RiAdminFill className='text-sm' /></span>
                                            <span className='text-xs '> medium </span>
                                        </div>
                                        <p className='font-bold'><CountUp end={25} /></p>
                                    </div>
                                </div> */}
        {cards.map((task) => (
          // All content
          overview === 0 ?
            <div key={task.id} className={`px-7 py-3 flex justify-between transition-all duration-500`}>
              <p>{task.title}</p>
              <p className={`whitespace-nowrap text-center text-sm p-1 sm:inline-block md:block rounded-full w-24 ${task.status == 'Pending' ? 'bg-pending' : task.status == 'In Progress' ? 'bg-progress' : task.status == 'Testing' ? 'bg-testing' : task.status == 'Completed' ? 'bg-done' : ''}`}>{task.status}</p>
            </div> :
            // important content
            overview === 1 && task.isImportant ? (
              <div key={task.id} className={`md:px-7 sm:px-3 py-3 flex flex-wrap justify-between transition-all duration-500`}>
                <p className="w-24">{task.title}</p>
                <p>{task.due_date}</p>
                <p className={`whitespace-nowrap text-center text-sm p-1 sm:inline-block md:block rounded-full w-24 ${task.status === 'Pending' ? 'bg-pending' : task.status === 'In Progress' ? 'bg-progress' : task.status === 'Testing' ? 'bg-testing' : task.status === 'Completed' ? 'bg-done' : ''}`}>{task.status}</p>
              </div>
            ) :
            overview === 2 && dateDifferenceFromCurrent(task.due_date) <= 7 && dateDifferenceFromCurrent(task.due_date)>=0 ? (
              <div key={task.id} className={`px-7 py-3 flex justify-between transition-all duration-500`}>
                <p>{task.title}</p>
                <p>{task.due_date}</p>
                <p>{dateDifferenceFromCurrent(task.due_date)===0? 'Due today': `Due in ${dateDifferenceFromCurrent(task.due_date)} days`}</p>
              </div>
            ) 
            // overview===3 && task.status ==='Pending'?(<div key={task.id}> <p> {task.title}</p></div>)
            : null
        ))}
      </div>

      <div className='lg:w-[40%] md:w-full sm:w-[300px] flex justify-center self-center h-[400px]'>
        {/* All chart */}
        {overview == 0 ?
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8">
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          : 
          overview==1?<ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={importantData}
              cx="50%"
              cy="50%"
              innerRadius='60%'
              outerRadius="100%"
              fill="#8884d8"
              paddingAngle={1}
              dataKey="value"
              labelLine={false}
              label={<CustomLabel />}
            >
              {importantData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
    
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>: 
        overview===2? <ResponsiveContainer width="100%" height="100%">
        <LineChart data={biaxialLineChartData}>
          <XAxis dataKey="title" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <CartesianGrid stroke="#f5f5f5" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="remaining_days" stroke="#8884d8" yAxisId="left" />
          <Line type="monotone" dataKey="task_time" stroke="#82ca9d" yAxisId="right" />
        </LineChart>
      </ResponsiveContainer>: ''
          }
      </div>
    </div>
  )
}

export default TaskSummary