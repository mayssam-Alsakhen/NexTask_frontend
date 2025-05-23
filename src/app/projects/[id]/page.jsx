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
import HalfPieChart from "@/Components/utils/HalfPieChart";

// ← NEW: import toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoaderSpinner from "@/Components/loader spinner/LoaderSpinner";

const ProjectDetails = ({ params }) => {
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [del, setDel] = useState(false);
  const [edit, setEdit] = useState(false);
  const { user, loading } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: "", description: "", status: "", due_date: "" });  
  const router = useRouter();
  const { id } = use(params);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setCurrentUser(localStorage.getItem("user_id"));
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  // fetch project details
  useEffect(() => {
    if (!id) return;
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/projects/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        });
        if (response.data) {
          setProject(response.data.data);
        } else {
          toast.error("Project not found");
        }
      } catch (err) {
        toast.error("Failed to fetch project details");
      }
    };
    // fetch tasks of this project
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/tasks?project_id=${id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
        });
        setTasks(response.data.tasks);
      } catch (err) {
        toast.error(err.response?.data?.message ||"Failed to fetch tasks");
      }
    };

    fetchProjectDetails();
    fetchTasks();
  }, [id]);

  const taskCounts = {
    pending: tasks.filter(task => task.category === "Pending").length,
    inProgress: tasks.filter(task => task.category === "In Progress").length,
    testing: tasks.filter(task => task.category === "Test").length,
    completed: tasks.filter(task => task.category === "Completed").length,
    all: tasks.length,
  };

  const handleNavigate = (status) => {
    localStorage.setItem("selectedStatus", status);
    router.push(`/projects/${id}/tasks`);
  };

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description,
        status: project.status,
        due_date: project.due_date ? project.due_date : ""
      });
    }
  }, [project]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/projects/${id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });
      setDel(false);
      router.push("/projects");
    } catch (err) {
      toast.error(err.response?.data?.message ||"Failed to delete project");
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/projects/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      setEdit(false);
      setProject({ ...project, ...formData });
      toast.success("Project updated successfully!");
    } catch (err) {
      let errorMessage;
      if (err.response) {
        const { status, data } = err.response;
        if (status === 400) {
          errorMessage = data.message || 'Invalid data. Please check your inputs.';
        } else if (status === 401) {
          errorMessage = 'Unauthorized - Please login again';
        } else {
          errorMessage = data.message || 'An error occurred';
        }
      } else if (err.request) {
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        errorMessage = 'Request setup error: ' + err.message;
      }
      toast.error(errorMessage);
    }
  };

  if (loading) return <div className="mt-20 flex justify-center"><LoaderSpinner child="Loading..." /></div> ;
  if (!user) return null;
  if (!project) return <LoaderSpinner child="Loading project details..." />;

  return (
    <div className="w-full mt-11 px-3 py-2 overflow-auto text-prime">
      {/* header secton  */}
      <div>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-1">
            <h1 className="md:text-2xl text-lg font-bold text-button ">{project.name}</h1>
              <span className={`${project.status=='Completed'?'bg-done':project.status=='In Progress'?'bg-progress':project.status=='Pending'?'bg-pending':'bg-testing'} text-baseText rounded-full md:text-sm text-xs px-2 md:px-3 py-[0.5px]`}>
                {project.status}
              </span>
          </div>
          {project.users.map((user) => (user.pivot.is_admin && user.pivot.user_id == currentUser) ? (
            <div key={user.id} className="flex justify-end gap-3">
              <button
                onClick={() => setEdit(true)}
                className="flex items-center gap-1 px-1 md:py-1 md:px-3 text-sm text-button border border-button rounded hover:bg-button hover:text-white transition"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => setDel(true)}
                className="flex items-center gap-1 px-1 md:py-1 md:px-3 text-sm text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-white transition"
              >
                <MdDelete />
              </button>
            </div>
          ) : null)}
        </div>
        <div className="flex justify-between flex-wrap items-end my-5 border-b border-gray-300 p-2 md:mx-4 text-xs md:text-base">
          <p className='text-gray-500'>Due Date: {project.due_date? project.due_date:<span className='text-donetext fon'> Open</span>}</p>
          <div className="w-full md:w-56 mt-5 md:mt-0"><HalfPieChart value={project.progress}/></div>
        </div>
        <p className="mt-4 md:px-6 text-lg text-gray-700 italic text-center">
          {project.description || "No description available"}
        </p>        
      </div>
      {/* task section */}
      <div className="mt-7">
        <div className="flex items-center justify-between mb-2"></div>
        <div className="flex flex-wrap justify-center gap-4 text-black ">
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
            {/* Update Info Footer */}
            {project.updated_by ? (
              <div className="mt-6 text-sm text-gray-500 text-center border-t border-gray-200 pt-3">
                <p>Updated by: <span className="font-medium">{project.updated_by.name}</span></p>
                <p>Last updated: {new Date(project.updated_at).toLocaleDateString()} {new Date(project.updated_at).toLocaleTimeString([],
                  { hour: "2-digit", minute: "2-digit" }
                )}</p>
              </div>
            ) : null}
          </form>
        </div>
      </Popup>

      <div className="bg-[#f1f6ff] border-t border-gray-300 text-gray-500 bottom-0 left-0 fixed w-full text-center text-xs">
        <span>Created by: </span>
        <span>{project.created_by.name} </span>
        <span>{new Date(project.created_at).toLocaleString()}</span>
      </div>
    </div>
  );
};

export default ProjectDetails;
