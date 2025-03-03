"use client";
import React, { useEffect, useState, useContext, use } from "react";

import axios from "axios";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Popup from "@/Components/popup/Popup";
import ProjectTaskSection from "@/Components/project task section/ProjectTaskSection";
import ProjectUsersSection from "@/Components/projectusersection/ProjectUserSection";

const ProjectDetails = ({ params }) => {
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [del, setDel] = useState(false);
  const [edit, setEdit] = useState(false);
  const { user, loading } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const router = useRouter();
  const { id } = use(params); 

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login"); 
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!id) return;
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/projects/${id}`,
           {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        console.log("Project Details:", response.data.data);
        
        if (response.data) {
          setProject(response.data.data); 
        } else {
          setError("Project not found");
        }
      } catch (err) {
        setError("Failed to fetch project details");
      }
    };

    if (id) fetchProjectDetails();
  }, [id]);

  useEffect(() => {
    if (project) {
      setFormData({ name: project.name, description: project.description });
    }
  }, [project]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/projects/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      });
      setDel(false);
      router.push("/projects"); // Redirect after deletion
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:8000/api/projects/${id}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      });
      setEdit(false);
      setProject({ ...project, ...formData }); // Update the UI immediately
    } catch (err) {
      console.error("Error updating project:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return null; // Prevent rendering before redirection
  if (error) return <p className="text-red-500">{error}</p>;
  if (!project) return <p>Loading project details...</p>;

  return (
    <div className="w-full h-full bg-second p-6 border-2 border-designing rounded-lg overflow-auto text-prime">
      <div className="flex justify-end gap-4">
      <span className="p-2 w-20 text-center bg-designing text-white rounded-lg cursor-pointer hover:shadow-lg" onClick={()=> setDel(true)}>Delete</span>
      <span className="p-2 w-20 text-center bg-designing text-white rounded-lg cursor-pointer hover:shadow-lg" onClick={()=> setEdit(true)}>Edit</span>
      </div>
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-6">{project.name}</h1>
        <p className="text-lg mb-6">{project.description || "No description available"}</p>
      </div>
      <ProjectTaskSection projectId={project.id}/>
      <ProjectUsersSection projectId={project.id} />
     
      {/* <Link href={`/projects/${id}/tasks`}>
        <span className="p-2 bg-designing text-white rounded-lg cursor-pointer">View Tasks</span>
      </Link> */}
      <Popup trigger={del} onBlur={() => setDel(false)}>
            <div className="text-prime text-xl font-bold p-4">
              <p>Are you sure you want to delete this project</p>
              <div className="flex justify-center gap-16 mt-10"> 
              <button onClick={() => setDel(false)} className="w-20 bg-second rounded-lg hover:shadow-lg">No</button>
              <button onClick={handleDelete} className="w-20 bg-second rounded-lg hover:shadow-lg">Yes</button>
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
                    className=' outline-none p-2 border-b-2 border-prime focus:border-designing '
                    placeholder="Project Title"
                  />
                  <input
                    name="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className=' outline-none p-2 border-b-2 border-prime focus:border-designing '
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
  );
};

export default ProjectDetails;
