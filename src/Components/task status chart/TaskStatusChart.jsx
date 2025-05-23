import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import LoaderSpinner from '../loader spinner/LoaderSpinner';

const TaskStatusChart = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/tasks',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setTasks(response.data.tasks);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch tasks');
      }
      finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const getStatusCount = (category) =>
    tasks.filter((task) => task.category === category).length;

  const data = [
    { name: 'Pending', value: getStatusCount('Pending') },
    { name: 'In Progress', value: getStatusCount('In Progress') },
    { name: 'Testing', value: getStatusCount('Test') },
    { name: 'Completed', value: getStatusCount('Completed') },
  ];

  const COLORS = ['#d5deef', '#b1c9ef', '#638ecb', '#395886'];

  return (
    <div className='bg-white/60 lg:w-[35%] md:[40%] w-full shadow-md rounded-lg p-3 flex flex-col items-center'>
      <h3 className='text-xl font-semibold mb-8'>Task Status Overview</h3>
      { loading ? (
        <LoaderSpinner child={'Loading...'} />
      ) :
      tasks.length > 0 ? (
        <PieChart width={300} height={300}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      ) : (
        <p>Loading chart or no tasks found...</p>
      )}
    </div>
  );
};

export default TaskStatusChart;
