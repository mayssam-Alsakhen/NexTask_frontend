import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { toast } from 'react-toastify';
import LoaderSpinner from '../loader spinner/LoaderSpinner';

const CompletedTasksChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/analytics/completed-tasks', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const formatted = response.data.map(item => ({
          date: item.date,
          count: item.count,
        }));

        setData(formatted);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch completed tasks');
      }
      finally {
        setLoading(false);
      }
    };
    fetchCompletedTasks();
  }, []);

  return (
    <div className='bg-white/60 p-2 lg:w-[60%] md:w-[50%] w-full rounded-lg shadow-md'>
      <h3 className="text-xl font-semibold mb-8 md:px-6 pt-2 ">Completed Tasks Over Time</h3>
    <div className="h-[400px]">
      {loading ? <LoaderSpinner child={'Loading...'} /> : data.length === 0 ? <div className='flex justify-center items-center h-full'>No completed tasks</div> :
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}
         margin={{ top: 20, right: 3, left: -10, bottom: 15 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }}/>
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }}/>
          <Tooltip />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#628ecb"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
}
    </div>
    </div>
  );
};

export default CompletedTasksChart;
