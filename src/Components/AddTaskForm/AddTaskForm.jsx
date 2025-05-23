'use client';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import AssignUsers from '../AssignUsers/AssignUsers';
import LoaderSpinner from '../loader spinner/LoaderSpinner';


export default function AddTaskForm({ projectId, defaultCategory = "Pending", onTaskCreated, defaultDueDate }) {
  const [adminProjects, setAdminProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(projectId || '');
  const [addedUserIds, setAddedUserIds] = useState([]);
  const [removedUserIds, setRemovedUserIds] = useState([]);
  const [usersToAddToProject, setUsersToAddToProject] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: defaultDueDate || '',
    category: defaultCategory,
    isImportant: '0',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const userId = localStorage.getItem('user_id');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!projectId) {
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
          toast.error('Failed to fetch projects')
          setError('Failed to load your projects');
        } finally {
          setLoading(false);
        }
      };

      if (userId && token) {
        fetchProjects();
      }
    } else {
      setLoading(false);
    }
  }, [projectId, userId, token]);

  useEffect(() => {
    if (projectId) {
      setSelectedProject(projectId);
    }
  }, [projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTask = {
      ...formData,
      project_id: selectedProject,
      assigned_users: addedUserIds,
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
        category: defaultCategory,
        isImportant: '0',
      });
      setAddedUserIds([]);
      setUsersToAddToProject([]);

      if (!projectId) {
        setSelectedProject('');
      }

      if (onTaskCreated) onTaskCreated(res.data.task);
      toast.success('Task added successfully!');
    } catch (error) {
      toast.error('Failed to create task. Please try again.');
      setError('Failed to create task. Please try again.');
    }
  };

  return (
    <div className="p-4 text-prime w-full">
      <h2 className="text-xl font-bold mb-4 text-button">Add New Task</h2>

      {loading ? (
        <LoaderSpinner child={'Loading your projects...'}/>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Project Dropdown */}
          {!projectId && (
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
          )}

          {/* Show form only if project selected */}
          {selectedProject && (
            <>
              <input
                type="text"
                placeholder="Task Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="p-2 border border-testing focus:border-2 outline-none rounded "
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="p-2 border border-testing focus:border-2 outline-none rounded"
                rows="3"
              />
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="p-2 border border-testing focus:border-2 outline-none rounded"
                required
              />
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
              <div>
                <AssignUsers
                  btnlabel="Assign to Task"
                  task={{ project: { users: [] }, users: [] }}
                  addedUserIds={addedUserIds}
                  setAddedUserIds={setAddedUserIds}
                  removedUserIds={removedUserIds}
                  setRemovedUserIds={setRemovedUserIds}
                  usersToAddToProject={usersToAddToProject}
                  setUsersToAddToProject={setUsersToAddToProject}
                  boxContainer={'hidden'}
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-button text-white rounded hover:bg-buttonHover hover:font-bold transition-all hover:shadow"
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
