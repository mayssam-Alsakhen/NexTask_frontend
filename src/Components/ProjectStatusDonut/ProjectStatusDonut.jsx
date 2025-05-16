import axios from 'axios';
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const ProjectStatusChart = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/projects/user/${localStorage.getItem('user_id')}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setProjects(response.data.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const getStatusCount = (status) =>
    projects.filter((project) => project.status?.toLowerCase() === status.toLowerCase()).length;

  const data = [
    { name: 'Pending', value: getStatusCount('pending') },
    { name: 'In Progress', value: getStatusCount('in progress') },
    { name: 'Testing', value: getStatusCount('test') },
    { name: 'Completed', value: getStatusCount('completed') },
  ];

  const COLORS = ['#d5deef', '#b1c9ef', '#638ecb', '#395886'];

  return (
    <div className='bg-white/60 lg:w-[35%] md:w-[40%] w-full shadow-md rounded-lg p-3 flex flex-col items-center'>
      <h3 className='text-xl font-semibold mb-8'>Project Status Overview</h3>
      {projects.length > 0 ? (
        <PieChart width={300} height={300}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70} // donut shape
            outerRadius={120}
            dataKey="value"
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      ) : (
        <p>Loading chart or no projects found...</p>
      )}
    </div>
  );
};

export default ProjectStatusChart;
