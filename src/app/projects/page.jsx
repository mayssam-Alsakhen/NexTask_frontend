"use client";
import React, { useState, useEffect, useContext } from 'react'
import AddButton from '@/Components/add/AddButton'
import Popup from '@/Components/popup/Popup'
import axios from 'axios'
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { LiaEdit } from "react-icons/lia";
import { MdDeleteOutline } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
import { MdOutlineGroup } from "react-icons/md";

function page() {
  const { user, loading } = useContext(AuthContext);
  const [del, setDel] = useState();
  const [edit, setEdit] = useState();
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/projects/user/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("API Response:", response.data); // Debugging

        if (response.data && response.data.data) {
          setProjects(response.data.data);
          projects.forEach(project => {
            const taskCount = project.tasks ? project.tasks.length : 0;
            console.log(`Project: ${project.name}, Task Count: ${taskCount}`);
          });
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        alert('Failed to fetch projects');
      }
    };

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
      setProjects(projects.filter(project => project.id !== id)); // Update UI
    } catch (err) {
      console.error("Error deleting project:", err);
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
      console.error("Error updating project:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return null; // Prevent rendering before redirection

  return (
    <div className='p-3 mt-12'>
      <div className=' flex justify-end'>
        <AddButton text={"Add A Project"} link={"/addProject"} />
      </div>
      <div className='flex flex-wrap lg:gap-x-6 gap-x-4 gap-y-10 justify-center w-full mt-6'>
        {projects.map((project) => (

          <div
            onClick={() => router.push(`/projects/${project.id}`)}
            key={project.id}
            className={`flex flex-col justify-between w-[280px] h-[200px] bg-white rounded-3xl px-6 py-4 text-baseText shadow-lg hover:shadow-2xl transform hover:scale-105 transition-transform duration-300 relative group`}
          >
            {/* icons */}
            <h2 className='text-xl font-semibold text-button mb-1'> {project.name} </h2>
            <p className='line-clamp-2 h-16 text-baseText text-sm overflow-auto'>{project.description}</p>
            {/* Task & User Count */}
            <div className="flex justify-between items-center text-baseText text-sm mb-2">
              <div className="flex items-center gap-1">
                <FaTasks className='text-pendingtext' />
                <span>{project.tasks.length} Tasks</span>
              </div>
              <div className="flex items-center gap-1 ">
                <MdOutlineGroup className='text-donetext text-lg' />
                <span>{project.users_count} Members</span>
              </div>
            </div>
            <div className='w-full flex justify-end text-sm font-medium text-button'>
              {/* <Link href={`/projects/${project.id}`} className='hover:underline'>Details</Link> */}
            </div>
            <div className="opacity-100 text-button transition-opacity flex justify-end w-full gap-2 ">
              <button className=" hover:font-bold" name='edit'>
                <LiaEdit onClick={(e) => {
                  e.stopPropagation();
                  setEdit(project.id);
                  setFormData({ name: project.name, description: project.description });
                }} />
              </button>
              <button className="hover:text-red-600" onClick={(e) =>{e.stopPropagation();setDel(project.id)}} name='delete'>
                <MdDeleteOutline />
              </button>
            </div>
          </div>

        ))}
      </div>
      <Popup trigger={del} onBlur={() => setDel(false)}>
        <div className="text-prime text-xl font-bold p-4">
          <p>Are you sure you want to delete this project</p>
          <div className="flex justify-center gap-16 mt-10">
            <button onClick={() => setDel(false)} className="w-20 bg-second rounded-lg hover:shadow-lg">No</button>
            <button onClick={() => handleDelete(del)} className="w-20 bg-second rounded-lg hover:shadow-lg">Yes</button>
          </div>
        </div>
      </Popup>
      <Popup trigger={edit} onBlur={() => setEdit(false)}>
        <div>
          <form onSubmit={handleEdit}>
            <div className="flex flex-col gap-7 text-prime">
              <h1 className="text-4xl font-bold ">Edit Project</h1>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className=' outline-none p-2 border-b-2 border-prime focus:border-button '
                placeholder="Project Title"
              />
              <input
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className=' outline-none p-2 border-b-2 border-prime focus:border-button '
                placeholder="Description"
              />
              <div className="flex justify-center gap-16">
                <button onClick={() => setEdit(false)} className="w-20 bg-second rounded-lg hover:shadow-lg">Cancel</button>
                <button type="submit" className="w-20 bg-second rounded-lg hover:shadow-lg">Save</button>
              </div>                </div>
          </form>
        </div>
      </Popup>
    </div>
  )
}

export default page
