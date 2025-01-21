"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";

const ProjectDetails = ({ params }) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = params; 

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost/nextask/get_projects_by_id.php?project_id=${id}`
        );
        if (response.data && response.data.project) {
          setProject(response.data.project);
        } else {
          setError("Project not found");
        }
      } catch (err) {
        setError("Failed to fetch project details");
      } finally {
        setLoading(false);
      }
    };
    fetchProjectDetails();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="w-full h-full bg-second p-10 border-2 border-designing rounded-lg">
      <h1 className="text-4xl font-bold text-prime mb-4">{project.title}</h1>
      <p className="text-lg text-prime mb-6">{project.description || "No description available"}</p>
      <a href={`/projects/${id}/tasks`}>
        <a className="p-2 bg-designing text-white rounded-lg">View Tasks</a>
      </a>
    </div>
  );
};

export default ProjectDetails;
