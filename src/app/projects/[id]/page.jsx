"use client";
import React, { useEffect, useState, useContext, use } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { AuthContext } from "@/context/AuthContext";
import { MdDelete } from "react-icons/md";
import { useRouter } from "next/navigation";
import Popup from "@/Components/popup/Popup";
import ProjectUsersSection from "@/Components/projectusersection/ProjectUserSection";
import ProjectTasksDetails from "@/Components/ProjectTasksDetails/ProjectTasksDetails";

const ProjectDetails = ({ params }) => {
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [del, setDel] = useState(false);
  const [edit, setEdit] = useState(false);
  const { user, loading } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: "", description: "", });
  const router = useRouter();
  const { id } = use(params);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  // fetch project details
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
    // fetch tasks of ths project
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/tasks?project_id=${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        });

        setTasks(response.data.tasks);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      }
    };

    fetchProjectDetails();
    fetchTasks();
  }, [id]);
  // count tasks by status
  const taskCounts = {
    pending: tasks.filter(task => task.category === "Pending").length,
    inProgress: tasks.filter(task => task.category === "In Progress").length,
    testing: tasks.filter(task => task.category === "Test").length,
    completed: tasks.filter(task => task.category === "Completed").length,
    all: tasks.length,
  };
  // navigating to the tasks page
  const handleNavigate = (status) => {
    localStorage.setItem("selectedStatus", status);
    router.push(`/projects/${id}/tasks`);
  };
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
      router.push("/projects");
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
    <div className="w-full mt-11 px-3 py-2 overflow-auto text-prime">
      {/* header secton  */}
      <div>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-1">
            <h1 className="text-3xl font-bold text-button">{project.name}</h1>
            {/* Tooltip Trigger */}
            <div className="relative group">
              <AiOutlineInfoCircle className="text-button cursor-pointer" />
              {/* Tooltip Box */}
              <div className="absolute hidden group-hover:flex flex-col bg-white text-sm text-baseText p-2 border border-gray-300 rounded-md shadow-md top-6 left-16 -translate-x-1/2 w-60 z-10">
                <span className="font-medium text-black">Created by:</span>
                <span>{project.created_by.name}</span>
                <span>{new Date(project.created_at).toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setEdit(true)}
              className="flex items-center gap-1 px-3 py-1 text-sm text-button border border-button rounded hover:bg-button hover:text-white transition"
            >
              <FaEdit /> Edit
            </button>
            <button
              onClick={() => setDel(true)}
              className="flex items-center gap-1 px-3 py-1 text-sm text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-white transition"
            >
              <MdDelete /> Delete
            </button>
          </div>
        </div>
        <p className="mt-4 md:px-4 text-lg text-gray-700 italic text-center">
          {project.description || "No description available"}
        </p>
      </div>
      {/* task section */}
      <div className="mt-7">
        <div className="flex items-center justify-between mb-2">
          {/* <h3 className="text-lg font-semibold">Project Task</h3> */}
          {/* <Link href={`/projects/${id}/tasks`} className="text-[#1E6AB0] hover:text-[#1E6AB0] text-sm font-semibold">View All Tasks</Link> */}
        </div>
        <div className=" flex flex-wrap justify-center gap-4 text-black ">
          <ProjectTasksDetails borderColor="border-pending" taskCount={taskCounts.pending} handleNavigate={() => handleNavigate('pending')} statusTitle="🕒 Pending" projectId={project.id} />
          <ProjectTasksDetails borderColor="border-progress" taskCount={taskCounts.inProgress} handleNavigate={() => handleNavigate('in progress')} statusTitle="⚙️ In Progress" projectId={project.id} />
          <ProjectTasksDetails borderColor="border-testing" taskCount={taskCounts.testing} handleNavigate={() => handleNavigate('test')} statusTitle="🧪 Testing" projectId={project.id} />
          <ProjectTasksDetails borderColor="border-done" taskCount={taskCounts.completed} handleNavigate={() => handleNavigate('completed')} statusTitle="✅ Completed" projectId={project.id} />
          <ProjectTasksDetails borderColor="border-gray-300" taskCount={taskCounts.all} handleNavigate={() => handleNavigate('all')} statusTitle="📋 All Tasks" projectId={project.id} />
        </div>
      </div>
      <ProjectUsersSection projectId={project.id} />

      <Popup trigger={del} onBlur={() => setDel(false)}>
        <div className="text-prime text-xl font-bold p-4">
          <p>Are you sure you want to delete this project</p>
          <div className="flex justify-center gap-16 mt-10">
            <button onClick={() => setDel(false)} className="w-24 bg-second rounded-lg hover:shadow-lg">No</button>
            <button onClick={handleDelete} className="w-24 py-2 bg-red-500 text-white rounded-lg hover:shadow-lg">Yes</button>
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
                className=' outline-none p-2 border-b-2 border-prime focus:border-button '
                placeholder="Project Title"
              />
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className=' outline-none p-2 border-b-2 border-prime focus:border-button '
                placeholder="Description"
              />
              <div className="flex justify-center gap-16">
                <button onClick={() => setEdit(false)} className="w-20 bg-second rounded-lg hover:shadow-lg">Cancel</button>
                <button type="submit" className="w-20 bg-second rounded-lg hover:shadow-lg">Save</button>
              </div>                
              </div>
               {/* Update Info Footer */}
        {project.updated_by?  <div className="mt-6 text-sm text-gray-500 text-center border-t border-gray-200 pt-3">
        <p>Updated by: <span className="font-medium">{project.updated_by.name}</span></p>
        <p>Last updated: {new Date(project.updated_at).toLocaleString()}</p>
      </div> : null}
     
          </form>
        </div>
      </Popup>
    </div>
  );
};

export default ProjectDetails;
