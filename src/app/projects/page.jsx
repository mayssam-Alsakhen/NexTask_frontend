"use client";
import React, { useState, useEffect, useContext } from 'react';
import AddButton from '@/Components/add/AddButton';
import Popup from '@/Components/popup/Popup';
import SearchInput from '@/Components/search input/SearchInput';
import axios from 'axios';
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { LiaEdit } from "react-icons/lia";
import { MdDeleteOutline } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
import { MdOutlineGroup } from "react-icons/md";
import LoaderSpinner from '@/Components/loader spinner/LoaderSpinner';
import { toast } from 'react-toastify';

function page() {
  const { user, loading } = useContext(AuthContext);
  const [del, setDel] = useState();
  const [edit, setEdit] = useState();
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ name: "", description: "", status: "", due_date: "" });
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [searching, setSearching] = useState(false);

  const router = useRouter();

  const fetchProjects = async () => {
    if (!user) return;
    setLoadingProjects(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/projects/user/${user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data && response.data.data) {
        setProjects(response.data.data);
      }
    } catch (error) {
      toast.error(err.response?.data?.message||"Failed to fetch projects");
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    setCurrentUser(localStorage.getItem("user_id"));
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    fetchProjects();
  }, [loading, user, router]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/projects/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      });
      setDel(false);
      setProjects(projects.filter(project => project.id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message||"Failed to delete project");
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:8000/api/projects/${edit}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      });
      setEdit(false);
      setProjects((prevProjects) =>
        prevProjects.map((proj) =>
          proj.id === edit ? { ...proj, ...formData } : proj
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message||"Failed to update project");
    }
  };

  useEffect(() => {
    if (searchTerm === '') {
      fetchProjects();
    }
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = async (value) => {
    setSearchTerm(value);
    setSearching(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/search-project?search=${value}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setProjects(response.data.projects);
    } catch (error) {
      toast.error(err.response?.data?.message||"Failed to search projects");
    } finally {
      setSearching(false);
    }
  };

  if (loading) return <LoaderSpinner child="Loading..." />;
  if (!user) return null;

  return (
    <div className='p-3 lg:mt-10 mt-12'>
      <div className='flex justify-between'>
        <SearchInput onSearch={handleSearch} onChange={handleSearchChange} />
        <AddButton text={"Add A Project"} link={"/addProject"} />
      </div>
      {loadingProjects ? (
        <div className='flex justify-center mt-10'>
          <LoaderSpinner child="Loading Projects..." />
        </div>
      ) : searching? (<div className='flex mt-2'>
        <LoaderSpinner child="Searching Projects..." />
      </div>) : (
        <div className='flex flex-wrap lg:gap-x-6 gap-x-4 gap-y-10 justify-center w-full mt-6'>
          {projects.map((project) => (
            <div
              onClick={() => router.push(`/projects/${project.id}`)}
              key={project.id}
              className='flex flex-col justify-between w-[280px] h-[200px] bg-white rounded-3xl px-6 py-4 cursor-pointer text-baseText shadow-lg hover:shadow-2xl transform hover:scale-105 transition-transform duration-300 relative group'
            >
              <div>
                <div className='flex justify-between items-center'>
                  <h2 className='text-xl font-semibold text-button mb-1'> {project.name} </h2>
                  <p className='text-sm text-gray-500'>{project.due_date ? project.due_date : <span className='text-donetext'> Open</span>}</p>
                </div>
              </div>
              <p className='line-clamp-3 h-16 text-baseText text-sm'>{project.description}</p>

              <div className="flex justify-between items-center text-baseText text-sm mb-2">
                <div
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/projects/${project.id}/tasks`);
                  }}
                >
                  <FaTasks className='text-pendingtext' />
                  <span>{project.tasks.length} Tasks</span>
                </div>
                <div className="flex items-center gap-1 ">
                  <MdOutlineGroup className='text-donetext text-lg' />
                  <span>{project.users_count} Members</span>
                </div>
              </div>

              <div className='flex justify-between'>
                <span className={`${project.status === 'Completed' ? 'bg-done' : project.status === 'In Progress' ? 'bg-progress' : project.status === 'Pending' ? 'bg-pending' : 'bg-testing'} rounded-full text-center text-sm px-3 py-[0.5px]`}>
                  {project.status}
                </span>
                {project.pivot.is_admin && project.pivot.user_id == currentUser ? (
                  <div className="opacity-100 text-button transition-opacity flex justify-end gap-2">
                    <button className="hover:font-bold" name='edit'>
                      <LiaEdit onClick={(e) => {
                        e.stopPropagation();
                        setEdit(project.id);
                        setFormData({ name: project.name, description: project.description, status: project.status, due_date:  project.due_date ? project.due_date : "" });
                      }} />
                    </button>
                    <button className="hover:text-red-600" onClick={(e) => { e.stopPropagation(); setDel(project.id) }} name='delete'>
                      <MdDeleteOutline />
                    </button>
                  </div>
                ): null}
              </div>
            </div>
          ))}
        </div>
      )}

      <Popup trigger={del} onBlur={() => setDel(false)}>
       <div className="text-prime text-xl font-bold p-4">
          <p>Are you sure you want to delete this project</p>
          <div className="flex justify-center text-white gap-16 mt-10">
            <button onClick={() => setDel(false)} className="w-16 py-1 bg-button hover:bg-buttonHover rounded-lg hover:shadow-lg">No</button>
            <button onClick={handleDelete} className="w-16 py-1 hover:bg-red-500 bg-button rounded-lg hover:shadow-lg">Yes</button>
          </div>
        </div>
      </Popup>

      <Popup trigger={edit} onBlur={() => setEdit(false)}>
        <div>
          <form onSubmit={handleEdit}>
            <div className="flex flex-col gap-4 text-prime">
              <h1 className="text-2xl font-semibold">Update Project</h1>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className='outline-none p-2 border-b-2 border-prime focus:border-button'
                placeholder="Project Title"
              />
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className='outline-none p-2 border-b-2 border-prime focus:border-button'
                placeholder="Description"
              />

              {/* New Status Select */}
              <select
                name="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="outline-none p-2 border-b-2 border-prime focus:border-button"
              >
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Test">Testing</option>
                <option value="Completed">Completed</option>
              </select>

              {/* New Due Date Field */}
              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="outline-none p-2 border-b-2 border-prime focus:border-button"
              />

              <div className="flex justify-center gap-16">
                <button onClick={() => setEdit(false)} className="w-20 bg-button hover:bg-buttonHover text-white rounded-lg hover:shadow-lg">Cancel</button>
                <button type="submit" className="w-20 bg-button hover:bg-buttonHover text-white rounded-lg hover:shadow-lg">Save</button>
              </div>
            </div>
          </form>
        </div>
      </Popup>
    </div>
  );
}

export default page;
