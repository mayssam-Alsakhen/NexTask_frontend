"use client";
import React, { useEffect, useState, useContext, use } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
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
  const [formData, setFormData] = useState({ name: "", description: "" });
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
  // nabigating to the tasks page
    const handleNavigate = () => {
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
    <div className="w-full mt-11 p-3 overflow-auto text-prime">
      {/* header secton  */}
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-button">{project.name}</h1>
          <div className="flex justify-end gap-2">
            <span className="text-xl text-center text-prime rounded-lg cursor-pointer hover:shadow-lg" onClick={() => setDel(true)}><MdDelete />
            </span>
            <span className="text-xl text-center text-prime rounded-lg cursor-pointer hover:shadow-lg" onClick={() => setEdit(true)}><FaEdit />
            </span>
          </div>
        </div>
        <p className="text-baseText mt-2 text-sm">{project.description || "No description available"}</p>
      </div>

      {/* task sectio */}
      <div className="mt-7">
        <div className="flex items-center justify-between mb-2">
          {/* <h3 className="text-lg font-semibold">Project Task</h3> */}
          {/* <Link href={`/projects/${id}/tasks`} className="text-[#1E6AB0] hover:text-[#1E6AB0] text-sm font-semibold">View All Tasks</Link> */}
        </div>
        <div className=" flex flex-wrap justify-center gap-4 text-black ">
            <ProjectTasksDetails borderColor="border-pending" taskCount={taskCounts.pending} handleNavigate={handleNavigate} statusTitle="Pending" projectId={project.id}/>
            <ProjectTasksDetails borderColor="border-progress" taskCount={taskCounts.inProgress} handleNavigate={handleNavigate} statusTitle="In Progress" projectId={project.id}/>
            <ProjectTasksDetails borderColor="border-testing" taskCount={taskCounts.testing} handleNavigate={handleNavigate} statusTitle="Testing" projectId={project.id}/>
            <ProjectTasksDetails borderColor="border-done" taskCount={taskCounts.completed} handleNavigate={handleNavigate} statusTitle="Completed" projectId={project.id}/>
            <ProjectTasksDetails borderColor="border-button" taskCount={taskCounts.all} handleNavigate={handleNavigate} statusTitle="All Tasks" projectId={project.id}/>
        </div>
      </div>
      <ProjectUsersSection projectId={project.id} />

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
  );
};

export default ProjectDetails;
