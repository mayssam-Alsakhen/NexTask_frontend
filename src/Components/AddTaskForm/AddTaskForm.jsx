'use client';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function AddTaskForm({ onTaskCreated ,defaultDueDate}) {
  const [adminProjects, setAdminProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: defaultDueDate || '',
    category: '',
    isImportant: '0',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const userId = localStorage.getItem('user_id');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/projects/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const adminOnly = res.data.data.filter(
          (project) => project.pivot?.is_admin === 1
        );

        setAdminProjects(adminOnly);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
        setError('Failed to load your admin projects');
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) {
      fetchProjects();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTask = {
      ...formData,
      project_id: selectedProject,
    };

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/tasks', newTask, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccessMessage('Task created successfully!');
      setFormData({
        title: '',
        description: '',
        due_date: '',
        category: '',
        isImportant: '0',
      });
      setSelectedProject('');

      // Optional callback
      if (onTaskCreated) onTaskCreated(res.data.task);
      toast.success('Task added successfully!');
    } catch (error) {
      console.error('Failed to create task:', error);
      toast.error('Failed to create task. Please try again.');
      setError('Failed to create task. Please try again.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Add New Task</h2>

      {loading ? (
        <p>Loading your admin projects...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Project Dropdown */}
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="p-2 border border-gray-300 rounded"
            required
          >
            <option value="">-- Choose Project --</option>
            {adminProjects.map((proj) => (
              <option key={proj.id} value={proj.id}>
                {proj.name}
              </option>
            ))}
          </select>

          {/* Show form only if project selected */}
          {selectedProject && (
            <>
              <input
                type="text"
                placeholder="Task Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="p-2 border border-gray-300 rounded"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="p-2 border border-gray-300 rounded"
                rows="3"
              />
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="p-2 border border-gray-300 rounded"
                required
              />
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="p-2 border border-gray-300 rounded"
                required
              >
                <option value="">Select Category</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Test">Test</option>
                <option value="Completed">Completed</option>
              </select>
              <div className="flex gap-5 items-center">
                <span>Important:</span>
                <label>
                  <input
                    type="radio"
                    name="isImportant"
                    value="1"
                    checked={formData.isImportant === '1'}
                    onChange={() => setFormData({ ...formData, isImportant: '1' })}
                  />{' '}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="isImportant"
                    value="0"
                    checked={formData.isImportant === '0'}
                    onChange={() => setFormData({ ...formData, isImportant: '0' })}
                  />{' '}
                  No
                </label>
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:shadow"
              >
                Add Task
              </button>

              {successMessage && <p className="text-green-600 ">{successMessage}</p>}
            </>
          )}
        </form>
      )}
    </div>
  );
}
